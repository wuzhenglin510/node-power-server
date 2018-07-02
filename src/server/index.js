const fs = require("fs")
const path = require("path")
const Koa = require("koa")
const Koa_Static = require("koa-static")
const Koa_Body = require("koa-body")
const Koa_Proxy = require("koa-proxies")
const EventEmitter = require('events').EventEmitter
const Config = require("./config")
const Middleware = require("./middleware")

module.exports = class Server extends EventEmitter {
    constructor(config) {
        super();
        this.config = new Config(config)
        this.middlewareManage = new Middleware.Manager()
        this._apis = {}
        this._server = new Koa()
    }

    start() {
        this._initStatic()
        this._initProxyTable()
        this._initMiddleware()
        this._initFrontApiExector()
        this._server.listen(this.config.port, () =>{this.emit("started")})
    }

    _initStatic() {
        if (this.config.staticRoot) {
            this._server.use(Koa_Static(this.config.staticRoot))
            this.emit("init_process", `static resources located in ${this.config.staticRoot}`)
        }
    }

    _initProxyTable() {
        if (this.config.proxyTable.rules.length > 0) {
            for (let rule of this.config.proxyTable.rules) {
                this._server.use(Koa_Proxy(rule.prefix, {
                    target: rule.dst,
                    changeOrigin: false,
                    rewrite: path => path.replace(rule.prefix, ""),
                    logs: this.config.enableProxyLog
                }))
                this.emit("init_process", `install proxy rule [prefix: ${rule.prefix} -> dst: ${rule.dst}]`)
            }
        }
    }

    _initMiddleware() {
        this._server.use(Koa_Body({multipart:true}))
        if (this.middlewareManage.middlewares.length > 0) {
            for(let middleware of this.middlewareManage.middlewares) {
                this._server.use(middleware)
            }
            this.emit("init_process", `install ${this.middlewareManage.middlewares.length} custom middleware successfully`)
        }
    }

    

    _initFrontApiExector() {
        if (this.config.handlerDir) {
            this._apis = fs.readdirSync(this.config.handlerDir).filter(filename => fs.lstatSync(path.join(this.config.handlerDir, filename)).isDirectory())
                         .reduce((prev, curr) => {
                            prev[curr] = path.join(this.config.handlerDir, curr)
                            return prev
                         }, {})
            this.emit("init_process", `scaning apis : ${JSON.stringify(this._apis)}`)
            this._server.use(async (ctx) => {
                if (ctx.request.method == 'OPTIONS') return
                let api = ctx.request.path.replace("/", "")
                if (this._apis[api]) await require(this._apis[api])(ctx)
            })
        }
    }
}