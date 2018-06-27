# node-power-server

## Description

---

Node-Power-Server 是为了让node中间件(前端后置层)的实现更简单，基于Koa， Request

方便实现简单的代理转发，以及集成接口调用

## Quickstart

---

## Installation

    npm install node_power_server --save

## Usage
```javascript
    const path = require("path")
    const NodePowerServer = require("node_power_server")
    
    const server = new NodePowerServer.Server({
        port: 8009, //指定端口（必须)
        staticRoot: `${path.join(__dirname, "static")}`， //指定静态文件路径(可选，如果需要做静态资源服务的话)
    	handlerDir: `${path.join(__dirname, "handler")}` //指定前置api路径(可选，如果需要前置api，集成调用后端api的话)
    });
    
    //添加代理表， 指定需要被转发的路径，以及被转发到的目标[协议+域名+【端口】+【地址】], prefix[即标志] 将会被去掉
    server.config.proxyTable.add("/api9081", "http://127.0.0.1:9081/mc")
                            .add("/api9082", "http://127.0.0.1:9082")
    
    //添加中间件， 该例子中对所有请求添加跨域处理，并且指定处理的时间点在调用接口前
    //如果需要其他中间件，可自行开发，参考中间件源码实现
    //注意: 中间件对静态资源无效， 后置中间件对代理转发无效, 前、后置中间件对 front api 都有效
    server.middlewares.add("/*", NodePowerServer.Middleware.CrossDomain(),NodePowerServer.Middleware.Constant.ExecBefore)
    
    //监听服务启动事件
    server.on("started", () => {
        console.log("server started successfully")
    })
    server.on("init_process", message => {
        console.log(message)
    })
    
    //正式启动，绑定端口
    server.start()
```
## 前置api建议写法

--- 

```javascript
    //在指定的handler中创建需要的api文件夹，文件名以.分割 如：user.info.get 是一个api, 里面有个index.js
    module.exports = async (ctx) => {
    ctx.body = {
            id: ctx.request.query.id,
            nickname: 'leo',
            age: 24,
            address: '天朝'
        }
    }
```