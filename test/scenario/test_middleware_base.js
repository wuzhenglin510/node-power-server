const CommonProxy = require("../../")
const path = require("path")
const rp = require("request-promise")
const assert = require("assert")

describe('test static feather', function() {

    this.timeout(50000)
    
    before(async function() {
        const server = new CommonProxy.Server({ 
            port: 9091
        });
        server.middlewareManage.add("/*", (ctx) => {
            ctx.body = Object.assign({param1: "before /*"}, ctx.body)
        }, CommonProxy.Middleware.Constant.ExecBefore).add("/user", (ctx) => {
            ctx.body = Object.assign({param2: "after /user"}, ctx.body)
        }, CommonProxy.Middleware.Constant.ExecAfter)
        server.start()
    })

    it("should get correct response with url /proifle/leo", async function() {
        let response = JSON.parse(await rp.get("http://127.0.0.1:9091/profile/leo"))
        assert(response.param1 == "before /*", `got error reponse: ${response}`)
    })

    it("should get correct response with url /user/silence", async function() {
        let response = JSON.parse(await rp.get("http://127.0.0.1:9091/user/silencr"))
        assert(response.param1 == "before /*" && response.param2 == "after /user", `got error reponse: ${response}`)
    })

})