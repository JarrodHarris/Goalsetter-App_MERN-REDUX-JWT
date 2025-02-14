const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const protect = async (req, res, next) => {
    try {
        let token

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                //get token from header
                token = req.headers.authorization.split(' ')[1]

                //verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET)

                //get user from the token
                req.user = await User.findById(decoded.id).select('-password');

                next()
            } catch(Error) {
                console.log(Error);
                res.status(401)
                throw new Error('Not authoirzed')
            }
        }

        if(!token) {
            res.status(401)
            throw new Error('Not authorized, no token')
        }
    } catch (Error) {
        console.log(Error);
    }
    
}

module.exports = { protect }