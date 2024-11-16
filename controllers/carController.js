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
      // user,
      user: req.user._id
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
        cars,
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
    console.log("Car details fetched successfully...!!!", car);
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
    let pics = car.images;
    if (req.files && req.files.length > 0) {
      pics = [];
      for (let i = 0; i < req.files.length; i++) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'cars' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.files[i].buffer).pipe(stream);
        });
        
        pics.push({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    }

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      carType: req.body.carType,
      company: req.body.company,
      dealerName: req.body.dealerName,
      tags: req.body.tags.split(',').map(tag => tag.trim()),
      images: pics
    };

    car = await Car.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      car
    });
  } catch (error) {
    console.log('Update error:', error);
    next(new ErrorHandler('Failed to update car', 500));
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
        await cloudinary.uploader.destroy(car.images[i].public_id);
      }
  
      await Car.findByIdAndDelete(req.params.id);
  
      res.status(200).json({
        success: true,
        message: 'Car deleted successfully'
      });
      console.log('Car deleted successfully...!!!', car);
    } catch (error) {
      next(error);
    }
};
  
exports.searchCars = async (req, res, next) => {
    try {
      const { keyword } = req.query;
      
      let searchQuery = {
        user: req.user.id
      };
  
      if (keyword) {
        // Check if keyword is a valid ObjectId
        if (keyword.match(/^[0-9a-fA-F]{24}$/)) {
          searchQuery._id = keyword;
        } else {
          searchQuery.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { carType: { $regex: keyword, $options: 'i' } },
            { company: { $regex: keyword, $options: 'i' } }
          ];
        }
      }
  
      const cars = await Car.find(searchQuery);
      
      res.status(200).json({
        success: true,
        count: cars.length,
        cars
      });
    } catch (error) {
      next(new ErrorHandler(`Search operation failed: ${error.message}`, 500));
    }
};
  
  