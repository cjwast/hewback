const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//URL users/
//GET obtiene la info detallada de un usuario
router.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ msg: err });
      console.log(err);
    })
});

//URL users/
//POST creara un nuevo registro]
router.post('/', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const newUser = new User({ firstName, lastName, email, password });

  if (email === "" || password === "") {
    return res.status(401).json({ message: "Indicate username and password" });
    return;
  }


  User.findOne({ 'email': email })
    .then(user => {
      console.log(`comparacion => ${(typeof user !== 'undefined')}`)
      if (user !== null) {
        console.log(`usuario =>${user}`)
        return res.status(401).json({ message: "the user already exist" });
      }
      else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        newUser.password = hashPass;

        newUser.save()
          .then(userResponse => {
            //here we shoul return the token for that user
            //pendiente revisar la verificación de correo??? SHIT!
            jwt.sign({ userResponse }, 'secretkey', { expiresIn: '1h' }, (err, token) => {
              //I really don't care the err XD
              res.status(200).json(
                { token }
              );
            })
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});


/**Metodo para hacer el login de un usuario*/
//URL users/login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res.status(401).json({ message: "Indicate username and password" });
    return;
  }

  console.log(`email recibido => ${email}, password => ${password}`)

  User.findOne({ 'email': email })
    .then(user => {
      console.log(`usuario encontrado=> ${user}`)
      if (user !== null) {
        //que si existe usuario
        //comparamos el pasword
        if (bcrypt.compareSync(password, user.password)) {
          //generamos el token con jwt para responder al login
          jwt.sign({ user }, 'secretkey', { expiresIn: '1h' }, (err, token) => {
            //I really don't care the err XD
            res.status(200).json(
              { token }
            );
          })
        }
        else {
          //mensaje ambiguo
          res.status(200).json({ message: "please verify the information" });
        }
      }
      else {
        //mensaje ambiguo
        res.status(200).json({ message: "please verify the information" });
      }
    })
    .catch(err => console.log(err));
})

module.exports = router;