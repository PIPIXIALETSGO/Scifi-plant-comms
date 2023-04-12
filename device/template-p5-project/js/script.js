var x = 0;
var y = 0;
var angle = 0;
var pipes = [];
var waterDrop = [];
var numOfPipes = 11;
var xCor = 500;
var yCor = 250;
var randomAngle = [0, 90, 180, 270];
var isPipeGame = false;
var isGuessGame = true;
var isloadingScreen = false;
var isFailded = false;
var waterTime = false;
var hint = false;
var rX = 0;
var rY = 0;
const FRAME_RATE = 30;
var hintAlpha = 255;
var barAlpha = 0;
var confirmAlpha = 0;
var p2Alpha = 0;
var loadingCounter = 0;
////////// guess game
var img,
  img2,
  img3,
  backgroundImg,
  device,
  box,
  leftb,
  middleb,
  rightb,
  guessBox,
  waterLogo,
  plantLogo,
  root1,
  root2,
  root3,
  leaf1,
  leaf2,
  leaf3,
  con1,
  beep,
  waterSound,
  fontRegular;
var countDown = 30;
var stepCount = 20;
var selectedImg = 0;
var buttonAlpha = 100;
var targetSeed;
var numofDrops = 100;
var waterTimer = 0;
/////////////////////// MQTT////////
let broker = {
  hostname: "public.cloud.shiftr.io",
  port: 443,
};
let client;
let creds = {
  clientID: Math.random().toString(16).slice(3),
  userName: "public",
  password: "public",
};
let topic = "CART253";
let myName = "jw";
let nextName = "kk";
////////////////////////////////
var winCon1 = [
  { position: 0, angle: 270, isMatched: 0 },
  { position: 1, angle: 270, isMatched: 0 },
  { position: 2, angle: 0, isMatched: 0 },
  { position: 4, angle: 90, isMatched: 0 },
  { position: 5, angle: 270, isMatched: 0 },
  { position: 6, angle: 90, isMatched: 0 },
  { position: 8, angle: 90, isMatched: 0 },
  { position: 9, angle: 90, isMatched: 0 },
];
///0-270,1-180/270,2-0,4-90,5-270,6-90,8-90/270,9-90
var winCon2 = [
  { position: 4, angle: 270, isMatched: 0 },
  { position: 5, angle: 0, isMatched: 0 },
  { position: 6, angle: 0, isMatched: 0 },
  { position: 8, angle: 90, isMatched: 0 },
  { position: 9, angle: 180, isMatched: 0 },
  { position: 10, angle: 90, isMatched: 0 },
];
//4-270,5-0,6-0,8-90,9-270,10-90
var winCon3 = [
  { position: 0, angle: 270, isMatched: 0 },
  { position: 1, angle: 0, isMatched: 0 },
  { position: 2, angle: 270, isMatched: 0 },
  { position: 3, angle: 270, isMatched: 0 },
  { position: 4, angle: 90, isMatched: 0 },
  { position: 5, angle: 180, isMatched: 0 },
  { position: 6, angle: 90, isMatched: 0 },
];
var mouse = false;
var level = 0;
var isLoaded = false;
var seedNumber;
var pattern = [2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2];
function preload() {
  fontRegular = loadFont("assets/digital.ttf");
  img = loadImage("./assets/images/seed0.png");
  img2 = loadImage("./assets/images/seed1.png");
  img3 = loadImage("./assets/images/seed2.png");
  backgroundImg = loadImage("./assets/images/BG.png");
  device = loadImage("./assets/images/console.png");
  box = loadImage("./assets/images/box.png");
  leftb = loadImage("./assets/images/left.png");
  middleb = loadImage("./assets/images/middle.png");
  rightb = loadImage("./assets/images/right.png");
  guessBox = loadImage("./assets/images/guessBox.png");
  waterLogo = loadImage("./assets/images/water_logo.png");
  waterLogo2 = loadImage("./assets/images/water_logo.png");
  plantLogo = loadImage("./assets/images/plant_logo.png");
  root1 = loadImage("./assets/images/root1.png");
  root2 = loadImage("./assets/images/root2.png");
  root3 = loadImage("./assets/images/root3.png");
  leaf1 = loadImage("./assets/images/leaf1.png");
  leaf2 = loadImage("./assets/images/leaf2.png");
  leaf3 = loadImage("./assets/images/leaf3.png");
  con1 = loadImage("./assets/images/con1.png");
  beep = loadSound('assets/sounds/beep.mp3')
  waterSound=loadSound('assets/sounds/water.mp3')
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  MQTTsetup();
  background(0, 27);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  beep.setVolume(1)
  image(guessBox, 1261, 589, 100, 100);
  if (level === 0) {
    createPipe(280, 180, 11, 1, pattern);
  }
  for (var ii = 0; ii < numofDrops; ii++) {
    waterDrop[ii] = new water();
  }
}
function onMessageArrived(message) {
  let dataReceive = split(trim(message.payloadString), "/");
  if (dataReceive[1] == myName) {
    if (dataReceive[2] == "seed") {
      p2Alpha = 255;
      seedNumber = parseInt(dataReceive[3]);
    } else if (dataReceive[2] == "pipe") {
      var x = parseInt(dataReceive[3]);
      var y = parseInt(dataReceive[4]);
      rX = x;
      rY = y;
      console.log(rX,rY)
      stepCount--;
    } else if (dataReceive[2] === "hintComplete") {
      hint = true;
    }
  }
}
function sendMQTTMessage(x) {
  message = new Paho.MQTT.Message(myName + "/" + nextName + "/" + x);
  message.destinationName = topic;
  client.send(message);
}
function onConnect() {
  client.subscribe(topic);
  console.log("connected");
}
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("error");
  }
}
function MQTTsetup() {
  client = new Paho.MQTT.Client(
    broker.hostname,
    Number(broker.port),
    creds.clientID
  );
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({
    onSuccess: onConnect,
    userName: creds.userName, // username
    password: creds.password, // password
    useSSL: true,
  });
}
function draw() {
  if (isloadingScreen) {
    loadingScreen();
  } else {
    image(backgroundImg, width/2, height/2, width, height);
    plantPhase(level);
    if (isGuessGame) {
      image(guessBox, 1661, 410, 2000, 1000);
    }
    interface();
    if (isPipeGame) {
      isGuessGame = false;
      pipeGame(level);
      if (level === 2 && isLoaded === false) {
        numOfPipes = 12;
        createPipe(
          280,
          180,
          numOfPipes,
          2,
          [2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2]
        );
        isLoaded = true;
      } else if (level === 3 && isLoaded === false) {
        numOfPipes = 11;
        createPipe(
          0,
          180,
          numOfPipes,
          3,
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        );
        isLoaded = true;
      }
      displayPipe();
      checkWinCon();
      stroke(0);
      if (hint) {
        hintAlpha -= 2;
        barAlpha += 1;
      }
    }
    if (isGuessGame) {
      push();
      text("Which one is the right one?", 190, 135);
      image(img2, 240, 340, 600, 500);
      image(img, 60, 340, 600, 500);
      image(img3, 420, 340, 600, 500);
      noFill();
      strokeWeight(7);
      stroke(158, 37, 245);
      if (selectedImg === 0) {
        mouse = false;
        rect(190, 265, 170, 170);
      }
      if (selectedImg === 1) {
        mouse = false;
        rect(370, 265, 170, 170);
      }
      if (selectedImg === 2) {
        mouse = false;
        rect(550, 265, 170, 170);
      }
      pop();
    }
    displayWater();
    if (isFailded) {
      failScreen(1);
    }
  }
  plantPhase(level);
  fill(0);
  textSize(25);
  text(mouseX + "," + mouseY, mouseX, mouseY);
  image(con1, 800, -300, 4000, 300);
}
function win(l) {
  if (l === 1) {
    push();
    stroke(255);
    strokeWeight(25);
    noFill();
    animS.shape("l1", FRAME_RATE * 3, [
      [200, 280],
      [280, 280],
      [280, 180],
      [380, 180],
      [480, 180],
      [480, 280],
      [380, 280],
      [380, 380],
      [280, 380],
      [180, 380],
    ]);
    pop();
  } else if (l === 2) {
    push();
    stroke(0, 0, 255);
    strokeWeight(25);
    noFill();
    animS.shape("l2", FRAME_RATE * 3, [
      [480, 200],
      [480, 380],
      [380, 380],
      [380, 280],
      [280, 280],
      [280, 380],
      [210, 380],
    ]);
    pop();
  } else if (l === 3) {
    push();
    stroke(255);
    strokeWeight(25);
    noFill();
    animS.shape("l3", FRAME_RATE * 3, [
      [550, 180],
      [480, 180],
      [480, 280],
      [380, 280],
      [380, 180],
      [280, 180],
      [280, 280],
      [180, 280],
      [180, 380],
    ]);
    pop();
  }
}
function timer() {
  push();
  noStroke();
  fill(0);
  fill(158, 37, 100);
  textSize(100);
  textFont(fontRegular);
  // text(8888, 900, 150);
  if (isGuessGame) {
    text(countDown, 250, 722);
    if (frameCount % 60 == 0 && countDown > 0) {
      if (waterTime === false) {
        countDown--;
      }
    }
    if (countDown === 0) {
      sendMQTTMessage("fail");
      isFailded = true;
    }
  }
  if (isPipeGame) {
    text(stepCount, 400, 722);
    if (stepCount === 0) {
      sendMQTTMessage("fail");
      isFailded = true;
    }
  }

  pop();
}
function interfaceAlpha() {
  if (isGuessGame) {
    buttonAlpha = 255;
  } else {
    buttonAlpha = 100;
  }
  if (isPipeGame) {
    valveAlpha = 255;
  } else {
    valveAlpha = 100;
  }
}
function interface() {
  image(box, 850, 370, 1300, 750);
  image(device, 653, 380, 1300, 750);
  interfaceAlpha();
  leftButton();
  middleButton();
  rightButton();
  timer();
}
function rightButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 413, 580);
    if (d < 60 && mouse) {
      if (selectedImg > 2) {
        selectedImg = 2;
      } else {
        selectedImg++;
      }
    }
  }
  image(leftb, 670, 310, 1400, 1000);
}
function middleButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 308, 580);
    if (d < 60 && mouse) {
      if (selectedImg === seedNumber) {
        sendMQTTMessage("guessComplete");
        waterTime = true;
      } else {
        beep.play()
        countDown -= 5;
      }
    }
  }
  image(middleb, -100, 285, 1500, 1100);
}
function leftButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 200, 580);

    if (d < 60 && mouse) {
      if (selectedImg < 0) {
        selectedImg = 0;
      } else {
        selectedImg--;
      }
    }
  }
  image(rightb, 750, 310, 1600, 1000);
}
function displayPipe() {
  for (var ii = 0; ii < numOfPipes; ii++) {
    pipes[ii].rotation(rX, rY);
    pipes[ii].display();
  }
}
function displayWater() {
  if (waterTime) {
    for (var ii = numofDrops - 1; ii >= 0; ii--) {
      waterDrop[ii].update();
      waterDrop[ii].show();
    }
    if (waterTimer < 400) {
      waterTimer++;
      waterSound.play()
    } else {
      level++;
      isGuessGame = false;
      isPipeGame = true;
      waterTime = false;
      isLoaded = false;
      waterTimer = 0;
    }
  }
}
function mouseClicked() {
  mouse = true;
}
function keyPressed() {
  if (isloadingScreen) {
    confirmAlpha = 255;
    sendMQTTMessage("ready");
  }
}
function createPipe(xCor, yCor, n, l, pattern) {
  if (l === 1) {
    for (var ii = 0; ii < n; ii++) {
      if (ii === 4) {
        xCor = 280;
        yCor += 100;
      }
      if (ii === 8) {
        xCor = 280;
        yCor += 100;
      }
      pipes[ii] = new pipeBlocks(xCor, yCor, pattern[ii]);
      xCor += 100;
    }
  } else if (l === 2) {
    reset();
    for (var ii = 0; ii < n; ii++) {
      if (ii === 2) {
        xCor = 580;
      } else if (ii === 3) {
        xCor = 180;
        yCor += 100;
      } else if (ii === 8) {
        xCor = 280;
        yCor += 100;
      }
      pipes[ii] = new pipeBlocks(xCor, yCor, pattern[ii]);
      xCor += 100;
    }
  } else if (l === 3) {
    reset();
    for (var ii = 0; ii < n; ii++) {
      if (ii === 0) {
        xCor += 280;
      }
      if (ii === 3) {
        xCor = 180;
        yCor += 100;
      } else if (ii === 8) {
        xCor = 280;
        yCor += 100;
      }
      pipes[ii] = new pipeBlocks(xCor, yCor, pattern[ii]);
      xCor += 100;
    }
  }
}
function reset() {
  mouse = false;
  isLoaded = false;
  console.log(1)
  hint = false;
  isFailded = false;
  waterTimer = 0;
  hintAlpha = 255;
  stepCount = 20;
  countDown=30
  barAlpha = 0;
  pipes = [];
}
function checkWinCon() {
  var total = 0;
  if (level === 1) {
    for (var jj = 0; jj < winCon1.length; jj++) {
      var position = winCon1[jj].position;
      var angle = winCon1[jj].angle;
      if (pipes[position].checkAngle(angle)) {
        winCon1[jj].isMatched = 1;
        total += winCon1[jj].isMatched;
      }
    }
    if (total === 8) {
      win(1);
      waterTime = true;
      sendMQTTMessage("water");
      isLoaded = false;
    }
  } else if (level === 2) {
    for (var jj = 0; jj < winCon2.length; jj++) {
      var position = winCon2[jj].position;
      var angle = winCon2[jj].angle;
      if (pipes[position].checkAngle(angle)) {
        winCon2[jj].isMatched = 1;
        total += winCon2[jj].isMatched;
      }
    }
    if (total === 6) {
      waterTime = true;
      sendMQTTMessage("water");
      win(2);
    }
  } else if (level === 3) {
    for (var jj = 0; jj < winCon3.length; jj++) {
      var position = winCon3[jj].position;
      var angle = winCon3[jj].angle;
      if (pipes[position].checkAngle(angle)) {
        winCon3[jj].isMatched = 1;
        total += winCon3[jj].isMatched;
      }
    }
    if (total === 7) {
      waterTime = true;
      sendMQTTMessage("water");
      win(3);
    }
  }
}
function pipeGame(l) {
  textSize(20);
  push();
  fill(255);
  noStroke();
  tint(255, 255);
  if (l === 1) {
    image(plantLogo, 180, 380, 100, 100);
    if (hint === false) {
      fill(0, 0, 255);
      image(waterLogo, 180, 180, 100, 100);
      image(waterLogo, 580, 380, 100, 100);
      image(waterLogo, 180, 280, 100, 100);
    } else {
      image(waterLogo, 180, 280, 100, 100);
      tint(255, hintAlpha);
      image(waterLogo, 180, 180, 100, 100);
      image(waterLogo, 580, 380, 100, 100);
      fill(0, barAlpha);
      rect(225, 280, 10, 50, 100);
      rect(225, 380, 10, 50, 100);
    }
  } else if (l === 2) {
    image(plantLogo, 180, 380, 100, 100);
    if (hint === false) {
      image(waterLogo, 180, 180, 100, 100);
      image(waterLogo, 480, 180, 100, 100);
    } else {
      image(waterLogo, 480, 180, 100, 100);
      tint(255, hintAlpha);
      image(waterLogo, 180, 180, 100, 100);
      fill(255, barAlpha);
      rect(480, 225, 50, 10);
      rect(224, 380, 10, 50);
    }
  } else if (l === 3) {
    image(plantLogo, 180, 380, 100, 100);
    if (hint === false) {
      image(waterLogo, 180, 180, 100, 100);
      image(waterLogo, 580, 380, 100, 100);
      image(waterLogo, 580, 180, 100, 100);
    } else {
      tint(255, hintAlpha);
      image(waterLogo, 180, 180, 100, 100);
      image(waterLogo, 580, 380, 100, 100);
      tint(255, 255);
      image(waterLogo, 580, 180, 100, 100);
      fill(255, barAlpha);
      rect(535, 180, 10, 50);
      rect(180, 335, 50, 10);
    }
  }
  pop();
}
function plantPhase(l) {
  if (l === 1) {
    image(leaf1, 700, 340, 2000, 1000);
    image(root1, 750, 360, 1700, 750);
  } else if (l === 2) {
    image(leaf1, 700, 340, 2000, 1000);
    image(leaf2, 750, 340, 2000, 1000);
    image(root1, 750, 360, 1700, 750);
    image(root2, 750, 370, 1700, 750);
  } else if (l === 3) {
    image(leaf1, 700, 340, 2000, 1000);
    image(leaf2, 750, 340, 2000, 1000);
    image(leaf3, 950, 375, 1700, 750);
    image(root1, 750, 360, 1700, 750);
    image(root2, 750, 370, 1700, 750);
    image(root3, 750, 380, 1700, 750);
  }
}
function failScreen(l) {
  image(con1, 1800, -400, 4000, 3000);
  push();
  fill(255);
  textSize(100);
  text("You failed !", 560, 361);
  var d = dist(mouseX, mouseY, 748, 625);
  if (d < 50) {
    fill(255);
   
      reset()
    }
  
    noFill();
  
  rect(748, 625, 150, 50);
  fill(0);
  textSize(25);
  text("Retry", 711, 633);
  pop();
}
function loadingScreen() {
  if (confirmAlpha === 255 && p2Alpha === 255) {
    loadingCounter++;
    if (loadingCounter > 100) {
      loadingCounter = 0;
      isGuessGame = true;
      isloadingScreen = false;
    }
  }
  push();
  background(255);
  fill(255);
  rect(744, 650, 200, 50, 50);
  fill(0);
  text("Confirm", 695, 659);
  text("Press space to confirm", 645, 559);
  textSize(40);
  pop();
  push();
  textSize(25);
  fill(0);
  text("player 1", 1014, 710);
  text("player 2", 1214, 710);
  fill(255, 0, 0, confirmAlpha);
  ellipse(1044, 650, 50, 50);
  fill(255, 0, 0, p2Alpha);
  ellipse(1244, 650, 50, 50);
  pop();
}
class pipeBlocks {
  constructor(x, y, pattern) {
    this.x = 0;
    this.y = 0;
    this.toX = x;
    this.toY = y;
    this.angle = randomAngle[round(random(0, 3))];
    // this.angle = 0;
    this.pattern = pattern;
    this.rotate = false;
    this.target = this.angle + 90;
  }
  rotation(x, y) {
    push();
    if (this.toX === x - 1023 && this.toY === y) {
      this.rotate = true;
      rX = 0;
      rY = 0;
    }
    if (this.rotate) {
      if (this.angle < this.target) {
        this.angle += 2;
      } else if (this.angle === this.target) {
        this.rotate = false;
        mouse = false;
        if (this.angle >= 360) {
          this.angle = 0;
          this.target = 90;
        } else {
          this.target += 90;
        }
      }
    }
    pop();
  }
  display() {
    push();
    translate(this.toX, this.toY);
    rotate(this.angle);
    if (level === 1) {
      this.shape(this.pattern);
    } else if (level === 2) {
      this.shape(this.pattern);
    } else if (level === 3) {
      this.shape(this.pattern);
    }
    pop();
  }
  shape(pattern) {
    noStroke();
    if (pattern === 1) {
      push();
      fill(66, 50, 168);
      rect(this.x, this.y - 45, 40, 10);
      rect(this.x, this.y + 45, 40, 10);
      fill(107, 84, 255);
      rect(this.x, this.y, 28, 80);
      pop();
    }
    if (pattern === 2) {
      push();
      fill(66, 50, 168);
      rect(this.x - 45, this.y, 10, 40);
      rect(this.x, this.y + 45, 40, 10);
      fill(107, 84, 255);
      rect(this.x - 22.5, this.y, 35, 28, 3);
      rect(this.x, this.y + 13, 28, 55, 3);
      pop();
    }
  }
  checkAngle(targetAngle) {
    if (this.pattern === 1) {
      if (targetAngle === 270 || targetAngle === 90) {
        if (this.angle === 90 || this.angle === 270) return true;
      } else {
        if (this.angle === 0 || this.angle === 180) return true;
      }
    }
    if (this.angle === targetAngle) {
      return true;
    }
  }
}
class water {
  constructor() {
    this.x = random(1090, 1177);
    this.y = 57;
    this.yVelocity = random(1, 5);
    this.alpha = 255;
    this.acc = 0.05;
  }
  update() {
    this.yVelocity += this.acc;
    this.y += this.yVelocity;
    this.alpha -= 1.3;
    if (this.y > 1050) {
      this.y = 57;
      this.yVelocity = random(1, 5);
    }
  }
  show() {
    var wgt = map(this.yVelocity, 1, 10, 0.5, 2);
    push();
    strokeWeight(wgt);
    stroke(187, 217, 238);
    line(this.x, this.y, this.x, this.y + 10);
    pop();
  }
}
