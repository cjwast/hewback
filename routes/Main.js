const express = require('express');
const router = express.Router();

const Message = require('../models/Messages');
const Show = require('../models/Shows');
const Submission = require('../models/Submissions');
const User = require('../models/Users');
const Venue = require('../models/Venues');
const jwt = require('jsonwebtoken');


/**URL /shows */
//GET Una consulta con todos los shows para mostrar en Main Page
router.get('/shows', (req, res) => {
  Show.find()
    .populate('venue')
    .populate('curator')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ msg: err });
      console.log(err);
    })
});

/**URL /shows*/
//POST creara un nuevo show
router.post('/shows', (req, res) => {
  let data = req.body;
  //first of all validate the token
  jwt.verify(data.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(200).json({ message: err.message });
    } else {
      //caso que no hay error
      const { name, address1, webSite } = data.show;
      Venue.create({ name, address1, webSite })
        .then(successVenue => {
          const { title, showType, applicationDeadLine, overview, fullDescription, applicationInstructions, startDate, endDate } = data.show;
          const newShow = new Show({ title, showType, applicationDeadLine, overview, fullDescription, applicationInstructions, startDate, endDate, });
          newShow.venue = successVenue.id;
          newShow.isPublished = true;
          newShow.curator = authData.user._id
          newShow.save()
            .then(result => {
              res.status(200).json({ status: 'ok' })
            })
            .catch(err => {
              res.status(500).json({ msg: err });
              console.log(err);
            })

        })
        .catch(err => {
          res.status(500).json({ msg: err });
          console.log(err);
        });
    }
  });
});

/**URL /dashboard/:userID */
//POST returns a lis of shows by user id
router.post('/dashboard/', (req, res, next) => {
  const { token } = req.body;

  jwt.verify(token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(200).json({ message: err.message });
    } else {
      Show.find({ curator: authData.user._id })
        .populate('curator')
        .populate('venue')
        .then(result => {
          res.status(200).json(
            {
              shows: result,
              user: authData.user
            }
          );
        })
        .catch(err => {
          res.status(500).json({ message: err });
          console.log(err);
        })
    }
  })
});

/**URL /shows/:id */
//GET returns the detail of the show
router.get('/shows/:id', (req, res, next) => {
  Show.findById(req.params.id)
    .populate('curator')
    .populate('venue')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ msg: err });
      console.log(err);
    })
});


/**URL /shows/:id/submissions */
//GET regresa el listado de submisiones de un show
router.get('/shows/:id/submissions', (req, res, next) => {
  Submission.find({ show: req.params.id, status: 1 })
    .then(result => {
      res.status(200).json({ submissions: result });
    })
    .catch(err => {
      res.status(500).json({ msg: err });
      console.log(err);
    })
});


/**URL /shows/:id/submissions */
//POST regresa el listado de submisiones de un show
router.post('/shows/:id/submissions', (req, res, next) => {
  const { artistName, artistEmail, website, instagram, fullyDescription, imageLink, addtionalLink, status, isSummited } = req.body;
  const newSubmission = new Submission({ artistName, artistEmail, website, instagram, fullyDescription, imageLink, addtionalLink, status, isSummited });
  newSubmission.show = req.params.id
  newSubmission.status = 1
  newSubmission.save()
    .then(result => {
      res.status(200).json(
        {
          status: 'ok',
          msg: 'the show has been successfully created'
        }
      )
    })
    .catch(err => {
      res.status(500).json({ msg: err });
    })
});


/**URL /shows/submissions/:id */
//PUT nuevo metodo para actualizar las submissions
router.put('/shows/submissions/:id/:status', (req, res, next) => {
  Submission.findByIdAndUpdate(req.params.id, { status: req.params.status })
    .then(result => {
      res.status(200).json(
        {
          status: 'ok',
          msg: 'the submission has been updated'
        }
      )
    })
    .catch(err => {
      res.status(200).json({ msg: err });
    })
});

module.exports = router;