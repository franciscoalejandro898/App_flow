import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/users', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
        navigate('/login');
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login')
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/users/${userToDelete.id}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
        
      })
      // Eliminar token del localStorage
      localStorage.removeItem('token');

      
      navigate('/login')
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && currentUser.id === userToDelete.id) {
        await axios.post('http://localhost:8000/api/logout/', {}, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setUsers(users.filter(user => user.id !== userToDelete.id));
        setShowModal(false);
      }
    } catch (error) {
      console.error('Failed to delete user', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="w-full max-w-4xl bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Tabla Usuarios</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">ID</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Username</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Email</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b border-gray-300">{user.id}</td>
                <td className="py-2 px-4 border-b border-gray-300">{user.username}</td>
                <td className="py-2 px-4 border-b border-gray-300">{user.email}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <button className="mr-2 bg-green-500 text-white py-1 px-3 rounded">Editar</button>
                  <button onClick={() => handleDeleteClick(user)} className="bg-red-500 text-white py-1 px-3 rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl mb-4">¿Estás seguro de que deseas eliminar este usuario?</h3>
            <div className="flex justify-end">
              <button onClick={handleDeleteCancel} className="mr-2 bg-gray-500 text-white py-2 px-4 rounded">Cancelar</button>
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white py-2 px-4 rounded">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;

