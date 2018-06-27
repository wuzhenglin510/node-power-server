// const CommonProxy = require("../")
// const path = require("path")

// const server = new CommonProxy.Server({
//     port: 8009,
//     logDir: `${path.join(__dirname, "log")}`,
//     staticRoot: `${path.join(__dirname, "static")}`
// });
// server.config.proxyTable.add("127.0.0.1:8009/api", "127.0.0.1:8080")
//                         .add("127.0.0.1:8009/av2", "127.0.0.1:3000/api")
// server.middlewares.add("/*", CommonProxy.Middleware.CrossDomain(), CommonProxy.Middleware.Constant.ExecAfter)

// server.on("started", () => {
//     console.log("server started successfully")
// })

// server.start()