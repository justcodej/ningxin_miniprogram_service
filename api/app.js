const https = require('https')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const sql = require("./module/mysql")
const fs = require('fs')

const options = {
  key: fs.readFileSync('/www/server/panel/vhost/cert/1578403_ningxinziguan.com.key'),
  cert: fs.readFileSync('/www/server/panel/vhost/cert/1578403_ningxinziguan.com.pem')
}

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended: true}));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  next();
})

app.use('/api', require(__dirname + '/router/index'))

https.createServer(options,app).listen(3000)