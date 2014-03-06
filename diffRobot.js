function DiffRobot (baseImgDir, newImgDir) {
    this.baseImgDir = baseImgDir || 'baseImgs/';
    this.newImgDir = newImgDir || 'newImgDir/';

    var init = function () {
        console.log("DiffRobot created.");
    };
    
    init();
}

DiffRobot.prototype.diffImage = function (image1, image2) {
};

DiffRobot.prototype.drawDiffImage = function () {
}; 

DiffRobot.prototype.saveImageDiff = function (fileName) {
};

module.exports = DiffRobot;
