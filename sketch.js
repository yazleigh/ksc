let totalSlices = 16; // the number of slices the image will start with... should be divisable by 4
let cWidth = 600;
let cHeight = 600
let capture;
let vid;


function setup() {
    cnv = createCanvas(cWidth, cHeight);
    
  var constraints = {
    audio: false,
   // video: {
      //facingMode: {
       // exact: "environment"
      //}
   // }    
    video: {
      facingMode: "user"
    } 
  };
    
  capture = createCapture(constraints);
  capture.hide();
}

function draw() {
    // console.log(capture.loadedmetadata)
    if (capture.loadedmetadata == true) {
        //make sure the cursor is on the sketch
        if (mouseX >= 0 && mouseX <= cWidth && mouseY >= 0 && mouseY <= cHeight) { //mouse is over sketch
            background(0);
            //the width and height parameters for the mask
            var w = int(width / 3.2);
            var h = int(height / 3.2);
            //create a mask of a slice of the original image.
            var selection_mask;
            selection_mask = createGraphics(w, h); //creates an off screen renderer
            selection_mask.noStroke();
            selection_mask.beginShape();
           // selection_mask.smooth();  //causes graphics error in open processing
            selection_mask.arc(0, 0, 2 * w, 2 * h, 0, radians(370 / totalSlices + .1)); //adding a little extra to hide edges
            var wRatio = float(cWidth - w) / float(width);
            var hRatio = float(cHeight - h) / float(height);
            var slice = createImage(w, h);
            slice = capture.get(int((mouseX) * wRatio), int((mouseY) * hRatio), w, h);
            slice.mask(selection_mask);
            translate(width / 2, height / 2);
            var scaleAmt = 1.5 //2.3; //a circle by default at 1.6, 2.3 this will fill in the canvas, as the cost of losing the edges
            scale(scaleAmt);
            //apply slice in a circle
            for (k = 0; k <= totalSlices; k++) {
                rotate(k * radians(360 / (totalSlices / 2)));
                image(slice, 0, 0);
                scale(-1.0, 1.0);
                image(slice, 0, 0);
            }
            resetMatrix();
        }
    }
}
// Key functions change the number of slices and save the image
function keyPressed() {
    //   console.log(keyCode)
    switch (keyCode) {
        case 38: //up arrow
            totalSlices = (totalSlices + 4) % 64;
            if (totalSlices == 0) { //jump over zero
                totalSlices = 4;
            }
            //  console.log(totalSlices)
            break;
        case 40: //down arrow
            totalSlices = (totalSlices - 4) % 64;
            if (totalSlices == 0) { //jump over zero
                totalSlices = 64;
            }
            //    console.log(totalSlices)
            break;
        case 83: //s for save
            saveCanvas(cnv, 'kaleidoscope', 'jpg');
            break;
    }
}
