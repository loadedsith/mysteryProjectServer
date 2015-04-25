"use strict";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var libovr = require("node-ovrsdk");
var printf = require("printf");

libovr.ovr_Initialize();
var hmd = libovr.ovrHmd_Create(0);
var desc = new libovr.ovrHmdDesc;
libovr.ovrHmd_GetDesc(hmd, desc.ref());
libovr.ovrHmd_StartSensor(hmd, ovrSensorCap_Orientation, ovrSensorCap_Orientation);



app.get('/', function(req, res){
  res.sendfile('index.html');
});

var pose;

// setInterval(function() {
//   var ss = libovr.ovrHmd_GetSensorState(hmd, libovr.ovr_GetTimeInSeconds());
//   pose = ss.Predicted.Pose.Orientation;  
// }, 10);

io.on('connection', function(socket){
	var interval = setInterval(function(){
		var ss = libovr.ovrHmd_GetSensorState(hmd, libovr.ovr_GetTimeInSeconds());
  	pose = ss.Predicted.Pose.Orientation;  
		socket.emit('location',pose);
	}, 10);
	
	socket.on('disconnected', function(){
		clearInterval(interval);
	})

  console.log('a user connected');
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});




