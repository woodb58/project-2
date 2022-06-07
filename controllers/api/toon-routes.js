const router = require("express").Router();
const { Toon, User } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  Toon.findAll({
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbToonData) => res.json(dbToonData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Toon.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: User,
        attributes: ["username"]
      }
    ]
  })
    .then((dbToonData) => {
      if (!dbToonData) {
        res.status(404).json({ message: "No character found with this id" });
        return;
      }
      res.json(dbToonData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
    Toon.create({
        name: req.body.name,
        gender: req.body.gender,
        race: req.body.race,
        class: req.body.class,
        backstory: req.body.backstory,
        user_id: req.session.user_id
    })
    .then(dbToonData => res.json(dbToonData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
    Toon.update({
        name: req.body.name,
        gender: req.body.gender,
        race: req.body.race,
        class: req.body.class,
        backstory: req.body.backstory,
        user_id: req.session.user_id
    },
    {
        where: {
            id: req.params.id
        }
    }
    )
    .then(dbToonData => {
        if (!dbToonData) {
          res.status(404).json({ message: 'No character found with this id' });
          return;
        }
        res.json(dbToonData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.delete('/:id', withAuth, (req, res) => {
    console.log('id', req.params.id);
    Toon.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbToonData => {
        if (!dbToonData) {
          res.status(404).json({ message: 'No character found with this id' });
          return;
        }
        res.json(dbToonData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;

