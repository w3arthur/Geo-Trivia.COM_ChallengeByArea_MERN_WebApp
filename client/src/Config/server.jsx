
const server =
    process.env.NODE_ENV !== 'production' ? {
        axiosBaseUrl: 'http://localhost:3444'
        , webSocketUrl: 'ws://localhost:3444'
    }
        : { //production
            axiosBaseUrl: 'https://geo-trivia.com'  //change to https
            , webSocketUrl: 'ws://geo-trivia.com'      //io-socket
        }
    ;

export default server;