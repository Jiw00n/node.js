var db = require('./db');
var qs = require('querystring');

function dateOfEightDigit(){
    var today = new Date();
    var nowdate = String(today.getFullYear());
    var month ;
    var day ;
    if (today.getMonth < 9)
        month = "0" + String(today.getMonth()+1);
    else
        month = String(today.getMonth()+1);

    if (today.getDate < 10)
        day = "0" + String(today.getDate());
    else
        day = String(today.getDate());
       
    return nowdate + month + day;
}


module.exports = {
    home : function (request, response) {
        db.query(`SELECT * FROM book`, function(error,results) {
            var context = {doc : `./book/book.ejs`,
                            loggined : request.session.is_logined,
                            id : request.session.login_id ,
                            results : results,
                            kind : 'Book'       // 이달의 책, best는 다르게 설정하면 됨
                            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            });
        });
    },
    detail : function(request, response){
        var bId = request.params.bId;
        db.query(`SELECT name, author, price, img, id, stock FROM book WHERE id = ${bId}`, function(error, results){
            if(error) {
                throw error;
            }
            var context = {doc : `./book/bookdetail.ejs`,
                    loggined : request.session.is_logined,
                    id : request.session.login_id ,
                    results : results}           // results관련이 잘못되면 err_invalid_arg_type 에러뜸
            request.app.render('index', context, function(err, html){
                response.end(html);
            })
        })
    },
    create : function(request, response){
        var context = {
                doc : `./book/bookCreate.ejs`,
                name : '',
                publisher : '',
                author : '',
                stock : '',
                pubdate : '',
                pagenum : '',
                ISBN : '',
                ebook : '',
                kdc : '',
                img : '',
                price : '',
                nation : '',
                description : '',
                kindOfDoc : 'C',
                loggined : request.session.is_logined, 
                id : request.session.login_id
            };
                request.app.render('index', context, function(err, html){
                response.end(html); 
        })
    },
    create_process : function(request,response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var book = qs.parse(body);
            db.query(`
                INSERT INTO book (name, publisher, author, stock, pubdate, pagenum, ISBN, ebook, kdc, img, price, nation, description) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [book.name, book.publisher, book.author, book.stock, book.pubdate, book.pagenum, book.ISBN, book.ebook, book.kdc, book.img, book.price, book.nation, book.description ], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/`});
                    response.end();
                }
            );
        });
    },
    list : function(request,response){
        db.query(`SELECT * FROM book`, function(error, result) {
                if(error) {
                    throw error;
                }
                var context = {doc : `./book/bookList.ejs`,
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
    update : function(request,response){
        var bId = request.params.bId;
        db.query(`SELECT * FROM book where id = ${bId} `,
            function(error, result) {
                if(error) {
                    throw error;
                }
                var context = {doc : `./book/bookCreate.ejs`,
                            name : result[0].name,
                            publisher : result[0].publisher,
                            author : result[0].author,
                            stock : result[0].stock,
                            pubdate : result[0].pubdate,
                            pagenum : result[0].pagenum,
                            ISBN : result[0].ISBN,
                            ebook : result[0].ebook,
                            kdc : result[0].kdc,
                            img : result[0].img,
                            price : result[0].price,
                            nation : result[0].nation,
                            description : result[0].description,
                            bId : bId,
                            kindOfDoc : 'U',
                            loggined : request.session.is_logined, 
                            id : request.session.login_id
                        };
                request.app.render('index',context, function(err, html){
                    response.end(html); });
        }); 
    },
    update_process : function(request, response) {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var book = qs.parse(body);
            // form으로 보낸 post에 담긴 값
            bId = request.params.bId;       
            db.query('UPDATE book SET name=?, publisher=?, author=?, stock=?, pubdate=?, pagenum=?, ISBN=? ,ebook=?, kdc=?, img=?, price=?, nation=?, description=?  WHERE id=?',
                    [book.name, book.publisher, book.author, book.stock, book.pubdate, book.pagenum, book.ISBN, book.ebook, book.kdc, book.img, book.price, book.nation, book.description, bId], function(error, result) {
                        response.writeHead(302, {Location: `/book/list`});
                        response.end();
                    });
        });
    },
    delete_process : function(request, response) {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            bId = request.params.bId;
            // prj-main의 url에서 가져오는 것
            db.query('DELETE FROM book WHERE id = ?', [bId], function(error, result) {
                if(error) {
                    throw error;
                }
                response.writeHead(302, {Location: `/book`});
                response.end();
            });
        });
    },
    cart : function (request, response) {
        db.query(`SELECT * FROM cart, book where cart.custid = ? and cart.bookid=book.id`,[request.session.login_id], function(error,results) {
            var context = {doc : `./book/cart.ejs`,
                            loggined : request.session.is_logined,
                            id : request.session.login_id ,
                            results : results,
                            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            });
        });
    },
    cart_process : function(request, response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var cart = qs.parse(body);
            db.query(`
                INSERT INTO cart (custid, bookid, cartdate, qty) 
                VALUES(?, ?, ?, ?)`,
                [cart.custid, cart.bookid, dateOfEightDigit(), cart.qty], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/book/cart`});
                    response.end();
                }
            );
        });
        // 1. form 데이터를 불러 온다. 
        // 2. form 데이터로부터 cart 테이블에 필요한 데이터를 구하여 cart 테이블에 insert 한다. 
        // 3. cart 화면으로 redirection 한다.
        // 4. cart 화면에서 구매할 수도 있고 bookdetail 화면에서 구매할 수도 있다.
        // cart의 cartid랑 custid 따로 한 이유? -> 카트 안의 책들을 하나하나 cartid로 나눔
    },
    cartDelete: function(request, response) {
        ctId = request.params.ctId;
        db.query('DELETE FROM cart WHERE cartid = ?', [ctId], function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: `/book/cart`});
            response.end();
        });
    },
    cartUpdate : function(request, response) {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var book = qs.parse(body);
            ctId = request.params.ctId;
            db.query('UPDATE cart SET qty=? WHERE cartid=?',
                    [book.qty, ctId], function(error, result) {
                        response.writeHead(302, {Location: `/book/cart`});
                        response.end();
                    });
        });
    },
    
    purchase : function (request, response) {
        var body = '';
        request.on('data', function(data) {
                body = body + data;
        });
        request.on('end', function() {
            var pbook = qs.parse(body);
            db.query(`SELECT * FROM book, purchase where purchase.custid = ? and purchase.bookid=book.id`,[request.session.login_id], function(error,results) {
                var context = {doc : `./book/purchase.ejs`,
                                loggined : request.session.is_logined,
                                id : request.session.login_id,
                                results : results,
                                kind : 'P',
                                pbook : pbook
                                };
                request.app.render('index', context, function(err, html){
                    response.end(html);
                });
            });
        })
    },
    purchase_process : function(request, response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var purchase = qs.parse(body);
            db.query(`
                INSERT INTO purchase (custid, bookid, purchasedate, price, point, qty) 
                VALUES(?, ?, ?, ?, ?, ?)`,
                [purchase.custid, purchase.bookid, dateOfEightDigit(), purchase.price, purchase.price*purchase.qty*0.1, purchase.qty], function(error, result) {
                    if(error) {
                        throw error;
                    }
                    db.query(`UPDATE book SET stock=? where id=?`, [purchase.stock-purchase.qty,purchase.bookid])
                    if(purchase.cartid){
                        db.query(`DELETE FROM cart WHERE cartid = ?`, [purchase.cartid])
                    }
                    response.writeHead(302, {Location: `/book/order`});
                    response.end();
                }
            );
        });
        // 1. form 데이터를 불러 온다. 
        // 2. form 데이터로부터 purchase 테이블에 필요한 데이터를 구하여 purchase 테이블에 insert 한다. 포인트는 10%
        // 3. 구매 화면으로 redirection 한다. 
        // 구매 이력이 나와야함. purchase.ejs를 order 메뉴와 같게 하여 purchase.ejs에 구매이력과 if(책 구매)이면 구매화면이 나와야한다.
        // 4. 구매 화면에서는 구매 취소 버튼이 있다. 구매 취소 되면 cancel, refund가 Y로 바뀜, 포인트도 다시 돌아감
        // cancel : Y or N
        // refund : Y or N
    },
    purchaseCancel: function(request, response){
        puId = request.params.puId;
        db.query('UPDATE purchase SET cancel=?, refund=?, point=0 WHERE purchaseid=?', ['Y', 'Y', puId],function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: `/book/order`});
            response.end();
        });

    },
    order : function (request, response) {
            db.query(`SELECT * FROM book, purchase where purchase.custid = ? and purchase.bookid=book.id`,[request.session.login_id], function(error,results) {
                var context = {doc : `./book/purchase.ejs`,
                                loggined : request.session.is_logined,
                                id : request.session.login_id,
                                results : results,
                                kind : 'O',
                                };
                request.app.render('index', context, function(err, html){
                    response.end(html);
                });
            });
    },
    best : function(request, response){
        db.query(`SELECT * FROM book B join (SELECT * 
            FROM (
            SELECT bookid, count(bookid) as numOfSeller
            FROM purchase 
            group by bookid) A
            LIMIT 3) S on B.id = S.bookid
            order by numOfSeller desc`, function(error, result){
                var context = {doc : `./book/book.ejs`,
                            loggined : request.session.is_logined, 
                            id : request.session.login_id,
                            results : result,
                            kind : 'BestSeller'
                        };
                request.app.render('index',context, function(err, html){
                    response.end(html);
                });
            })
        },
    month : function(request,response){
        db.query(`SELECT * FROM book B join (SELECT * 
        FROM (
        SELECT bookid, count(bookid) as numOfSeller
        FROM purchase 
        WHERE left(purchasedate,6) = ?
        group by bookid
        order by count(bookid) desc ) A
        LIMIT 3) S on B.id = S.bookid`,[dateOfEightDigit().substring(0,6)], function(error, result){
            var context = {doc : `./book/book.ejs`,
                        loggined : request.session.is_logined, 
                        id : request.session.login_id,
                        results : result,
                        kind : '이달의 책'
                    };
            request.app.render('index',context, function(err, html){
                response.end(html);
            });
        }
        )
    },
    ebook : function (request, response) {
        db.query(`SELECT * FROM book where ebook='Y'`, function(error,results) {
            var context = {doc : `./book/book.ejs`,
                            loggined : request.session.is_logined,
                            id : request.session.login_id ,
                            results : results,
                            kind : 'ebook'
                            };
            request.app.render('index', context, function(err, html){
                response.end(html);
            });
        });
    }
            
}


