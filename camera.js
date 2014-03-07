var AppEvents = require('./app_events');
var util = require('util');
var phantom = require('phantom');
var async = require('async');
var events = require('events');

//helper methods
var generateFilename = function (key, imgDir) {
    key = key.replace(/http:\/\//,'');
    key = key.replace(/\//,'-');
    key = imgDir + key + ".jpg";
    return key;
};

var distributeWorkload = function (browserCount, urls) {
    var countPerBrowser = Math.ceil(urls.length/browserCount);
    var workArr = [];
    
    while (urls.length > 0) {
        var urlGroup = urls.splice(0, countPerBrowser);
        workArr.push(urlGroup);
    }

    return workArr;
};

//Camera class
var Camera = function (switches, imgDir, ports) {
    var self = this;

    this.browsers = [];
    this.switches = "";
    this.imgDir = imgDir || 'baseImgs/';
    this.ports = ports || [9999];
};

util.inherits(Camera, events.EventEmitter);

Camera.prototype.capture = function (urls, switches, imgDir, ports) { 
    var self = this;
    var captureSwitches = switches || this.switches; 
    var captureImgDir = imgDir || this.imgDir;
    var capturePorts = ports || this.ports;
    var captureBrowserCount = capturePorts.length; 

    var workArr = distributeWorkload(captureBrowserCount, urls);

    async.each(workArr, function(urls, callback) {
        var portObj = { port : capturePorts.pop() };

        self.createBrowser(captureSwitches, portObj, function(browser) {
            async.eachSeries(urls, function (url, callback) {
                var filename = generateFilename(url, self.imgDir);
                self.openAndCaptureTab(browser, url, filename , function () {
                    console.log("saving: " + filename);
                    callback();
                });
            }, function (err) {
                browser.exit();
                self.emit(AppEvents.BROWSER_CLOSED, portObj.port);
            });
        });

    }, function (err) {
        //port iteration done
    });
};


Camera.prototype.createBrowser = function (switches, port, callback) {
    var self = this;

    //We need to do the following expressions
    //because the count of switches is arbitrary
    var createCallback = function (browser) {
        self.browsers.push(browser);
        callback(browser);
    };

    var createArgs = switches.split(' '); 
    createArgs.push(port);
    createArgs.push(createCallback);

    phantom.create.apply(self, createArgs);
};

Camera.prototype.openAndCaptureTab = function (browser, url, filename, callback) {
    var self = this;
    browser.createPage(function(tab) {
        tab.open(url, function (status) {
            if (status === 'success') {
                tab.render(filename, function () {
                    self.emit(AppEvents.CAPTURED, filename, url); 
                    tab.close();
                    callback();
                });
            } else {
                //decide on how to show missed pages
                console.log("Failed to open " + url);
                self.emit(AppEvents.BROWSER_OPEND_FAILED);
                tab.close();
                callback();
            }
        });
    });
};

module.exports = Camera;
