const User = require('../models/user');
const jwt = require('jsonwebtoken');

const key = '@LiverpoolObinnaKalu';



exports.login = async(req, res, next) => {
    try {
        const user = await new User(null, null, null, req.body.userName, req.body.password, null).login();
        if (user) {
            const jwtToken = jwt.sign({ userName: user.userName }, key)
            res.json({ jwtToken: jwtToken })
        } else {
            res.json({ error: "invalid username and password" })
        }
    } catch (err) {
        next(err)
    }

}
exports.authorize = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const jwtToken = token.split(' ')[1];
        try {
            const data = jwt.verify(jwtToken, key)
            req.user = data;
            next()
        } catch (error) {
            res.status(403).json({ error: "Forbidden" })
        }
    } else {
        res.status(401).json({ error: "unauthorize" })
    }
}


exports.save = async(req, res, next) => {
    try {
        const userBody = req.body;
        console.log(req.body);

        const check = await User.checkUserName(req.body.userName)
            //if the user exists it will data 
            //if no exists it will return null 
        if (!check) {
            const user = await new User(null, userBody.firstName, userBody.lastName, userBody.userName, userBody.password).save()
            res.status(201).json(user.ops);
        } else {
            res.status(201).json({ exist: true });
        }
    } catch (err) {
        next(err)
    }
}





exports.getAllUser = async(req, res, next) => {
    const users = await User.findAll();
    res.status(200).json(users)
}









exports.update = async(req, res, next) => {
    try {
        const user = await User.findByUserName(req.params.username)
        console.log(user._id)
            //const id=req.params.id;
        const userBody = req.body;
        if (user.userName === req.body.userName) {
            const updateUser = new User(user._id, userBody.firstName, userBody.lastName, userBody.userName, userBody.password);
            await updateUser.update()
            res.status(200).json(updateUser)
        } else {
            res.status(200).json({ error: "you can not updated user name" })
        }
    } catch (err) {
        next(err)
    }
}
exports.delete = async(req, res, next) => {
    try {
        await User.deleteById(req.params.id)
        res.status(200).end()
    } catch (err) {
        next(err)
    }
}
exports.getByUserName = async(req, res, next) => {
    try {
        console.log(req.params.username)
        const user = await User.findByUserName(req.params.username)
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}