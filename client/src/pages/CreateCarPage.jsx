import React from 'react';
import Navbar from '../components/Navbar';
import CarForm from '../components/CarForm';
import { useNavigate } from 'react-router-dom';

const CreateCarPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Car</h1>
        <CarForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateCarPage;