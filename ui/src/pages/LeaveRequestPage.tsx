import React, { useState, useEffect } from 'react';
import API from '../services/api';

const LeaveRequestPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isManager = user?.role === 'manager';

  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    employeeId: user?.id || '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const fetchEmployees = async () => {
    if (isManager) {
      try {
        const response = await API.get('/employees/');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await API.get('/leave-management/');
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleNewRequest = async () => {
    try {
      await API.post('/leave-management/', {
        employee_id: newRequest.employeeId,
        start_date: newRequest.startDate,
        end_date: newRequest.endDate,
        reason: newRequest.reason,
      });
      fetchLeaveRequests();
      setNewRequest({ ...newRequest, startDate: '', endDate: '', reason: '' });
    } catch (error) {
      console.error('Error creating leave request:', error);
    }
  };

  const handleChangeStatus = async (id: number, status: string) => {
    try {
      await API.post(`/leave-management/${id}/change-status/`, { status });
      fetchLeaveRequests();
    } catch (error) {
      console.error(`Error changing status to ${status}:`, error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const getRequestStatus = (status: string) => {
    if (status === 'pending') return 'text-yellow-500';
    if (status === 'approved') return 'text-green-500';
    return 'text-red-500';
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-grow p-6">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isManager ? 'Leave Requests Management' : 'My Leave Requests'}
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              New Leave Request
            </h2>
            <div className="space-y-4">
              {isManager && (
                <div>
                  <label className="block text-sm text-gray-600">
                    Employee
                  </label>
                  <select
                    name="employeeId"
                    value={newRequest.employeeId}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee: any) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.full_name} ({employee.position})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={newRequest.startDate}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={newRequest.endDate}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Reason</label>
                <textarea
                  name="reason"
                  value={newRequest.reason}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Provide a reason for the leave"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleNewRequest}
                className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition duration-300"
              >
                Submit Request
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {isManager ? 'All Leave Requests' : 'My Leave Requests'}
            </h2>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Remaining Leave Days: {user?.remaining_leave_days || 'N/A'}
              </h2>
            </div>

            <div className="bg-gray-100 rounded-lg shadow-md p-4">
              {leaveRequests.length > 0 ? (
                <ul className="space-y-4">
                  {leaveRequests.map((request: any) => (
                    <li
                      key={request.id}
                      className="bg-white shadow-sm p-4 rounded border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-800 font-medium">
                          {request.start_date} - {request.end_date}
                        </p>
                        <span
                          className={`text-sm font-bold ${getRequestStatus(
                            request.status
                          )}`}
                        >
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.reason}
                      </p>
                      {isManager && request.status === 'pending' && (
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleChangeStatus(request.id, 'approved')
                            }
                            className="px-4 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition duration-300"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleChangeStatus(request.id, 'rejected')
                            }
                            className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition duration-300"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No leave requests available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
