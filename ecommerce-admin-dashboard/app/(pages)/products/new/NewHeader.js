import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

const NewHeader = ({ status, handleSubmit, setStatus }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link
        href="/products"
        className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Products
      </Link>
      <div className="flex gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {status === "draft" ? "Save Draft" : "Publish Product"}
        </button>
      </div>
    </div>
  );
};

export default NewHeader;
