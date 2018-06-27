module.exports = async (ctx) => {
    ctx.body = {
        id: ctx.request.query.id,
        nickname: 'leo',
        age: 24,
        address: '天朝'
    }
}