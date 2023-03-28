/**
scifi plant comms - plant interface
Leonardo Morales

This is the plant interface of the Scifi Plant Comms 2player cooperative game.
*/
 
"use strict";

let state = 'seedID' // possible states are 'seedID', 'growthPhase00', 'growthPhase01', 'growthPhase02'

// seed variables:
let seeds = [];
let seedNum = 3;
let seed;

//Plant phase variables:
let plantPhase0;
let plantPhase1;
let plantPhase2;

let plantPhase0_IMG;
let plantPhase1_IMG;
let plantPhase2_IMG;

// MQTT implementation variables:
let myName = "leo"; // Who are you? Make sure it matches the previous person's variable! 
let nextName = "jw"; // Who is next on the list? Make sure it matches the next person's variable!
let dataToSend;  // Variable to hold the data to send to the next person on the list


// MQTT client details. We are using a public server called shiftr.io. Don't change this. 
let broker = {
  hostname: 'public.cloud.shiftr.io',
  port: 443
};
let client;

let creds = {
  clientID: Math.random().toString(16).slice(3), 
  userName: 'public', 
  password: 'public' 
}
let topic = 'CART253'; // This is the topic we are all subscribed to

// End of MQTT client details 

/**
Preload loads image assets.
*/
function preload() {
  for (let i = 0; i < seedNum; i++) {
        let seedImage = loadImage(`assets/images/seed${i}.png`);
        seeds.push(seedImage);
    }
  
  plantPhase0_IMG = loadImage('assets/images/plantPhase0.png');
  plantPhase1_IMG = loadImage('assets/images/plantPhase1.png');
  plantPhase2_IMG = loadImage('assets/images/plantPhase2.png');
}


/**
setup creates the canvas and calls MQTT setup stuff
*/
function setup() {
    createCanvas(1500, 800);
    background(240);

    MQTTsetup(); // Setup the MQTT client

    //create seed object
        seed = new Seed(width/2, height/2, random(seeds));

    plantPhase0 = new PlantPhase(width/2, height/2, plantPhase0_IMG);
    plantPhase1 = new PlantPhase(width/2, height/2, plantPhase1_IMG);
    plantPhase2 = new PlantPhase(width/2, height/2, plantPhase2_IMG);

}


/**
Description of draw()
*/
function draw() {
    if (state == `seedID`) {
        seedID();
      } else if (state == `growthPhase00`) {
        growthPhase00();
      } else if (state == `growthPhase01`) {
        growthPhase01();
      } else if (state == `growthPhase02`) {
        growthPhase02();
      } 
    }

function seedID() {
  // display a seed:
     seed.display();
};

function growthPhase00() {
  plantPhase0.display();
};

function growthPhase01() {
  plantPhase1.display();
};

function growthPhase02() {
  plantPhase2.display();
};

/**
Seed class:
*/
class Seed {
    constructor (x, y, shape) {
        this.x = x;
        this.y = y;
        this.shape = shape;
    }
    
    display() {
        push();
        imageMode(CENTER);
        image(this.shape, this.x, this.y, width, height);
        pop();
    }
}

/**
 Plant Phase class:
 */
class PlantPhase {
  constructor (x, y, image) {
      this.x = x;
      this.y = y;
      this.image = image;
  }
  
  display() {
      push();
      imageMode(CENTER);
      image(this.image, this.x, this.y, width, height);
      pop();
  }
}

function mousePressed(){ 
    // Sends a message on mouse pressed to test. You can use sendMQTTMessage(msg) at any time, it doesn't have to be on mouse pressed. 
    // sendMQTTMessage(mouseX, mouseY); // This function takes 1 parameter, here I used a random number between 0 and 255 and constrained it to an integer. You can use anything you want.

    if (state === `seedID`) {
      state = 'growthPhase00';
    } else if (state === `growthPhase00`) {
      state = 'growthPhase01';
    } else if (state === `growthPhase01`) {
      state = 'growthPhase02';
    } else if (state === `growthPhase02`) {
      state = 'seedID';
    } 

  }

  // When a message arrives, do this: 
function onMessageArrived(message) {
    let dataReceive = split(trim(message.payloadString), "/");// Split the incoming message into an array deliniated by "/"
    console.log("Message Received:");
    console.log(String(dataReceive[1])); 
  // 0 is who its from
  // 1 is who its for
  // 2 is the data
    if(dataReceive[1] == myName){ // Check if its for me
      console.log("Its for me! :) ");
      console.log(dataReceive[2]);
      console.log(dataReceive[3]);
    } else {
      console.log("Not for me! :( ");
    }
    if(int(dataReceive[3]) > 10){ 
      console.log("yes!");
    } else { 
      console.log("nope");
    }
  }
  
  // Sending a message
  function sendMQTTMessage(msg, msg2) {
        message = new Paho.MQTT.Message(myName + "/" + nextName+"/"+msg + "/"+msg2); // add messages together: 
  // My name + Next name + data separated by / 
        message.destinationName = topic;
        console.log("Message Sent!");
        client.send(message);
  }
  
  // Callback functions
  function onConnect() {
    client.subscribe(topic);
    console.log("connected");
    // is working
  }
  function onConnectionLost(response) {
    if (response.errorCode !== 0) {
      // If it stops working
    }
  }
  function MQTTsetup(){
    client = new Paho.MQTT.Client(broker.hostname, Number(broker.port), creds.clientID);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
          onSuccess: onConnect,
      userName: creds.userName, // username
      password: creds.password, // password
      useSSL: true
    });
  }