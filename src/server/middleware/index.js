class MiddllewareManager {
    constructor() {
        this.middlewares = []
    }

    add(pattern, middlewareFunc, execPoint = Constant.ExecBefore) {
        if (execPoint == Constant.ExecBefore) {
            this.middlewares.push(before_middleware_builder(pattern, middlewareFunc))
        } else {
            this.middlewares.push(after_middleware_builder(pattern, middlewareFunc))
        }
        return this
    }
}

function before_middleware_builder(pattern, middlewareFunc) {
    return async (ctx, next) => {
        let regex = new RegExp(pattern)
        if (regex.test(ctx.url)) {
            await middlewareFunc(ctx, next)
        } else {
            await next()
        }
    }
}

function after_middleware_builder(pattern, middlewareFunc) {
    return async (ctx, next) => {
        await next()
        let regex = new RegExp(pattern)
        if (regex.test(ctx.url)) {
            await middlewareFunc(ctx, next)
        }
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