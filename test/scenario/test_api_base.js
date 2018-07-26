const CommonProxy = require("../../")
const path = require("path")
const rp = require("request-promise")
const assert = require("assert")

describe('test api base', function() {

    this.timeout(50000) //指定测试用例最大时长 50s
    
    before(async function() {
        const server = new CommonProxy.Server({ 
            port: 9091,
            handlerDir: `${path.join(__dirname, "../handler")}`
        });
        //中间件写法，参考koa。 next必须 await， 否则不会继续执行中间件链，直接返回。
        server.middlewareManage.add("/*", async (ctx, next) => {
            ctx.set("param1", "before /*")
            await next()
        }, CommonProxy.Middleware.Constant.ExecBefore).add("/user", async (ctx, next) => {
            ctx.set("param2", "after /user")
            await next()
        }, CommonProxy.Middleware.Constant.ExecAfter)
        //监听初始化事件
        server.on('init_process', (msg) => {console.log(msg)})
        //监听启动完成事件
        server.on('started', (msg) => {console.log(msg)})
        //服务端报错，可以监听error事件，打印日志
        server.on("error", err =>{
            console.log(err)
        })
        server.start()
    })

    it("should get correct response with local api url", async function() {
        let response = await rp.get("http://127.0.0.1:9091/user.info.get?id=520", {resolveWithFullResponse: true})
        assert(response.headers.param1 == "before /*"
                && response.headers.param2 == "after /user" 
                && JSON.parse(response.body).id == "520" 
                && JSON.parse(response.body).nickname == "leo", `got error reponse: ${response}`)
    })

    it("should get error", async function() {
        await rp.get("http://127.0.0.1:9091/user.info.get?id=520&error=true", {resolveWithFullResponse: true}).catch(err => {
            assert(err.statusCode == 500, 'shoold get http status code == 500')
        })
    })

})