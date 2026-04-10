const EventEmitter = require('events');

class AppEmitter extends EventEmitter {
    constructor() {
        super();
    }
}

module.exports = AppEmitter;