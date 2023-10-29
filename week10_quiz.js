// Create an empty array to store the songs
let songs = [];

// Set a variable to track the currently playing song
let currentSongIndex = 0;

// Declare a variable to store the FFT object
let fft;

// Create an array to store the radius of the outer ellipse
let ellipsesRadius = [];

// Number of outer ellipses
let numEllipses = 50;


function preload() {
  // Load five songs and store them in the songs array
  songs[0] = loadSound("drums.mp3");
  songs[1] = loadSound("noise.mp3");
  songs[2] = loadSound("complex.mp3");
  songs[3] = loadSound("saw-tooth.mp3");
  songs[4] = loadSound("sin-tone.mp3");
}

function setup() {
 
  createCanvas(700, 700);
  angleMode(DEGREES);
  // 创建一个新的FFT对象，并设置平滑和带宽
  fft = new p5.FFT(0.8, 64);
}


function draw() {
//Refresh Background
  background(30, 30, 30);
  textSize(18);
  noFill();
  stroke(255);
  strokeWeight(1);
  text('Mouse click to play or stop the music，', 20, 40);
  text('Press space for the next song.', 20, 70);
  
  //Move the coordinate system to the center of the canvas
  translate(width / 2, height / 2);

  noStroke();
  // Getting Spectrum Analysis Results
  let spectrum = fft.analyze();

  for (let i = 0; i < spectrum.length; i++) {
    
    // Mapping the index of a spectrum array to an angle
    let angle = map(i, 0, spectrum.length, 0, 360);
    
    // Get the amplitude of the current frequency
    let amp = spectrum[i];
    
    // Mapping amplitude to radius
    let r = map(amp, 0, 256, 30, 180);
    
    // Calculate the x and y coordinates of the ellipse
    let x = r * cos(angle);
    let y = r * sin(angle);
    
    ellipse(x, y, 10, 10);
    fill(255 - amp, 200 - amp, 255 - amp);
  }

  // Loop to draw the outer ellipse
  for (let i = 0; i < numEllipses; i++) {
    
    // Mapping the index of an ellipse to an angle
    let angle = map(i, 0, numEllipses, 0, 360);
    
    // Calculate the x and y coordinates of the ellipse
    let x = (200 + ellipsesRadius[i]) * cos(angle);
    let y = (200 + ellipsesRadius[i]) * sin(angle);
 
    // Update the radius of the ellipse
    let spectrumValue = spectrum[i % spectrum.length];
    ellipsesRadius[i] = map(spectrumValue, 0, 256, 10, 50);


    push();
    
    // Move the coordinates to the center of the ellipse
    translate(x, y);
    
    // rotating coordinate system
    rotate(angle);
    
    // Setting color values
    let C_r = map(spectrum[i], 0, 255, 0, 255);
    let C_g = 255 - C_r;
    let C_b = 50 + C_g;
    fill(C_r, C_g, C_b);
    
    ellipse(0, 0, 10 + ellipsesRadius[i], 20);
    pop();
  }
}

// Press space to switch to the next song
function keyPressed() {
  if (key === ' ') {
    songs[currentSongIndex].stop();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    songs[currentSongIndex].play();
  }
}

//Mouse click to play or stop
function mouseClicked() {

  if (songs[currentSongIndex].isPlaying()) {     
    songs[currentSongIndex].pause();   
  } else {
    songs[currentSongIndex].play();
  }
}
