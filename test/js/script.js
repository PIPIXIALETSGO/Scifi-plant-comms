var x = 0;
var y = 0;
var angle = 0;
var pipes = [];
var waterDrop = [];
var numOfPipes = 4;
var numofDrops = 100;
var xCor = 500;
var yCor = 250;
var randomAngle = [0, 90, 180, 270];
var isPipeGame = false;
var isGuessGame = true;
var isFailed = false;
var isloadingScreen = false;
var waterTime = false;
var waterTimer = 0;
var word;
var letter;
var spacing = 10;
////////// guess game
var backgroundImg,
  device,
  leftb,
  middleb,
  rightb,
  fontRegular,
  hintb,
  guessBox,
  seed;
var leaf1, leaf2, leaf3, root1, root2, root3, con1, con2, con3;
var countDown = 0;
var selectedImg = 1;
var buttonAlpha = 255;
var targetSeed;
var stepsCount = 10;
///////////////////Quiz///////////
var quiz = [
  {
    question: "Which of these is a flowering plant?",
    answer1: "Seaweed",
    answer2: "Fir tree",
    answer3: "Oak tree",
    answer4: "Moss",
    correct: 3,
  },
  {
    question: "What are the male parts of a flower called?",
    answer1: "Stamens",
    answer2: "Stigma",
    answer3: "Carpels",
    answer4: "Pollen",
    correct: 1,
  },
  {
    question: "Which of these plants spread their seeds on water?",
    answer1: "Roses",
    answer2: "Water lilies",
    answer3: "Dandelions",
    answer4: "Pine trees",
    correct: 2,
  },
  {
    question: "Which of these is a nonflowering plant?",
    answer1: "Dandelion",
    answer2: "Eryngo",
    answer3: "Fern",
    answer4: "Oak tree",
    correct: 3,
  },
  {
    question: "Seeds develop in which section of a flower?",
    answer1: "Pistil",
    answer2: "Stamen",
    answer3: "Ovary",
    answer4: "Sepels",
    correct: 3,
  },
];
var story = "haha";
var isQuizGame = false;
var selectedAnswer = 1;
var quizNumber;
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
let myName = "kk";
let nextName = "jw";
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
var hint = false;
var seedNumber;
var level = 0;
var isLoaded = false;
function preload() {
  fontRegular = loadFont("assets/digital.ttf");
  backgroundImg = loadImage("./assets/images/BG.png");
  device = loadImage("./assets/images/console.png");
  box = loadImage("./assets/images/box.png");
  leftb = loadImage("./assets/images/left.png");
  middleb = loadImage("./assets/images/middle.png");
  rightb = loadImage("./assets/images/right.png");
  hintb = loadImage("./assets/images/hintButton.png");
  guessBox = loadImage("./assets/images/guessBox.png");
  leaf1 = loadImage("./assets/images/leaf1.png");
  leaf2 = loadImage("./assets/images/leaf2.png");
  leaf3 = loadImage("./assets/images/leaf3.png");
  root1 = loadImage("./assets/images/root1.png");
  root2 = loadImage("./assets/images/root2.png");
  root3 = loadImage("./assets/images/root3.png");
  con1 = loadImage("./assets/images/con1.png");
  con2 = loadImage("./assets/images/con2.png");
  con3 = loadImage("./assets/images/con3.png");
  quizNumber = Math.round(random(0, 4));
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  MQTTsetup();
  seedNumber = Math.round(random(0, 2));
  seed = loadImage("./assets/images/seed" + seedNumber + ".png");
  background(0, 27);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  for (var ii = 0; ii < numofDrops; ii++) {
    waterDrop[ii] = new water();
  }
}
function onMessageArrived(message) {
  let dataReceive = split(trim(message.payloadString), "/");
  if (dataReceive[1] == myName) {
    if (dataReceive[2] === "guessComplete") {
      waterTime = true;
    } else if (dataReceive[2] === "water") {
      waterTime = true;
    } else if (dataReceive[2] === "pipeComplete") {
      reset();
      level = 2;
    } else if (dataReceive[2] === "fail") {
      isFailed = true;
    }
  }
}
function sendMQTTMessage(g, x, y) {
  message = new Paho.MQTT.Message(
    myName + "/" + nextName + "/" + g + "/" + x + "/" + y
  );
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
    loadingSreen();
  } else {
    interface();
    if (isGuessGame) {
      image(guessBox, 850, 400, 2000, 1000);
      text("Describe the seed to your partner", 954, 120);
      image(seed, 900, 450, 1200, 1000);
    }
    if (isPipeGame) {
      push();
      stroke(141, 134, 184);
      strokeWeight(20);
      noFill();
      rect(1137, 280, 400, 208);
      line(939, 280, 1336, 280);
      line(939, 280, 1336, 280);
      line(1038, 180, 1038, 380);
      line(1138, 180, 1138, 380);
      line(1238, 180, 1238, 380);
      pop();
      if (isLoaded === false) {
        numOfPipes = 15;
        createPipe(940, 180, numOfPipes);
        isLoaded = true;
      }
      displayPipe(numOfPipes);
      stroke(0);
    }
    if (isQuizGame) {
      push();
      fill(141, 134, 184);
      noStroke();
      stroke(0);
      if (selectedAnswer === 1) {
        strokeWeight(5);
        stroke(255, 0, 0);
        rect(950, 350, 110, 80, 100);
      } else {
        stroke(0);
        strokeWeight(1);
        rect(950, 350, 110, 80, 100);
      }
      if (selectedAnswer === 2) {
        strokeWeight(5);
        stroke(255, 0, 0);
        rect(1080, 350, 110, 80, 100);
      } else {
        stroke(0);
        strokeWeight(1);
        rect(1080, 350, 110, 80, 100);
      }
      if (selectedAnswer === 3) {
        strokeWeight(5);
        stroke(255, 0, 0);
        rect(1220, 350, 110, 80, 100);
      } else {
        stroke(0);
        strokeWeight(1);
        rect(1220, 350, 110, 80, 100);
      }
      if (selectedAnswer === 4) {
        strokeWeight(5);
        stroke(255, 0, 0);
        rect(1360, 350, 110, 80, 100);
      } else {
        stroke(0);
        strokeWeight(1);
        rect(1360, 350, 110, 80, 100);
      }
      pop();
      quizBlock();
    }
    if (isFailed) {
      failScreen(1);
    }
    displayWater();
  }
  fill(0);
  textSize(25);
  text(mouseX + "," + mouseY, mouseX, mouseY);
}
function timer() {
  push();
  noStroke();
  fill(0);
  rect(1186, 691, 590, 70);
  fill(255, 0, 0);
  textSize(100);
  textFont(fontRegular);
  // text(8888, 900, 150);
  if (isPipeGame) {
    text(stepsCount, 1100, 722);
  }
  pop();
}

