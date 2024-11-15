import { getToken } from './auth';

const API_BASE_URL = '/api/v1';

export const getCars = async () => {
  const response = await fetch(`${API_BASE_URL}/cars`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  return data.cars;
};

export const createCar = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/car/new`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
    body: formData,
  });
  const data = await response.json();
  return data.car;
};

export const getCarDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/car/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  return data.car;
};

export const updateCar = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/car/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
    body: formData,
  });
  const data = await response.json();
  return data.car;
};

export const deleteCar = async (id) => {
  const response = await fetch(`${API_BASE_URL}/car/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  await response.json();
};

export const searchCars = async (keyword) => {
  const response = await fetch(`${API_BASE_URL}/cars/search?keyword=${keyword}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  return data.cars;
};