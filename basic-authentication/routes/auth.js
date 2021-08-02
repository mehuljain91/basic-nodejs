const router = require('express').Router();
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

// VALIDATION

const schemaRegister = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

const schemaLogin = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

// REGISTER

router.post('/register', bodyParser.urlencoded({ extended: false }), async (req, res) => {

    try {
        const { error } = schemaRegister.validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
    } catch (error) {
        res.send(error)
    }

    // check weather email exist or not

    const checkEmail = await User.findOne({ email: req.body.email })
    if (checkEmail) {
        return res.status(400).send("Error : Email already exist")
    }

    // hash password

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    user.save((err, savedUser) => {
        if (!err) {
            let responseObject = {};
            responseObject['email'] = savedUser.email;
            res.send({ "Registered with ": responseObject });
        }
    })

})

// LOGIN

router.post('/login', bodyParser.urlencoded({ extended: false }), async (req, res) => {
    try {
        const { error } = schemaLogin.validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
    } catch (error) {
        res.send(error)
    }

    // check email exist

    const emailExist = await User.findOne({ email: req.body.email });
    if (!emailExist) {
        return res.status(400).send('Email is not found')
    }

    // check password

    const validPass = await bcrypt.compare(req.body.password, emailExist.password)
    if (!validPass) {
        return res.status(400).send('Invalid Password')
    }

    // create assign token

    const token = jwt.sign({ _id: emailExist._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);
})

module.exports = router