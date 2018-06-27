module.exports = class ProxyTable {
    constructor() {
        this.rules = []
    }

    add(prefix, dst) {
        this.rules.push(new Rule(prefix, dst))
        return this
    }

}

class Rule {
    constructor(prefix, dst) {
        this.prefix = prefix
        this.dst = dst
    }
}