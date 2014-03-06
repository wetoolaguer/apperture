var AppEvents = require('./app_events');
var util = require('util');
var phantom = require('phantom');
var async = require('async');
var events = require("events");

//helper methods
var generateFilename = function (key, imgDir) {
    key = key.replace(/http:\/\//,'');
    key = imgDir + key + ".png";
    return key;
};

//Camera class
var Camera = function (browsersConfig, imgDir) {
    var self = this;

    this.browsers = [];
    this.imgDir = imgDir || 'baseImgs/';

    var init = function (browsersConfig) {
        async.each(Object.keys(browsersConfig), function (port, callback) {
            var urlArr = browsersConfig[port].urls || [];
            var switches = browsersConfig[port].switches || ''; 
            var portObj = { port: port };

            self.createBrowser (switches, portObj, function(browser) {
                async.each(urlArr, function(url, callback) {
                    //use url as the filename for now
                    self.openAndCaptureTab(browser, url, generateFilename(url, self.imgDir), function () {
                        callback();
                    });
                }, function (err) {
                    //url array iteration done
                    browser.exit();
                });
            });

            callback();
        }, function (err) {
            //port iteration done
        });
    };

    init(browsersConfig);
};

util.inherits(Camera, events.EventEmitter);

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

    phantom.create.apply(phantom, createArgs);
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
                console.log("Failed to open" + url);
                self.emit(AppEvents.BROWSER_FAILED_OPEN);
                tab.close();
                callback();
            }
        });
    });
};


module.exports = Camera;
