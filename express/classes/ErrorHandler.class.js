class ErrorHandler{
    status; message;
    constructor (status, message){
        this.status = status;
        this.message = message;
    }
}

module.exports = {ErrorHandler};