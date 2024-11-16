const express = require('express');
const router = express.Router();
const {
  createCar,
  getAllCars,
  getCarDetails,
  updateCar,
  deleteCar,
  searchCars
} = require('../controllers/carController');
const { isAuthenticatedUser } = require('../middlewares/auth');
const { upload } = require('../middlewares/multer');


router.post('/create', upload.array('images', 10), createCar);
router.get('/getallcars', isAuthenticatedUser, getAllCars);
router.get('/car/:id', isAuthenticatedUser, getCarDetails)
router.put('/car/:id', isAuthenticatedUser, updateCar)
router.delete('/car/:id', isAuthenticatedUser, deleteCar);
router.get('/cars/search', isAuthenticatedUser, searchCars);


module.exports = router;