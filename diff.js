console.log("loaded");
var baseCanvas = document.getElementById("base-canvas");
var baseContext = baseCanvas.getContext('2d');

var newCanvas = document.getElementById("new-canvas");
var newContext = newCanvas.getContext('2d');

var diffCanvas = document.getElementById("diff-canvas");
var diffContext = diffCanvas.getContext('2d');
//var img = document.getElementById("test-img");

function diffImageData (firstVal, secondVal) {
    return firstVal === secondVal;
}

function drawDiff (x,y) {
    diffContext.fillRect(x,y,1,1);
} 

var newImg = new Image();
var baseImg = new Image ();

baseImg.onload = function () {
    //set base image
    var baseImageWidth = baseImg.width;
    var baseImageHeight = baseImg.height;

    baseCanvas.width = baseImageWidth;
    baseCanvas.height = baseImageHeight;

    baseContext.drawImage(baseImg, 0, 0);
    var baseImgData = baseContext.getImageData(0, 0, baseImageWidth, baseImageHeight).data;
    
    //set new image
    newCanvas.width = baseImageWidth;
    newCanvas.height = baseImageHeight;

    newContext.drawImage(newImg, 0,0);
    var newImgData = newContext.getImageData(0, 0, baseImageWidth, baseImageHeight).data;

    diffCanvas.width = baseImageWidth;
    diffCanvas.height = baseImageHeight;

    //iterate over image data
    for (var y=0; y < baseImageHeight; y++) {
        for (var x=0; x < baseImageWidth; x++) {

            var baseRed = baseImgData[((baseImageWidth * y) + x) * 4];
            var newRed = newImgData[((baseImageWidth * y) + x) * 4];

            if (!diffImageData(baseRed, newRed)) {
                drawDiff(x,y);
                continue;
            }

            var baseGreen = baseImgData[((baseImageWidth * y) + x) * 4 + 1];
            var newGreen = newImgData[((baseImageWidth * y) + x) * 4 + 1];

            if (!diffImageData(baseGreen, newGreen)) {
                drawDiff(x,y);
                continue;
            }

            var baseBlue = baseImgData[((baseImageWidth * y) + x) * 4 + 2];
            var newBlue = newImgData[((baseImageWidth * y) + x) * 4 + 2];

            if (!diffImageData(baseBlue, newBlue)) {
                drawDiff(x,y);
                continue;
            }

            //var baseAlpha = baseImgData[((baseImageWidth * y) + x) * 4 + 3];
            //var newAlpha = newImgData[((baseImageWidth * y) + x) * 4 + 3];

            //if (!diffImageData(baseAlpha, newAlpha)) {
            //}
        }
    }
};

newImg.src = "google2.png";
baseImg.src ="google.png";
