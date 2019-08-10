/*CONFIG */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);
const app = express();


/*CONNECTION */
mongoose.connect('mongodb+srv://appUser:sowxeS-1soxbi-wupnof@cluster0-vx2qk.mongodb.net/hewDB?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(db => console.log('La base de datos esta conectada'))
  .catch(err => console.log(err));

/*MIDDLEWARE*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:8080']
}));

/*ROUTES*/
app.use('/users', require('./routes/Auth'));
app.use('/', require('./routes/Main'));


/**LISTEN */
app.listen(3000, () => console.log('el servidor está listo'));
