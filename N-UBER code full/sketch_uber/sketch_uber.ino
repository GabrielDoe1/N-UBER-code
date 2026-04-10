#include <Servo.h>
#include <Servo.h>
Servo myservo;

void setup() {
  Serial.begin(9600);
  myservo.attach(9);
  myservo.write(90);  // stop at start
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');

    if (cmd == "OPEN") {
      myservo.write(180);   // spin full speed
      delay(3000);          // spin for 3 seconds
      myservo.write(90);    // stop
    }
  }
}