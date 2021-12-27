var client = require('./mqtt/mqtt');
var con = require('./sql/sql');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
var lamp;
var fan;
var mode;
client.on('message', function (topic, message) {
  if (topic == "danhtran1998/esp32/data") {
    var mes_str = message.toString();
    var data_sensor = JSON.parse(mes_str);
    //console.log(data_sensor);
    var a = data_sensor.temp;
    var hum = data_sensor.hum;
    var light = data_sensor.light;
    var count = data_sensor.count;
  }
  if (topic == "danhtran1998/esp32/lamp") {
    lamp = message.toString();
    //console.log(lamp);
  }
  if (topic == "danhtran1998/esp32/fan") {
    fan = message.toString();
    //console.log(fan);
  }
  // if (topic == "danhtran1998/esp32/mode") {
  //   console.log(message.toString());
  //   if(message.toString() === "true"){
  //     console.log("mode manual");
  //     socket.on("lamp", function (data_lamp) {
  //       client.publish("danhtran1998/esp32/lamp", data_lamp.toString());
  //       //console.log(data_lamp);
  //     });
  //     socket.on("fan", function (data_fan) {
  //       client.publish("danhtran1998/esp32/fan", data_fan.toString());
  //       //console.log(data_fan);
  //     });
  //   }

  //   if (message.toString() === "false") {
  //     setInterval(() => {
  //       if (lamp == "true") {
  //         socket.emit("lamp_rx", true);
  //       }
  //       if (lamp == "false") {
  //         socket.emit("lamp_rx", false);
  //       }
  //       //
  //       console.log(lamp + ".." + fan);
  //     }, 100);

  //   }
  // }


})
io.on('connection', function (socket) {
  console.log('a user connected');
  setInterval(() => {
    con.query('SELECT * FROM `sensor` ORDER BY ID DESC LIMIT 1', function (err, result, fields) {
      if (result && result.length) {
        temp = result[0].temp;
        const data = {
          temp: result[0].temp,
          hum: result[0].hum,
          light: result[0].light,
          count: result[0].count
        }
        sensor_data = JSON.stringify(result);
        // console.log(data);
        socket.emit('data', data);
      }
    });
    //socket.emit('data', new Date().toISOString());
  }, 1000);
  // setInterval(() => {
  socket.on("mode", function (data_mode) {
    mode = data_mode.toString();
    client.publish("danhtran1998/esp32/mode", data_mode.toString());
    if(mode ==="true"){
      socket.on("lamp", function (data_lamp) {
        client.publish("danhtran1998/esp32/lamp", data_lamp.toString());
      });
      socket.on("fan", function (data_fan) {
        client.publish("danhtran1998/esp32/fan", data_fan.toString());
      });
      console.log("lamp off")
    }
  });
  
  setInterval(() =>{
    if(mode ==="false"){
      if (lamp === "true") {
        socket.emit("lamp_rx", true);
        console.log(lamp);   
      }
      if (lamp === "false") {
        socket.emit("lamp_rx", false);
      }
      if (fan === "true") {
        socket.emit("fan_rx", true);
        console.log(lamp);   
      }
      if (fan === "false") {
        socket.emit("fan_rx", false);
      }
      //socket.emit("lamp_rx", true);
      console.log(lamp);
    }
  },500);
  
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});