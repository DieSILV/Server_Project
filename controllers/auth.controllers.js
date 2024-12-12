const User = require('./../models/User.model')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Company = require('../models/Company.model')
const saltRound = 10

const signupUser = (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        active = true,
        role = "CLIENT",
        phone,
        address: { city, zipcode, firstAddress } = {},
        avatar
    } = req.body

    if (!email || !password) {
        res.status(400).json({ message: "Provide email and password." })
        return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address." })
        return
    }

    if (password.length < 3) {
        res.status(400).json({ message: "Password too short." })
        return
    }

    User
        .findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                res.status(400).json({ message: "User already exists." })
                return
            }

            const salt = bcrypt.genSaltSync(saltRound)
            const hashedPassword = bcrypt.hashSync(password, salt)

            return User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                active,
                role,
                phone,
                address: { city, zipcode, firstAddress },
                avatar
            })
        })
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            console.error("Error al crear el usuario:", err)
            next(err)
        })
}

const loginUser = (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        next(new Error("Provide email and password."))
        return
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.status(401).json({ message: "User not found." })
                return
            }

            const isCorrectPwd = bcrypt.compareSync(password, user.password)
            if (!isCorrectPwd) {
                res.status(401).json({ message: "Unable to authenticate the user." })
                return
            }

            Company.findOne({ owner: user._id })
                .then(company => {
                    const { _id, email, firstName, lastName } = user

                    // Crear el payload incluyendo los datos de la compañía
                    const payload = {
                        _id,
                        email,
                        firstName,
                        lastName,
                        company: company ? { name: company.name, id: company._id } : null
                    }

                    const authToken = jwt.sign(
                        payload,
                        process.env.TOKEN_SECRET,
                        { algorithm: 'HS256', expiresIn: "6h" }
                    )

                    res.json({
                        authToken,
                        user: { _id, email, firstName, lastName },
                        company: company || null
                    })
                })
                .catch(err => {
                    console.error("Error al obtener la compañía del usuario:", err)
                    next(err)
                })
        })
        .catch(err => {
            console.error("Error al autenticar el usuario:", err)
            next(err)
        })
}

const verifyUser = (req, res, next) => {
    const { _id, email, firstName, lastName, company } = req.payload

    res.json({
        loggedUserData: {
            _id,
            email,
            firstName,
            lastName,
            company
        }
    })
}

module.exports = {
    signupUser,
    loginUser,
    verifyUser
}