var Camera = require('./camera.js');
var DiffRobot = require('./diffRobot.js');
var AppEvents = require('./app_events');
var BrowserManager = require('./browser_manager');

function App () {
    var ports = [
        9999, 9998, 9997, 9996, 9995, 9994, 9993 
    ];

    var camera = new Camera("", null, null, ports);
    var diffRobot = new DiffRobot();
    var browserManager = new BrowserManager(null, "", { width: 1024, height: 768 });

    var urls = [
        "http://localhost:3000/subscription",
        "http://localhost:3000/blog",
        "http://localhost:3000/contact-us",
        "http://localhost:3000/support",
        "http://localhost:3000/products", 
        "http://localhost:3000/services",
        "http://localhost:3000/about"
    ];

    browserManager.spinBrowsers(ports);

    browserManager.on(AppEvents.BROWSER_RELEASED, function (browsers) {
        camera.capture(urls, browsers);
    });
}

new App();
