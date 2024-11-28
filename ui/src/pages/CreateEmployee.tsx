import React, { useState } from 'react';
import API from '../services/api';

const CreateEmployee: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    position: '',
    isManager: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/employees/create/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        position: formData.position,
        is_manager: formData.isManager,
      });
      setSuccess(response.data.message || 'Employee created.');
      setError('');
      setFormData({
        username: '',
        email: '',
        fullName: '',
        password: '',
        position: '',
        isManager: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-96"
        >
          <h1 className="text-2xl font-bold mb-4">Create Employee</h1>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-500 mb-2">{success}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="isManager"
              checked={formData.isManager}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Is Manager?</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
