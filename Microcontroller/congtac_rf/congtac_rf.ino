#include <SPI.h>
#include <RF24Network.h>
#include <RF24.h>
RF24 radio(9, 10); // Chọn chân kết nối CE, CSN
RF24Network network(radio);
const uint16_t this_node = 03; // Address of this node in Octal format
const uint16_t node00 = 00;  

#define TouchSensor1 4 // Pin for capactitive touch sensor
#define TouchSensor2 3

int relay1 = 5; 
int relay2 = 6; 
bool rfstate = LOW;
int lastDT = 0;
unsigned long msgrx[3];
unsigned long data_Tx[2];
int lamp;
int fan;
int mode;
boolean currentState1 = LOW;
boolean lastState1 = LOW;
boolean RelayState1 = LOW;

boolean currentState2 = LOW;
boolean lastState2 = LOW;
boolean RelayState2 = LOW;

unsigned long previousMillis1 = 0; 
const long interval1 = 900; 

unsigned long previousMillis2 = 0; 
const long interval2 = 700; 

unsigned long previousMillis3 = 0; 
const long interval3 = 500; 
void setup() {
  Serial.begin(9600);
  SPI.begin();
  radio.begin();
  network.begin(42, this_node); //(channel, node address)
  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_MIN);
  pinMode(relay1, OUTPUT);  
  pinMode(relay2, OUTPUT);  
  pinMode(TouchSensor1, INPUT);
  pinMode(TouchSensor2, INPUT);
}

void loop() {
  switch (mode)
  {
  case 0:
    mode_auto();
    break;
  case 1:
    mode_manual();
    mode_auto();
    break;

  default:
    break;
  }
  network.update();
  if ((unsigned long) (millis() - previousMillis1) > 200) {
      data_Tx[0] = RelayState1;
      data_Tx[1] = RelayState2;
      RF24NetworkHeader header3(node00);
      bool ok2 = network.write(header3, &data_Tx, sizeof(data_Tx)); 
      if(ok2){
        Serial.println("ok");
      }
      previousMillis1 = millis();
    } 
  if ((unsigned long) (millis() - previousMillis3) > 100) {
  while(network.available() ) {  
    RF24NetworkHeader header; 
    bool ok = network.read(header, &msgrx, sizeof(msgrx)); 
    //Serial.println(header.from_node);
        if(ok){
          lamp = msgrx[0];
          fan = msgrx[1];
          mode = msgrx[2];
          Serial.print(lamp);
          Serial.print("\t");
          Serial.print(fan);
          Serial.print("\t"); 
          Serial.println(mode);
        }
     }
   previousMillis3 = millis();
  }

//////  
//    Serial.print(lamp);
//    Serial.print("\t");
//    Serial.println(fan);   
  

}
void mode_auto(){
  if(lamp == 0){
    digitalWrite(relay1, LOW);
    RelayState1 = LOW;
  }
  if(lamp == 1){
    digitalWrite(relay1, HIGH);
    RelayState1 = HIGH;
  }
  if(fan == 0){
    digitalWrite(relay2, LOW);
    RelayState2 = LOW;
  }
  if(fan == 1){
    digitalWrite(relay2, HIGH);
    RelayState2 = HIGH;
  }
}
void mode_manual(){
  currentState1 = digitalRead(TouchSensor1);
  currentState2 = digitalRead(TouchSensor2);
    if (currentState1 == HIGH && lastState1 == LOW){
    delay(1);  
      if (RelayState1 == HIGH){
        digitalWrite(relay1, LOW);
        RelayState1 = LOW;
      } else {
        digitalWrite(relay1, HIGH);
        RelayState1 = HIGH;
      }
  }
   lastState1 = currentState1;
  
    if (currentState2 == HIGH && lastState2 == LOW){
    delay(1);  
      if (RelayState2 == HIGH){
        digitalWrite(relay2, LOW);
        RelayState2 = LOW;
      } else {
        digitalWrite(relay2, HIGH);
        RelayState2 = HIGH;
      }
  }
    lastState2 = currentState2;
}
