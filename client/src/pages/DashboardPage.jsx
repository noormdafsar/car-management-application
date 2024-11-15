import React, { useState, useEffect } from 'react';
import { getCars, searchCars } from '../utils/api';
import Navbar from '../components/Navbar';
import CarCard from '../components/CarCard';

const DashboardPage = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      const data = await getCars();
      setCars(data);
    };
    fetchCars();
  }, []);

  const handleSearch = async () => {
    const data = await searchCars(searchTerm);
    setCars(data);
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Search
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;