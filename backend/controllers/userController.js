const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// @desc Register new User
// @route POST /api/users
// @access Public
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body
        //check if there is a name, email and password
        if(!name || !email || !password) {
            res.status(400)
            throw new Error('Please add all fields')
        }

        //check if user exists
        const userExists = await User.findOne({email})
        if(userExists) {
            res.status(400)
            throw new Error('User already exists')
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        if(user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(400)
            throw new Error('Invalid user data')
        }
    } catch (Error) {
        console.log(Error);
    }
}

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        // Check for user email
        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password, user.password))) {
            res.status(201).json({
              _id: user.id,
              name: user.name,
              email: user.email,  
              token: generateToken(user._id)
            })
        } else {
            res.status(400)
            throw new Error('Invalid credentials')
        }
    } catch (Error) {
        console.log(Error);
    }
}

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (Error) {
        console.log(Error);
    }
}

//Generate JWT with user id
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}