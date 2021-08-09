let Category = require('../models/Category');
let ConnectionSteps = require('../../helper/connection-steps');

module.exports.controllerListCategories = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aCategory = new Category();
        let limit = req.query.limit;
        let offset = req.query.offset;
        if(req.query.parent_id == undefined){
            aCategory.parent_id = {"category_id":null};
        }else{
            aCategory.parent_id = {"category_id":req.query.parent_id};
        }
        aCategory.listCategories(connection,limit,offset, function (err, arrOfCategories) {
            callback(err, arrOfCategories);
        });
    });
};