var Camera = require('./camera.js');
var DiffRobot = require('./diffRobot.js');
var AppEvents = require('./app_events');
var BrowserManager = require('./browser_manager');

function App () {
    var cameraPorts = [
        9999, 9998, 9997 
    ];

    var diffPort = [
        9992
    ];

    var camera = new Camera();
    var diffRobot = new DiffRobot();
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
        diffRobot.diffImage("first.png","second.png", browsers[0]);    
    });

    camera.on(AppEvents.BROWSER_RELEASED, function(browser) {
        browserManager.reclaimBrowser(browser);
    });
}

new App();
