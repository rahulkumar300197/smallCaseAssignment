const Joi = require('joi');

const constants = require('../constants/constants');
const commonServices = require('../commonServices/service');
const responses = require('../responses/responses');

const apiReferenceModule = 'user';


const signup = (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().email({tlds: {allow: false}}).required(),
        password: Joi.string().required()
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "signup"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};

const login = (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().email({tlds: {allow: false}}).required(),
        password: Joi.string().required()
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "login"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};

const addStocks = (req, res, next) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        ticker_symbol: Joi.string().required(),
        current_price: Joi.number().required()
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "addStocks"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};

const putTrade = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        ticker_symbol: Joi.string().required(),
        quantity: Joi.number().required().min(1)
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "putTrade"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};

const updateTrade = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        ticker_symbol: Joi.string().required(),
        quantity: Joi.number().required().min(1)
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "updateTrade"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};

const deleteTrade = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required(),
        ticker_symbol: Joi.string().required()
    });
    if (commonServices.validateFields(req.body, res, schema)) {
        req.body.apiReference = {
            module: apiReferenceModule,
            api: "deleteTrade"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};

const getPortfolio = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required()
    });
    if (commonServices.validateFields(req.query, res, schema)) {
        req.query.apiReference = {
            module: apiReferenceModule,
            api: "getPortfolio"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};

const getHolding = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required()
    });
    if (commonServices.validateFields(req.query, res, schema)) {
        req.query.apiReference = {
            module: apiReferenceModule,
            api: "getHolding"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
};

const getReturns = (req, res, next) => {
    const schema = Joi.object().keys({
        access_token: Joi.string().required()
    });
    if (commonServices.validateFields(req.query, res, schema)) {
        req.query.apiReference = {
            module: apiReferenceModule,
            api: "getReturns"
        };
        next();
    } else {
        responses.parameterMissingResponse(res);
    }
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