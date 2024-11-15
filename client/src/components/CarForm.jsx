import React, { useState } from 'react';
import { createCar, updateCar } from '../utils/api';

const CarForm = ({ car = null, onSuccess }) => {
  const [title, setTitle] = useState(car?.title || '');
  const [description, setDescription] = useState(car?.description || '');
  const [carType, setCarType] = useState(car?.carType || '');
  const [company, setCompany] = useState(car?.company || '');
  const [dealerName, setDealerName] = useState(car?.dealerName || '');
  const [images, setImages] = useState(car?.images || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('carType', carType);
    formData.append('company', company);
    formData.append('dealerName', dealerName);
    images.forEach((image) => {
      formData.append('images', image);
    });

    if (car) {
      await updateCar(car._id, formData);
    } else {
      await createCar(formData);
    }
    onSuccess();
  };

  const handleImageUpload = (e) => {
    setImages([...images, ...e.target.files]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <label htmlFor="title" className="block font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-3 w-full"
        />
      </div>
      {/* Add similar input fields for other form fields */}
      <div className="mb-4">
        <label htmlFor="images" className="block font-bold mb-2">
          Images
        </label>
        <input
          type="file"
          id="images"
          multiple
          onChange={handleImageUpload}
          className="border border-gray-300 rounded-lg py-2 px-3 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        {car ? 'Update Car' : 'Create Car'}
      </button>
    </form>
  );
};

export default CarForm;