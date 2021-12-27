#include <SPI.h>
#include <RF24Network.h>
#include <RF24.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"

#define ONE_WIRE_BUS 7
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
  
RF24 radio(9, 10); // Chọn chân kết nối CE, CSN
RF24Network network(radio);
const uint16_t this_node = 01; // Address of this node in Octal format
const uint16_t node00 = 00; 
   
const int DHTPIN = 8;      
const int DHTTYPE = DHT11;  
unsigned long data[3];
DHT dht(DHTPIN, DHTTYPE);
unsigned long previousMillis1 = 0; 
const long interval1 = 50; 
void setup() {
  Serial.begin(9600);
  sensors.begin();
  dht.begin();    
  radio.begin();
  network.begin(42, this_node); //(channel, node address)
  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_MIN);
}
void loop() {
  network.update();
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis1 >= interval1) {
  sensors.requestTemperatures();  
  Serial.print("Nhiet do");
  float tem1 =sensors.getTempCByIndex(0);
  Serial.println(tem1); // vì 1 ic nên dùng 0
  float h = dht.readHumidity(); 
  int qtro =  map(analogRead(A1), 0, 1023, 0, 100);  
  data[0] = tem1;
  data[1] = h;
  data[2] = qtro;
  RF24NetworkHeader header(node00);
  network.write(header, &data, sizeof(data));
//  Serial.println(data[0]);
//  Serial.println(data[1]);
}
}
