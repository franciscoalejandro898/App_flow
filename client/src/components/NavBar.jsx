import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Este efecto se ejecuta cada vez que el componente se monta
    const checkToken = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        setToken(null);
      }
    };

    checkToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // También eliminamos cualquier información de usuario almacenada
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 w-full">
      <div className="container flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link to="/">FlowHydro</Link>
        </div>
        <div>
          {token ? (
            <>
              <Link to="/dashboard" className="text-white px-4">Dashboard</Link>
              <Link to="/users" className="text-white px-4">Users</Link>
              <button onClick={handleLogout} className="text-white px-4">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white px-4">Login</Link>
              <Link to="/register" className="text-white px-4">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