function interface() {
  image(backgroundImg, width - 768, height - 371, width, height);
  image(device, 835, 380, 1400, 750);
  plantPhase(level);
  image(box, 700, 370, 1400, 750);
  hintButton();
  leftButton();
  middleButton();
  rightButton();
}
function quizBlock() {
  push();
  fill(0);
  text(quiz[quizNumber].question, 890, 200);
  textSize(20);
  text(quiz[quizNumber].answer1, 900, 360);
  text(quiz[quizNumber].answer2, 1030, 360);
  text(quiz[quizNumber].answer3, 1170, 360);
  text(quiz[quizNumber].answer4, 1310, 360);
  pop();
}
function leftButton() {
  if (isQuizGame) {
    var d = dist(mouseX, mouseY, 1090, 580);
    if (d < 70 && mouse) {
      if (selectedAnswer <= 1) {
        selectedAnswer = 1;
      } else {
        selectedAnswer--;
        mouse = false;
      }
    }
  }
  image(leftb, 830, 300, 1400, 1000);
}
function middleButton() {
  if (isQuizGame) {
    var d = dist(mouseX, mouseY, 1180, 580);
    if (d < 70 && mouse) {
      if (selectedAnswer === quiz[quizNumber].correct) {
        sendMQTTMessage("hintComplete");
        isQuizGame = false;
        hint = true;
        isPipeGame = true;
        mouse = false;
        quiz.splice(quizNumber, 1);
        quizNumber = Math.round(random(0, quiz.length));
        selectedAnswer = 1;
      } else {
        mouse = false;
      }
    }
  }
  image(middleb, 810, 280, 1500, 1100);
}
function rightButton() {
  if (isQuizGame) {
    var d = dist(mouseX, mouseY, 1300, 580);
    if (d < 75 && mouse) {
      if (selectedAnswer >= 4) {
        selectedAnswer = 4;
      } else {
        selectedAnswer++;
      }
      mouse = false;
    }
  }
  image(rightb, 775, 280, 1600, 1100);
}
function hintButton() {
  if (dist(mouseX, mouseY, 958, 578) < 50 && mouse) {
    isQuizGame = true;
    isPipeGame = false;
    mouse = false;
  }
  push();
  image(hintb, 820, 300, 1500, 1000);
  if (isPipeGame) {
    if (hint === false) {
      fill(209, 27, 21, 255);
    } else {
      fill(209, 27, 21, 80);
    }
    textSize(70);
    noStroke();
    text("?", 940, 610);
    pop();
  }
}
function displayPipe(numOfPipes) {
  for (var ii = 0; ii < numOfPipes; ii++) {
    pipes[ii].display();
    pipes[ii].rotation();
  }
}
function displayWater() {
  if (waterTime) {
    for (var ii = numofDrops - 1; ii >= 0; ii--) {
      waterDrop[ii].update();
      waterDrop[ii].show();
    }
    if (waterTimer < 300) {
      waterTimer++;
    } else {
      hint = flase;
      if (level === 0) {
        isGuessGame = false;
        isPipeGame = true;
        level = 1;
      } else if (level === 1) {
        level = 2;
      }
      waterTime = false;
      waterTimer = 0;
    }
  }
}
function mouseClicked() {
  mouse = true;
}
function keyPressed() {
  sendMQTTMessage("seed", seedNumber, 1);
}
function createPipe(xCor, yCor, n) {
  for (var ii = 0; ii < n; ii++) {
    if (ii === 5) {
      xCor = 940;
      yCor += 100;
    } else if (ii === 10) {
      xCor = 940;
      yCor += 100;
    }
    pipes[ii] = new pipeBlocks(xCor, yCor);
    xCor += 100;
  }
}
function reset() {
  mouse = false;
  isLoaded = false;
  waterTimer = 0;
  pipes = [];
}
function plantPhase(l) {
  if (l === 1) {
    image(leaf1, 900, 340, 2000, 1000);
    image(root1, 800, 360, 1700, 750);
  } else if (l === 2) {
    image(leaf1, 900, 340, 2000, 1000);
    image(leaf2, 900, 340, 2000, 1000);
    image(root1, 800, 360, 1700, 750);
    image(root2, 790, 370, 1700, 750);
  } else if (l === 3) {
    image(leaf1, 800, 340, 1700, 750);
    image(leaf2, 780, 360, 1700, 750);
    image(leaf3, 800, 375, 1700, 750);
    image(root1, 800, 360, 1700, 750);
    image(root2, 790, 370, 1700, 750);
    image(root3, 700, 380, 1700, 750);
  }
}
function failScreen(l) {
  image(con1, 1800, -300, 4000, 3000);
}
function loadingSreen() {
  background(255);
}
class pipeBlocks {
  constructor(x, y) {
    this.x = 0;
    this.y = 0;
    this.toX = x;
    this.toY = y;
    this.angle = 0;
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
          sendMQTTMessage("pipe", this.toX, this.toY);
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
    this.shape();
    pop();
  }
  shape() {
    noStroke();
    push();
    fill(141, 134, 184);
    fill(255, 0, 0);
    ellipse(this.x, this.y, 10, 10);
    noFill();
    stroke(255, 0, 0, 200);
    strokeWeight(2);
    line(this.x, this.y, 20, -20);
    line(this.x, this.y, 20, 20);
    line(this.x, this.y, -20, 20);
    line(this.x, this.y, -20, -20);
    strokeWeight(4);
    ellipse(this.x, this.y, 60, 60);
    pop();
  }
}
class water {
  constructor() {
    this.x = random(335, 440);
    this.y = 62;
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
///missing the forth stage for plants
