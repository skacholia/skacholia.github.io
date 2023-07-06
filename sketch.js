var stars = [];
var numStars = 200; // Number of stars
  

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
  // Create stars with random positions and speeds
  for (let i = 0; i < numStars; i++) {
    stars[i] = {
      x: random(width),
      y: random(height),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5)
    };
  }
}

function draw() {
  background(0);
  drawStars();
  
  
  // Map mouseX and mouseY to appropriate ranges for fix and zoom
  let mappedFix = map(mouseX, 0, width, 0, 360);
  let mappedZoom = map(mouseY, 0, height, 0.1, 1);

  // Blend mouse-controlled rotation with time-based rotation
  let blendedFix = (mappedFix * 0.5) + (frameCount * 0.01 % 360) * 0.15;
  createPattern(blendedFix + 10, mappedZoom);
}

// Function to draw starry background
function drawStars() {
  fill(255);
  for (let star of stars) {
    // Update star position
    star.x += star.speedX;
    star.y += star.speedY;
    
    // Wrap star around to the other side of the screen if it goes off the edge
    if (star.x < 0) star.x = width;
    if (star.x > width) star.x = 0;
    if (star.y < 0) star.y = height;
    if (star.y > height) star.y = 0;
    
    // Draw star
    ellipse(star.x, star.y, 2, 2);
  }
}

function createPattern (fix, zoom) {
  var length = 0;
  var step = fix;
  var rotationAngle = 0;
  var magnify = zoom * height / 1000;
  var oldX = width/2;
  var oldY = height/2;
  var newX;
  var newY;

  stroke(255); // Change the pattern color to white

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
function mousePressed() {
    // Existing mousePressed code...
    // Check if a tab was clicked
    for (let tab of tabs) {
      let d = dist(mouseX, mouseY, tab.x, tab.y);
      if (d < 50) {
        tab.action();
      }
    }
  }
  
