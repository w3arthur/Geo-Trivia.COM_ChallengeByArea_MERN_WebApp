
const server =
    process.env.NODE_ENV !== 'production' ? {
        axiosBaseUrl: 'https://geo-trivia.com' //'http://localhost:3444'
        , webSocketUrl: 'ws://geo-trivia.com' //'ws://localhost:3444'
    }
        : { //production
            axiosBaseUrl: 'https://geo-trivia.com'  //'http://localhost:3444'  //change to https
            , webSocketUrl: 'ws://geo-trivia.com'      //io-socket
        }
    ;

export default server;
