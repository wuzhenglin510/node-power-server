const Table = require("./table")

module.exports = class Config {

    constructor(config) {
        this.proxyTable = new Table()
        this.handlerDir = config ? config.handlerDir : null
        this.staticRoot = config ? config.staticRoot : null
    }
}