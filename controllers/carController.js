const Car = require('../models/carModel');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



exports.createCar = async (req, res, next) => {
  try {
    let pics = [];
    console.log('hiiiiiiiiiiiiiiiiiiii');

    // Check if files are uploaded
    if (req.files) {

      // check for number of images 
      if (req.files.length > 10) {
        console.log(req.files.length);
        return res.status(404).json({message: "You can upload maximum 10 pictures."})
      }
      
      // Helper function to handle stream uploads to Cloudinary
      const uploadBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'Nooruddin', // Folder on Cloudinary
              use_filename: true,  // Use original file name
              unique_filename: false, // Keep original filename
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      // Iterate over each file and upload it to Cloudinary
      for (let i = 0; i < req.files.length; i++) {
        const result = await uploadBuffer(req.files[i].buffer); // Await the upload
        console.log(result); // Log the Cloudinary result for debugging
        pics.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    console.log('pics array:', pics);
    console.log('Img Uploaded Successfully!');

    // Create a new car record 
    const { title, description, images, tags, carType, company, dealerName, user } = req.body;
    const car = await Car.create({
      title, 
      description, 
      images: pics, 
      tags, 
      carType, 
      company, 
      dealerName, 
      user,
      // user: req.user._id
    });

    console.log("Car created successfully...!!!");
    res.status(201).json({ success: true, car });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find({ user: req.user.id });
    // check if cars are empty
    if (!cars) {
      return next(new ErrorHandler('No cars found', 404));
    }
    else {
      return res.status(200).json({
        success: true,
        cars
      });
    }
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