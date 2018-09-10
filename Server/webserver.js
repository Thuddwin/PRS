var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)

var socketArray = [];
var currentMode = '';

http.listen(5601); // Listen to port 5601 (5414 is taken??)

function handler(req, res) { //create server
    console.log('URL: ' + req.url); 
   
    if (req.url.indexOf('.html')) {
        fs.readFile(__dirname + '/public/index.html',
            (err, data) => { //read file index.html in public folder
                if (err) {
                    res.writeHead(404, {
                        'Content-Type': 'text/html'
                    }); //display 404 on error
                    return res.end("404 Not Found");
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html,'
                }); //write HTML
                
                res.write(data, (err) => {
                    if(err) {
                        console.log('Error in HTML path: ')
                        console.log(err);
                    }
                    // return res.end();
                }); //write data from index.html
                res.end();
            });
    }
}

var socketsConnected = 0;
io.sockets.on('connection', function (socket) { // WebSocket Connection
    var isInit = false;

    if(isInit == false) {
        socketsConnected = socketsConnected + 1;
        socket.emit(
            'mode', 
                {
                    'mode':'init', 
                    'data':{
                        'date':'Thu - Sept 6, 2018',
                        'call':{"items": ["one", "two", "three", "four", "five"]},
                        'web':{"items":  ["web one", "web two", "web three"]}
                    }
                }
        );
        
        isInit = true;
        console.log('Sockets connected: ' + socketsConnected);
        console.log('Current Mode: ' + currentMode);
        socketArray.push(socket);
    }

    // Keeping as a possible template for Client responses.
    // socket.on(
    //     'idback', function(msg) {
    //         console.log('ID IN: ' + msg);
    //     }
    // )
});
