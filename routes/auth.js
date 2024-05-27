let User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretKey } = require('../const');

const checkToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if (err) {
            console.error('error', err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

const login = async (req, res) => {
    const MESSAGE = `Veuillez vérifier l'email et le mot de passe`;

    const email = req.body.email;
    const password = req.body.password;

    console.log(req.body);
    
    const user = await User.findOne({ email});
    if (user == null) {
        return res.status(401).send({message: MESSAGE});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(401).send({message: MESSAGE});
    }

    const token = jwt.sign({ email: email }, secretKey);
    res.json({ token: token });
}

module.exports = { checkToken, login };