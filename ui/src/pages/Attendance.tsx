import React, { useState, useEffect } from "react";
import { useTable, usePagination, useSortBy, Column } from "react-table";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API from "../services/api";

const AttendancePage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");

  const fetchData = async ({
    pageIndex,
    pageSize,
    sortBy,
  }: {
    pageIndex: number;
    pageSize: number;
    sortBy: { id: string; desc?: boolean }[];
  }) => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/attendance/", {
        params: {
          page: pageIndex + 1,
          pageSize,
          sortField: sortBy[0]?.id || "date",
          sortOrder: sortBy[0]?.desc ? "desc" : "asc",
        },
      });

      setData(response.data.results || []);
      setPageCount(Math.ceil(response.data.count / pageSize));
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<any>[] = React.useMemo(
    () => [
      { Header: "Employee Name", accessor: "employee_name" },
      { Header: "Date", accessor: "date" },
      { Header: "Check-In Time", accessor: "check_in_time" },
      { Header: "Check-Out Time", accessor: "check_out_time" },
      { Header: "Late Duration", accessor: "late_duration" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize, sortBy },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = useTable<any>(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      pageCount,
      fetchData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const getSortIndicator = (isSorted: boolean, isSortedDesc: boolean) => {
    if (!isSorted) return null;
    return isSortedDesc ? " 🔽" : " 🔼";
  };

  useEffect(() => {
    fetchData({ pageIndex, pageSize, sortBy });
  }, [pageIndex, pageSize, sortBy]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-grow flex flex-col">
        <Header title="Attendance Records" />
        <div className="p-4 flex-grow">
          {loading && <p className="text-center mt-4">Loading...</p>}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}
          {!loading && !error && (
            <>
              <table
                {...getTableProps()}
                className="w-full border-collapse border border-gray-200"
              >
                <thead className="bg-gray-200">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            (column as any).getSortByToggleProps()
                          )}
                          className="p-2 border border-gray-300 text-left"
                        >
                          {column.render("Header")}
                          {getSortIndicator(
                            (column as any).isSorted,
                            (column as any).isSortedDesc
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="hover:bg-gray-100">
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="p-2 border border-gray-300"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  {"<<"}
                </button>
                <button
                  type="button"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  {"<"}
                </button>
                <span>
                  Page {pageIndex + 1} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  {">"}
                </button>
                <button
                  type="button"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  {">>"}
                </button>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="ml-2 bg-gray-200 px-2 py-1 rounded"
                >
                  {[10, 20, 30, 40, 50].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AttendancePage;
