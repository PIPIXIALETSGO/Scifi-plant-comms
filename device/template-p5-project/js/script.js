var x = 0;
var y = 0;
var angle = 0;
var pipes = [];
var numOfPipes = 4;
var xCor = 500;
var yCor = 250;
var randomAngle = [0, 90, 180, 270];
var isPipeGame = false;
var isGuessGame = false;
////////// guess game
var img, img2, img3, fontRegular;
var countDown = 0;
var selectedImg = 2;
var buttonAlpha = 100;
var targetSeed;
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
  { position: 1, angle: 180, isMatched: 0 },
  { position: 2, angle: 0, isMatched: 0 },
  { position: 3, angle: 90, isMatched: 0 },
];
var winCon2 = [
  { position: 2, angle: 180, isMatched: 0 },
  { position: 3, angle: 90, isMatched: 0 },
  { position: 4, angle: 0, isMatched: 0 },
];
var winCon3 = [
  { position: 1, angle: 270, isMatched: 0 },
  { position: 2, angle: 0, isMatched: 0 },
  { position: 3, angle: 270, isMatched: 0 },
  { position: 4, angle: 270, isMatched: 0 },
  { position: 5, angle: 90, isMatched: 0 },
  { position: 6, angle: 180, isMatched: 0 },
  { position: 7, angle: 90, isMatched: 0 },
];
var mouse = false;
var level = 1;
var isLoaded = false;
var pattern = [2, 2, 2, 2]; //1=vertical   2=L-shape 3=cross
function preload() {
  fontRegular = loadFont("assets/digital.ttf");
  img = loadImage("./assets/images/seed1.png");
  img2 = loadImage("./assets/images/seed2.png");
  img3 = loadImage("./assets/images/seed3.jpg");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  MQTTsetup();
  background(0, 27);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  if (level === 1) {
    createPipe(500, 250, 4, 1, pattern);
  }
}
function onMessageArrived(message) {
  let dataReceive = split(trim(message.payloadString), "/");
  if (dataReceive[1] == myName) {
    if (dataReceive[2] === "pipe") {
      isPipeGame = true;
    } else if (dataReceive[2] === "seed") {
      targetSeed = dataReceive[3];
      isGuessGame = true;
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
  background(21, 21, 21);
  fill(255);
  interface();
  timer();
  valve();
  // console.log(isLoaded)
  if (valveRotate === false && valveTime) {
    valveArrow();
  }
  if (isPipeGame) {
    pipeGame(level);
    if (level === 2 && isLoaded === false) {
      numOfPipes = 7;
      createPipe(450, 250, numOfPipes, 2, [1, 2, 2, 1, 2, 2, 1]);
      isLoaded = true;
    } else if (level === 3 && isLoaded === false) {
      console.log("3");
      numOfPipes = 13;
      createPipe(
        250,
        250,
        numOfPipes,
        3,
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
      );
      isLoaded = true;
    }
    displayPipe(numOfPipes);
    checkWinCon();
    stroke(0);
  }
  if (isGuessGame) {
    push();
    if (selectedImg === 1) {
      mouse = false;
      strokeWeight(15);
      stroke(255, 0, 0);
      rect(200, 325, 240, 240);
      image(img, 200, 325, 240, 240);
    } else {
      image(img, 200, 325, 220, 220);
    }
    if (selectedImg === 2) {
      mouse = false;
      strokeWeight(15);
      stroke(255, 0, 0);
      rect(455, 325, 240, 240);
      image(img2, 455, 325, 240, 240);
    } else {
      image(img2, 455, 325, 220, 220);
    }
    if (selectedImg === 3) {
      mouse = false;
      strokeWeight(15);
      stroke(255, 0, 0);
      rect(705, 325, 240, 240);
      image(img3, 705, 325, 240, 240);
    } else {
      image(img3, 705, 325, 220, 220);
    }

    pop();

    timer();
  }
  fill(0);
  textSize(25);
  text(mouseX + "," + mouseY, mouseX, mouseY);
}
function timer() {
  push();
  noStroke();
  fill(0, 100);
  rect(1000, 120, 210, 80);
  fill(255, 0, 0, 8);
  textSize(100);
  textFont(fontRegular);
  text(8888, 900, 150);
  if (isGuessGame || isPipeGame) {
    text(countDown, 1023, 150);
  }

  // text("countDown", width / 2, 100);

  // if (frameCount % 60 == 0 && countDown > 0) {
  //   countDown--;
  // }
  // if (countDown === 0) {
  //   // text("Game Over", width / 2, height / 2);
  //   if (mouse) {
  //     countDown = 10;
  //   }
  // }
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
  push();
  // fill(21, 21, 21);
  fill(0);
  strokeWeight(15);
  stroke(255, 100);
  rect(450, 350, 750, 500, 3);
  strokeWeight(0);
  fill(0);
  rect(450, 350, 748, 490, 15);
  pop();
  led();
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
    var d = dist(mouseX, mouseY, 990, 580);
    if (d < 75 && mouse) {
      if (selectedImg < 1) {
        selectedImg = 1;
      } else {
        selectedImg--;
      }
    }
  }
  push();
  noStroke();
  fill(200, 15, 0, buttonAlpha);
  ellipse(990, 580, 150, 150);
  stroke(255, 0, 0, buttonAlpha);
  noFill();
  strokeWeight(10);
  ellipse(990, 580, 140, 140);
  fill(0, buttonAlpha);
  strokeWeight(30);
  stroke(0, buttonAlpha);
  text("<", 980, 590);
  pop();
}
function middleButton() {
  var d = dist(mouseX, mouseY, 1190, 580);
  if (d < 75 && mouse) {
    for (var ii = 1; ii < 4; ii++) {
      if (selectedImg === ii) {
        sendMQTTMessage("complete");
      }
    }
  }
  push();
  noStroke();
  fill(200, 15, 0, buttonAlpha);
  ellipse(1190, 580, 150, 150);
  stroke(255, 0, 0, buttonAlpha);
  noFill();
  strokeWeight(10);
  ellipse(1190, 580, 140, 140);
  fill(0, buttonAlpha);
  strokeWeight(2);
  stroke(0, buttonAlpha);
  textSize(50);
  text("OK", 1150, 600);
  pop();
}
function rightButton() {
  var d = dist(mouseX, mouseY, 1390, 580);
  if (d < 75 && mouse) {
    if (selectedImg > 3) {
      selectedImg = 3;
    } else {
      selectedImg++;
    }
  }
  push();
  noStroke();
  fill(200, 15, 0, buttonAlpha);
  ellipse(1390, 580, 150, 150);
  stroke(255, 0, 0, buttonAlpha);
  noFill();
  strokeWeight(10);
  ellipse(1390, 580, 140, 140);
  fill(0, buttonAlpha);
  strokeWeight(30);
  stroke(0, buttonAlpha);
  text(">", 1380, 590);
  pop();
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
        sendMQTTMessage("water");  //['jw','leo','water']
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
function valveArrow() {
  push();
  noStroke();
  translate(1170, 125);
  rotate(30);
  fill(255, 0, 0, arrowAlpha);
  if (blink) {
    arrowAlpha += 5;
    if (arrowAlpha > 255) blink = false;
  }
  if (blink === false) {
    arrowAlpha -= 5;
    if (arrowAlpha < 0) blink = true;
  }
  rect(0, 0, 120, 10);
  triangle(60, 15, 60, -15, 75, 0);
  pop();
}
function displayPipe(numOfPipes) {
  for (var ii = 0; ii < numOfPipes; ii++) {
    pipes[ii].display();
    pipes[ii].rotation();
  }
}
function mouseClicked() {
  mouse = true;
}
function createPipe(xCor, yCor, n, l, pattern) {
  if (l === 1) {
    for (var ii = 0; ii < n; ii++) {
      if (ii === 1) {
        xCor = 400;
        yCor += 100;
      }
      if (ii === 3) {
        yCor += 100;
        xCor = 500;
      }
      pipes[ii] = new pipeBlocks(xCor, yCor, pattern[ii]);
      xCor += 100;
    }
  } else if (l === 2) {
    for (var ii = 0; ii < n; ii++) {
      if (ii === 2) {
        xCor = 350;
        yCor += 100;
      } else if (ii === 5) {
        xCor = 350;
        yCor += 100;
      }
      pipes[ii] = new pipeBlocks(xCor, yCor, pattern[ii]);
      xCor += 100;
    }
  } else if (l === 3) {
    for (var ii = 0; ii < n; ii++) {
      if (ii === 4) {
        xCor = 250;
        yCor += 100;
      } else if (ii === 9) {
        xCor = 350;
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
    if (total === 3) {
      valveTime = true;
      isLoaded = false;
    }
  } else if (level === 2) {
    console.log(total);
    for (var jj = 0; jj < winCon2.length; jj++) {
      var position = winCon2[jj].position;
      var angle = winCon2[jj].angle;
      if (pipes[position].checkAngle(angle)) {
        winCon2[jj].isMatched = 1;
        total += winCon2[jj].isMatched;
      }
    }
    if (total === 3) {
      valveTime = true;
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
    rect(450, 350, 200, 300);
    fill(0, 0, 255);
    rect(400, 250, 100, 100);
    fill(0);
    rect(400, 295, 50, 10);

    text("water", 380, 260);
    fill(0, 255, 0);
    rect(400, 450, 100, 100);
    fill(0);
    rect(445, 450, 10, 50);
    text("plant", 380, 460);
  } else if (l === 2) {
    rect(450, 350, 300, 300);
    fill(0, 0, 255);
    rect(350, 250, 100, 100);
    fill(0);
    rect(350, 295, 50, 10);
    text("water", 330, 260);
    fill(0, 255, 0);
    rect(550, 450, 100, 100);
    fill(0);
    rect(550, 405, 50, 10);

    text("plant", 530, 460);
  } else if (l === 3) {
    rect(450, 350, 500, 300);
    fill(0, 0, 255);
    rect(650, 250, 100, 100);
    fill(0);
    rect(605, 250, 10, 50);
    text("water", 620, 260);
    fill(0, 255, 0);
    rect(250, 450, 100, 100);
    fill(0);
    rect(250, 405, 50, 10);
    text("plant", 230, 460);
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
  rotation() {
    push();
    if (mouseX < this.toX + 50 && mouseX > this.toX - 50) {
      if (mouseY < this.toY + 50 && mouseY > this.toY - 50) {
        if (mouse) {
          this.rotate = true;
          mouse = false;
        }
      }
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
    if (pattern === 3) {
      push();
      fill(99, 98, 94);
      rect(this.x - 45, this.y, 10, 40);
      rect(this.x, this.y - 45, 40, 10);
      fill(184, 181, 173);
      rect(this.x, this.y, 80, 28);
      rect(this.x, this.y, 28, 80);
      fill(99, 98, 94);
      rect(this.x + 45, this.y, 10, 40);
      rect(this.x, this.y + 45, 40, 10);
      pop();
    }
    if (pattern === 2) {
      push();
      fill(99, 98, 94);
      rect(this.x - 45, this.y, 10, 40);
      fill(184, 181, 173);
      rect(this.x - 22.5, this.y, 35, 28);
      rect(this.x, this.y + 13, 28, 55);
      fill(99, 98, 94);
      rect(this.x, this.y + 45, 40, 10);
      pop();
    }
  }
  checkAngle(targetAngle) {
    if (this.angle === targetAngle) {
      return true;
    }
  }
}
///level 1 win con///
///1-180,2-0,3-90

///level 2 win con///
///1-180,2-0,3-90

///level 3 win con///
///1-270,2-0,3-270,4-270,5-90,6-180,7-90

///add 3 LED, when message recived, led blinks for 1-2 secs. Then display the screen
