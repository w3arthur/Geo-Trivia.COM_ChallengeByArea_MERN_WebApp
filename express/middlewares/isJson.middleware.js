
module.exports = (req, res, next) => {  //still not works
    if (req.body && Object.keys(req.body).length === 0 ) return res.status(601).send('no JSON body error!');
    next(); 
};

//if (req.body && Object.keys(req.body).length === 0 ) return res.status(601).send('no JSON body error!');
/*
    if (req.body){
        try{JSON.parse(req.body)}
        catch{return res.status(601).send('no JSON body error!');}
        // Object.keys(req.body).length === 0*/