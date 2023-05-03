const jwt = require('jsonwebtoken');
const config = require('../config');

async function verifyToken(req, res, next){
    const string = req.headers['cookie']
    const token = string.slice(6, string.length)

    if(!token){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }

    try {
        
        const validToken = jwt.verify(token, config.secret);
        if(validToken) {

            req.authenticated = true
            return next()

        }

    } catch (err) {
        
        return res.status(400).json({error: err});

    }

    req.userId = decoded.id;
    next();

}

module.exports = verifyToken;