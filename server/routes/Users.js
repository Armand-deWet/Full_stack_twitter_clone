const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.post('/', (req, res) => {
    const { username, password } = req.body
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash
        })
    })
    res.json('User created')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = await Users.findOne({ where: { username:username } })

    if (!user) return res.json({error: 'Users does not exist'})

    bcrypt.compare(password, user.password).then((match) => {
        if(!match) return res.json({ error: 'Wrong username and password combination' })

        const accessToken = sign({username: user.username, id: user.id}, 'importantsecret')
        return res.json({token: accessToken, username: username, id: user.id})
    })
})

router.get('/auth', validateToken, (req, res) => {
    return res.json(req.user)
})

router.get('/basicinfo/:id', async (req, res) => {
    const id = req.params.id
    const basicInfo = await Users.findByPk(id, {attributes : {
        exclude: ['password']
    }})

    res.json(basicInfo)
})

router.put('/changepassword', validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await Users.findOne({where: {username: req.user.username}})
    bcrypt.compare(oldPassword, user.password).then((match) => {
        if (!match) res.json({error: 'Wrong password entered'})

        bcrypt.hash(newPassword, 10).then((hash) => {
            Users.update({password: hash}, {where: {username: req.user.username}})
            res.json('Success')
        })
    })
})


module.exports = router