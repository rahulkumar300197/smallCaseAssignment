const path = require('path');


const commonServices = require('../commonServices/service');
const responses = require('../responses/responses');
const user = require('./controller');


const signup = async (req, res) => {
    try {
        let data = await user.signup(req.body);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}

const login = async (req, res) => {
    try {
        let data = await user.login(req.body);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}

const addStocks = async (req, res) => {
    try {
        let data = await user.addStocks(req.body);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}

const putTrade = async (req, res) => {
    try {
        let data = await user.putTrade(req.body);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}

const updateTrade = async (req, res) => {
    try {
        let data = await user.updateTrade(req.body);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}

const deleteTrade = async (req, res) => {
    try {
        let data = await user.deleteTrade(req.body);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}

const getPortfolio = async (req, res) => {
    try {
        let data = await user.getPortfolio(req.query);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}

const getHolding = async (req, res) => {
    try {
        let data = await user.getHolding(req.query);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}

const getReturns = async (req, res) => {
    try {
        let data = await user.getReturns(req.query);
        responses.actionCompleteResponse(res, data);
    } catch (error) {
        responses.sendCustomResponse(res, error);
    }
}


module.exports.signup = signup;
module.exports.login = login;
module.exports.addStocks = addStocks;
module.exports.putTrade = putTrade;
module.exports.updateTrade = updateTrade;
module.exports.deleteTrade = deleteTrade;
module.exports.getPortfolio = getPortfolio;
module.exports.getHolding = getHolding;
module.exports.getReturns = getReturns;