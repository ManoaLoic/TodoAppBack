let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors');

let assignment = require('./routes/assignments');
let user = require('./routes/users');
let matiere = require('./routes/matieres');

let mongoose = require('mongoose');
const { checkToken, login } = require('./routes/auth');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://loic:loic1234@cluster0.vwkhc.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:" + port + "/api/assignments que cela fonctionne")
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

app.use(cors());

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Obligatoire si déploiement dans le cloud !
let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.post(`${prefix}/auth`, login);
app.post(prefix + '/register', user.register)

app.use(checkToken);

// Route pour récupérer le nombre total des devoirs à faire
app.route(`${prefix}/assignments/count`).get( assignment.getAssignmentsCount);


// http://serveur..../assignments
app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment)
  .get(assignment.getAssignments);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);

app.route(prefix + '/users')
  .post(user.postUser)
  .put(user.updateUser)
  .get(user.getUsers);

app.route(prefix + '/users/:id')
  .get(user.getUser)
  .delete(user.deleteUser);

app.route(prefix + '/matieres')
  .post(matiere.postMatiere)
  .put(matiere.updateMatiere)
  .get(matiere.getMatieres);

app.route(prefix + '/users/:id')
  .get(matiere.getMatiere)
  .delete(matiere.deleteMatiere);


// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


