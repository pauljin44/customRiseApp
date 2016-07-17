var express = require('express');
var router = express.Router();


var mysql = require('mysql');
var connection = mysql.createConnection({
   port: 3000,
   host: 'localhost',
   user: 'root',
   password: "1111",
   database: "customRise_db"
});


connection.connect(function(err) {
   if (err) {
       console.error('error connecting: ' + err.stack);
       return;
   }
   console.log('connected as id ' + connection.threadId);
});

//module.exports = connection;

/* GET home page. */
router.get('/', function(req, res, next) {
 res.render('index', { title: 'customRise'});
});


//<!--note to self put hbs file name int he section after render. hsb ending needed-->
router.get('/map', function(req, res, next) {
 res.render('map', { title: 'Map' });
});

router.get('/buyer', function(req, res, next) {
  console.log(req.session);
  if(req.session.logged_in!=true){
      res.redirect("/login");
  }else{
    res.render('buyerlandingPage', { title: 'buyer' });
  }

});

router.get('/manufacturer', function(req, res, next) {


console.log(req.session);
if(req.session.logged_in!=true){
    res.redirect("/login");
}else{
  if(req.session.user_type=="manufacturer"){
    res.render('manufacturerLandingPage', {title: 'manufacturer'});
  }else{
    res.render('login', {user_message: 'Sorry you\'re not a manufacturer.'});
  }
}

});

router.get('/manufacturerform ', function(req,res, next){
  res.render('manfacturerLandingPage', { data: results });
});


 //<!-- connection.query('select * from table name  WHERE colume=?',[req.session.instudy], function (error, results, fields) {-->


router.get('/register', function(req, res, next) {
 res.render('regristrationPage', { title: 'regristration' });
});

router.post('/register-process', function(req, res, next) {
  console.log(req.body);
    connection.query('INSERT INTO buyer_regristration (email, password, first_name, last_name, phone, company_name, street_address, state, country, industry, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.body.email,req.body.password, req.body.first_name,req.body.last_name,req.body.phone,req.body.company_name,req.body.street_address,req.body.state,req.body.country,req.body.industry,req.body.user_type],function(err, result) {

      req.session.logged_in=true;
      req.session.email=req.body.email;
      req.session.user_id=result.insertId;
      req.session.user_type=req.body.user_type;

      if(req.body.user_type=="manufacturer"){
        res.redirect('/manufacturer');
      }else{
        res.redirect('/buyer');
      }

    });




});



router.post('/requestaQuote', function(req, res, next) {

console.log(req.session);

res.render('buyerLandingPage');
//    connection.query('post INTO intakeforms (first_name,last_name, email,phone,company_name,asking price,comments,Quantitys) values(req.body.First Name, req.body Last Name req.body.email, req.body.phone, req.body.company_name, req.body asking price, req.body comments, req. body Quantitys, req.body country,req.body industry, req.body radio ');
});


router.get('/login', function(req, res, next){

  res.render('login', { title: 'Sign In' });

});



router.post('/login-process', function(req, res, next){

//res.send("Got form")
//  res.render('login', { title: 'Sign In' });

///  Get the login form contents
console.log(req.body);

/// Check if the username and password is in the data to see if this is a valid user
connection.query("SELECT * FROM user_regristration WHERE email=? AND password=?", [req.body.email, req.body.password], function(err,result){

console.log(err)
console.log(result);

if(result.length>0){
        /// If it is a valid user then show them either the manufacturer page or the creator custom page
        req.session.logged_in=true;
        req.session.email=result[0].email;
        req.session.user_id=result[0].id;
        req.session.user_type=result[0].user_type;

        if(result[0].user_type=="manufacturer"){
          console.log("got mamufacturer registration number?")
          res.redirect('/Manufacturer');
        }
        if(result[0].user_type=="creator"){
          res.redirect('/buyer')
        }

}else{
/// If it is not a valid send them back to the login page (/login)
res.render('login',{user_message:"Invalid Login. Please try again"})
}

});



});


module.exports = router;
