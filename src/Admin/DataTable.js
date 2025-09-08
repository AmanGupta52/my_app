import React from "react";

const DataTable = ({ data, columns, type, onDelete }) => {
  if (!data || data.length === 0) return <p>No data available.</p>;

  return (
    <table className="table table-striped table-bordered">
      <thead className="table-light">
        <tr>
          {columns.map(col => <th key={col}>{col}</th>)}
          {type && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row._id}>
            {columns.map(col => {
              if (col === "Image" && row.img?.data) {
                return (
                  <td key={col}>
                    <img
                      src={`data:${row.img.contentType};base64,${row.img.data}`}
                      alt="profile"
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                    />
                  </td>
                );
              }
              return <td key={col}>{row[col.toLowerCase()] ?? "-"}</td>;
            })}
            {type && (
              <td>
                <button className="btn btn-sm btn-primary me-2">Edit</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(row._id, type)}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
