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
        logDir: `${path.join(__dirname, "log")}`, //指定日志地址(必须)
        staticRoot: `${path.join(__dirname, "static")}`， //指定静态文件路径(可选，如果需要做静态资源服务的话)
    		handlerDir: `${path.join(__dirname, "handler")}` //指定前置api路径(可选，如果需要前置api，集成调用后端api的话)
    });
    
    //添加代理表， 指定需要被转发的路径，以及需要被转发到哪个路径，采用的是正则替换实现
    server.config.proxyTable.add("127.0.0.1:8009/api", "127.0.0.1:8080")
                            .add("127.0.0.1:8009/av2", "127.0.0.1:3000/api")
    
    //添加中间件， 该例子中对所有请求添加跨域处理，并且在处理的时间点在调用接口后才进行添加允许跨域头部
    //如果需要其他中间件，可自行开发，参考中间件源码实现
    server.middlewares.add("/*", NodePowerServer.Middleware.CrossDomain(), NodePowerServer.Middleware.Constant.ExecAfter)
    
    //监听服务启动事件
    server.on("started", () => {
        console.log("server started successfully")
    })
    
    //正式启动，绑定端口
    server.start()
```
## 前置api写法

---

...待补充