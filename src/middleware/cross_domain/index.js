module.exports = (origin = "*", 
                  method = "GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH",
                  enableCookie = true) =>{
    return async (ctx) =>{
        ctx.set("Access-Control-Allow-Origin", origin);
        ctx.set("Access-Control-Allow-Methods", method);
        ctx.set("Access-Control-Allow-Credentials", enableCookie);
        ctx.body = ""
    }
}