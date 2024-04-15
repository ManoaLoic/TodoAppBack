let Matiere = require('../model/matiere');

function getMatieres(req, res) {
    let aggregateQuery = Matiere.aggregate();

    Matiere.aggregatePaginate(
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

function getMatiere(req, res) {
    let matiereId = req.params.id;
    Matiere.findById(matiereId, (err, matiere) => {
        if (err) { res.send(err) }
        res.json(matiere);
    })
}

function postMatiere(req, res) {
    let matiere = new Matiere();
    matiere.id = req.body.id;
    matiere.nom = req.body.nom;
    matiere.image = req.body.image;
    matiere.email = req.body.email;
    matiere.password = req.body.password;
    matiere.isAdmin = req.body.isAdmin;

    console.log("POST matiere reçu :");
    console.log(matiere)

    matiere.save((err) => {
        if (err) {
            res.send('cant post matiere ', err);
        }
        res.json({ message: `${matiere.nom} saved!` })
    })
}

function updateMatiere(req, res) {
    console.log("UPDATE recu Matiere : ");
    console.log(req.body);
    Matiere.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, matiere) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: 'updated' })
        }
    });

}

function deleteMatiere(req, res) {
    Matiere.findByIdAndRemove(req.params.id, (err, matiere) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${matiere.nom} deleted` });
    })
}



module.exports = { getMatieres, postMatiere, getMatiere, updateMatiere, deleteMatiere };