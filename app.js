var express = require("express");
var port = 8000;
var http = require("http");
var querystring = require('querystring');
var path = require("path");
var app = express();
var server = http.createServer(app);

//设置静态资源
// app.use(express.static(path.resolve(__dirname,"/public")));
app.use(express.static(path.join(__dirname, "/")));
app.get("/", function(req, res) {
    res.sendfile('dist/index.html')
})

server.listen(port, function() {
    console.log("代理服务器已启动，http://127.0.0.1:" + port);
});