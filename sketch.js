let video;
let poseNet;

// Right wrist
let rightWristX = 0;
let rightWristY = 0;

// Left wrist
let leftWristX = 0;
let leftWristY = 0;

// Right ankle
let rightAnkleX = 0;
let rightAnkleY = 0;

// Left ankle
let leftAnkleX = 0;
let leftAnkleY = 0;

// Paths for each body part
let rightWristPath;
let leftWristPath;
let rightAnklePath;
let leftAnklePath;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', gotPoses);

  // Hide the video element, and just show the canvas
  video.hide();
  
  // Initialize paths
  rightWristPath = new Path(255, 0, 0); // Red path for right wrist
  leftWristPath = new Path(0, 255, 0); // Green path for left wrist
  rightAnklePath = new Path(0, 0, 255); // Blue path for right ankle
  leftAnklePath = new Path(255, 255, 0); // Yellow path for left ankle
  
  // Create a save button
  saveButton = createButton('Save Drawing');
  saveButton.position(10, height-30 );

  // Add a mousePressed event listener to the button
  saveButton.mousePressed(saveDrawing);


}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    
    // Update right wrist position
    rightWristX = poses[0].pose.keypoints[10].position.x;
    rightWristY = poses[0].pose.keypoints[10].position.y;
    
    // Update left wrist position
    leftWristX = poses[0].pose.keypoints[9].position.x;
    leftWristY = poses[0].pose.keypoints[9].position.y;

    // Update right ankle position
    rightAnkleX = poses[0].pose.keypoints[16].position.x;
    rightAnkleY = poses[0].pose.keypoints[16].position.y;

    // Update left ankle position
    leftAnkleX = poses[0].pose.keypoints[15].position.x;
    leftAnkleY = poses[0].pose.keypoints[15].position.y;
  }
}

function modelReady() {
  select('#status').html();
}

function draw() {
  // Draw video on canvas
  image(video, 0, 0, width, height);
  
  // Add current positions to paths for each body part
  rightWristPath.add(rightWristX, rightWristY);
  leftWristPath.add(leftWristX, leftWristY);
  rightAnklePath.add(rightAnkleX, rightAnkleY);
  leftAnklePath.add(leftAnkleX, leftAnkleY);
  
  // Update and display each path
  rightWristPath.update();
  rightWristPath.display();
  
  leftWristPath.update();
  leftWristPath.display();
  
  rightAnklePath.update();
  rightAnklePath.display();
  
  leftAnklePath.update();
  leftAnklePath.display();


}

// Path class
class Path {
  constructor(r, g, b) {
    this.color = color(r, g, b);
    this.path = [];
    this.path.push(createVector(width/2, 0)); // Start path
  }
  
  add(x, y) {
    // Add a new point to the path
    this.path.push(createVector(x, y));
  }
  
  update() {
    // Shift the path up by one pixel each frame
    for (let i = 0; i < this.path.length; i++) {
      this.path[i].y -= 1;
    }
    
    // Remove the top point if it's off the top of the canvas
    if (this.path[0].y < 0) {
      this.path.splice(0, 1);
    }
  }
  
  display() {
    // Draw the path as a series of lines
    stroke(this.color);
    strokeWeight(4);
    noFill();
    
    beginShape();
    for (let i = 0; i < this.path.length; i++) {
      vertex(this.path[i].x, this.path[i].y);
    }
    endShape();
  }
}

function saveDrawing() {
  save('DrawingData.png');
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}


