const mysql = require('mysql');
var async = require('async');

//Create pool of database connections.
//queueLimit:10, limit pending connection queue.
const pool = mysql.createPool({
    connectionLimit: "100",
    queueLimit:10,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER_NAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

/**
 * 
 * @param {*} finalCallback That returns a connection to DB
 * 
 * Get a connection with a transaction.
 */
module.exports.connectionWithTransaction = function (finalCallback) {
    let aConnection = null;

    async.waterfall([
        function (callback) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    callback(err);
                } else {
                    aConnection = connection;
                    callback(null);
                }
            });
        },
        function(callback)
        {
          aConnection.query(" set @@SESSION.time_zone='+02:00' ",function(err){
            callback(err);
          });
        },
        function(callback)
        {
          aConnection.query(" set @@SESSION.sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' ",function(err){
            callback(err);
          });
        },
        function (callback) {
            aConnection.beginTransaction(function (err) {
                callback(err);
            });
        }

    ], function (err) {
        finalCallback(err, aConnection);
    })
}

/**
 * 
 * @param {*} err Error happens in the DB.
 * @param {*} aConnection The DB connection itself.
 * @param {*} callback Callback with response.
 * 
 * Release a connection with a transaction.
 */
module.exports.releaseConnectionWithTransaction = function (err, aConnection, callback) {
    //Return DB error.
    if (!aConnection) {
        let error = new Error();
        error.code = "DATABASE_ERROR";
        error.developerMessage = "DB Connection error";
        error.message = "Something went wrong..";
        callback(error);
    }
    // Rollback if we have an error during DB methods.
    else if (err) {
        aConnection.rollback(function () {
            aConnection.release();
            callback(err);
        });
    }
    // Commit if everything is okay.
    else {
        aConnection.commit(function (err) {
            if (err) {
                aConnection.rollback(function () {
                    aConnection.release();
                    callback(err);
                });
            }
            else {
                aConnection.release();
                callback(null);
            }
        });
    }
}

/**
 * 
 * @param {*} finalCallback Get a connection without transaction to GET methods only.
 * 
 */

module.exports.connectionWithoutTransaction = function (finalCallback) {
    let aConnection = null;

    async.waterfall([
        function (callback) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    callback(err);
                } else {
                    aConnection = connection;
                    callback(null);
                }
            });
        },
        function(callback)
        {
          aConnection.query(" set @@SESSION.time_zone='+02:00' ",function(err){
            callback(err);
          });
        },
        function(callback)
        {
          aConnection.query(" set @@SESSION.sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' ",function(err){
            callback(err);
          });
        }
    ], function (err) {
        finalCallback(err, aConnection);
    })
}

/**
 * 
 * @param {*} err Error happens in the DB.
 * @param {*} aConnection The DB connection itself.
 * @param {*} callback Callback with response.
 * 
 */

module.exports.releaseConnectionWithoutTransaction = function (err, aConnection, callback) {
    if (!aConnection) {
        let error = new Error();
        error.code = "DATABASE_ERROR";
        error.developerMessage = "DB Connection error";
        error.message = "Something went wrong..";
        callback(error);
    }
    else if (err) {
        aConnection.release();
        callback(err);
    }
    else {
        aConnection.release();
        callback(null);
    }
}

module.exports.pool = pool;