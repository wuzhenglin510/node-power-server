module.exports = (origin = "*",
    method = "GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH",
    enableCookie = true) => {
    return async (ctx, next) => {
        ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        ctx.set("Access-Control-Allow-Origin", origin);
        ctx.set("Access-Control-Allow-Methods", method);
        ctx.set("Access-Control-Allow-Credentials", enableCookie);
        if (ctx.request.method == "OPTIONS") {
            ctx.status = 204;
        } else {
            await next()
        }
    }
}