const mysql = require('mysql2');
const queryString = require('querystring');
exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    var response = {
        headers: {
            'Content-Type': 'application/json'
        },
    }
    var conn = mysql.createConnection({
        host: "database-1.chkcj9kuwup1.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "GwliayP9Y4HJdWaYZzWA",
        port: 3306,
        database: "hr-sw2",

    });
    conn.connect(function(error) {
        if (error) {
            conn.end(function() {
                response.statusCode = 400;
                response.body = JSON.stringify({
                    "estado": "error",
                    "msg": error
                });
                callback(error, response);
            });

        }
        else {
            console.log("exitooo");
            console.log(event);
            if (event.body !=null && event.body !=undefined) {
                var body = JSON.parse(event.body);
                var token = body.token;
                var postId = body.postId;
                var message = body.message;
                var sql1 = "SELECT * FROM token where code = ?1";
                var params1 = [token];
                conn.query(sql1, params1, function(error1, result1) {
                    if (error1) {
                        conn.end(function() {
                            response.statusCode = 400;
                            response.body = JSON.stringify({
                                "estado": "error",
                                "msg": error
                            });
                            callback(error, response);
                        });

                    }
                    else {
                        if (result1.length > 0) {
                            var userid = result1.user_id;
                            console.log(userid);
                            var sql2 = "INSERT INTO `teletok_lambda`.`post_comment` (`message`, `user_id`, `post_id`) VALUES (?1, ?2, ?3);";
                            var params2 = [message, userid, postId];
                            conn.query(sql2, params2, function(error2, result2) {
                                if (error2) {
                                    conn.end(function() {
                                        response.statusCode = 400;
                                        response.body = JSON.stringify({
                                            "estado": "error",
                                            "msg": error
                                        });
                                        callback(error, response);
                                    });
                                }
                                else {
                                    conn.end(function() {
                                        response.statusCode = 200;
                                        response.body = JSON.stringify({
                                            "comentId": result2.insertId,
                                            "status": "COMMENT_CREATED"
                                        });
                                        callback(null, response);
                                    });

                                }

                            })
                        }
                    }

                });

            }
            else {
                console.log("no funciona");
                response.statusCode = 400;
                response.body = JSON.stringify({
                    "estado": "error",
                    "msg": ":c xd"
                });
                callback(null,response);
            }



        }
    });


};

