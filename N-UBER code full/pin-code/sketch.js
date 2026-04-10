let pin = "123456";
let inputPin = "";
let displayText = "Enter 6-digit PIN";
let scene = "pin";
let time1;
let time2 = 500;
let deliveryButton;
let video;
let videoTime = 0;
let showVideo = false;
let capturing = false;
let captureStartTime = 0;
let captureInterval = 500; 
let lastCaptureTime = 0;
let frameNumber = 0;
let capturedFrames = [];

function setup() {
  createCanvas(1000, 1200);
  textAlign(CENTER, CENTER);
  textSize(24);

  video = createCapture(video);
  video.size(640, 480);
  video.hide();

  deliveryButton = createButton('Collect a delivery');
  deliveryButton.position(665, 300);
  deliveryButton.size(150, 50);
  deliveryButton.hide();
  deliveryButton.mousePressed(() => {
    scene = "delivery";
    deliveryButton.hide();
  });
}

function draw() {
  background(25);

  if (scene === "pin") drawPinScene();
  else if (scene === "success") drawWelcomeScene();
  else if (scene === "delivery") drawDeliveryScene();

  if (capturing) {
    if (millis() - captureStartTime < 10000) { 
      if (millis() - lastCaptureTime > captureInterval) {
        let frameCopy = video.get();
        capturedFrames.push(frameCopy);
        frameNumber++;
        lastCaptureTime = millis();
        frameCopy.save(`frame-${frameNumber}.png`);
      }
    } else {
      capturing = false;
    }
  }

  if (scene === "pin" && displayText === "Correct!") {
    if (millis() - time1 > time2) {
      scene = "success";
      videoTime = millis();
      showVideo = true;
      capturing = true;
      captureStartTime = millis();
      lastCaptureTime = 0;
      frameNumber = 0;
    }
  }

  if (scene === "pin" && displayText === "Incorrect!") {
    if (millis() - time1 > time2) {
      displayText = "Enter 6-digit PIN";
    }
  }
}

function drawPinScene() {
  fill(255);
  text(displayText, width / 2, 400);

  let boxSize = 50;
  let gap = 10;
  let startX = 440 - (boxSize * 2 + gap * 1.5);

  for (let i = 0; i < 6; i++) {
    if (displayText === "Correct!") fill(100, 255, 100);
    else if (displayText === "Incorrect!") fill(255, 100, 100);
    else fill(255);

    stroke(0);
    rect(startX + i * (boxSize + gap), 300, boxSize, boxSize, height / 2);

    fill(0);
    noStroke();
    if (i < inputPin.length) {
      text("*", startX + i * (boxSize + gap) + boxSize / 2, 305 + boxSize / 2);
    }
  }
}


function drawWelcomeScene() {
  background(25);

  if (showVideo) {
    image(video, 170, 200);
  }

  fill(255);
  textSize(40);
  text("Welcome Gabe", width / 2, 75);

  
  if (millis() - videoTime > 10000) {
    showVideo = false;
    deliveryButton.show();
  } else {
    deliveryButton.hide();
  }
}

function drawDeliveryScene() {
  deliveryButton.hide();
  background(25);
  fill(255);
  text("Collect delivery from...", width / 2, 75);
}

function keyPressed() {
  if (scene !== "pin") return;

  
  if (key >= '0' && key <= '9' && inputPin.length < 6) {
    inputPin += key;
    displayText = "Enter 6-digit PIN";
  }


  if (keyCode === BACKSPACE) {
    inputPin = inputPin.substring(0, inputPin.length - 1);
    displayText = "Enter 6-digit PIN";
  }

  if (inputPin.length === 6) {
    if (inputPin === pin) {
      displayText = "Correct!";
      time1 = millis();
    } else {
      displayText = "Incorrect!";
      inputPin = "";
      scene = "pin";
      time1 = millis();
    }
  }
}


