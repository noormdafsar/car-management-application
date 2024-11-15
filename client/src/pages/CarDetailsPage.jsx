import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCarDetails, deleteCar } from '../utils/api';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      const data = await getCarDetails(id);
      setCar(data);
    };
    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    await deleteCar(id);
    navigate('/dashboard');
  };

  if (!car) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <img
              src={car.images[0].url}
              alt={car.title}
              className="w-full h-64 object-cover mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">{car.title}</h1>
            <p className="text-gray-700 mb-4">{car.description}</p>
            <p className="text-gray-500 mb-2">
              Car Type: <span className="font-bold">{car.carType}</span>
            </p>
            <p className="text-gray-500 mb-2">
              Company: <span className="font-bold">{car.company}</span>
            </p>
            <p className="text-gray-500 mb-4">
              Dealer: <span className="font-bold">{car.dealerName}</span>
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/car/${id}/edit`)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;