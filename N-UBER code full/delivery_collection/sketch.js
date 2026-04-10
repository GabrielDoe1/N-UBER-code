let ml;
let video;
let photoSaved = false;
let countdownStart = 5;
let countdownValue = 5;
let classPrediction = "";
let maxRadius = 120;
let step = maxRadius;
let step2 = 0;
let state = "photoCountdown";
let startTime;
let bridge;
let isConnected = false;
let commandSent = false;

function setup() {
  createCanvas(1000, 1200);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  startTime = millis();

  ml = new MLBridge();
  bridge = new SerialBridge('http://localhost:3000');

  

  ml.onPrediction((data) => {
    if (data.label) {
      classPrediction = data.label;
      console.log("Prediction received:", JSON.stringify(data.label));
    
    }
  });

   bridge.onData('device_1', (data) => {
        console.log('Received:', data);
    
});

}

function draw() {

  //photo countdown
  if (state === "photoCountdown") {

    let elapsed = floor((millis() - startTime) / 1000);
    countdownValue = 5 - elapsed;

    background(50);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(120);
    text(max(countdownValue, 0), width/2, height/2);

    if (countdownValue <= 0) {
      let photo = video.get();
      save(photo, "live_photo_1.png");

      state = "MLinput";
    }
  }

  //ML bridge input waiting
  else if (state === "MLinput") {

    background(50);

    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER)
  
    fill(200, 127);
    noStroke();
    circle(width/2, height/2, step);
    circle(width/2, height/2, step2);

    if (step > -maxRadius) {
      step -= 2;
    } else {
      step = maxRadius;
    }

    if (step2 > -maxRadius) {
      step2 -= 2;
    } else {
      step2 = maxRadius;
    }

    if (classPrediction !== "") {
      state = "result";
    }
  }

  //results
 else if (state === "result") {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);

  if (classPrediction.includes("1")) {
    background(0, 200, 0);
    text("please collect", width/2, height/2);
    
    if (!commandSent) {
      bridge.send('device_1', 'OPEN\n');
      commandSent = true;
    }
  
    
    

  } else {
    background(200, 0, 0);
    text("Uh Oh", width/2, height/2);
  }
}


}

 

  
  

  

