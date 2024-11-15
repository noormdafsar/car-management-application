export const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
  
      const { token } = await response.json();
      localStorage.setItem('token', token);
    } catch (error) {
      throw error;
    }
  };
  
  export const login = async (email, password) => {
    try {
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
  
      const { token } = await response.json();
      localStorage.setItem('token', token);
    } catch (error) {
      throw error;
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };