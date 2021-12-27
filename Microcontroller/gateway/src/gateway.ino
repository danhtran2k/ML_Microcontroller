#include <Arduino.h>
#include <SPI.h>
#include <RF24Network.h>
#include <RF24.h>
#include "setting.h"
#include <PubSubClient.h>
#include <ArduinoJson.h>
////////////////////////////////////
#include "EloquentTinyML.h"

#include "model_data.h"
//////////////////////////////////
#define mqttServer "mqtt.ngoinhaiot.com"
#define mqttPort 1111
#define mqttUser "danhtran1998"
#define mqttPassword "24D258358D884F1C"

WiFiClient espClient;
PubSubClient client(espClient);
//////////////////////////////////////////
RF24 radio(4, 5);              // Chọn chân kết nối CE, CSN
RF24Network network(radio);    // Include the radio in the network
const uint16_t this_node = 00; // Address of our node in Octal format
const uint16_t node_ctrl = 03;
////////////////////////////////////////////
unsigned long data[7];
unsigned long datarx[3];
int fan;
int lamp;
float tem = 15;
float hum = 89;
int people = 1;
int count_pp = 0;
int qtro = 14;
int modectrl = 0;
String modefan = "true";
String modelamp = "true";
#define NUMBER_OF_INPUTS 4
#define NUMBER_OF_OUTPUTS 2
// in future projects you may need to tweak this value
// it's a trial and error process
#define TENSOR_ARENA_SIZE 34 * 1024
Eloquent::TinyML::TfLite<NUMBER_OF_INPUTS, NUMBER_OF_OUTPUTS, TENSOR_ARENA_SIZE> ml;
///setTime
unsigned long previousMillis1 = 0;
const long interval1 = 900;

unsigned long previousMillis2 = 0;
const long interval2 = 500;

unsigned long previousMillis3 = 0;
const long interval3 = 500;

void initMQTT()
{
  client.setServer(mqttServer, mqttPort);
  while (!client.connected())
  {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword))
    {
      Serial.println("connected");
      //client.publish("danhtran1998/esp32/mode", "hello world");
      client.subscribe("danhtran1998/esp32/mode");
      client.subscribe("danhtran1998/esp32/fan");
      client.subscribe("danhtran1998/esp32/lamp");
    }
    else
    {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(100);
    }
  }
}
void setup()
{
  Serial.begin(9600);
  SPI.begin();
  radio.begin();
  network.begin(42, this_node); //(channel, node address)
  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_MIN);
  ml.begin(model_tflite);
  pinMode(13, OUTPUT);
  pinMode(14, OUTPUT);
  digitalWrite(13, HIGH);
  digitalWrite(14, HIGH);
  client.setCallback(callback);
  initWiFi();
  initMQTT();
}
void callback(char *topic, byte *payload, unsigned int length)
{
  // Serial.print("Message arrived in topic: ");
  // Serial.println(topic);
  String msg = (char *)payload;
  msg.remove(length);
  if (String(topic) == "danhtran1998/esp32/mode")
  {

    if (msg == "true")
    {
      datarx[2] = 1;
      modectrl = 1;
    }
    if (msg == "false")
    {
      datarx[2] = 0;
      modectrl = 0;
    }
  }
  if (String(topic) == "danhtran1998/esp32/fan")
  {
    modefan = msg;
    // Serial.print(String(topic));
    // Serial.println(modefan);
  }
  if (String(topic) == "danhtran1998/esp32/lamp")
  {
    modelamp = msg;
    // Serial.print(String(topic));
    // Serial.println(modelamp);
  }
}
void sendpayload()
{
  StaticJsonDocument<200> doc;
  doc["temp"] = tem;
  doc["hum"] = hum;
  doc["light"] = qtro;
  doc["count"] = count_pp;

  // Add an array.
  //  JsonArray data = doc.createNestedArray("data");
  //  data.add(tem);
  //  data.add(hum);
  //  data.add(light);
  //  data.add(human);
  String output;
  serializeJson(doc, output);
  client.publish("danhtran1998/esp32/data", output.c_str());
}
void loop()
{
  if ((unsigned long)(millis() - previousMillis3) > 500)
  {
    switch (modectrl)
    {
    case 0:
      mode_auto();
      break;
    case 1:
      mode_manual();
      break;

    default:
      break;
    }
    previousMillis3 = millis();
  }

  if (!client.connected())
  {
    initMQTT();
  }
  client.loop();
  if ((unsigned long)(millis() - previousMillis1) > 500)
  {
    sendpayload();
    dipslay();
    previousMillis1 = millis();
  }
  network.update();
  while (network.available())
  {
    RF24NetworkHeader header;
    bool ok = network.read(header, &data, sizeof(data));
    // if(ok){
    //   Serial.println("oK");
    // }
    //Serial.println (header.from_node);
    if (header.from_node == 1)
    {
      tem = (float)data[0];
      hum = (float)data[1];
      qtro = (float)data[2];
    }
    if (header.from_node == 2)
    {
      count_pp = (int)data[0];
      if (count_pp > 0)
      {
        people = 1;
      }
      if (count_pp <= 0)
      {
        people = 0;
      }
    }
    if (header.from_node == 3)
    {
      lamp = (int)data[0];
      fan = (int)data[1];
      Serial.print(lamp);
      Serial.print("\t");
      Serial.println(fan);
    }
  }
  if ((unsigned long)(millis() - previousMillis2) > 300)
  {
    RF24NetworkHeader header3(node_ctrl);
    bool ok = network.write(header3, &datarx, sizeof(datarx));
    // if (ok)
    // {
    //   Serial.println(datarx[1]);
    // }
    //Serial.println("aaaaaaaa");
    previousMillis2 = millis();
  }
  //Serial.println(count_pp);
}

