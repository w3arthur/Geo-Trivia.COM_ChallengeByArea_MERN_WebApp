class ErrorHandler{
    status; message;
    constructor (status, message){
        console.log('::Error Handler ::Error');
        this.status = status;
        this.message = message;
    }
}

module.exports = {ErrorHandler};