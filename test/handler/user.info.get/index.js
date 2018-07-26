module.exports = async ({body, query}) => {
    if (query.error == 'true') {
        throw new Error("now i will throw an error as want");
    }
    return {
        id: query.id,
        nickname: 'leo',
        age: 24,
        address: '天朝'
    }
}