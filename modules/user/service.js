const jwt = require('jsonwebtoken');

const logging = require('../logging/loggingService');
const constants = require('../constants/constants');
const User = require("../models/user");
const Portfolio = require("../models/portfolio");
const Stock = require("../models/stock");
const Trade = require("../models/trade");


const addUser = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = new User({
                email: payload.email,
                hashed_password: payload.password,
                is_deleted: false,
                created_at: new Date()
            });
            let data = await user.save();
            resolve(data);
        } catch (error) {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const addStocks = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const stock = new Stock({
                name: payload.name,
                tickerSymbol: payload.ticker_symbol,
                currentPrice: payload.current_price,
                modified_at: new Date()
            });
            let data = await stock.save();
            resolve(data);
        } catch (error) {
            console.log("err", error)
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const getUser = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("getUser")
            let data = await User.findOne({email: payload.email});
            if (!(data)) {
                throw {
                    "message": constants.responseMessages.USER_NOT_FOUND,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            } else {
                resolve(data);
            }
        } catch (error) {
            logging.log(apiReference, {ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const getPortfolio = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await Portfolio.findOneAndUpdate({userId: payload.user_id}, {$set: {modified_at: new Date()}}, {
                upsert: true,
                new: true
            });
            logging.log(apiReference, {SERVICE: "getPortfolio", ERROR: {}, DATA: data});
            if (!(data)) {
                throw new Error("Not found");
            } else {
                resolve(JSON.parse(JSON.stringify(data)));
            }
        } catch (error) {
            logging.log(apiReference, {SERVICE: "getPortfolio", ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const addTradeToPortfolio = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await Portfolio.findByIdAndUpdate(payload.portfolio_id, {
                $addToSet: {
                    stocks: [{
                        stock_id: payload.stock._id,
                        quantity: payload.quantity,
                        average_buy_price: payload.stock.currentPrice
                    }]
                }
            });

            console.log("data::", data);
            logging.log(apiReference, {SERVICE: "addTradeToPortfolio", ERROR: {}, DATA: data});
            if (!(data)) {
                throw new Error("Not found");
            } else {
                resolve(data);
            }
        } catch (error) {
            logging.log(apiReference, {SERVICE: "addTradeToPortfolio", ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const updateTradeToPortfolio = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (payload.stock_in_portfolio.length > 0) {
                payload.stock_in_portfolio = payload.stock_in_portfolio[0];
            } else {
                payload.stock_in_portfolio = {
                    average_buy_price: 0,
                    quantity: 0
                };
            }
            let averageBuyPrice = ((payload.stock_in_portfolio.average_buy_price * payload.stock_in_portfolio.quantity) + (payload.quantity * payload.stock.currentPrice)) / (payload.stock_in_portfolio.quantity + payload.quantity);
            let quantity = payload.stock_in_portfolio.quantity + payload.quantity;
            let data = await Portfolio.findByIdAndUpdate(payload.portfolio_id, {
                $set: {
                    "stocks.$[elem].average_buy_price": averageBuyPrice,
                    "stocks.$[elem].quantity": quantity
                }
            }, {
                arrayFilters: [{
                    "elem.stock_id": {$eq: payload.stock._id}
                }]
            });

            console.log("data::", data);
            logging.log(apiReference, {SERVICE: "updateTradeToPortfolio", ERROR: {}, DATA: data});
            if (!(data)) {
                throw new Error("Not found");
            } else {
                resolve(data);
            }
        } catch (error) {
            console.log("err:::", error)
            logging.log(apiReference, {SERVICE: "updateTradeToPortfolio", ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const deleteTradeToPortfolio = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await Portfolio.findByIdAndUpdate(payload.portfolio_id, {
                $pull: {stocks: {stock_id: payload.stock._id}}
            });

            console.log("data::", data);
            logging.log(apiReference, {SERVICE: "deleteTradeToPortfolio", ERROR: {}, DATA: data});
            if (!(data)) {
                throw new Error("Not found");
            } else {
                resolve(data);
            }
        } catch (error) {
            console.log("err:::", error)
            logging.log(apiReference, {SERVICE: "deleteTradeToPortfolio", ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const getStock = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            if (payload.ticker_symbol) {
                data = await Stock.findOne({tickerSymbol: payload.ticker_symbol});
            } else {
                data = await Stock.findById(payload.stock_id);
            }
            console.log("stock data::", data);
            logging.log(apiReference, {SERVICE: "getStock", ERROR: {}, DATA: data});
            if (!(data)) {
                throw new Error("Not found");
            } else {
                console.log("price:::", parseFloat(data.currentPrice))
                resolve(data);
            }
        } catch (error) {
            logging.log(apiReference, {SERVICE: "getStock", ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const logTrade = (apiReference, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = new Trade({
                portfolioId: payload.portfolio_id,
                stock_id: payload.stock._id,
                quantity: payload.quantity,
                price: payload.stock.currentPrice,
                created_at: new Date()
            });
            let data = await user.save();
            resolve(data);
        } catch (error) {
            logging.log(apiReference, {FUNCTION: "logTrade", ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const getTradeLog = (apiReference, portfolioId, stock) => {
    return new Promise(async (resolve, reject) => {
        try {
            stock.trade_log = await Trade.find({
                portfolioId: portfolioId,
                stock_id: stock.stock_id
            }, {
                "_id": 0,
                "quantity": 1,
                "price": 1,
                "created_at": 1
            });
            resolve();
        } catch (error) {
            logging.log(apiReference, {FUNCTION: "getTradeLog", ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const getStockReturns = (apiReference, stock) => {
    return new Promise(async (resolve, reject) => {
        try {
            let stockCurrent = await getStock(apiReference, stock);
            stock.average_buy_price = parseFloat(stock.average_buy_price["$numberDecimal"]);
            stock.currentPrice = parseFloat(stockCurrent.currentPrice);

            let returns = (stock.quantity * parseFloat(stockCurrent.currentPrice)) -
                (stock.quantity * stock.average_buy_price);
            stock.returns = returns;
            resolve();
        } catch (error) {
            logging.log(apiReference, {FUNCTION: "getStockReturns", ERROR: error, DATA: {}});
            reject({
                "message": constants.responseMessages.ERROR_IN_EXECUTION,
                "status": constants.responseFlags.ERROR_IN_EXECUTION,
                "data": {}
            });
        }
    });
};

const signToken = (apiReference, payload) => {
    return jwt.sign({
        "id": payload._id,
    }, config.get('authSettings.authKey'), {expiresIn: 60 * 60})
};

const verifyToken = (apiReference, token) => {
    try {
        return jwt.verify(token, config.get('authSettings.authKey'));
    } catch (err) {
        console.log("err", err)
        throw {
            "message": constants.responseMessages.ERROR_IN_EXECUTION,
            "status": constants.responseFlags.ERROR_IN_EXECUTION,
            "data": {}
        };
    }
};


module.exports.addUser = addUser;
module.exports.addStocks = addStocks;
module.exports.getUser = getUser;
module.exports.getPortfolio = getPortfolio;
module.exports.addTradeToPortfolio = addTradeToPortfolio;
module.exports.updateTradeToPortfolio = updateTradeToPortfolio;
module.exports.deleteTradeToPortfolio = deleteTradeToPortfolio;
module.exports.getStock = getStock;
module.exports.logTrade = logTrade;
module.exports.getTradeLog = getTradeLog;
module.exports.getStockReturns = getStockReturns;
module.exports.verifyToken = verifyToken;
module.exports.signToken = signToken;