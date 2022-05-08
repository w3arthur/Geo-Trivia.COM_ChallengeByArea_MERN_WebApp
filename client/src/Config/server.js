
const server =
    process.env.NODE_ENV !== 'production' ? {
        axiosBaseUrl: 'http://localhost:3500'
        , webSocketUrl : 'ws://localhost:3500'
    }
    : { //production
        axiosBaseUrl: 'https://:80'
        , webSocketUrl : 'ws://:80'
    }
;

export default server;