import React, { useState, useEffect } from 'react';
import API from '../services/api';

interface Report {
  employee: string;
  year: number;
  month: number;
  total_hours: number;
  total_minutes: number;
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const fetchReports = async () => {
    try {
      const response = await API.get('/reports/monthly-work/', {
        params: { year, month },
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [year, month]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Monthly Work Reports</h1>
        <div className="mb-4">
          <label className="block">
            Year:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </label>
          <label className="block">
            Month:
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          onClick={fetchReports}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get Reports
        </button>
        {reports.length > 0 ? (
          <div className="mt-6">
            {reports.map((report) => (
              <div
                key={`${report.employee}-${report.year}-${report.month}`}
                className="mt-4 bg-white p-6 rounded shadow"
              >
                <h2 className="text-xl font-bold">
                  {report.employee} - {report.month}/{report.year}
                </h2>
                <p>Total Hours: {report.total_hours}</p>
                <p>Total Minutes: {report.total_minutes}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No reports available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
