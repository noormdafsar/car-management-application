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

router.route('/car/new').post(isAuthenticatedUser, createCar);
router.route('/cars').get(isAuthenticatedUser, getAllCars);
router.route('/car/:id')
  .get(isAuthenticatedUser, getCarDetails)
  .put(isAuthenticatedUser, updateCar)
  .delete(isAuthenticatedUser, deleteCar);
router.route('/cars/search').get(isAuthenticatedUser, searchCars);

module.exports = router;