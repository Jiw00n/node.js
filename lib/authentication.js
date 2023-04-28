var db = require('./db')
var qs = require('querystring')


module.exports = {
    login : function(request, response){
        var context = {doc : `login.ejs`, 
                        id : '' , loggined : 'N' };
        request.app.render('index',context, function(err, html){
        response.end(html); })
    },
    login_process : function(request,response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query(`SELECT loginid, password, cls FROM person WHERE loginid = ? and password = ?` ,
                    [post.id, post.pw], 
                    function(error, result) {
                        if(error) {
                            throw error;
                        }
                        if( result[0] === undefined)
                            response.end('Who ?');
                        else{
                            request.session.is_logined = true;
                            request.session.login_id = result[0].loginid;
                            request.session.class = result[0].cls;
                            response.redirect('/');
                            //response.end('Welcome !!!');
                        }
                    }
            );
        });
    },
    logout : function(request, response){
        request.session.destroy(function(err){
        response.redirect('/');
        });
    },

    register : function(request, response){
        var context = {doc : `register.ejs`, 
            id : '' , 
            pw : '', 
            name : '',
            address : '',
            tel : '',
            birth : '',
            loggined : 'N'};
        request.app.render('index',context, function(err, html){
        response.end(html); })
    },

    register_process : function(request,response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var us = qs.parse(body);
            db.query(`
                INSERT INTO person (loginid, password, name, address, tel, birth, cls, grade) 
                VALUES(?, ?, ?, ?, ?, ?, 'B', 'B')`,
                [us.id, us.pw, us.name, us.address, us.tel, us.birth], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/`});
                    response.end();
                }
            );
        });
    },
    changepw : function(request,response){
        var usId = request.session.login_id;
        db.query(`SELECT password FROM person where loginid = '${usId}' `,
            function(error, result) {
                if(error) {
                    throw error;
                }
                var context = {doc : `./changepw.ejs`,
                            usId : usId,
                            loggined : request.session.is_logined, 
                            id : request.session.login_id
                        };
                request.app.render('index',context, function(err, html){
                    response.end(html); });
        }); 
    },

    changepw_process : function(request,response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var us = qs.parse(body);
            db.query(`
                UPDATE person SET password=? WHERE loginid=?`,
                [us.pw_new, request.session.login_id], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/`});
                    response.end();
                }
            );
        });
    }
}