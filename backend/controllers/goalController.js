const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc Get Goals
// @route GET /api/goals
// @access Private
const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id })
        res.status(200).json(goals);
    } catch (Error) {
        console.log(Error);
    }
}

// @desc Set Goal
// @route POST /api/goals
// @access Private
const setGoal = async (req, res) => {
    try {
        //sends an error if there isnt a 'text' value in the body
        if(!req.body.text) {
            res.status(400)
            throw new Error('Please add a text field')
        }

        const goal = await Goal.create({
            text: req.body.text,
            user: req.user.id
        })
        res.status(200).json(goal);
    } catch (Error) {
        console.log(Error)
    }
}

// @desc Update Goal
// @route PUT /api/goals/:id
// @access Private
const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)

        if(!goal) {
            res.status(400)
            throw new Error('Goal not found')
        }

        //check for user
        if(!req.user) {
            res.status(401)
            throw new Error('User not found')
        }

        //make sure the logged in user matches the goal user
        if(goal.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error('User not authorized')
        }

        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})

        res.status(200).json({updatedGoal});
    } catch (Error) {
        console.log(Error)
    }
}

// @desc Delete Goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)

        if(!goal) {
            res.status(400)
            throw new Error('Goal not found')
        }

        //check for user
        if(!req.user) {
            res.status(401)
            throw new Error('User not found')
        }

        //make sure the logged in user matches the goal user
        if(goal.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error('User not authorized')
        }

        await goal.remove();

        res.status(200).json({id: req.params.id});
    } catch (Error) {
        console.log(Error);
    }
}

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
}