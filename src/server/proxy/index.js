const rp = require("request-promise")

module.exports = async (ctx, rule) => {
    let newUrl = _generateNewTargetUrl(ctx, rule)
    return await _doRequest(ctx, newUrl)
}

function _generateNewTargetUrl(ctx, rule) {
    return `${ctx.request.protocol}://${(ctx.request.host + ctx.request.url).replace(new RegExp(rule.pattern), rule.dst)}`
}

async function _doRequest(ctx, url) {
    if (ctx.request.headers && ctx.request.headers["content-type"] 
            && ctx.request.headers["content-type"].toLowerCase().indexOf("json") != -1) {
        return await _processJson(ctx, url)
    } else if (ctx.request.headers && ctx.request.headers["content-type"] 
    && ctx.request.headers["content-type"].toLowerCase().indexOf("plain") != -1) {
        return await _processPlain(ctx, url)
    } else if (ctx.request.headers && ctx.request.headers["content-type"] 
    && ctx.request.headers["content-type"].toLowerCase().indexOf("application/x-www-form-urlencoded") != -1) {
        return await _processXWwwFormUrlencoded(ctx, url)
    } else {
        return await _processPlain(ctx, url)
    }
}

async function _processPlain(ctx, uri) {
    return await rp({
        method: ctx.request.method,
        uri: uri,
        headers: ctx.request.headers,
        resolveWithFullResponse: true
    })
}

async function _processXWwwFormUrlencoded(ctx, uri) {
    return await rp({
        method: ctx.request.method,
        uri: uri,
        headers: ctx.request.headers,
        formData: ctx.request.body,
        resolveWithFullResponse: true
    })
}

async function _processJson(ctx, uri) {
    return await rp({
        method: ctx.request.method,
        uri: uri,
        body: ctx.request.body,
        headers: ctx.request.headers,
        json: true,
        resolveWithFullResponse: true
    })
}