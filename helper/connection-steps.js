var conn = require('../database');
var async = require('async');

function Helper() {
}

/**
 * 
 * @param {*} req the coming request.
 * @param {*} res the response to be returned.
 * @param {*} next callback with the next execution.
 * @returns {*} close the connection of DB and response to the user.
 * 
 * This is a helper function that opens a connection to the database and do the logic of our code then
 * release that connection and response to the user.
 * */

Helper.prototype.controllerSteps = function (req, res, next, UserAction) {
    let aConnection = null;
    async.waterfall([
        //Connect to DB.
        function (callback) {
            conn.connectionWithTransaction(function (err, connection) {
                aConnection = connection;
                callback(err);
            });
        }, 
        //Do some logic
        function (callback) {
            UserAction(aConnection, function (err, returnedObject) {
                callback(err, returnedObject);
            });
        }
    ],
        //release DB connection then response with our output.
        function (err, output) {
            conn.releaseConnectionWithTransaction(err, aConnection, function (err) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json(output);
                }
            });
        }
    );
};

module.exports = Helper;