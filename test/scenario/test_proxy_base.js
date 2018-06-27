const CommonProxy = require("../../")
const path = require("path")
const Koa = require("koa")
const rp = require("request-promise")
const assert = require("assert")

describe('test proxy feather', function() {

    this.timeout(50000)
    
    before(async function() {
        const server = new CommonProxy.Server({ 
            port: 9091
        });
        server.config.proxyTable.add("/api9081", "http://127.0.0.1:9081/mc")
                                .add("/api9082", "http://127.0.0.1:9082")
        server.start()
        const api9081Server = new Koa().use((ctx) => { ctx.body = `hello ${ctx.request.url.replace("/", "")}, i am 9081` }).listen(9081)
        const api9082Server = new Koa().use((ctx) => { ctx.body = `hello ${ctx.request.url.replace("/", "")}, i am 9082` }).listen(9082)
    })

    it("should get 9081 response", async function() {
        let response = await rp.get("http://127.0.0.1:9091/api9081/leo")
        assert(response == "hello mc/leo, i am 9081", `got value not expected: ${response}`)
    })

    it("should get 9082 response", async function() {
        let response = await rp.get("http://127.0.0.1:9091/api9082/silence")
        assert(response == "hello silence, i am 9082", `got value not expected: ${response}`)
    })

})