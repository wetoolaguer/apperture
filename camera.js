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
var Camera = function (switches, screenSize, imgDir, ports) {
    var self = this;

    this.browsers = [];
    this.screenSize = screenSize || { width: 1280, height: 720 } ;
    this.imgDir = imgDir || 'baseImgs/';
    this.ports = ports || [9999];
};

util.inherits(Camera, events.EventEmitter);

Camera.prototype.capture = function (urls, browsers, size) { 
    var self = this;
    var browserScreenSize = size || this.screenSize;
    var browserCount = browsers.length; 

    var workArr = distributeWorkload(browserCount, urls);

    async.each(workArr, function(urls, callback) {
        var browser = browsers.pop();
        async.eachSeries(urls, function (url, callback) {
            var filename = generateFilename(url, self.imgDir);
            self.openAndCaptureTab(url, browser, filename, browserScreenSize, function () {
                console.log("saving: " + filename);
                callback();
            });
        }, function (err) {
            self.emit(AppEvents.BROWSER_RELEASED, browser);
        });

    }, function (err) {
        //works iteration done
    });
};

Camera.prototype.openAndCaptureTab = function (url, browser, filename, size, callback) {
    var self = this;
    browser.createPage(function(tab) {
        tab.set('viewportSize', size, function () {
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
    });
};

module.exports = Camera;
