const fs = require("fs")
const path = require("path")
const assert = require("assert")
const log4js = require("log4js")
const Koa = require("koa")
const Koa_Static = require("koa-static")
const Koa_Body = require("koa-body")
const EventEmitter = require('events').EventEmitter
const Config = require("./config")
const Middleware = require("./middleware")
const goProxy = require("./proxy")

module.exports = class Server extends EventEmitter {
    constructor(config) {
        super();
        assert(typeof(config.port) != Number, 'port must be an integer')
        this._port = config.port
        assert(config.logDir, 'logDir must be set')
        this._logDir = config.logDir
        this._server = new Koa()
        this._server.use(Koa_Body())
        this.config = new Config(config)
        this.middlewares = new Middleware.Manager()
        this.apis = []
        log4js.configure({
            appenders: {
              server: { type: 'dateFile', filename: `${path.join( this._logDir, 'server.log')}` }
            },
            categories: {
              default: { appenders: [ 'server' ], level: 'debug' },
              server: { appenders: [ 'server' ], level: 'debug' }
            }
        });
        this.log = log4js.getLogger("server");
    }

    start() {
        this._initHandlerDir()
        this._initStatic()
        this._initExecutor()
        this._server.listen(this._port)
        this.log.info(`server started suceessfully, binding to port ${this._port}`)
        this.emit("started")
    }

    _initHandlerDir() {
        if (this.config.handlerDir) {
            let apiNames = fs.readdirSync(this.config.handlerDir).filter(filename => {
                return fs.lstatSync(path.join(this.config.handlerDir, filename)).isDirectory()
            })
            this.apis = apiNames
            this.log.info(`successful scaning local api with:\n ${JSON.stringify(apiNames, null, 4)}`)
        }
    }

    _initStatic() {
        if (this.config.staticRoot) {
            this._server.use(Koa_Static(this.config.staticRoot))
            this.log.info(`static resources located in ${this.config.staticRoot}`)
        }
    }

    _initExecutor() {
        this._server.use(async (ctx) => {
            let originUrl = `${ctx.request.protocol}://${(ctx.request.host + ctx.request.url)}`
            for (let middleware of this.middlewares.beforeMiddlewares) {
                let regex = new RegExp(middleware.pattern)
                    if (regex.test(ctx.url)) {
                        await middleware.exec(ctx)
                    }
            }
            let hasMapLocalApi = false
            if (this.apis.length > 0) {
                for (let api of this.apis) {
                    let regex = new RegExp(api) 
                    if (regex.test(request.originalUrl)) {
                        this.log.info(`[map local api]: ${originUrl}`)
                        hasMapLocalApi = true
                        await require(path.join(this.config.handlerDir, api)(ctx))
                    }
                    break
                }
            }
            if (hasMapLocalApi == false) {
                this.log.info(`[go proxy]: ${originUrl}`)
                await this._processProxy(ctx)
            }
            for (let middleware of this.middlewares.afterMiddlewares) {
                let regex = new RegExp(middleware.pattern)
                if (regex.test(ctx.url)) {
                    await middleware.exec(ctx)
                }
            }
        })
    }

    async _processProxy(ctx) {
        let originUrl = `${ctx.request.protocol}://${(ctx.request.host + ctx.request.url)}`
        let proxyResult = await goProxy(ctx, this.config.proxyTable.map(originUrl))
        ctx.set("set-cookie", proxyResult.headers["set-cookie"])
        ctx.response.status = proxyResult.statusCode
        ctx.body = proxyResult.body
        this.log.info(`proxy result: ${JSON.stringify(proxyResult)}`)
    }
}