const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/saucesCtrl');
const auth = require('../middleware/auth');

//global sauces sight
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);

//user post-update-delete
router.post('/', auth, saucesCtrl.createSauce);
router.put('/:id', auth, saucesCtrl.modifyOneSauce);
router.delete('/:id', auth, saucesCtrl.deleteOneSauce);

//likes&dislikes
router.post('/', auth)

module.exports = router;