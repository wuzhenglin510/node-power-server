const assert = require("assert")
const ProxyTable = require("./proxy_table")

module.exports = class Config {

    constructor(config) {
        assert(typeof(config.port) != Number, "port must be an integer")
        this.port = config.port
        this.proxyTable = new ProxyTable()
        this.handlerDir = config ? config.handlerDir : null
        this.staticRoot = config ? config.staticRoot : null
        this.enableProxyLog = config.enableProxyLog ? true : false
    }
}