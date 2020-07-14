const mysql = require("mysql2");

exports.handler = function (event, context,callback) {
    // TODO implement
    var response={
        headers:{
            'Content-Type': 'application/json'
        }
    }


    var conn = mysql.createConnection({
        host: "database-1.cicjgdbixfoj.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "8K0vtoWk9qzXvQEshesW",
        port: 3306,
        database: "teletok_lambda"
    });

    conn.connect(function(err){
        if(err){
            conn.end(function() {

                response.statusCode = 400;
                response.body = JSON.stringify({
                    "error": "POST_NOT_FOUND"
                });

                callback(err, response);
            });
        }else{
            console.log(event);
            if(event.queryStringParameters != null){
                var id = event.queryStringParameters.id;
                var sql = "SELECT * FROM post p where p.id = ?";
                var queryUser = "SELECT u.* FROM post p inner join user u on u.id=p.user_id where p.id = ?";

                var param = [id];

                conn.query(sql,param,function(er, result){
                    if(er){
                        conn.end(function() {

                            response.statusCode = 400;
                            response.body = JSON.stringify({
                                "error": "POST_NOT_FOUND",
                                "msg": err
                            });

                            callback(er, response);
                        });
                    }else{
                        conn.query(queryUser,param,function(e,result1){
                            conn.end(function() {

                                response.statusCode = 200;
                                response.body = JSON.stringify({
                                    result,
                                    result1
                                });

                                callback(null, response);
                            });
                        });

                    }
                });

            }else{

                response.statusCode = 400;
                response.body = JSON.stringify({
                    "error": "POST_NOT_FOUND"
                });

                callback(null, response);
            }
        }
    });



};

