var Product = require('../models/Product');
var ConnectionSteps = require('../../helper/connection-steps');

module.exports.controllerListProductsByState = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aProduct = new Product();
        let limit = req.query.limit;
        let offset = req.query.offset;
        aProduct.state = {'state_id':req.params.state_id}
        aProduct.listProducts(connection,limit,offset, function (err, arrOfProducts) {
            callback(err, arrOfProducts);
        });
    });
};

module.exports.controllerUpdateProductState = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aProduct = new Product();
        let nextStateId = req.params.next_state_id;
        aProduct.product_id = req.body.product_id;
        aProduct.updateProductState(connection, nextStateId, function (err, updatedProduct) {
            callback(err, updatedProduct);
        });
    });
};