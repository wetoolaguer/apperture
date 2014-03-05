var config = require('./config.js');
var Shutter = require('./shutter.js');
var DiffRobot = require('./diffRobot.js');

function App (config) {
    var shutter = new Shutter();
    var diffRobot = new DiffRobot();

    phantom.exit();
}

new App(config);
