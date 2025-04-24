window.addEventListener("load", loadHandler);

let canvas = document.getElementById("artField");
let context = canvas.getContext("2d");
let colorPicker = document.getElementById("color");
let sizeSlider = document.getElementById("size");

function loadHandler(event) {
    console.log("Load handling...");

    context.strokeStyle = 'black';
    context.lineWidth = 20;

    colorPicker.addEventListener("input", (event) => context.strokeStyle = event.target.value)
    sizeSlider.addEventListener("input", (event) => context.lineWidth = event.target.value)

    resize(); // Resizes the canvas once the window loads 
    document.addEventListener('mousedown', startPainting); 
    document.addEventListener('mouseup', stopPainting); 
    document.addEventListener('mousemove', sketch); 
    // window.addEventListener('resize', resize); 
}

// Resizes the canvas to the available size of the window. 
function resize(){ 
//   context.canvas.width = window.innerWidth; 
//   context.canvas.height = window.innerHeight; 
} 
    
// Stores the initial position of the cursor 
let coord = {x:0 , y:0};  
   
// This is the flag that we are going to use to  
// trigger drawing 
let paint = false; 
    
// Updates the coordianates of the cursor when  
// an event e is triggered to the coordinates where  
// the said event is triggered. 
function getPosition(event){ 
  coord.x = event.clientX - canvas.offsetLeft; 
  coord.y = event.clientY - canvas.offsetTop; 
} 
  
// The following functions toggle the flag to start 
// and stop drawing 
function startPainting(event){ 
  paint = true; 
  getPosition(event); 
} 
function stopPainting(){ 
  paint = false; 
} 
    
function sketch(event){ 
  if (!paint) return; 
  context.beginPath(); 
    
  context.lineWidth = sizeSlider; 
   
  // Sets the end of the lines drawn 
  // to a round shape. 
  context.lineCap = 'round'; 
    
  context.strokeStyle = colorPicker; 
      
  // The cursor to start drawing 
  // moves to this coordinate 
  context.moveTo(coord.x, coord.y); 
   
  // The position of the cursor 
  // gets updated as we move the 
  // mouse around. 
  getPosition(event); 
   
  // A line is traced from start 
  // coordinate to this coordinate 
  context.lineTo(coord.x , coord.y); 
    
  // Draws the line. 
  context.stroke(); 
}

document.getElementById("clearButton").addEventListener("click", clearCanvas);

function clearCanvas() {
    context.clearRect(0,0, canvas.width,canvas.height);
}