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
var rX = 0;
var rY = 0;
const FRAME_RATE = 30;
var hint = false;
var hintAlpha = 255;
var barAlpha = 0;
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
  fontRegular;
var countDown = 100;
var stepCount = 20;
var selectedImg = 1;
var buttonAlpha = 100;
var targetSeed;
var numofDrops = 100;
var waterTime = false;
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
var pattern = [2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2]; //1=vertical   2=L-shape 3=cross
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
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  MQTTsetup();
  background(0, 27);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
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
      seedNumber = parseInt(dataReceive[3]);
      console.log(seedNumber);
    } else if (dataReceive[2] == "pipe") {
      var x = parseInt(dataReceive[3]);
      var y = parseInt(dataReceive[4]);
      rX = x;
      rY = y;
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
  image(backgroundImg, width - 768, height - 371, width, height);
  interface();
  if (isPipeGame) {
    isGuessGame = false;
    pipeGame(level);
    if (level === 2 && isLoaded === false) {
      numOfPipes = 12;
      createPipe(280, 180, numOfPipes, 2, [2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2]);
      isLoaded = true;
    } else if (level === 3 && isLoaded === false) {
      console.log('haha')
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
    image(guessBox, 1761, 410, 2000, 1000);
    push();
    image(img, 240, 340, 500, 500);
    image(img2, 60, 340, 500, 500);
    image(img3, 420, 340, 500, 500);
    noFill();
    strokeWeight(7);
    if (selectedImg === 0) {
      mouse = false;
      rect(170, 265, 170, 170);
    }
    if (selectedImg === 1) {
      mouse = false;
      rect(350, 265, 170, 170);
    }
    if (selectedImg === 2) {
      mouse = false;
      rect(530, 265, 170, 170);
    }
    pop();
  }
  displayWater();
  timer();
  fill(255);
  console.log(level)
  // win(3)
  textSize(25);
  text(mouseX + "," + mouseY, mouseX, mouseY);
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
  rect(311, 691, 520, 70);
  fill(255, 0, 0);
  textSize(100);
  textFont(fontRegular);
  // text(8888, 900, 150);
  if (isGuessGame) {
    text(countDown, 400, 722);
    if (frameCount % 60 == 0 && countDown > 0) {
      if(waterTime===false){
        countDown--
      }
    }
    if (countDown === 0) {
      sendMQTTMessage("fail");
    }
  }
  if (isPipeGame) {
    text(stepCount, 400, 722);
    if (stepCount === 0) {
      sendMQTTMessage("fail");
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
}

function leftButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 200, 580);
    if (d < 60 && mouse) {
      console.log("left");

      if (selectedImg < 0) {
        selectedImg = 0;
      } else {
        selectedImg--;
      }
    }
  }
  image(leftb, -60, 310, 1400, 1000);
}
function middleButton() {
  var d = dist(mouseX, mouseY, 308, 580);
  if (d < 60 && mouse) {
    if (selectedImg === seedNumber) {
      sendMQTTMessage("guessComplete");
      waterTime=true
    }
  }
  image(middleb, -100, 285, 1500, 1100);
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
  image(rightb, -150, 310, 1600, 1000);
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
    } else {
      level++;
      isGuessGame = false;
      isPipeGame = true;
      waterTime = false;
      isLoaded=false
      waterTimer=0
      
    }
  }
}
function mouseClicked() {
  mouse = true;
}
function keyPressed() {
  // sendMQTTMessage('water')
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
    reset()
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
    reset()
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
  hint = false;
  waterTimer = 0;
  hintAlpha = 255;
  stepCount = 20
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
function plant() {
  if (level === 1) {
  }
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
    if (this.toX === x - 760 && this.toY === y) {
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
      fill(99, 98, 94);
      rect(this.x, this.y - 45, 40, 10);
      fill(184, 181, 173);
      rect(this.x, this.y, 28, 80);
      fill(99, 98, 94);
      rect(this.x, this.y + 45, 40, 10);
      pop();
    }
    if (pattern === 2) {
      push();
      fill(99, 98, 94);
      rect(this.x - 45, this.y, 10, 40);
      fill(184, 181, 173);
      rect(this.x - 22.5, this.y, 35, 28, 3);
      rect(this.x, this.y + 13, 28, 55, 3);
      fill(99, 98, 94);
      rect(this.x, this.y + 45, 40, 10);
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
