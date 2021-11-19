const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname) + "/public/index.html")
});

const http = require('http').createServer(app);
var io = require('socket.io')(http, {
  allowEIO3: true,
  allowEIO4: true,
  serveClient: true,
  cors: { origin: '*'}
});

http.listen(PORT, _ => {
  console.log('App deployed as Port ' + PORT);
})

var serverID = 'undefined';
var currentPoint = 0;
io.on('connection', function (socket){
    console.log('a user connected: ' + socket.id + " (server: " + serverID + " )");
    socket.broadcast.emit('OnActivePoint', currentPoint);

    //register the server id, received the command from unity
    socket.on('RegServerId', function (data){
        serverID = socket.id;
        console.log('reg server id : ' + serverID);
    });

    socket.on('disconnect', function(){
        if (serverID == socket.id)
        {
           serverID = 'undefined';
           console.log('removed Server: ' + socket.id);
        }
        else
        {
           console.log('user disconnected: ' + socket.id);
        }
    });

    socket.on('OnReceiveData', function (data){
        if (serverID != 'undefined')
        {
            switch(data.EmitType)
            {
                //emit type: all;
                case 0: io.emit('OnReceiveData', { DataString: data.DataString, DataByte: data.DataByte }); break;
                //emit type: server;
                case 1: io.to(serverID).emit('OnReceiveData', { DataString: data.DataString, DataByte: data.DataByte }); break;
                //emit type: others;
                case 2: socket.broadcast.emit('OnReceiveData', { DataString: data.DataString, DataByte: data.DataByte }); break;
            }
        }
        else
        {
            console.log('cannot find any active server');
        }
    });

    socket.on('OnRequestIDPoint', function (data){
        console.log("Request");
        if (currentPoint == 0) {
            io.to(serverID).emit('OnReceiveData', "RequestID");
        }
        socket.broadcast.emit('OnActivePoint', currentPoint);
    });

    socket.on('OnPointsEvent', function (data){
        var pars = parseInt(data, 10);
        if (isNaN(pars)) return;
        currentPoint = pars;
        socket.broadcast.emit('OnActivePoint', currentPoint);
    });
});
