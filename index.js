var config = require('./config.js');
var Camera = require('./camera.js');
var DiffRobot = require('./diffRobot.js');
var AppEvents = require('./app_events');

function App (config) {
    var ports = [
        9999, 9998, 9997, 9996, 9995, 9994, 9993, 9992 
    ];

    var camera = new Camera("", "baseImgs/", ports);
    var diffRobot = new DiffRobot();

    var urls = [
        "http://localhost:3000/subscription",
        "http://localhost:3000/blog",
        "http://localhost:3000/contact-us",
        "http://localhost:3000/support",
        "http://localhost:3000/products", 
        "http://localhost:3000/services",
        "http://localhost:3000/about"
    ];

    camera.capture(urls);
    camera.on(AppEvents.BROWSER_CLOSED, function (port) {
        console.log( "Closed port: " + port);
    });
}

new App(config);
