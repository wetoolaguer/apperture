var path = require('path');
var connect = requrie('connect');

var DiffRobot = function (baseImgDir, newImgDir, browser, camera) {
    this.baseImgDir = baseImgDir || 'baseImgs';
    this.newImgDir = newImgDir || 'newImgDir';
    this.server = connect().use(connect.static('test_server'));
    this.que = [];
    this.camera = camera;
    this.browser = browser;
    this.lastInQue = "";
    this.readyForCycle = true;
    this.watchLoop = null;

    var init = function () {
        this.initDiffCycle();
    };

    init();
};

DiffRobot.prototype.initDiffCycle = function () {
    var self = this;

    if (!(this.browser || this.camera)) {
        throw new Error ('Browser or camera undefined.');
    }

    this.watchQue(function (file) {
        //set to indicate that it's already in the cycle
        this.readyForCycle = false;

        self.diffImage (file, file, function (result) {
            //capture the diff image if result is true
            if (result) {

            }
        });
    }); 
};

DiffRobot.prototype.watchQue = function (callback) {
    var self = this;

    if (!this.watchLoop || this.watchLoop === -1) {
        self.watchLoop = setInterval(function() {
            if (self.que.length > 0 && this.readyForCycle) {
                callback(self.que.shift);
            }
            console.log('watching for files');
        }, 500); 
    }
};

DiffRobot.prototype.releaseWatchQue = function () {
    if (this.watchLoop && this.watchLoop._idleTimeout > -1) {
        clearInterval(this.watchLoop); 
    }
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

DiffRobot.prototype.diffImage = function (image1, image2, browser, callback) {
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
            callback(result);
        }, image1Dir, image2Dir);

    });
};

module.exports = DiffRobot;
