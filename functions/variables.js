exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({access_token: process.env.ACCESS_TOKEN})
    };
};
