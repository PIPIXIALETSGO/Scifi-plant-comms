var x = 0;
var y = 0;
var angle = 0;
var pipes = [];
var waterDrop = [];
var numOfPipes = 11;
var level = 3;
var xCor = 500;
var yCor = 250;
var randomAngle = [0, 90, 180, 270];
var isPipeGame = true;
var isGuessGame = false;
var isloadingScreen = false;
var isFailded = false;
var isEnded=false
var waterTime = false;
var isLoaded = false  ;
var hint = true;
var rX = 0;
var rY = 0;
const FRAME_RATE = 30;
var hintAlpha = 255;
var barAlpha = 0;
var confirmAlpha = 0;
var p2Alpha = 0;
var loadingCounter = 0;
var mouse = false;
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
  root4,
  leaf1,
  leaf2,
  leaf3,
  leaf4,
  con1,
  con2,
  con3,
  alien,
  beep,
  waterSound,
  fontRegular;
var countDown = 20; 
var stepCount = 20;
var selectedImg = 0;
var buttonAlpha = 100;
var targetSeed;
var numofDrops = 100;
var waterTimer = 0;
/////////////////////// MQTT variables v////////
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
var winCon2 = [
  { position: 4, angle: 270, isMatched: 0 },
  { position: 5, angle: 0, isMatched: 0 },
  { position: 6, angle: 0, isMatched: 0 },
  { position: 8, angle: 90, isMatched: 0 },
  { position: 9, angle: 180, isMatched: 0 },
  { position: 10, angle: 90, isMatched: 0 },
];
var winCon3 = [
  { position: 0, angle: 270, isMatched: 0 },
  { position: 1, angle: 0, isMatched: 0 },
  { position: 2, angle: 270, isMatched: 0 },
  { position: 3, angle: 270, isMatched: 0 },
  { position: 4, angle: 90, isMatched: 0 },
  { position: 5, angle: 180, isMatched: 0 },
  { position: 6, angle: 90, isMatched: 0 },
];// stores the correct path and orientations of pipes 
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
  root4 = loadImage("./assets/images/root4.png");
  leaf1 = loadImage("./assets/images/leaf1.png");
  leaf2 = loadImage("./assets/images/leaf2.png");
  leaf3 = loadImage("./assets/images/leaf3.png");
  leaf4 = loadImage("./assets/images/leaf4.png");
  alien = loadImage("./assets/images/alien.png");

  con1 = loadImage("./assets/images/con1.png");
  con2 = loadImage("./assets/images/con2.png");
  con3 = loadImage("./assets/images/con3.png");
  beep = loadSound('assets/sounds/beep.mp3')
  waterSound=loadSound('assets/sounds/water.mp3')
}// preload all the images and audios before the lauching the website
function setup() {
  createCanvas(windowWidth, windowHeight);
  MQTTsetup();
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  beep.setVolume(1)
  if (level === 0) {
    createPipe(280, 180, 11, 1, pattern);
  }//when level is 0, initialize all the pipe particles
  for (var ii = 0; ii < numofDrops; ii++) {
    waterDrop[ii] = new water();
  }//initialize water drop particles
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
      stepCount--;
    } else if (dataReceive[2] === "hintComplete") {
      hint = true;
    }
  }
}// function will excute when the  name is matched 
function sendMQTTMessage(x) {
  message = new Paho.MQTT.Message(myName + "/" + nextName + "/" + x);
  message.destinationName = topic;
  client.send(message);
}// A function that sends message to another device
function onConnect() {
  client.subscribe(topic);
  console.log("connected");
}//diplay connected when MQTT is connected
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("error");
  }
}//display an error message when something goes wrong during the connection
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
}// initialization of MQTT
function draw() {
  if (isloadingScreen) {       //display the loading page when the boolean(isloadingScreen) is true    
    loadingScreen();
  } else {           
    image(backgroundImg, width/2, height/2, width, height);  //draw background image
    plantPhase(level);                                       //display the plants next the console
    if (isGuessGame) {                                       //display the quesiton box if guess game starts
      image(guessBox, 1521, 510, width, height);
    }
    interface();                                             //display all the buttons and console 
    if (isPipeGame) {                                        //when pipe puzzle starts, turn off the guess game
      isGuessGame = false; 
      pipeGame(level);                                       //display the water and plant icon on console
      if (level === 1 && isLoaded === false) {               //call the function to initialize the position, number of pipes and pipe shape based on the level
        numOfPipes = 12;
        createPipe(
          280,
          180,
          numOfPipes,
          1,
          pattern
        );
        isLoaded = true;                                  
      }else if (level === 2 && isLoaded === false) {
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
      displayPipe();                                        //call the function to load all the pipe s
      checkWinCon();                                        //call the function to check the win condition 
      stroke(0);
      if (hint) {                                           //when hint is unlocked, fade out the wrong blocks
        hintAlpha -= 2;
        barAlpha += 1;
      }
    }
    if (isGuessGame) {                                     //display the 3 images of the seeds and a red border around it when it's been seletcted 
      push();
      fill(0,200)
      textSize(40)
      textFont(fontRegular);
      text("Which one is the right one?", 160, 135);
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
    
  }
  plantPhase(level);
  if(isEnded===true){                                                    //show the ending screen when isEnded is true
    ending()
  }
  if (isFailded) {                                                       //show the failling screen when isFailed is true
    failScreen();
  }
  win(3)
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
} //In this function, I used a library call animS which helps to do the simple linear animation, it will animate the water flow based on the level
function timer() {                                                      
  push();
  noStroke();
  fill(0);
  fill(258, 37, 100);
  textSize(100);
  textFont(fontRegular);
  // text(8888, 900, 150);
  if (isGuessGame) {
    text("Timer:   ", 50, 722);
    text(countDown, 300, 722);
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
    text("steps:", 50, 722);
    text(stepCount, 350, 722);
    if (stepCount === 0) {
      sendMQTTMessage("fail");
      isFailded = true;
    }
  }

  pop();
} //A function that display a timer at the bottom of screen when it's been called. And based on the game, it will choose to be a countdown or stepcounts
function interface() {                     
  image(device, 653, 380, 1300, 750);
  leftButton();
  middleButton();
  rightButton();
  timer();
}//A function that contains all elements of the console
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
}//display the right arrow button, and change seleted image to the one on the right hand side
function middleButton() {
  if (isGuessGame) {
    var d = dist(mouseX, mouseY, 308, 580);
    if (d < 60 && mouse) {
      if (selectedImg === seedNumber) {
        sendMQTTMessage("guessComplete");
        waterSound.play()
        waterTime = true;
      } else {
        beep.play()
        countDown -= 5;
      }
    }
  }
  image(middleb, -100, 285, 1500, 1100);
}//display the check mark  button, when it's been pressed. Check the answer and will send a message to another device if the puzzle is solved
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
}//display the left arrow button, and change seleted image to the one on the left hand side
function displayPipe() {
  for (var ii = 0; ii < numOfPipes; ii++) {
    pipes[ii].rotation(rX, rY);
    pipes[ii].display();
  }
}//A function loops all the methods in particle class
function displayWater() {
  if (waterTime) {                                     //when watertime is true, display the water drop particles
    for (var ii = numofDrops - 1; ii >= 0; ii--) {
      waterDrop[ii].update();
      waterDrop[ii].show();
    }
    if (waterTimer < 400) {                           //a timer to track how long you want the drops last 
      waterTimer++;

    } else {
      if(level===3){                                  //if current level is 3, it will show the ending screen when watering phase is completed
        isGuessGame = false;
        waterTime = false;
        isLoaded = false;
        waterTimer = 0;
        isEnded=true
      }                                              //reset some booleans and goes to the next level
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
} //a boolean called mouse will be true when mouse is clicked
function keyPressed() {
  if (isloadingScreen) {
    confirmAlpha = 255;
    sendMQTTMessage("ready");
  }

} // send ready to another device when key is pressed during the loading  screen                                                
function createPipe(xCor, yCor, n, l, pattern) {
  if (l === 1) {
    waterTimer=0
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
}//change the x and y offset based on the level and initialize pipe particles
function reset() {
  if (level === 0) {
    createPipe(280, 180, 11, 1, pattern);
  }
  mouse = false;
  isLoaded = false;
  hint = false;
  isFailded = false;
  hintAlpha = 255;
  stepCount = 20;
  countDown=30
  barAlpha = 0;
  pipes = [];
}//a function to reset some variables when its needed
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
      waterSound.play()
      sendMQTTMessage("water");
      // isLoaded = false;
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
      waterSound.play()
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
      waterSound.play()
      win(3);
      
    }
  }
}//loops over all the win condition of pipe puzzle, and it will add 1 credit when a pipe is placed at the right direction. If credits equal to number of pipes that need to be rotated, it will start watering and goes to next level
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
      fill(6, 56, 143, barAlpha);
      rect(225, 280, 10, 50, 100);
      fill(5, 66, 28, barAlpha);
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
      fill(6, 56, 143, barAlpha);
      rect(480, 225, 50, 10);
      fill(5, 66, 28, barAlpha);
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
      fill(6, 56, 143, barAlpha);
      rect(535, 180, 10,50,50);
      fill(5, 66, 28, barAlpha);
      rect(180, 335, 50, 10,50);
    }
  }
  pop();
}//A function display the water and plant logo during the pipe puzzle
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
  if(isGuessGame||isPipeGame){
    image(box, 850, 370, 1300, 750);
  }

}//display the plants next the console based on which level it is right now
function failScreen() {
  image(con1, 1800, -400, 4000, 3000);
  image(con2, 1800, -400, 4000, 3000)
  image(con3, 1800, -400, 4000, 3000);
  push();
  fill(247, 114, 154);
  textSize(60);
  text("Plant specimen has been contaminated!!", 260, 361);
  var d = dist(mouseX, mouseY, 748, 625);
  if (d < 50) {
       reset()
  }
    fill(235, 64, 52);
    noStroke()
  rect(748, 625, 150, 50,50);
  fill(0);
  textSize(20);
  text("Retry", 721, 633);
  pop();
}//A retry button and failling screen will be displayed when the players fail to complete their task
function loadingScreen() {
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
 rect(width/3, (vert3rd * 2) + 100, 200, 50, 50);
 fill(0);
 text("Confirm", width/3, vert3rd * 2 + 110);
 text("Press space-bar to confirm", width/3, (vert3rd * 2) + 70);
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
 textSize(30);
 text("Extraterrestrial alien lifeforms have been discovered in the topsoil. Our department has found a way to interface with these plant-like entities. We believe they may hold the key to offset CO2 levels in the atmosphere. Providing Oxygen at a rapid rate, and allowing us to return to the surface within the coming years.", width/2, vert3rd - 100, width - 500);
;
 text("We call upon the inhabitants of the Greenhouse underground to cooperate in pairs to upkeep the systems that allow us to grow our alien plant visitors and avoid contamination.", width/2, height/2 -60, width - 500);

 textAlign(RIGHT);
 text("Identify the alien seeds, test your knowledge of earth flora, repair irrigation pipelines, and **communicate everything you see onscreen to your teammate**", width/2-70, height/2 + 65, width - 500);

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
 ellipse(width/2, vert3rd * 2+100, 50, 50);
 
 fill(255,0,0,p2Alpha)
 ellipse(width/2 + 200, vert3rd * 2 + 100, 50, 50);
 pop();
}//When both player pressed a key on their screen in loading phase, it will start the actual game
function ending(){
  isPipeGame=false
  image(root1, 750, 360, 1700, 750);
  image(root2, 750, 370, 1700, 750);
  image(root3, 750, 380, 1700, 750);
  image(root4,width/2,height/2,width,height)
  image(leaf1, 700, 340, 2000, 1000);
  image(leaf2, 750, 340, 2000, 1000);
  image(leaf3, 950, 375, 1700, 750);
  image(leaf4,width/2,height/2,width,height)
  image(alien,width/2,height/2,width,height)
  push()
  noStroke()
  fill(141,134,184,150)
  rect(width-500,height/2,600,200,10)
  fill(255,0,0)
  textSize(55)
  textFont(fontRegular)
  text("incoming message ",122,710)
  textSize(25)

  text("Your root-computer networks are ours! We are ",800,319)
  text("converting your precious CO2 into deadly Oxigen.",800,349)
  textSize(35)
  
  text("Prepare for planetary invasion.",819,399)
  
  pop()
}//Display the endings when players have completed all 3 levels
class pipeBlocks {
  constructor(x, y, pattern) {
    this.x = 0;
    this.y = 0;
    this.toX = x;
    this.toY = y;
    this.angle = randomAngle[round(random(0, 3))];
    this.pattern = pattern;
    this.rotate = false;
    this.target = this.angle + 90;
  } //initilize coordinates and angle of each pipe
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
  } //rotate the pipe 90 degrees and stop
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
  }//the shape of pipes will be different based on the level
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
  }//A method to check if the pipe is rotated to the correct angle that connect the plant logo and water logo together
}
class water {
  constructor() {
    this.x = random(1090, 1177);
    this.y = 57;
    this.yVelocity = random(1, 5);
    this.alpha = 255;
    this.acc = 0.05;
  } //initilize coordinates and acceleration of each pipe
  update() {
    this.yVelocity += this.acc;
    this.y += this.yVelocity;
    this.alpha -= 1.3;
    if (this.y > 1050) {
      this.y = 57;
      this.yVelocity = random(1, 5);
    }
  }//add acceleration to velocity and when y coordinate is below 1050, reset its position
  show() {
    var wgt = map(this.yVelocity, 1, 10, 0.5, 2);
    push();
    strokeWeight(wgt);
    stroke(187, 217, 238);
    line(this.x, this.y, this.x, this.y + 10);
    pop();
  } 
}
