var PortManager = function(startingPort) {
    this.startingPort = startingPort;
    this.ports = [];
};

PortManager.prototype.issuePort = function() {
    var self = this;
    var port = startingPort; 

    while (true) {
        if ((self.ports.indexOf(port) === -1)) {
            self.ports.push(port);
            return port;
        }

        port = port - 1;
    }
};

PortManager.prototype.retrievePort = function (port) {
    var index = this.ports.indexOf(port);
    return this.ports.splice(index, 1);
};

module.exports = PortManager;
