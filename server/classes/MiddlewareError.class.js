class MiddlewareError{
    status; title; message;
    constructor (status, title, message){
        console.log('::Error Handler ::Middleware Error');
        this.status = status;
        this.title = title;
        this.message = message;
    }
}

module.exports = {MiddlewareError};
