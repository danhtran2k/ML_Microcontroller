#include <RF24Network.h>
#include <SPI.h>
#include <RF24.h>
RF24 radio(9, 10); // Chọn chân kết nối CE, CSN
#define sensorPin1 3
#define sensorPin2 4

RF24Network network(radio); // Include the radio in the network
const uint16_t this_node = 02; // Address of this node in Octal format
const uint16_t node00 = 00;    
int sensorState1 = 0;
int sensorState2 = 0;
int songuoitrongphong;
String hangdoi = "";
int timeoutcounter=0;
unsigned long data[1];
unsigned long previousMillis1 = 0; 
const long interval1 = 20; 
void setup() { 
  Serial.begin(9600);
  songuoitrongphong=0; 
  radio.begin();
  network.begin(42, this_node); //(channel, node address)
  radio.setDataRate(RF24_250KBPS);
  radio.setPALevel(RF24_PA_MIN);
}
void loop() {
  network.update();
  // put your main code here, to run repeatedly:
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis1 >= interval1) {
  sensorState1 = digitalRead(sensorPin1);
  sensorState2 = digitalRead(sensorPin2);
  
  
  data[0] = songuoitrongphong;
  Serial.println(songuoitrongphong);
  RF24NetworkHeader header(node00);
  network.write(header, &data, sizeof(data)); // Send the data
  if(sensorState1 == LOW && hangdoi.charAt(0)!='1')
  {
    hangdoi+="1";
  }
  else if(sensorState2 == LOW && hangdoi.charAt(0)!='2')
  {
    hangdoi+="2";
  }
  if(hangdoi.equals("12"))
  {
    songuoitrongphong++;
    Serial.print("Hang doi: ");
    Serial.println(hangdoi);
    hangdoi="";
    delay(1000);
  }
 else if(hangdoi.equals("21") && songuoitrongphong>0)
 {
    songuoitrongphong--;
    Serial.print("Hang doi: ");
    Serial.println(hangdoi);
    hangdoi="";
    delay(1000);
 }
 // Reset hàng đợi nếu giá trị hàng đợi sai (11 hoặc 22) hoặc hết thời gian chờ
  if(hangdoi.length()>2 || hangdoi.equals("11") || hangdoi.equals("22") ||timeoutcounter>200)
  {
      hangdoi="";
  }
  if(hangdoi.length()==1)
  {timeoutcounter++;}
  else {timeoutcounter=0;}
  }
}
