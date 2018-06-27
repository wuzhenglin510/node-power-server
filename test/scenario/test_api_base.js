const CommonProxy = require("../../")
const path = require("path")
const rp = require("request-promise")
const assert = require("assert")

describe('test api base', function() {

    this.timeout(50000)
    
    before(async function() {
        const server = new CommonProxy.Server({ 
            port: 9091,
            handlerDir: `${path.join(__dirname, "../handler")}`
        });
        server.middlewareManage.add("/*", (ctx) => {
            ctx.set("param1", "before /*")
        }, CommonProxy.Middleware.Constant.ExecBefore).add("/user", (ctx) => {
            ctx.set("param2", "after /user")
        }, CommonProxy.Middleware.Constant.ExecAfter)
        server.start()
    })

    it("should get correct response with local api url", async function() {
        let response = await rp.get("http://127.0.0.1:9091/user.info.get?id=520", {resolveWithFullResponse: true})
        assert(response.headers.param1 == "before /*"
                && response.headers.param2 == "after /user" 
                && JSON.parse(response.body).id == "520" 
                && JSON.parse(response.body).nickname == "leo", `got error reponse: ${response}`)
    })

})