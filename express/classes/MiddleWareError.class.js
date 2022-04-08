class MiddlewareError{
    status; title; message;
    constructor (status, title, message){
        this.status = status;
        this.title = title;
        this.message = message;
    }
}

module.exports = {MiddlewareError};