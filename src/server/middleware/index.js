class MiddllewareManager {
    constructor() {
        this.beforeMiddlewares = []
        this.afterMiddlewares = []
    }

    add(pattern, middlewareFunc, execPoint = Constant.ExecBefore) {
        if (execPoint == Constant.ExecBefore) {
            this.beforeMiddlewares.push(new Middleware(pattern, middlewareFunc))
        } else {
            this.afterMiddlewares.unshift(new Middleware(pattern, middlewareFunc))
        }
    }
}

class Middleware {
    constructor(pattern, middlewareFunc) {
        this.pattern = pattern
        this.exec = middlewareFunc
    }
}

const Constant = {
    ExecBefore: "before",
    ExecAfter: "after"
}

module.exports = {
    Manager: MiddllewareManager,
    Constant: Constant
}