import React, { useEffect, useState,useRef } from 'react';
import {
  StyleSheet, View, StatusBar, ImageBackground, Text,
  Image, Switch
} from 'react-native';
import socketIOClient from "socket.io-client";
import socket from 'socket.io-client/lib/socket';

const ENDPOINT = "http://192.168.0.189:3000";

export default function App() {
  const socketRef = useRef();
  const [toggle1, setIsEnabled1] = useState(true);
  const [toggle2, setIsEnabled2] = useState(false);
  const [toggle3, setIsEnabled3] = useState(false);
  const [ctrl, setCtrl] = useState(true);
  const toggleSwitch1 = (value) => {
    setIsEnabled1(value)
    setCtrl(value)
    socketRef.current.emit("mode", toggle1)
  }
  const toggleSwitch2 = (value) => {
    if(toggle2 === true){
      console.log(toggle2)
      socketRef.current.emit("lamp", "false")
    }
    if(toggle2 === false){
      console.log(toggle2)
      socketRef.current.emit("lamp", "true")
    }
    //socketRef.current.emit("lamp", toggle2)
    setIsEnabled2(value)
  }
  const toggleSwitch3 = (value) => {
    setIsEnabled3(value)
    if(toggle3 === true){
      console.log(toggle3)
      socketRef.current.emit("fan", "false")
    }
    if(toggle3 === false){
      console.log(toggle3)
      socketRef.current.emit("fan", "true")
    }
  }

  // data socket.io
  const [response, setResponse] = useState([]);

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT, {
      transports: ['websocket'], jsonp: false
    });
    socketRef.current.on("data", data => {
    setResponse(data);
    });
    socketRef.current.on("lamp_rx", data_lamp => {
      setIsEnabled2(data_lamp);
      //console.log(data_lamp);
    });
    socketRef.current.on("fan_rx", data_fan => {
      setIsEnabled3(data_fan);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar hidden='true' />

      <View style={styles.container_header}>
        <ImageBackground
          source={require('./assets/back.jpg')}
          imageStyle={{
            borderBottomLeftRadius: 80,
          }}
          resizeMode="cover" style={styles.image_header}>
          <View>
            <Text style={styles.texttitel}></Text>
          </View>
        </ImageBackground>
      </View>
      {/* view main */}
      <View style={styles.container_view}>
        <View style={styles.info}>
          <View style={styles.dataview}>
            <View style={[styles.box, { backgroundColor: "white", marginRight: 13 }]}>
              <Image style={styles.Imagebox}
                source={require('./assets/tem.png')} />
              <Text style={styles.text}>TEMPERATURE</Text>
              <Text style={styles.data}>{response.temp}</Text>
            </View>
            <View style={[styles.box, { backgroundColor: "white", marginRight: 13 }]}>
              <Image style={styles.Imagebox}
                source={require('./assets/hum.png')} />
              <Text style={styles.text}>HUMIDITY</Text>
              <Text style={styles.data}>{response.hum}</Text>
            </View>
            <View style={[styles.box, { backgroundColor: "white" }]}>
              <Image style={styles.Imagebox}
                source={require('./assets/light.png')} />
              <Text style={styles.text}>LIGHT</Text>
              <Text style={styles.data}>{response.light}</Text>
            </View>
          </View>
          <View style={[styles.boxp, { backgroundColor: "white" }]}>
            <View style={styles.pp}>
              <Text style={{
                textAlign: 'center',
                fontFamily: "Cochin",
                fontSize: 13,
                color: 'blue'
              }}>COUNT PEOPLE</Text>
              <View style={styles.ppp}>
                <Image
                  style={{
                    marginRight: 10
                  }}
                  source={require('./assets/step.png')} />
                <Text style={{
                  fontSize: 25,
                  marginTop: 8,
                  color: '#999999',
                  fontWeight:'bold'
                }}>{response.count}</Text>
              </View>
            </View>
            <View style={styles.status}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: "Cochin",
                  fontSize: 13,
                  color: 'blue'
                }}>{toggle1 ? 'AUTO' : 'MANUAL'}</Text>
              <View style={styles.ppp}>
                <Text

                  style={{
                    marginTop: 8,
                    color: '#999999'
                  }}>M</Text>
                <Switch
                  onValueChange={toggleSwitch1}
                  value={toggle1}
                />
                <Text
                  style={{
                    marginTop: 8,
                    color: '#999999'
                  }}>A</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.button_crl}>
          <View style={[styles.button, { backgroundColor: "white", marginRight: 30 }]}>
            <Image style={styles.lamp}
              source={require('./assets/idea.png')} />
            <Switch
             // style={{ transform: [{ scaleX: .9 }, { scaleY: .8 }] }}
              onValueChange={toggleSwitch2}
              value={toggle2}
              disabled ={ctrl}
            />
          </View>
          <View style={[styles.button, { backgroundColor: "white", marginRight: 10 }]}>
            <Image style={styles.lamp}
              source={require('./assets/fan.png')} />
            <Switch
             // style={{ transform: [{ scaleX: .10 }, { scaleY: .2 }] }}
              onValueChange={toggleSwitch3}
              value={toggle3}
              disabled ={ctrl}
            />
          </View>
        </View>


      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  image: {
    flex: 1,
    justifyContent: "center",
    shadowOpacity: 20
  },
  container_header: {
    backgroundColor: '#426EB4',
    // alignItems: 'center',
    justifyContent: 'center',
    height: '25%',
    borderBottomColor: "gray",
    borderBottomLeftRadius: 80,
    // shadowColor: '#171717',
    // shadowOffset: { width: 5, peak: 9 },
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
  },
  texttitel: {
    marginLeft: 30,
    fontSize: 30,
    color: "blue"
  },
  image_header: {
    flex: 1,
    // justifyContent: "center",
    shadowOpacity: 20,

  },
  // view main
  container_view: {
    // backgroundColor: '#EEEEEE',
    marginTop: 25,
    paddingTop: 0,
  },
  info: {
    paddingHorizontal: 33,
  },
  dataview: {
    flexDirection: "row",
    paddingVertical: 20
  },
  box: {
    height: 160,
    flex: 1,
    //paddingHorizontal: 10,
    // justifyContent: 'center',
    //alignItems: 'center',
    //
    borderRadius: 15,
    shadowColor: '#426EB4',
    shadowOffset: { width: 7, peak: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  Imagebox: {
    marginTop: 20,
    width: 28,
    //resizeMode: 'contain',
    marginBottom: 20,
    marginLeft: 40
  },
  text: {
    fontFamily: "Cochin",
    fontSize: 12,
    marginLeft: 8,
    textAlign: 'center'
  },
  data: {
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Cochin",
    fontSize: 27,
    color: '#999999',
    fontWeight:'bold'
  },
  boxp: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    height: 70,
    borderRadius: 20,
    shadowColor: '#171717',
    shadowColor: '#426EB4',
    shadowOffset: { width: 2, peak: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingVertical: 5,
    marginTop: 15,
    marginBottom: 15,
  },
  pp: {

  },
  status: {
    // marginTop: 10
  },
  ppp: {
    flexDirection: 'row',
    marginTop: 8
  },
  button_crl: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 55,
  },
  button: {
    height: 130,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    //
    borderRadius: 90,
    shadowColor: '#426EB4',
    shadowOffset: { width: -5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  lamp: {
    width: 60,
    height: 60,
    marginBottom: 5
  }
});
