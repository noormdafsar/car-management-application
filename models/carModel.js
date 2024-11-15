const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter car title'],
    trim: true,
    maxLength: [100, 'Car title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter car description']
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  tags: [{
    type: String,
    required: true
  }],
  carType: {
    type: String,
    required: [true, 'Please enter car type']
  },
  company: {
    type: String,
    required: [true, 'Please enter car company']
  },
  dealerName: {
    type: String,
    required: [true, 'Please enter dealer name']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
carSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Car', carSchema);