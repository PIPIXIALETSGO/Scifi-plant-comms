var x=500
var y=500
function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  rect(50, 50, width - 100, 500);
}

function draw() {
  background(0);
  fill(255)
  rect(50, 50, width - 100, 500);
  textSize(10);
  fill(0, 0, 255);

  text(mouseX +","+ mouseY, mouseX, mouseY);
  pipeGame();
}
function pipeGame() {
    noStroke()
  triangle(89, 97, 102, 66, 109, 97);
  ellipse(99,95,19.5,19.5)
  //////straight horizontal pipe//////
fill(99, 98, 94)
rect(x,y,5,20)
fill(184, 181, 173)
rect(x+5,y+1,50,18)
fill(99, 98, 94)
rect(x+50,y,5,20)
  //////straight vertical pipe//////
  

}
