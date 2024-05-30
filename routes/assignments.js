let Assignment = require('../model/assignment');
const User = require('../model/user');
const Matiere = require('../model/matiere');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

function getAssignments(req, res) {
    const filterCriteria = {};
    const { rendu, q } = req.query;
    if (rendu) {
        filterCriteria.rendu = rendu == 'true' ? true : false;
    }

    if (q) {
        filterCriteria.nom = { $regex: `^${q}`, $options: 'i' };
    }

    if (!req.user.isAdmin) {
        filterCriteria['auteur._id'] = req.user._id;
    }

    console.log(req.user);
    console.log(filterCriteria);

    const aggregateQuery = Assignment.aggregate([
        { $match: filterCriteria }
    ]);

    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: { dateDeCreation: -1 },
        },
        (err, data) => {
            if (err) {
                res.send(err)
            }

            res.send(data);
        }
    );
}

function getAssignmentsCount(req, res) {
    const user = req.user;

    Assignment.aggregate([
        {
            $match: {
                "auteur._id": user._id
            }
        },
        {
            $group: {
                _id: "$rendu",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                rendu: "$_id",
                count: 1
            }
        }
    ], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de la récupération du nombre total des devoirs à faire.' });
        } else {
            res.status(200).json({ result: result });
        }
    });
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;
    console.log('Id', assignmentId);
    Assignment.findById(ObjectId(assignmentId), (err, assignment) => {
        if (err) { res.send(err) }
        res.json(assignment);
    })

    /*
    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
    */
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
    try {
        const token = {
            _id: mongoose.Types.ObjectId('66223b9233fdb80bb8e3171f').toString(),
            isAdmin: true,
        };

        if (!req.body.matiere || !req.body.matiere._id) {
            return res.status(500).json({ message: 'Missing field required : Matiere ' });
        }

        let assignment = new Assignment();
        assignment.id = req.body.id;
        assignment.dateDeRendu = req.body.dateDeRendu;
        assignment.nom = req.body.nom;
        assignment.rendu = req.body.rendu;
        assignment.note = req.body.note;
        assignment.remarque = req.body.remarque;
        assignment.dateDeCreation = new Date();

        if (token.isAdmin) {
            assignment.auteur = req.body.auteur;
            assignment.matiere = req.body.matiere;
        }

        if (!assignment.auteur?.nom) {
            const user = await User.findById(token._id);
            if (!user)
                return res.status(500).json({ message: "Can't find the auteur for the new assignment" });

            assignment.auteur = {
                _id: user._id,
                nom: user.nom,
                image: user.image,
            };
        }

        if (!assignment.matiere?.nom) {
            const matiere = await Matiere.findById(req.body.matiere._id);
            if (!matiere)
                return res.status(500).json({ message: "Can't find the matiere for the new assignment" });

            assignment.matiere = {
                _id: matiere._id,
                nom: matiere.nom,
                image: matiere.image,
                prof_img: matiere.prof_img,
            };
        }

        console.log('body', req.body);
        console.log("POST assignment reçu :");
        console.log(assignment)

        assignment.save((err, savedAssignment) => {
            if (err) {
                return res.send('cant post assignment ', err);
            }
            return res.json(savedAssignment)
        })
    } catch (e) {
        console.error(e);
        return res.status(500).json(e);
    }
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    if (req.body.note || req.body.note == 0) {
        req.body.rendu = true;
    }
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json(assignment)
        }

        // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${assignment.nom} deleted` });
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, getAssignmentsCount, updateAssignment, deleteAssignment };
