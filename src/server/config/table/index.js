module.exports = class Table {
    constructor() {
        this.rules = []
    }

    add(pattern, dst) {
        this.rules.push(new Rule(pattern, dst))
        return this
    }

    map(src) {
        if (this.rules.length == 0) throw new Error('should add one rule at least')
        for (let rule of this.rules) {
            let regex = new RegExp(rule.pattern)
            if (regex.test(src)) return rule
        }
        throw new Error(`may forget to specify rule for url(${src})`)
    }
}

class Rule {
    constructor(pattern, dst) {
        this.pattern = pattern
        this.dst = dst
    }
}