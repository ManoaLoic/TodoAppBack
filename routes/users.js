let User = require('../model/user');
const bcrypt = require('bcrypt');

function getUsers(req, res) {
    let aggregateQuery = User.aggregate();

    User.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if (err) {
                res.send(err)
            }

            res.send(data);
        }
    );
}

function getUser(req, res) {
    let userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) { res.send(err) }
        res.json(user);
    })
}

async function register(req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); 
    
    let user = new User();
    user.id = req.body.id;
    user.nom = req.body.nom;
    user.image = req.body.image;
    user.email = req.body.email;
    user.password = hashedPassword;
    user.isAdmin = false;

    console.log("POST user reçu :");
    console.log(user)

    user.save((err) => {
        if (err) {
            res.send('cant post user ', err);
        }
        res.json({ message: `${user.nom} saved!` })
    })
}

async function postUser(req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); 
    
    let user = new User();
    user.id = req.body.id;
    user.nom = req.body.nom;
    user.image = req.body.image;
    user.email = req.body.email;
    user.password = hashedPassword;
    user.isAdmin = req.body.isAdmin;

    console.log("POST user reçu :");
    console.log(user)

    user.save((err) => {
        if (err) {
            res.send('cant post user ', err);
        }
        res.json({ message: `${user.nom} saved!` })
    })
}

function updateUser(req, res) {
    console.log("UPDATE recu User : ");
    console.log(req.body);
    User.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, user) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: 'updated' })
        }
    });

}

function deleteUser(req, res) {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${user.nom} deleted` });
    })
}



module.exports = { getUsers, postUser, getUser, updateUser, deleteUser, register };