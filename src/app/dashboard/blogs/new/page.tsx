"use client"

import React from 'react';
import BlogForm1 from '../components/BlogForm1';

const NewBlogPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Create New Blog Post</h1>
      <BlogForm1 onCancel={() => {
      window.history.back();
      }} />
    </div>
  );
};

export default NewBlogPage;