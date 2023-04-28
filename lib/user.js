var db = require('./db');
var qs = require('querystring');

module.exports = {
    userHome : function (request, response) {
        db.query(`SELECT * FROM person`, function(error,results) {
            var context = {doc : `./user/user.ejs`,
                            loggined : request.session.is_logined,
                            id : request.session.login_id ,
                            results : results
                            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            });
        });
    },
    userCreate : function(request, response){
        var context = {
                doc : `./user/userCreate.ejs`,
                name : '',
                password : '',
                address : '',
                tel : '',
                birth : '',
                cls : '',
                grade : '',
                kindOfDoc : 'C',
                loggined : request.session.is_logined, 
                id : request.session.login_id
            };
                request.app.render('index',context, function(err, html){
                response.end(html); 
        })
    },
    userCreate_process : function(request,response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var us = qs.parse(body);
            db.query(`
                INSERT INTO person (loginid, password, name, address, tel, birth, cls, grade) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`,
                [us.loginid, us.password, us.name, us.address, us.tel, us.birth, us.cls, us.grade], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/user`});
                    response.end();
                }
            );
        });
    },
    userList : function(request,response){
        db.query(`SELECT * FROM person`,
            function(error, result) {
                if(error) {
                    throw error;
                }
                var context = {doc : `./user/userList.ejs`,
                            loggined : request.session.is_logined, 
                            id : request.session.login_id,
                            results : result
                        };
                request.app.render('index',context, function(err, html){
                    response.end(html);
                });
            }
        ); 
    },
    userUpdate : function(request,response){
        var usId = request.params.usId;
        db.query(`SELECT * FROM person where id = ${usId} `,
            function(error, result) {
                if(error) {
                    throw error;
                }
                var context = {doc : `./user/userCreate.ejs`,
                            name : result[0].name,
                            password : result[0].password,
                            address : result[0].address,
                            tel : result[0].tel,
                            birth : result[0].birth,
                            cls : result[0].cls,
                            grade : result[0].grade,
                            uId : usId,
                            kindOfDoc : 'U',
                            loggined : request.session.is_logined, 
                            id : request.session.login_id
                        };
                request.app.render('index',context, function(err, html){
                    response.end(html); });
        }); 
    },
    userUpdate_process : function(request, response) {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var us = qs.parse(body);
            usId = request.params.usId;
            db.query('UPDATE person SET name=?, password=?, address=?, tel=?, birth=?, cls=?, grade=? WHERE id=?',
                    [us.name, us.password, us.address, us.tel, us.birth, us.cls, us.grade, usId], function(error, result) {
                        response.writeHead(302, {Location: `/user`});
                        response.end();
                    });
        });
    },
    userDelete_process : function(request, response) {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var us = qs.parse(body);
            usId = request.params.usId;
            db.query('DELETE FROM person WHERE id = ?', [usId], function(error, result) {
                if(error) {
                    throw error;
                }
                response.writeHead(302, {Location: `/user`});
                response.end();
            });
        });
        }
        
}