let User = require('../model/user');

const checkToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username: username });
    if (user == null) {
        return res.status(400).send('User not found');
    }

    if (await bcrypt.compare(password, user.hashedPassword)) {
        const token = jwt.sign({ username: username }, secretKey);
        res.json({ token: token });
    } else {
        res.status(401).send('Invalid password');
    }
}

module.exports = { checkToken, login };