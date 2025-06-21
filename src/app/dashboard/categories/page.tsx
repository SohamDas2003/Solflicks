'use client';

import React from 'react';
import CategoryManager from './components/CategoryManager';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
      </div>
      <CategoryManager />
    </div>
  );
}