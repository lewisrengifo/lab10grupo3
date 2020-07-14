const mysql = require('mysql2');
const querystring = require('querystring');

exports.handler = function(event, context, callback) {

    if (event.body != null && event.body != undefined) {

        var bodyBase64 = Buffer.from(event.body, 'base64').toString();
        var body = querystring.parse(bodyBase64);

        var token = body.token;
        var description = body.description;

        var conn = mysql.createConnection({
            host: "database-1.cbnvuu0kvg2e.us-east-1.rds.amazonaws.com",
            user: "admin",
            password: "MjBu4uf5FQM1bbzqCUzc",
            port: 3306,
            database: "teletok_lambda"
        });

        conn.connect(function(error) {
            if (error) {
                conn.end(function() {
                    callback(error, {
                        statusCode: 400,
                        body: JSON.stringify({
                            "estado": "error",
                            "msg": "error en la conexión a base de datos"
                        })
                    });
                });
            }
            else {
                console.log("exito");
                var sql1="select * from token where code=?1";
                conn.query(sql1,[token],function(erro,result){
                    if(erro){
                        conn.end(function() {
                            callback(error, {
                                statusCode: 400,
                                body: JSON.stringify({
                                    "estado": "error",
                                    "msg": "error al realizar Query",
                                    "err": error
                                })
                            });
                        });
                    }
                    else{
                        if(result.length>0){
                            var sql2 = "INSERT INTO post (description,user_id) VALUES (?,?)";
                            conn.query(sql2, [description,result.user_id], function(e, resu) {
                                if (e) {
                                    conn.end(function() {
                                        callback(error, {
                                            statusCode: 400,
                                            body: JSON.stringify({
                                                "estado": "error",
                                                "msg": "No se pudo guardar",
                                                "err": error
                                            })
                                        });
                                    });
                                }
                                else {
                                    sql3 = "SELECT * FROM post where user_id=?";
                                    conn.query(sql3,[result.user_id], function(er, resul) {
                                        conn.end(function() {
                                            callback(null, {
                                                statusCode: 200,
                                                body: JSON.stringify({
                                                    "postId": resul.id,
                                                    "status": "POST_CREATED"
                                                })
                                            });
                                        });
                                    });
                                }
                            });
                        }

                    }
                });
            }
        });

    }

}