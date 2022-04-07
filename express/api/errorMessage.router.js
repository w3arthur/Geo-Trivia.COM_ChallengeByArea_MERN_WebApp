//routers error
module.exports =  (status, message) => {
             const error = new Error(message);
             error.status = status;
             return (req) => {
                 req.body.isError = true; 
                 return error;
             }      
};