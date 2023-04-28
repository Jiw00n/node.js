var express = require('express')
var app = express()
app.set('views',__dirname+'/views')
app.set('view engine','ejs');
var db = require('./lib/db.js')
var etc = require('./lib/etc.js');
var book = require('./lib/book.js')
var user = require('./lib/user.js')
var auth = require('./lib/authentication')
var namecard = require('./lib/namecard')
var search = require('./lib/search.js')
var board = require('./lib/board.js')

var session = require('express-session')
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host    : 'localhost',
    user    : 'root',
    password: 'root',
    database: 'webdb2022'
}
var sessionStore = new MySqlStore(options);

app.use(express.static('public'));

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));


// book
app.get('/',function(request, response){
    book.home(request, response);
})
app.post('/',function(request, response){
    book.home(request, response);
})
app.get('/book_detail/:bId',function(request, response){
    book.detail(request, response);
})
app.get('/book/create',function(request, response){
    book.create(request, response);
})
app.post('/book/create_process',function(request, response){
    book.create_process(request, response);
})
app.get('/book/list',function(request, response){
    book.list(request, response);
})
app.get('/book/update/:bId',function(request, response){
    book.update(request, response);
})
app.post('/book/update_process/:bId',function(request, response){
    book.update_process(request, response);
})
app.get('/book/delete_process/:bId',function(request, response){
    book.delete_process(request, response);
})
app.get('/book/best',function(request, response){
    book.best(request, response);
})
app.get('/book/month',function(request, response){
    book.month(request, response);
})
app.get('/book/ebook',function(request, response){
    book.ebook(request, response);
})
app.post('/book/cart_process',function(request, response){
    book.cart_process(request, response);
})
app.get('/book/cart',function(request, response){
    book.cart(request, response);
})
app.get('/book/cart/delete/:ctId',function(request, response){
    book.cartDelete(request, response);
})
app.post('/book/cart/update/:ctId',function(request, response){
    book.cartUpdate(request, response);
})
app.post('/book/purchase_process',function(request, response){
    book.purchase_process(request, response);
})
app.post('/book/purchase',function(request, response){
    book.purchase(request, response);
})
app.post('/book/purchase/cancel/:ctId',function(request, response){
    book.purchaseCancel(request, response);
})
app.get('/book/purchase/cancel/:puId',function(request, response){
    book.purchaseCancel(request, response);
})
app.get('/book/order',function(request, response){
    book.order(request, response);
})


// 로그인
app.get('/login',function(request, response){
    auth.login(request, response);
}) ;
app.post('/login_process',function(request, response){
    auth.login_process(request, response);
})
app.get('/logout',function(request, response){
    auth.logout(request, response);
}) ;
app.get('/register', function(request, response){
    auth.register(request, response);
})
app.post('/register_process',function(request, response){
    auth.register_process(request, response);
})
app.get('/changepw', function(request, response){
    auth.changepw(request, response);
})
app.post('/changepw_process/:usId',function(request, response){
    auth.changepw_process(request, response);
})

// 네임카드
app.get('/namecard', function(request, response){
    namecard.home(request, response);
}) ;
app.get('/namecard/create',function(request, response){
    namecard.namecardCreate(request, response);
})
app.post('/namecard/create_process',function(request, response){
    namecard.namecardCreate_process(request, response);
})
app.get('/namecard/list',function(request, response){
    namecard.namecardList(request, response);
})
app.get('/namecard/update/:ncId',function(request, response){
    namecard.namecardUpdate(request, response);
})
app.post('/namecard/update_process/:ncId',function(request, response){
    namecard.namecardUpdate_process(request, response);
})
app.get('/namecard/delete_process/:ncId',function(request, response){
    namecard.namecardDelete_process(request, response);
})


// 캘린더
app.get('/calendar',function(request, response){
    console.log("get");
    etc.calendarHome(request, response);
})
app.get('/calendar/create',function(request, response){
    etc.calendarCreate(request, response);
})
app.post('/calendar/create_process',function(request, response){
    etc.calendarCreate_process(request, response);
})
app.get('/calendar/list',function(request, response){
    etc.calendarList(request, response);
})
app.get('/calendar/update/:planId',function(request, response){
    etc.calendarUpdate(request, response);
})
app.post('/calendar/update_process/:planId',function(request, response){
    etc.calendarUpdate_process(request, response);
})
app.get('/calendar/delete_process/:planId',function(request, response){
    etc.calendarDelete_process(request, response);
})


// 유저
app.get('/user',function(request, response){
    user.userHome(request, response)
})
app.get('/user/create',function(request, response){
    user.userCreate(request, response);
})
app.post('/user/create_process',function(request, response){
    user.userCreate_process(request, response);
})
app.get('/user/list',function(request, response){
    user.userList(request, response);
})
app.get('/user/update/:usId',function(request, response){
    user.userUpdate(request, response);
})
app.post('/user/update_process/:usId',function(request, response){
    user.userUpdate_process(request, response);
})
app.post('/user/delete_process/:usId',function(request, response){
    user.userDelete_process(request, response);
})


// search
app.get('/book/search',function(request, response){
    search.booksearch(request, response);
})
app.post('/book/search',function(request, response){
    search.bookidsearch(request, response);
}) ;
app.get('/namecard/search',function(request, response){
    search.ncsearch(request, response);
})
app.post('/namecard/search',function(request, response){
    search.ncidsearch(request, response);
}) ;
app.get('/calendar/search',function(request, response){
    search.calsearch(request, response);
})
app.post('/calendar/search',function(request, response){
    search.calidsearch(request, response);
}) ;
    

//board
app.get('/board/list/:pNum',function(request, response){
    board.list(request, response)
})
app.get('/board/view/:bNum/:pNum',function(request, response){
    board.view(request, response)
})
app.get('/board/create',function(request, response){
    board.create(request, response)
})
app.post('/board/create_process',function(request, response){
    board.create_process(request, response);
})
app.get('/board/update/:bNum/:pNum',function(request, response){
    board.update(request, response);
})
app.post('/board/update_process',function(request, response){
    board.update_process(request, response);
})
app.get('/board/delete/:bNum/:pNum',function(request, response){
    board.delete(request, response);
})

    


app.listen(3000, () => console.log('App listening on port 3000'))  