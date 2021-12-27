var mqtt = require("mqtt");
options = {
    clientId: "danh",
    username: "danhtran1998",
    password: "24D258358D884F1C",
    clean: true
};

var client = mqtt.connect('mqtt://ngoinhaiot.com:1111', options);
client.on('connect', () => {
    console.log("mqtt connected");
    client.subscribe("danhtran1998/esp32/data");
    client.subscribe("danhtran1998/esp32/lamp");
    client.subscribe("danhtran1998/esp32/fan");
    client.subscribe("danhtran1998/esp32/mode");
  });

module.exports = client