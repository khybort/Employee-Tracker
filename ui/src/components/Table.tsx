import React from 'react';

interface RowData {
  id: string | number;
  [key: string]: string | number | boolean | null;
}

interface TableProps {
  columns: string[];
  data: RowData[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <table className="w-full border-collapse border border-gray-300 mt-4">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="border border-gray-300 px-4 py-2 text-left"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {' '}
            {columns.map((col) => (
              <td
                key={`${row.id}-${col}`}
                className="border border-gray-300 px-4 py-2"
              >
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
