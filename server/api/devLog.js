function devLog(message){
    if (process.env.NODE_ENV !== 'production') {
        console.log(message);
    }
}
module.exports = devLog;