const allowedAccess = {
    development: [
        'http://localhost:3000'
        , 'http://localhost:3001'
        , 'http://localhost:3500'
        , 'http://127.0.0.1:5500'
    ]
    , production: [
        'https://www.geo-trivia.com'
    ]
};

module.exports = allowedAccess;