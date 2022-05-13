
const server =
    process.env.NODE_ENV !== 'production' ? {
        axiosBaseUrl: 'http://localhost:3500'
        , webSocketUrl : 'ws://localhost:3500'
    }
    : { //production
        axiosBaseUrl: 'http://geo-trivia.com:3500'  //change to https
        , webSocketUrl : 'ws://geo-trivia.com:3500'
    }
;

export default server;