var FeedParser = require('feedparser')
    , request = require('request')
    , fs = require('fs')
    , http = require('http')
    , url = require('url');
 
http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var queryData = url.parse(req.url, true).query;
    var feedurl = unescape(queryData.feed)
    var article = [];
    if(pathname === "/favicon.ico") return;
 
    request(feedurl)
        .pipe(new FeedParser())
        .on('error', function(error) {
            console.error(error);
        })
        .on('meta', function (meta) {
            //console.error(meta);
        })
        .on('readable', function () {
            // do something else, then do the next thing
            var stream = this, item; 
 
            while (item = stream.read()) {
                article.push(item);
            }
            stream.end = function(){
                res.writeHead(200, {
                    'Content-Type':'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin':'*',
                    'Pragma': 'no-cache',
                    'Cache-Control' : 'no-cache'
                });
                if(queryData.limit) article = article.slice(0, queryData.limit);
                res.write(JSON.stringify(article));
                res.end();            
            };
 
        });
 
 
    process.on('uncaughtException', function (err) {
        console.log('uncaughtException => ' + err);
        console.log(feedurl); 
        res.writeHead(500);
        res.write("error!");
        res.end(); 
    });
}).listen(1337, '127.0.0.1');
 
 
function send(){
 
}
console.log('Server running at http://127.0.0.1:1337/?feed=<RSS URL>&limit=<length>');
