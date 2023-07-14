let fix = 240; // Make 'fix' a global variable

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(20);
}

function draw() {
  background(255);
  rotate(frameCount * 0.1);
  let zoom = 15; // control the size of the spiral
  createPattern(fix, zoom); // Use 'fix' global variable
}

function createPattern(fix, zoom) {
  var length = 0;
  var step = fix;
  var rotationAngle = 0;
  var magnify = zoom * height / 1000;
  var oldX = width/2;
  var oldY = height/2;
  var newX;
  var newY;

  stroke(0); // Change the pattern color to white

  for(var i = 0; i < 360; i++) {
    newX = length*(cos(rotationAngle))+oldX * 0.5 + width * 0.25; // Scaling down and centering
    newY = length*(sin(rotationAngle))+oldY * 0.5 + height * 0.25; // Scaling down and centering

    line(oldX,oldY,newX,newY);

    oldX = newX;
    oldY = newY;
    rotationAngle += step;
    length -= magnify;
  }
}

function mouseClicked() {
  fix = random(240, 250); // Change 'fix' to a random value between 150 and 350 when mouse is clicked
  console.log(fix); // Print the current value of 'fix' in the browser console
}
