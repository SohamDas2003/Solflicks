'use client';
import React from 'react';

interface CategoryFormProps {
  formData: {
    name: string;
    description: string;
  };
  editMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancel?: () => void;
}

export default function CategoryForm({
  formData,
  editMode,
  onSubmit,
  onChange,
  onCancel
}: CategoryFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">
        {editMode ? 'Edit Category' : 'Add New Category'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {editMode ? 'Update' : 'Create'}
          </button>
          {editMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}