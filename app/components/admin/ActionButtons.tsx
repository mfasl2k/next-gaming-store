"use client";

import React, { useState } from "react";
import { FiEdit, FiTrash2, FiEye, FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";

type ActionButtonsProps<T> = {
  item: T;
  itemId: string | number;
  onDelete?: (item: T) => Promise<void>;
  editPath?: string;
  viewPath?: string;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
};

export default function ActionButtons<T>({
  item,
  itemId,
  onDelete,
  editPath,
  viewPath,
  showView = true,
  showEdit = true,
  showDelete = true,
}: ActionButtonsProps<T>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(item);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* View button */}
      {showView && viewPath && (
        <Link
          href={`${viewPath}/${itemId}`}
          className="btn btn-sm btn-ghost text-blue-600"
          aria-label="View details"
        >
          <FiEye size={16} />
        </Link>
      )}

      {/* Edit button */}
      {showEdit && editPath && (
        <Link
          href={`${editPath}/${itemId}`}
          className="btn btn-sm btn-ghost text-green-600"
          aria-label="Edit"
        >
          <FiEdit size={16} />
        </Link>
      )}

      {/* Delete button */}
      {showDelete && onDelete && (
        <>
          {showConfirm ? (
            <div className="flex items-center space-x-1 bg-red-50 p-1 rounded">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-sm btn-error"
                aria-label="Confirm delete"
              >
                {isDeleting ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn-sm btn-ghost "
                aria-label="Cancel delete"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn btn-sm btn-ghost text-red-600"
              aria-label="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
