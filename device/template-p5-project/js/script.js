var x = 0;
var y = 0;
var angle = 0;
var pipes = [];
var waterDrop = [];
var numOfPipes = 11;
var xCor = 500;
var yCor = 250;
var randomAngle = [0, 90, 180, 270];
var isPipeGame = true;
var isGuessGame = false;
var rX = 0;
var rY = 0;
const FRAME_RATE = 30;
var hint = false;
var hintAlpha = 255;
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
  fontRegular;
var countDown = 20;
var stepsCount = 10;
var selectedImg = 1;
var buttonAlpha = 100;
var targetSeed;
var numofDrops = 100;
var waterTime=false
////////////////// valve
var valveRotate = false;
var valveAngle = 360;
var arrowAlpha = 255;
var blink = false;
var valveTime = false;
var valveAlpha = 100;
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
var level = 1;
var isLoaded = false;
var pattern = [2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2]; //1=vertical   2=L-shape 3=cross
function preload() {
  fontRegular = loadFont("assets/digital.ttf");
  img = loadImage("./assets/images/seed0.jpg");
  img2 = loadImage("./assets/images/seed1.jpg");
  img3 = loadImage("./assets/images/seed2.jpg");
  backgroundImg = loadImage("./assets/images/BG.png");
  device = loadImage("./assets/images/console.png");
  box = loadImage("./assets/images/box.png");
  leftb = loadImage("./assets/images/left.png");
  middleb = loadImage("./assets/images/middle.png");
  rightb = loadImage("./assets/images/right.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  MQTTsetup();
  background(0, 27);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  if (level === 1) {
    createPipe(400, 180, 11, 1, pattern);
  }
  for (var ii = 0; ii < numofDrops; ii++) {
    waterDrop[ii] = new water();
  }
}
function onMessageArrived(message) {
  let dataReceive = split(trim(message.payloadString), "/");
  // console.log(dataReceive);
  if (dataReceive[1] == myName) {
    if (dataReceive[2] == "pipe") {
      var x = parseInt(dataReceive[3]);
      var y = parseInt(dataReceive[4]);
      rX = x;
      rY = y;
      console.log(rX, rY);
      stepsCount--;
    } else if (dataReceive[2] === "guess") {
      isGuessGame = true;
    } else if (dataReceive[2] === "hint") {
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
  // valve();
  if (isPipeGame) {
    isGuessGame = false;
    pipeGame(level);
    if (level === 2 && isLoaded === false) {
      numOfPipes = 12;
      createPipe(400, 180, numOfPipes, 2, [2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2]);
      isLoaded = true;
    } else if (level === 3 && isLoaded === false) {
      numOfPipes = 11;
      createPipe(
        200,
        180,
        numOfPipes,
        3,
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
      );
      isLoaded = true;
    }
    timer();
    displayPipe();
    checkWinCon();
    stroke(0);
  }
  if (isGuessGame) {
    push();
    if (selectedImg === 0) {
      mouse = false;
      image(img, 400, 280, 400, 400);
    }
    if (selectedImg === 1) {
      mouse = false;
      image(img2, 400, 280, 400, 400);
    }
    if (selectedImg === 2) {
      mouse = false;
      image(img3, 400, 280, 400, 400);
    }

    pop();

    timer();
  }
  displayWater();
  fill(255);
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
      [300, 280],
      [400, 280],
      [400, 180],
      [500, 180],
      [600, 180],
      [600, 280],
      [500, 280],
      [500, 380],
      [400, 380],
      [300, 380],
    ]);
    pop();
  } else if (l === 2) {
    push();
    stroke(0, 0, 255);
    strokeWeight(25);
    noFill();
    animS.shape("l2", FRAME_RATE * 3, [
      [600, 200],
      [600, 380],
      [500, 380],
      [500, 280],
      [400, 280],
      [400, 380],
      [350, 380],
    ]);
    pop();
  } else if (l === 3) {
    push();
    stroke(255);
    strokeWeight(25);
    noFill();
    animS.shape("l3", FRAME_RATE * 3, [
      [700, 180],
      [600, 180],
      [600, 280],
      [500, 280],
      [500, 180],
      [400, 180],
      [400, 280],
      [300, 280],
      [300, 380],
    ]);
    pop();
  }
}
function timer() {
  push();
  noStroke();
  fill(0);
  rect(551, 691, 520, 70);
  fill(255, 0, 0);
  textSize(100);
  textFont(fontRegular);
  // text(8888, 900, 150);
  if (isPipeGame) {
    text(stepsCount, 400, 722);
  }
  if (isGuessGame) {
    text(countDown, 400, 722);
    if (frameCount % 60 == 0 && countDown > 0) {
      countDown--;
    }
    if (countDown === 0) {
      // text("Game Over", width / 2, height / 2);
      if (mouse) {
        countDown = 10;
      }
    }
  }
  // text("countDown", width / 2, 100);

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
  image(device, 150, 380, 1500, 750);
  image(box, 1550, 370, 1400, 750);
  // led();
  interfaceAlpha();
  leftButton();
  middleButton();
  rightButton();
}
function led() {
  noStroke();
  fill(255, 0, 0, 100);
  ellipse(350, 50, 50, 50);
  ellipse(450, 50, 50, 50);
  ellipse(550, 50, 50, 50);
}
function leftButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 300, 580);
    if (d < 60 && mouse) {
      if (selectedImg < 0) {
        selectedImg = 0;
      } else {
        selectedImg--;
      }
    }
  }
  image(leftb, 80, 310, 1400, 1000);
}
function middleButton() {
  var d = dist(mouseX, mouseY, 460, 586);
  if (d < 60 && mouse) {
    if (selectedImg === parseInt(targetSeed)) {
      sendMQTTMessage("guessComplete");
    }
  }
  image(middleb, 80, 315, 1400, 1000);
}
function rightButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 570, 580);
    if (d < 60 && mouse) {
      if (selectedImg > 2) {
        selectedImg = 2;
      } else {
        selectedImg++;
      }
    }
  }
  image(rightb, 10, 310, 1600, 1000);
}
function valve() {
  push();
  fill(21, 21, 21);
  translate(1355, 255);
  var d = dist(mouseX, mouseY, 1055, 255);
  if (valveTime) {
    valveAlpha = 255;
    if (d < 125 && mouse) {
      valveRotate = true;
      mouse = false;
    }
    if (valveRotate) {
      if (angle < valveAngle) {
        angle += 3;
      } else if (angle === valveAngle) {
        angle = 0;
        valveRotate = false;
        valveTime = false;
        isPipeGame = false;
        if (level === 1) {
          level = 2;
        } else if (level === 2) {
          level = 3;
        }
        reset();
        sendMQTTMessage("pipeComplete"); //['jw','leo','water']
      }
      rotate(angle);
    }
  } else {
    valveAlpha = 100;
  }
  strokeWeight(8);
  stroke(255, 0, 0, valveAlpha);
  ellipse(0, 0, 250, 250);
  fill(255, 0, 0, valveAlpha);
  ellipse(0, 0, 20, 20);
  strokeWeight(5);
  line(0, 0, 50, -110);
  line(0, 0, -50, -110);

  line(0, 0, 125, 0);
  line(0, 0, -125, 0);

  line(0, 0, 50, 110);
  line(0, 0, -50, 110);
  pop();
}
function displayPipe() {
  for (var ii = 0; ii < numOfPipes; ii++) {
    pipes[ii].rotation(rX, rY);
    pipes[ii].display();
  }
}
function displayWater() {
  if(waterTime){
    for (var ii = numofDrops - 1; ii >= 0; ii--) {
      waterDrop[ii].update();
      waterDrop[ii].show();
      
    }
  }
}
function mouseClicked() {
  mouse = true;
  waterTime=!waterTime
}
function createPipe(xCor, yCor, n, l, pattern) {
  if (l === 1) {
    for (var ii = 0; ii < n; ii++) {
      if (ii === 4) {
        xCor = 400;
        yCor += 100;
      }
      if (ii === 8) {
        xCor = 400;
        yCor += 100;
      }
      pipes[ii] = new pipeBlocks(xCor, yCor, pattern[ii]);
      xCor += 100;
    }
  } else if (l === 2) {
    for (var ii = 0; ii < n; ii++) {
      if (ii === 2) {
        xCor = 700;
      } else if (ii === 3) {
        xCor = 300;
        yCor += 100;
      } else if (ii === 8) {
        xCor = 400;
        yCor += 100;
      }
      pipes[ii] = new pipeBlocks(xCor, yCor, pattern[ii]);
      xCor += 100;
    }
  } else if (l === 3) {
    for (var ii = 0; ii < n; ii++) {
      if (ii === 0) {
        xCor += 200;
      }
      if (ii === 3) {
        xCor = 300;
        yCor += 100;
      } else if (ii === 8) {
        xCor = 400;
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
      valveTime = true;
      win(1);
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
      valveTime = true;
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
      valveTime = true;
      win(3);
    }
  }

  // console.log(total);
}
function pipeGame(l) {
  textSize(20);
  push();
  fill(255);
  noStroke();
  if (l === 1) {
    // rect(400, 300, 500, 300);
    if (hint === false) {
      fill(0, 0, 255);
      rect(300, 180, 100, 100);
      rect(700, 380, 100, 100);
      rect(300, 280, 100, 100);
    } else {
      fill(0, 0, 255, hintAlpha);
      hintAlpha -= 3;
      rect(300, 180, 100, 100);
      rect(700, 380, 100, 100);
      fill(0, 0, 255);
      rect(300, 280, 100, 100);
    }
    fill(0);
    // rect(400, 295, 50, 10);
    text("water", 280, 300);
    fill(0, 255, 0);
    rect(300, 380, 100, 100);
    fill(0);
    rect(350, 380, 10, 50);
    text("plant", 300, 400);
  } else if (l === 2) {
    // rect(400, 300, 500, 300);
    if (hint === false) {
      fill(0, 0, 255);
      rect(300, 180, 100, 100);
      rect(600, 180, 100, 100);
    } else {
      fill(0, 0, 255, hintAlpha);
      hintAlpha -= 3;
      rect(300, 180, 100, 100);
      fill(0, 0, 255);
      rect(600, 180, 100, 100);
    }
    fill(0);
    rect(600, 225, 50, 10);
    text("water", 580, 210);
    fill(0, 255, 0);
    rect(300, 380, 100, 100);
    fill(0);
    rect(300, 335, 50, 10);
    text("plant", 290, 410);
  } else if (l === 3) {
    // rect(400, 300, 500, 300);
    if (hint === false) {
      fill(0, 0, 255);
      rect(300, 180, 100, 100);
      rect(700, 380, 100, 100);
      rect(700, 180, 100, 100);
    } else {
      fill(0, 0, 255, hintAlpha);
      hintAlpha -= 3;
      rect(300, 180, 100, 100);
      rect(700, 380, 100, 100);
      fill(0, 0, 255);
      rect(700, 180, 100, 100);
    }
    fill(0);
    rect(655, 180, 10, 50);
    text("water", 690, 190);
    fill(0, 255, 0);
    rect(300, 380, 100, 100);
    fill(0);
    rect(300, 335, 50, 10);
    text("plant", 280, 390);
  }
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
    if (this.toX === x - 620 && this.toY === y) {
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
    this.x = random(1193,1284);
    this.y = 57;
    this.yVelocity = random(1, 5);
    this.alpha = 255;
    this.acc = 0.05;
  }
  update() {
    this.yVelocity += this.acc;
    this.y += this.yVelocity;
    this.alpha-=1.3;
    if(this.y>1050){
      this.y=57
      this.yVelocity=random(1, 5);
    }
  }
  show() {
    var wgt=map(this.yVelocity, 1, 10, 0.5, 2);
    push()
    strokeWeight(wgt);
    stroke(187, 217, 238);
    line(this.x, this.y, this.x, this.y +10);
    pop()
  }
}
///level 1 win con///
///0-270,1-180/270,2-0,4-90,5-270,6-90,8-90/270,9-90

///level 2 win con///
///1-180,2-0,3-90

///level 3 win con///
///1-270,2-0,3-270,4-270,5-90,6-180,7-90


