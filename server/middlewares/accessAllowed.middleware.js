require('dotenv').config();
let allowedOrigins;


if (process.env.NODE_ENV !== 'production'){ 

allowedOrigins = [
    process.env.ACCESS_LOCALHOST_1
    , process.env.ACCESS_LOCALHOST_2
    , process.env.ACCESS_LOCALHOST_3
    , process.env.ACCESS_LOCALHOST_4
    , process.env.ACCESS_LOCALHOST_5
    , process.env.ACCESS_LOCALHOST_6
    , process.env.ACCESS_SITE_1
    , process.env.ACCESS_SITE_2
    , process.env.ACCESS_SITE_3
];

 } else {
     allowedOrigins = [
        process.env.ACCESS_SITE_1
        , process.env.ACCESS_SITE_2
        , process.env.ACCESS_SITE_3
    ];
 }
console.log('allowedOrigins');
console.log(allowedOrigins);

const accessAllowed = (req, res, next) => {
    if (allowedOrigins.includes( req.headers.origin )) res.header('Access-Control-Allow-Credentials', true);
    next();
}

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = {accessAllowed, corsOptions}