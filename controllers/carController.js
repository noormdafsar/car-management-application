const Car = require('../models/carModel');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

exports.createCar = async (req, res, next) => {
  try {
    let images = [];

    if (typeof req.body.images === 'string') {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images.length > 10) {
      return next(new ErrorHandler('Maximum 10 images are allowed', 400));
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'cars'
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      car
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      cars
    });
  } catch (error) {
    next(error);
  }
};

exports.getCarDetails = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return next(new ErrorHandler('Car not found', 404));
    }

    if (car.user.toString() !== req.user.id) {
      return next(new ErrorHandler('Not authorized to access this car', 403));
    }

    res.status(200).json({
      success: true,
      car
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCar = async (req, res, next) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return next(new ErrorHandler('Car not found', 404));
    }

    if (car.user.toString() !== req.user.id) {
      return next(new ErrorHandler('Not authorized to update this car', 403));
    }

    // Handle image updates
    if (req.body.images) {
      // Delete old images
      for (let i = 0; i < car.images.length; i++) {
        await cloudinary.v2.uploader.destroy(car.images[i].public_id);
      }

      let images = [];
      if (typeof req.body.images === 'string') {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      if (images.length > 10) {
        return next(new ErrorHandler('Maximum 10 images are allowed', 400));
      }

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: 'cars'
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }

      req.body.images = imagesLinks;
    }

    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      car
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return next(new ErrorHandler('Car not found', 404));
    }

    if (car.user.toString() !== req.user.id) {
      return next(new ErrorHandler('Not authorized to delete this car', 403));
    }

     // Delete images from cloudinary
     for (let i = 0; i < car.images.length; i++) {
        await cloudinary.v2.uploader.destroy(car.images[i].public_id);
      }
  
      await car.remove();
  
      res.status(200).json({
        success: true,
        message: 'Car deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.searchCars = async (req, res, next) => {
    try {
      const { keyword } = req.query;
  
      const cars = await Car.find({
        user: req.user.id,
        $text: { $search: keyword }
      });
  
      res.status(200).json({
        success: true,
        cars
      });
    } catch (error) {
      next(error);
    }
  };