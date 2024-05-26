let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AuteurSchema = Schema({
    _id: String,
    nom: String,
    image: String,
});

let MatiereSchema = Schema({
    _id: String,
    nom: String,
    image: String,
    prof_img: String,
});

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: Date,
    dateDeCreation: Date,
    nom: String,
    rendu: Boolean,
    note: Number,
    auteur: AuteurSchema,
    matiere: MatiereSchema,
    remarque: String,
});

AssignmentSchema.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('assignments', AssignmentSchema);
