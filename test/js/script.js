var x = 0;
var y = 0;
var angle = 0;
var pipes = [];
var numOfPipes = 4;
var xCor = 500;
var yCor = 250;
var randomAngle = [0, 90, 180, 270];
var isPipeGame = true;
var isGuessGame = false;
var test = true;
////////// guess game
var img, img2, img3,backgroundImg,device,leftb,middleb,rightb, fontRegular;
var countDown = 0;
var selectedImg = 1;
var buttonAlpha = 100;
var targetSeed;
var stepsCount=10
////////////////// valve
var valveRotate = false;
var valveAngle = 360;
var arrowAlpha = 255;
var blink = false;
var valveTime = false;
var valveAlpha = 100;
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
var isQuizGame = true;
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
var level = 3;
var isLoaded = false;
var pattern = [2, 2, 2, 2]; //1=vertical   2=L-shape 3=cross
function preload() {
  fontRegular = loadFont("assets/digital.ttf");
  // img = loadImage("./assets/images/seed0.jpg");
  // img2 = loadImage("./assets/images/seed1.jpg");
  // img3 = loadImage("./assets/images/seed2.jpg");
  backgroundImg=loadImage("./assets/images/BG.png")
  device=loadImage("./assets/images/console.png")
  box=loadImage("./assets/images/box.png")
  leftb=loadImage("./assets/images/left.png")
  middleb=loadImage("./assets/images/middle.png")
  rightb=loadImage("./assets/images/right.png")
  quizNumber = Math.round(random(0, 4));
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  MQTTsetup();
  background(0, 27);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);

}
function onMessageArrived(message) {
  let dataReceive = split(trim(message.payloadString), "/");
  console.log(dataReceive);
  if (dataReceive[1] == myName) {
    if (dataReceive[2] === "water") {
      isPipeGame = true;
    } else if (dataReceive[2] === "guess") {
      targetSeed = dataReceive[3];
      isGuessGame = true;
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
  image(backgroundImg,width-768,height-371,width,height)
  interface();
  timer();
  // valve();
  // test()

  if (isPipeGame) {
    isGuessGame = false;
 if (level === 3 && isLoaded === false) {
      numOfPipes = 15;
      createPipe(
        940,
        180,
        numOfPipes,
        3,
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
      );
      isLoaded = true;
    }
    displayPipe(numOfPipes);
    stroke(0);
  }
  if (isGuessGame) {
    push();
    pop();
    timer();
  }
  if (isQuizGame) {
    isPipeGame=false
    push();
    fill(255)
    noStroke()
    // rect(1150, 280, 630, 400,50);
    fill(255);
    stroke(0);
    if (selectedAnswer === 1) {
      strokeWeight(5);
      stroke(255, 0, 0);
      rect(890, 350, 130, 100);
    } else {
      stroke(0);
      strokeWeight(1);
      rect(890, 350, 130, 100);
    }
    if (selectedAnswer === 2) {
      strokeWeight(5);
      stroke(255, 0, 0);
      rect(1060, 350, 130, 100);
    } else {
      stroke(0);
      strokeWeight(1);
      rect(1060, 350, 130, 100);
    }
    if (selectedAnswer === 3) {
      strokeWeight(5);
      stroke(255, 0, 0);
      rect(1240, 350, 130, 100);
    } else {
      stroke(0);
      strokeWeight(1);
      rect(1240, 350, 130, 100);
    }
    if (selectedAnswer === 4) {
      strokeWeight(5);
      stroke(255, 0, 0);
      rect(1420, 350, 130, 100);
    } else {
      stroke(0);
      strokeWeight(1);
      rect(1420, 350, 130, 100);
    }
    pop();
    quizBlock();
  }
  fill(0);
  textSize(25);
  text(mouseX + "," + mouseY, mouseX, mouseY);
}
function timer() {
  push();
  noStroke();
  fill(0);
  rect(1186,691,590,70)
  fill(255, 0, 0);
  textSize(100);
  textFont(fontRegular);
  // text(8888, 900, 150);
  if (isPipeGame) {
    text(stepsCount, 1100, 722);
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
  if (isGuessGame||isQuizGame) {
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
  image(device,835,380,1400,750)
  image(box,700,370,1400,750)
  if(dist(mouseX,mouseY,800,600)<25&&mouse){
    isQuizGame=!isQuizGame
    mouse=false
  }
  ellipse(800,600,50)
  interfaceAlpha();
  leftButton();
  middleButton();
  rightButton();
}
function quizBlock() {
  push();
  fill(0);
  text(quiz[quizNumber].question, 910, 100);
  text(quiz[quizNumber].answer1, 820, 360);
  text(quiz[quizNumber].answer2, 1000, 360);
  text(quiz[quizNumber].answer3, 1180, 360);
  text(quiz[quizNumber].answer4, 1360, 360);
  pop();
}
function leftButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 1090, 580);
    if (d < 70 && mouse) {
      console.log('left')
      if (selectedImg < 0) {
        selectedImg = 0;
      } else {
        selectedImg--;
      }
    }
  }
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
  image(leftb,830,300,1400,1000)
}
function middleButton() {
  if(isGuessGame){
    var d = dist(mouseX, mouseY, 1345, 580);
    if (d < 70 && mouse) {
      if (selectedImg === parseInt(targetSeed)) {
        sendMQTTMessage("guessComplete");
        mouse=false
      }
    }
  }
  if(isQuizGame){
    var d = dist(mouseX, mouseY, 1180, 580);
    if (d < 70 && mouse) {
        if(selectedAnswer===quiz[quizNumber].correct){
          isQuizGame=false
          mouse=false
          selectedAnswer=1
          sendMQTTMessage("hint");
        }
    }
  }
  image(middleb,810,280,1500,1100)

}
function rightButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 790, 280);
    if (d < 75 && mouse) {
      if (selectedImg > 2) {
        selectedImg = 2;
      } else {
        selectedImg++;
      }
    }
  }
  if (isQuizGame) {
    var d = dist(mouseX, mouseY, 1300, 580);
    if (d < 75 && mouse) {
      if (selectedAnswer >= 4) {
        selectedAnswer = 4;
      } else {
        selectedAnswer++;
        mouse = false;
      }
    }
  }
  image(rightb,775  ,280,1600,1100)

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
      if (ii === 5) {
        xCor = 940;
        yCor += 100;
      } else if (ii === 10) {
        xCor = 940;
        yCor += 100;
      }
      pipes[ii] = new pipeBlocks(xCor, yCor, pattern[ii]);
      xCor += 100;
    }
    console.log(pipes);
  }
}
function reset() {
  mouse = false;
  isLoaded = false;
  pipes = [];
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
    if (pattern === 2) {
      push();
      fill(0);
      rect(this.x, this.y, 90, 90);
      arc(this.x, this.y, 100, 50, PI / 2, (3 * PI) / 2, OPEN); // 180 degrees

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
// One player will only be able to see pipes, but can't control and have no ideal where water and plant is
// Another one will be able turn each pipe and know where it starts and ends
// whenever mouse is pressed, it will send the x and y coordinates through MQTT to another player,
