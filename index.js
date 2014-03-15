var Camera = require('./camera.js');
var DiffRobot = require('./diffRobot.js');
var AppEvents = require('./app_events');
var BrowserManager = require('./browser_manager');

function App () {
    var self = this;

    var cameraPorts = [
        9999, 9998, 9997 
    ];

    var diffPort = [
        9992
    ];

    this.camera = new Camera();
    this.diffRobot = null;

    var browserManager = new BrowserManager(cameraPorts, "--ignore-ssl-errors=true");

    var urls = [
        "http://localhost:3000/subscription",
        "http://localhost:3000/blog",
        "http://localhost:3000/contact-us",
        "http://localhost:3000/support",
        "http://localhost:3000/products", 
        "http://localhost:3000/services",
        "http://localhost:3000/about"
    ];

    //browserManager.spinBrowsers(null, null, function (browsers) {
        //camera.capture(urls, browsers);
    //});

    browserManager.spinBrowsers(diffPort, "--local-to-remote-url-access=true", function (browsers) {
        self.diffRobot = new DiffRobot(null, null, browsers[0], camera);
    });

    camera.on(AppEvents.BROWSER_RELEASED, function(browser) {
        browserManager.reclaimBrowser(browser);
    });

    camera.on(AppEvents.CAPTURED, function (filename, url) {
        diffRobot.addToQue(filename);
    });

}

new App();
