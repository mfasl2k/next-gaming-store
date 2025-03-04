"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export type ColumnDefinition<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: ColumnDefinition<T>[];
  data: T[];
  keyField: keyof T;
  onDelete?: (item: T) => void;
  onEdit?: (item: T) => void;
  editPath?: string;
  showActions?: boolean;
  isLoading?: boolean;
};

export default function DataTable<T>({
  columns,
  data,
  keyField,
  onDelete,
  onEdit,
  editPath,
  showActions = true,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((item) => {
    return columns.some((column) => {
      const value = item[column.accessorKey];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input input-bordered w-full pl-10"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="table w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.accessorKey)} className="px-4 py-2">
                  {column.header}
                </th>
              ))}
              {showActions && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={`loading-${index}-${String(column.accessorKey)}`}
                      className="px-4 py-2"
                    >
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  )}
                </tr>
              ))
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {searchTerm ? "No results found" : "No data available"}
                </td>
              </tr>
            ) : (
              currentData.map((item) => (
                <tr key={String(item[keyField])} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={String(column.accessorKey)} className="px-4 py-2">
                      {column.cell
                        ? column.cell(item)
                        : String(item[column.accessorKey] || "")}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        {editPath ? (
                          <Link
                            href={`${editPath}/${item[keyField]}`}
                            className="btn btn-sm btn-ghost text-blue-500"
                          >
                            <FiEdit size={16} />
                          </Link>
                        ) : onEdit ? (
                          <button
                            onClick={() => onEdit(item)}
                            className="btn btn-sm btn-ghost text-blue-500"
                          >
                            <FiEdit size={16} />
                          </button>
                        ) : null}

                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="btn btn-sm btn-ghost text-red-500"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                page === currentPage ||
                page === currentPage - 1 ||
                page === currentPage + 1
              ) {
                return (
                  <button
                    key={page}
                    className={`join-item btn ${
                      currentPage === page ? "btn-active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              } else if (page === 2 || page === totalPages - 1) {
                return (
                  <button key={page} className="join-item btn btn-disabled">
                    ...
                  </button>
                );
              }
              return null;
            })}

            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