void dipslay()
{
  Serial.print(tem);
  Serial.print("\t");
  Serial.print(hum);
  Serial.print("\t");
  Serial.print(qtro);
  Serial.print("\t");
  Serial.print(people);
  Serial.print("\t");
  Serial.print(lamp);
  Serial.print("\t");
  Serial.println(fan);
  delay(100);
}
void mode_auto()
{
  float input[4] = {tem, hum, qtro, people};
  //Serial.println(input[3]);
  float output[2] = {0, 0};
  ml.predict(input, output);
  String lamp = "";
  String fan = "";
  if (output[0] > 0.5)
  {
    digitalWrite(13, LOW);
    datarx[0] = 1;
    lamp = "true";
    //Serial.println("Bật đèn:");
  }
  if (output[1] > 0.5)
  {
    digitalWrite(14, LOW);
    datarx[1] = 1;
    fan = "true";
    //Serial.println("Bật quạt:");
  }
  if (output[0] < 0.5)
  {
    digitalWrite(13, HIGH);
    datarx[0] = 0;
    lamp = "false";
    //Serial.println("Tắt đèn:");
  }
  if (output[1] < 0.5)
  {
    digitalWrite(14, HIGH);
    datarx[1] = 0;
    fan = "false";
    //Serial.println("Tắt quạt:");
  }
  client.publish("danhtran1998/esp32/lamp", lamp.c_str());
  client.publish("danhtran1998/esp32/fan", fan.c_str());
}
void mode_manual()
{
  
  if (modelamp == "true")
  {
    digitalWrite(13, LOW);
    datarx[0] = 1;
    //Serial.println("Bật đèn:");
  }
  if (modefan == "true")
  {
    digitalWrite(14, LOW);
    datarx[1] = 1;
    //Serial.println("Bật quạt:");
  }
  if (modelamp == "false")
  {
    digitalWrite(13, HIGH);
    datarx[0] = 0;
    //Serial.println("Tắt đèn:");
  }
  if (modefan == "false")
  {
    digitalWrite(14, HIGH);
    datarx[1] = 0;
    //Serial.println("Tắt quạt:");
  }
}