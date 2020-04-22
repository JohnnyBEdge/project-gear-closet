var express = require('express');
var router = express.Router();

const {
  getGear,
  addGear,
  removeGear
} = require('../../data/gear');


/* GET retrieve database */
router.get('/', async function(req, res, next) {
  try{
    const data = await getGear();
    res.send(data);
  } catch(err) {
    console.log(err);
    res.send(500, 'Internal Server Issue; check logs');
  }
});

// POST add to database
router.post('/', async function(req, res, next){
  try{
    const data = await addGear(req.body);
    res.send(data);
  } catch(err){
    if(err.error){
      res.status(400).send(err);
    } else {
      console.log(err);
      res.status(500).send("Internal server error; check logs")
    }
  };
});

// DELETE remove from database
router.delete('/', async function(req, res, nect){
  try{
    const data = await removeGear(req.body._id);
    res.send(data);
  } catch(err){
      console.log(err);
      res.statusMessage(500, 'Internal Server Issue; check logs')
  }
})

module.exports = router;
