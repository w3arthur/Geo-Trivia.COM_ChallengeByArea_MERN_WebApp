class Success{
    status; result = undefined;
    constructor (status, result = undefined){
        this.status = status;
        this.result = result;
    }
}

module.exports = {Success};