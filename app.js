var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var PdfPrinter = require('pdfmake');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/make-pdf', (req, res) => {
  var fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
    }
  };

  var printer = new PdfPrinter(fonts);
  var fs = require('fs');

  var docDefinition = {
    content: [
      'First paragraph - JUST NOW',
      'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    ]
  };

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('document.pdf'));
  pdfDoc.end();

  res.send({ "status": 200, "msg": "PDF generated successfully" });

});




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
