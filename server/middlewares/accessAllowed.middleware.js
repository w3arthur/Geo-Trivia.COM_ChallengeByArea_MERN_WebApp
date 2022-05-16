const { allowedAccess } = require('../config')

let allowedOrigins;

if (process.env.NODE_ENV !== 'production'){  allowedOrigins = [ ...allowedAccess.development , ...allowedAccess.production ];
} else { allowedOrigins = [ ...allowedAccess.production ]; }

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