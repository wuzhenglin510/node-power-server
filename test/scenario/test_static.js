const CommonProxy = require("../../")
const path = require("path")
const rp = require("request-promise")
const assert = require("assert")

describe('test static feather', function() {

    this.timeout(50000)
    
    before(async function() {
        //start node server
        const proxyServer = new CommonProxy.Server({ 
            port: 9091, 
            logDir: `${path.join(__dirname, "../log")}`,
            staticRoot: `${path.join(__dirname, "../static")}`
        });
        proxyServer.start()
    })

    it("should get index.html response", async function() {
        let response = await rp.get("http://127.0.0.1:9091/index.html")
        assert(response.indexOf("html") != -1, `got error reponse: ${response}`)
    })

})