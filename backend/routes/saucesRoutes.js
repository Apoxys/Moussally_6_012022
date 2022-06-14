const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/saucesCtrl');
const multer = require('../middleware/multer-config');


//global sauces sight
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);

//user post-update-delete
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifyOneSauce);
router.delete('/:id', auth, saucesCtrl.deleteOneSauce);

//likes&dislikes
router.post('/:id/like', auth, saucesCtrl.likes);

module.exports = router;