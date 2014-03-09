var AppEvents = require('./app_events');
var util = require('util');
var phantom = require('phantom');
var async = require('async');
var events = require('events');

var BrowserManager = function (ports, switches) {
    this.ports = ports || 9999;
    this.switches = switches || "";
};

util.inherits(BrowserManager, events.EventEmitter);

BrowserManager.prototype.spinBrowsers = function (ports, switches, callback) {
    var self = this;
    var browserSet = [];
    var capturePorts = ports || this.ports;
    var captureSwitches = switches || this.switches;

    async.each(capturePorts, function(port, callback) {
        var portObj = { port : port };

        self.createBrowser(captureSwitches, portObj, function(browser) {
            browserSet.push(browser);
            callback();
        });

    }, function (err) {
        callback(browserSet);
    });
};

BrowserManager.prototype.createBrowser = function (switches, port, callback) {
    var self = this;

    //We need to do the following expressions
    //because the count of switches is arbitrary
    var createCallback = function (browser) {
        callback(browser);
    };

    var createArgs = switches.split(' '); 
    createArgs.push(port);
    createArgs.push(createCallback);

    phantom.create.apply(self, createArgs);
};

BrowserManager.prototype.reclaimBrowser = function (browser) {
    browser.exit();
};

module.exports = BrowserManager;
