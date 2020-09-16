const _ = require('underscore');
const bcrypt = require('bcrypt');

const service = require('./service');
const constants = require('./../constants/constants');


const signup = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            payload.password = await bcrypt.hash(payload.password, config.get('authSettings.saltRounds'));
            let userData = await service.addUser(payload.apiReference, payload);

            resolve({
                "access_token": service.signToken(payload.apiReference, userData)
            });
        } catch (error) {
            reject(error);
        }
    });
};

const login = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = await service.getUser(payload.apiReference, payload);

            const match = await bcrypt.compare(payload.password, userData.hashed_password);

            if (match) {
                resolve({
                    "id": userData.id,
                    "user_name": userData.user_name,
                    "access_token": service.signToken(payload.apiReference, userData)
                });
            } else {
                throw {
                    "message": constants.responseMessages.INVALID_PASSWORD,
                    "status": constants.responseFlags.SHOW_ERROR_MESSAGE,
                    "data": {}
                };
            }
        } catch (error) {
            reject(error);
        }
    });
};

const addStocks = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            await service.addStocks(payload.apiReference, payload);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

const putTrade = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deCodedToken = await service.verifyToken(payload.apiReference, payload.access_token);
            payload.user_id = deCodedToken.id;

            let portfolio = await service.getPortfolio(payload.apiReference, payload);
            payload.portfolio_id = portfolio._id;

            let stock = await service.getStock(payload.apiReference, payload);
            payload.stock = stock;

            await Promise.all([
                service.logTrade(payload.apiReference, payload),
                service.addTradeToPortfolio(payload.apiReference, payload)
            ]);

            resolve({});
        } catch (error) {
            reject(error);
        }
    });
};

const updateTrade = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deCodedToken = await service.verifyToken(payload.apiReference, payload.access_token);
            payload.user_id = deCodedToken.id;

            let portfolio = await service.getPortfolio(payload.apiReference, payload);
            payload.portfolio_id = portfolio._id;

            let stock = await service.getStock(payload.apiReference, payload);
            payload.stock = stock;

            payload.stock_in_portfolio = portfolio.stocks.filter((portfolioStock) => {
                return portfolioStock.stock_id.toString() === stock._id.toString();
            });

            await Promise.all([
                service.logTrade(payload.apiReference, payload),
                service.updateTradeToPortfolio(payload.apiReference, payload)
            ]);

            resolve({});
        } catch (error) {
            reject(error);
        }
    });
};

const deleteTrade = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deCodedToken = await service.verifyToken(payload.apiReference, payload.access_token);
            payload.user_id = deCodedToken.id;

            let portfolio = await service.getPortfolio(payload.apiReference, payload);
            payload.portfolio_id = portfolio._id;

            let stock = await service.getStock(payload.apiReference, payload);
            payload.stock = stock;

            payload.stock_in_portfolio = portfolio.stocks.filter((portfolioStock) => {
                return portfolioStock.stock_id.toString() === stock._id.toString();
            });

            payload.quantity =  -(payload.stock_in_portfolio[0].quantity);

            await Promise.all([
                service.logTrade(payload.apiReference, payload),
                service.deleteTradeToPortfolio(payload.apiReference, payload)
            ]);

            resolve({});
        } catch (error) {
            reject(error);
        }
    });
};

const getPortfolio = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deCodedToken = await service.verifyToken(payload.apiReference, payload.access_token);
            payload.user_id = deCodedToken.id;

            let portfolio = await service.getPortfolio(payload.apiReference, payload);
            await Promise.all(portfolio.stocks.map((stock) => {
                return service.getTradeLog(payload.apiReference, portfolio._id, stock);
            }));
            resolve(portfolio);
        } catch (error) {
            reject(error);
        }
    });
};

const getHolding = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deCodedToken = await service.verifyToken(payload.apiReference, payload.access_token);
            payload.user_id = deCodedToken.id;

            let portfolio = await service.getPortfolio(payload.apiReference, payload);
            resolve(portfolio);
        } catch (error) {
            reject(error);
        }
    });
};

const getReturns = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deCodedToken = await service.verifyToken(payload.apiReference, payload.access_token);
            payload.user_id = deCodedToken.id;

            let portfolio = await service.getPortfolio(payload.apiReference, payload);
            await Promise.all(portfolio.stocks.map((stock) => {
                return service.getStockReturns(payload.apiReference, stock);
            }));
            resolve(portfolio);
        } catch (error) {
            reject(error);
        }
    });
};


module.exports.signup = signup;
module.exports.login = login;
module.exports.addStocks = addStocks;
module.exports.putTrade = putTrade;
module.exports.updateTrade = updateTrade;
module.exports.deleteTrade = deleteTrade;
module.exports.getPortfolio = getPortfolio;
module.exports.getHolding = getHolding;
module.exports.getReturns = getReturns;