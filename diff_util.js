var DiffUtil = function(baseCanvas, newCanvas, diffCanvas) {
    var self = this;

    this.baseCanvas = null;
    this.baseContext = null;

    this.newCanvas = null;
    this.newContext = null;

    this.diffCanvas = null;
    this.diffContext = null;

    this.baseImage = new Image();
    this.newImage = new Image();

    this.diffResult = false;

    var init = function (baseCanvas, newCanvas, diffCanvas) {
        self.baseCanvas = document.getElementById(baseCanvas);
        self.newCanvas = document.getElementById(newCanvas);
        self.diffCanvas = document.getElementById(diffCanvas);

        if (!(self.baseCanvas && self.newCanvas && self.diffCanvas)) {
            throw new Error ("Canvas element missing!");
        }

        self.baseContext = self.baseCanvas.getContext('2d');
        self.newContext = self.newCanvas.getContext('2d');
        self.diffContext = self.diffCanvas.getContext('2d');
    };

    init(baseCanvas, newCanvas, diffCanvas);
};

//var img = document.getElementById("test-img");
DiffUtil.prototype.diff = function (baseImage, newImage) {
    var self = this;

    function diffImageData (firstVal, secondVal) {
        //set this.diffResult
        if (!self.diffResult) {
            self.diffResult = true;
        }

        return firstVal === secondVal;
    }

    function drawDiff (x,y) {
        self.diffContext.fillRect(x,y,1,1);
    } 
    
    this.baseImage.src = baseImage; 
    this.newImage.src = newImage;

    this.baseImage.onload = function () {
        var baseImageWidth = self.baseImage.width;
        var baseImageHeight = self.baseImage.height;

        self.baseCanvas.width = baseImageWidth;
        self.baseCanvas.height = baseImageHeight;

        self.baseContext.drawImage(self.baseImage, 0, 0);
        var baseImgData = self.baseContext.getImageData(0, 0, baseImageWidth, baseImageHeight).data;
        
        //set new image
        self.newCanvas.width = baseImageWidth;
        self.newCanvas.height = baseImageHeight;

        self.newContext.drawImage(self.newImage, 0,0);
        var newImgData = self.newContext.getImageData(0, 0, baseImageWidth, baseImageHeight).data;

        self.diffCanvas.width = baseImageWidth;
        self.diffCanvas.height = baseImageHeight;

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

        return self.diffResult;
    };
};
