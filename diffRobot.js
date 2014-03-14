var path = require('path');
var connect = requrie('connect');

var DiffRobot = function (baseImgDir, newImgDir, camera) {
    this.baseImgDir = baseImgDir || 'baseImgs';
    this.newImgDir = newImgDir || 'newImgDir';
    this.server = connect().use(connect.static('test_server'));
    this.que = [];
    this.camera = camera;
    this.lastInQue = "";

    var init = function () {
        this.watchQue();
    };

    init();
};

DiffRobot.prototype.watchQue = function (callback) {
    var watchLoop = setInterval(function() {
        if (this.que.length > 0) {
            clearInterval (watchLoop);
            callback();
        }

        console.log('watching for files');
    }, 500); 
};

DiffRobot.prototype.addToQue = function (filename, last) {
    if (last) {
        this.lastInQue = filename;
    }

    this.que.push(filename);    
};

DiffRobot.prototype.captureDiff = function (url, browser, filename, size, callback) {
    this.camera.capture (url, browser, filename, size, callback);
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
            var diffUtil = new DiffUtil("base-canvas","new-canvas","diff-canvas"); 
            var diffResult = diffUtil.diff(image1Dir,image2Dir);

            return diffResult;
        }, function(result) {
        }, image1Dir, image2Dir);

    });
};

module.exports = DiffRobot;
