var path = require('path');
var connect = requrie('connect');

function DiffRobot (baseImgDir, newImgDir) {
    this.baseImgDir = baseImgDir || 'baseImgs';
    this.newImgDir = newImgDir || 'newImgDir';
    this.server = connect().use(connect.static('test_server'));
}

DiffRobot.prototype.addToQue = function (filename) {
};

DiffRobot.prototype.diffImage = function (image1, image2, browser) {
    var self = this;

    browser.createPage(function(tab) {
        var image1Dir = path.join(self.baseImgDir, image1);
        var image2Dir = path.join(self.newImgDir, image2);

        tab.set('onConsoleMessage', function (msg) {
            console.log("Phantom Console: " + msg);
        });

        tab.set('onResourceRequested', function () {
            console.log("Resource requested..");
        });

        tab.set('onError', function() {
            console.log('error');
        });

        tab.set('onResourceError', function() {
            console.log('resource error');
        });

        tab.set('onLoadFinished', function (status) {
            console.log(status);
            tab.render('aha.png');
        });

        tab.set('onLoadStarted', function (status) {
            console.log('starting');
        });

        tab.evaluate(function (image1Dir, image2Dir) {
            console.log(image1Dir);
            console.log(image2Dir);
        }, function(err) {
        }, image1Dir, image2Dir);

    });
};

DiffRobot.prototype.drawDiffImage = function () {
}; 

DiffRobot.prototype.saveImageDiff = function (fileName) {
};

module.exports = DiffRobot;
