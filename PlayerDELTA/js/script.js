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
var isGuessGame = false; 
var isFailed = false; 
var isloadingScreen = true;
var waterTime = false;
var waterTimer = 0;
var word;
var letter;
var spacing = 10;
var loadingCounter=0
var isEnded=false;
var music;
var backgroundImg,
  device,
  leftb,
  middleb,
  rightb,
  fontRegular,
  hintb,
  guessBox,
  seed,
  alien,
  leaf4,
  root4;
var leaf1, leaf2, leaf3, root1, root2, root3, con1, con2, con3;
var countDown = 0;
var selectedImg = 1;
var buttonAlpha = 255;
var targetSeed;
var stepsCount = 10;
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
];// A collection that contains all title and answers of the quiz game
var story = "haha";
var isQuizGame = false;
var selectedAnswer = 1;
var quizNumber;
var confirmAlpha = 0;
var p2Alpha=0
/////////////////////// MQTT variables////////
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
var mouse = false;
var hint = false;
var seedNumber;
var level = 3;
var isLoaded = false;
function preload() {
  music = loadSound('./assets/music/Plantasia.mp3'); // Music!
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
  leaf4 = loadImage("./assets/images/leaf4.png");
  alien = loadImage("./assets/images/alien.png");
  root1 = loadImage("./assets/images/root1.png");
  root2 = loadImage("./assets/images/root2.png");
  root3 = loadImage("./assets/images/root3.png");
  root4 = loadImage("./assets/images/root4.png");
  con1 = loadImage("./assets/images/con1.png");
  con2 = loadImage("./assets/images/con2.png");
  con3 = loadImage("./assets/images/con3.png");
  quizNumber = Math.round(random(0, 4));                                 // randomize a number between 0 to 4 to pick one from the quiz collections
}                                                                        // preload all the images and audios before the lauching the website
function setup() {
  createCanvas(windowWidth, windowHeight);
  MQTTsetup();
  seedNumber = Math.round(random(0, 2));
  seed = loadImage("./assets/images/seed" + seedNumber + ".png");
  background(0, 27);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  for (var ii = 0; ii < numofDrops; ii++) {                             //initialize the water drops
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
      level +=1;
    } else if (dataReceive[2] === "fail") {
      isFailed = true;
    }else if (dataReceive[2] === "ready") {
      p2Alpha = 255;
    }
  }
}                                                                       // function will excute when my name is received 
function sendMQTTMessage(g, x, y) {
  message = new Paho.MQTT.Message(
    myName + "/" + nextName + "/" + g + "/" + x + "/" + y
  );
  message.destinationName = topic;
  client.send(message);
}                                                                       // A function that sends message to another device
function onConnect() {
  client.subscribe(topic);
  console.log("connected");
}                                                                       //diplay connected when MQTT is connected
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("error");
  }
}                                                                       //display an error message when something goes wrong during the connection
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
}                                                                       // initialization of MQTT
function draw() {
  if (isloadingScreen) {                                                //display the loading page when the boolean(isloadingScreen) is true  
    loadingSreen();
  } else {
    interface();                                                        //draw background image
    if (isGuessGame) {
      image(guessBox, width/2 , height/2, width, height);               //display the quesiton box if guess game starts
      push()
      textSize(30);
      textFont(fontRegular);
      text("Describe the seed displayed on the terminal.", ((width/3) * 2) - 160, 1000);
      pop();
      image(seed, width/2 , height/2, width, height);                   //display a seed in the middle of the console
    }
    if (isPipeGame) {                                                   //when pipe game is enabled, show all the following shapes and texts
      push();
      stroke(141, 134, 184);
      strokeWeight(20);
      noFill();
      rect(1400, 280, 400, 208);
      line(1200, 280, 1600, 280);
      line(1303, 180, 1303, 380);
      line(1403, 180, 1403, 380);
      line(1503, 180, 1503, 380);
      pop();
      textFont(fontRegular);
      text("Click on valves to rotate pipeline sections.", ((width/3) * 2) - 180, 655);
      text("Press the '?' button to attempt to eliminate", ((width/3) * 2) - 180, 975);
      text("false resource location signals.", ((width/3) * 2) - 170, 1010);
      if (isLoaded === false) {                                                    //initilize all the wheels on the pipeline
        numOfPipes = 15;
        createPipe(1203, 180, numOfPipes);
        isLoaded = true;
      }
      displayPipe(numOfPipes);
      stroke(0);
    }
    if (isQuizGame) {                                                            //display the 4 answers and a red border around it when it's been seletcted during the quiz
      let xPos = 1225; 
      push();
      fill(141, 134, 184);
      noStroke();
      stroke(0);
      if (selectedAnswer === 1) {
        strokeWeight(5);
        stroke(255, 0, 0);
        rect(xPos, 350, 110, 80, 100);
      } else {
        stroke(0);
        strokeWeight(1);
        rect(xPos, 350, 110, 80, 100);
      }
      if (selectedAnswer === 2) {
        strokeWeight(5);
        stroke(255, 0, 0);
        rect(xPos + 150, 350, 110, 80, 100);
      } else {
        stroke(0);
        strokeWeight(1);
        rect(xPos + 150 , 350, 110, 80, 100);
      }
      if (selectedAnswer === 3) {
        strokeWeight(5);
        stroke(255, 0, 0);
        rect(xPos + 300 , 350, 110, 80, 100);
      } else {
        stroke(0);
        strokeWeight(1);
        rect(xPos + 300 , 350, 110, 80, 100);
      }
      if (selectedAnswer === 4) {
        strokeWeight(5);
        stroke(255, 0, 0);
        rect(xPos + 450 , 350, 110, 80, 100);
      } else {
        stroke(0);
        strokeWeight(1);
        rect(xPos + 450, 350, 110, 80, 100);
      }
      pop();
      quizBlock();
    }
    plantViz();                                                                   // Plant visualization.
    if (isFailed) {                                                               //show the failling screen when isFailed is true
      failScreen(1);
    }
    displayWater();
    if(level===4){                                                                //The boolean isEnded become true when it reaches level 4                                                   
      isEnded=true
    }
  }
  if (isEnded){                                                                    //show the ending screen when isEnded is true
    ending();
  }
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
}                                                                       //A function that display a timer at the bottom of screen when it's been called. And based on the game, it will choose to be a countdown or stepcounts
function interface() {
  image(backgroundImg, width/2, height/2, width, height);
  image(device, width/2 , height/2, width, height);
  hintButton();
  leftButton();
  middleButton();
  rightButton();
}                                                                       //A function that contains all elements of the console
function plantViz() {
  plantPhase(level);
  image(box, width/2 , height/2, width, height);
}                                                                       //It will put the plants behind the box
function quizBlock() {
  let xPos = 1176; 
  push();
  fill(0);
  text(quiz[quizNumber].question, xPos, 250);
  textSize(20);
  text(quiz[quizNumber].answer1, xPos, 360);
  text(quiz[quizNumber].answer2, xPos + 150, 360);
  text(quiz[quizNumber].answer3, xPos + 300, 360);
  text(quiz[quizNumber].answer4, xPos + 450, 360);
  pop();
}                                                                       //A function to that displays all quiz elements
function leftButton() {
  if (isQuizGame) {
    var d = dist(mouseX, mouseY, 1291, 831);
    if (d < 70 && mouse) {
      if (selectedAnswer <= 1) {
        selectedAnswer = 1;
      } else {
        selectedAnswer--;
        mouse = false;
      }
    }
  }
  image(leftb, width/2 , height/2, width, height);
}                                                                       //display the right arrow button, and change seleted answer to the one on the right hand side
function middleButton() {
  if (isQuizGame) {
    var d = dist(mouseX, mouseY, 1450, 817);
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
  image(middleb, width/2 , height/2, width, height);
}                                                                       //display the check mark  button, when it's been pressed. Check the answer and will send a message to another device if the puzzle is solved
function rightButton() {
  if (isQuizGame) {
    var d = dist(mouseX, mouseY, 1610, 817);
    if (d < 75 && mouse) {
      if (selectedAnswer >= 4) {
        selectedAnswer = 4;
      } else {
        selectedAnswer++;
      }
      mouse = false;
    }
  }
  image(rightb,width/2 , height/2, width, height);
}                                                                       //display the left arrow button, and change seleted answer to the one on the left hand side
function hintButton() {
  if (dist(mouseX, mouseY, (width/2) + 162, 865) < 50 && mouse) {
    isQuizGame = true;
    isPipeGame = false;
    waterTimer=0;
    mouse = false;
  }
  push();
  image(hintb, width/2 , height/2, width, height);
  if (isPipeGame) {
    if (hint === false) {
      fill(239, 97, 111, 255);
    } else {
      fill(209, 27, 21, 80);
    }
    textSize(70);
    noStroke();
    text("?", (width/2) + 162, 865);
    pop();
  }
}                                                                        //display the hint button, it will turn off the pipe screen when hint is true
function displayPipe(numOfPipes) {
  for (var ii = 0; ii < numOfPipes; ii++) {
    pipes[ii].display();
    pipes[ii].rotation();
  }
}                                                                       //A function loops all the methods in particle class
function displayWater() {
  if (waterTime) {                                                      //when watertime is true, display the water drop particles
    for (var ii = numofDrops - 1; ii >= 0; ii--) {
      waterDrop[ii].update();
      waterDrop[ii].show();
    }
    if (waterTimer < 300) {                                              //a timer to track how long you want the drops last 
      waterTimer++;
    } else {
      hint = false;
      if (level === 0) {
        isGuessGame = false;
        isPipeGame = true;
        level = 1;
      } else if (level === 1) {                                         //adding 1 to the current level when watering phase is done
        level = 2;
      } else if (level === 2) {
        level = 3;
      } else if (level === 3) {
        level=4;
      }
      waterTime = false;
      waterTimer = 0;
    }
  }
}
function mouseClicked() {
  mouse = true;
}                                                                     //a boolean called mouse will be true when mouse is clicked
function keyPressed() {
  sendMQTTMessage("seed", seedNumber, 1);
  //Play music if it's not playing:
    if (isloadingScreen) {
      if (music.isPlaying() == false) {
        music.loop();
      };

    confirmAlpha=255;
  }
}                                                                   // send a signal to another device when key is pressed during the loading  screen   
function createPipe(xCor, yCor, n) {
  for (var ii = 0; ii < n; ii++) {
    if (ii === 5) {
      xCor = 1203;
      yCor += 100;
    } else if (ii === 10) {
      xCor = 1203;
      yCor += 100;
    }
    pipes[ii] = new pipeBlocks(xCor, yCor);
    xCor += 100;
  }
}                                                                   //change the x and y offset based on the level and initialize pipe particles
function reset() {
  mouse = false;
  isLoaded = false;
  waterTimer = 0;
  pipes = [];
}                                                                   //a function to reset some variables when its needed
function plantPhase(l) {
  if (l === 1) {
    image(leaf1, width/2 , height/2, width, height);
    image(root1, width/2 , height/2, width, height);
  } else if (l === 2) {
    image(leaf1, width/2 , height/2, width, height);
    image(leaf2, width/2 , height/2, width, height);
    image(root1, width/2 , height/2, width, height);
    image(root2, width/2 , height/2, width, height);
  } else if (l === 3) {
    image(leaf1, width/2 , height/2, width, height);
    image(leaf2, width/2 , height/2, width, height);
    image(leaf3, width/2 , height/2, width, height);
    image(root1, width/2 , height/2, width, height);
    image(root2, width/2 , height/2, width, height);
    image(root3, width/2 , height/2, width, height);
  }
}                                                                   //display the plants next the console based on which level it is right now
function failScreen(l) {
  image(con1, 1800, -400, 4000, 3000);
  image(con2, 1800, -400, 4000, 3000)
  image(con3, 1800, -400, 4000, 3000);
  push();
  fill(247, 114, 154);
  textSize(60);
  text("Plant specimen has been contaminated!!", 260, 361);
  var d = dist(mouseX, mouseY, 748, 625);
  if (d < 50) {
    fill(255);
      isFailed=false;
    
    }
  
    fill(235, 64, 52);
    noStroke()
  rect(748, 625, 150, 50,50);
  fill(0);
  textSize(20);
  text("Retry", 721, 633);
  pop();

}                                                                   //A retry button and failling screen will be displayed when the players fail to complete their task
function loadingSreen() {
  if(confirmAlpha===255&&p2Alpha===255){
     loadingCounter++
     if(loadingCounter>100){
      loadingCounter=0
      isloadingScreen=false
      isGuessGame=true
     }
  }

  let vert3rd = height/3;  
  push();
  textAlign(CENTER);
  textFont(fontRegular);
  background(240,240,240);
  fill(255);
  rect(width/3, (vert3rd * 2) + 35, 200, 50, 50);
  fill(0);
  text("Confirm", width/3, vert3rd * 2 + 40);
  text("Press space-bar to confirm", width/3, (vert3rd * 2) + 90);
  textSize(40);
  fill(0);
  pop();

  push();
  textAlign(CENTER);
  textFont(fontRegular);
  textSize(60);
  text("Program Code Name: **Alien Plant Comms**", width/2, vert3rd - 250);
  textSize(50);
  text("Brief:", width/2, vert3rd - 160);
  
  textAlign(LEFT);
  textWrap(WORD);
  textSize(40);
  text("Extraterrestrial alien lifeforms have been discovered in the topsoil. Our department has found a way to interface with these plant-like entities. We believe they may hold the key to offset CO2 levels in the atmosphere. Providing Oxygen at a rapid rate, and allowing us to return to the surface within the coming years.", width/2, vert3rd - 100, width - 500);
;
  text("We call upon the inhabitants of the Greenhouse underground to cooperate in pairs to upkeep the systems that allow us to grow our alien plant visitors and avoid contamination.", width/2, height/2 - 50, width - 500);

  textAlign(RIGHT);
  text("Identify the alien seeds, test your knowledge of earth flora, repair irrigation pipelines, and **communicate everything you see onscreen to your teammate**", width/2, height/2 + 95, width - 500);

  textAlign(CENTER)
  text("Cooperation among all species is essential to our success.", width/2, (vert3rd * 2) + 200, width - 500);
  pop();

  push();
  textAlign(CENTER);
  textFont(fontRegular);
  textSize(25);
  text("player **GAMMA**", width/2, (vert3rd * 2) + 70);
  text("player **DELTA** ", width/2 + 200, (vert3rd * 2) + 70);

  fill(255,0,0,confirmAlpha)
  ellipse(width/2, vert3rd * 2 + 20, 50, 50);
  
  fill(255,0,0,p2Alpha)
  ellipse(width/2 + 200, vert3rd * 2 + 20, 50, 50);
  pop();
}                                                                   //When both player pressed a key on their screen in loading phase, it will start the actual game
function ending(){
  isPipeGame=false;
  image(root1, width/2,height/2,width,height);
  image(root2, width/2,height/2,width,height);
  image(root3, width/2,height/2,width,height);
  image(root4,width/2,height/2,width,height)
  image(leaf1, width/2,height/2,width,height);
  image(leaf2, width/2,height/2,width,height);
  image(leaf3, width/2,height/2,width,height);
  image(leaf4,width/2,height/2,width,height)
  image(alien,width/2,height/2,width,height)
  push();
  textAlign(CENTER);
  noStroke();
  fill(141,134,184,150);
  rect(width/3,height/3,600,200,10);
  fill(255,0,0);
  textSize(55);
  textFont(fontRegular);
  text("incoming message ",(width/3) * 2 + 100 ,height - 80);

  textSize(25);
  text("Your root-computer networks are ours! We are ",width/3,319);
  text("converting your precious CO2 into deadly Oxigen.",width/3,349);
  textSize(35);
  
  text("Prepare for planetary invasion.",width/3,399);
  
  pop();
}                                                                   //Display the endings when players have completed all 3 levels
class pipeBlocks {
  constructor(x, y) {                                               //initilize coordinates and angle of each pipe
    this.x = 0;
    this.y = 0;
    this.toX = x;
    this.toY = y;
    this.angle = 0;
    this.rotate = false;
    this.target = this.angle + 90;
  }
  rotation() {                                                      //rotate the pipe 90 degrees and stop
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
  constructor() {                                                  //initilize coordinates and acceleration of each pipe
    this.x = random(464, 600);
    this.y = 62;
    this.yVelocity = random(1, 5);
    this.alpha = 255;
    this.acc = 0.05;
  }
  update() {                                                        //add acceleration to velocity and when y coordinate is below 1050, reset its position
    this.yVelocity += this.acc;
    this.y += this.yVelocity;
    this.alpha -= 1.3;
    if (this.y > 1050) {
      this.y = 57;
      this.yVelocity = random(1, 5);
    }
  }
  show() {                                                          //all water drop is in a shape of line
    var wgt = map(this.yVelocity, 1, 10, 0.5, 2);
    push();
    strokeWeight(wgt);
    stroke(187, 217, 238);
    line(this.x, this.y, this.x, this.y + 10);
    pop();
  }
}
