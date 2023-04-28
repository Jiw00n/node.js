var db = require('./db');
var qs = require('querystring');

module.exports = {
    booksearch : function(request, response){
        var context = {
            doc : `./book/booksearch.ejs`,
            listyn : 'N',
            kind : '책 검색',
            loggined : request.session.is_logined,
            id : request.session.login_id
        };
            request.app.render('index',context, function(err, html){
            response.end(html); 
    })
    },
    bookidsearch : function(request, response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query(`SELECT * FROM book where name like ?`,
                [`%${post.keyword}%`], function(error, results) {
                    if(error) {
                        throw error;
                    }
                    var context = {
                        doc : `./book/booksearch.ejs`,
                        kind : '책 검색',
                        listyn : 'Y',
                        loggined : request.session.is_logined, 
                        id : request.session.login_id,
                        bs : results
                    }
                    request.app.render('index',context, function(err, html){
                        response.end(html);
                    })
            });
        })
    },
    ncsearch : function(request, response){
        var context = {
            doc : `./namecard/ncsearch.ejs`,
            listyn : 'N',
            kind : 'namecard 검색',
            loggined : request.session.is_logined,
            id : request.session.login_id
        };
            request.app.render('index',context, function(err, html){
            response.end(html); 
    })
    },
    ncidsearch : function(request, response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query(`SELECT * FROM namecard where name like ?`,
                [`%${post.keyword}%`], function(error, results) {
                    if(error) {
                        throw error;
                    }
                    var context = {
                        doc : `./namecard/ncsearch.ejs`,
                        kind : 'namecard 검색',
                        listyn : 'Y',
                        loggined : request.session.is_logined, 
                        id : request.session.login_id,
                        bs : results
                    }
                    request.app.render('index',context, function(err, html){
                        response.end(html);
                    })
            });
        })
    },
    calsearch : function(request, response){
        var context = {
            doc : `./calendar/calsearch.ejs`,
            listyn : 'N',
            kind : '캘린더 검색',
            loggined : request.session.is_logined,
            id : request.session.login_id
        };
            request.app.render('index',context, function(err, html){
            response.end(html); 
    })
    },
    calidsearch : function(request, response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            db.query(`SELECT * FROM calendar where title like ?`,
                [`%${post.keyword}%`], function(error, results) {
                    if(error) {
                        throw error;
                    }
                    var context = {
                        doc : `./calendar/calsearch.ejs`,
                        kind : '캘린더 검색',
                        listyn : 'Y',
                        loggined : request.session.is_logined, 
                        id : request.session.login_id,
                        bs : results
                    }
                    request.app.render('index',context, function(err, html){
                        response.end(html);
                    })
            });
        })
    },
}