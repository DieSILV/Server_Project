const mongoose = require('mongoose')

const User = require('../models/User.model')

const getuser = (req, res, next) => {
    User
        .find()
        // .select({})
        .then(users => res.json(users))
        .catch(err => next(err))
}

const getOneuser = (req, res, next) => {

    const { _id: userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: "id not valid )" })
        return
    }

    User
        .findById(userId)
        // .select({})
        .then(users => res.json(users))
        .catch(err => next(err))
}

const getOwnerCompany = (req, res, next) => {

    const { owner } = req.params

    if (!mongoose.Types.ObjectId.isValid(owner)) {
        res.status(404).json({ message: "id not valid )" })
        return
    }

    User
        .findById(owner)
        .then(users => res.json(users))
        .catch(err => next(err))
}




const deleteuser = (req, res, next) => {

    const { _id: userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: "id not valid )" })
        return
    }

    User
        .findByIdAndDelete(userId)
        .then(() => res.sendStatus(200))
        .catch(err => next(err))
}

const filterusers = (req, res, next) => {
    User
        .find(req.query)
        .then(users => res.json(users))
        .catch(err => next(err))
}



module.exports = {
    getuser,
    getOneuser,
    getOwnerCompany,
    deleteuser,
    filterusers
}