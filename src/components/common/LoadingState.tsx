import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="bg-white rounded-md shadow p-8 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}