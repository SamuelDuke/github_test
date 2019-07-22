module.exports = {
    port: 8080,
    database: 'mongodb://localhost/github_test',
    jwtSecret: 'Replace with better secret',
    jwtExpiration: 1000000,
    formatted_response: (res, status, success, data, message) => {
        res.status(status).json({
            success: success,
            data: data,
            message: message
        })
    }
};