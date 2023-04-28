var db = require('./db');
var qs = require('querystring');

module.exports = {
    home : function (request, response) {
        db.query(`SELECT * FROM namecard`, function(error,results) {

            var context = {doc : `./namecard/namecard.ejs`,
                            loggined : request.session.is_logined,
                            id : request.session.login_id ,
                            results : results
                            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            });
        });
    },
    namecardCreate : function(request, response){
        var context = {
                doc : `./namecard/namecardCreate.ejs`,
                name : '',
                tel : '',
                address : '',
                com : '',
                kindOfDoc : 'C',
                loggined : request.session.is_logined,
                id : request.session.login_id ,
            };
                request.app.render('index',context, function(err, html){
                response.end(html); 
        })
    },
    namecardCreate_process : function(request,response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var nc = qs.parse(body);
            db.query(`
                INSERT INTO namecard (name, tel, address, com) VALUES(?, ?, ?, ?)`,
                [nc.name, nc.tel, nc.address, nc.com], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/namecard`});
                    response.end();
                }
            );
        });
    },
    namecardList : function(request,response){
        db.query(`SELECT * FROM namecard `,
            function(error, result) {
                if(error) {
                    throw error;
                }
                var context = {doc : `./namecard/namecardList.ejs`,
                            loggined : request.session.is_logined,
                            id : request.session.login_id ,
                            results : result
                        };
                request.app.render('index',context, function(err, html){
                    response.end(html);
                });
            }
        ); 
    },
    namecardUpdate : function(request,response){
        var ncId = request.params.ncId;
        db.query(`SELECT * FROM namecard where id = ${ncId} `,
            function(error, result) {
                if(error) {
                    throw error;
                }
                var context = {doc : `./namecard/namecardCreate.ejs`,
                            name : result[0].name,
                            tel : result[0].tel,
                            address : result[0].address,
                            com : result[0].com,
                            nId : ncId,
                            kindOfDoc : 'U',
                            loggined : request.session.is_logined,
                            id : request.session.login_id ,
                        };
                request.app.render('index',context, function(err, html){
                    response.end(html); });
        }); 
    },
    namecardUpdate_process : function(request, response) {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var nc = qs.parse(body);
            ncId = request.params.ncId;
            db.query('UPDATE namecard SET name=?, tel=?, address=?, com=? WHERE id=?',
                    [nc.name, nc.tel, nc.address, nc.com, ncId], function(error, result) {
                        response.writeHead(302, {Location: `/namecard`});
                        response.end();
                    });
        });
    },
    namecardDelete_process : function(request, response) {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var us = qs.parse(body);
            ncId = request.params.ncId;
            db.query('DELETE FROM namecard WHERE id = ?', [ncId], function(error, result) {
                if(error) {
                    throw error;
                }
                response.writeHead(302, {Location: `/namecard`});
                response.end();
            });
        });
        }
}