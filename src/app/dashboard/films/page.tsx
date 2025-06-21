"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiService } from '@/app/utils/apiService';
import { IFilm } from '@/app/_models/Film';

export default function FilmsPage() {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFilms();
  }, []);

  async function fetchFilms(search?: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getFilms(search);
      if (response.success && response.films) {
        setFilms(response.films);
      } else {
        setError(response.message || 'Failed to fetch films');
      }
    } catch (err) {
      console.error('Error fetching films:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilms(searchQuery);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this film?')) return;
    
    try {
      const response = await apiService.deleteFilm(id);
      if (response.success) {
        // Remove the deleted film from the state
        setFilms(films.filter(film => film._id !== id));
      } else {
        setError(response.message || 'Failed to delete film');
      }
    } catch (err) {
      console.error('Error deleting film:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="max-w-container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Films</h1>
        <Link 
          href="/dashboard/films/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Film
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search films..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading films...</p>
        </div>
      ) : films.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No films found</p>
          <Link
            href="/dashboard/films/add"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Your First Film
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Film</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genres</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {films.map((film) => (
                <tr key={film._id as string} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {film.imageUrl ? (
                          <Image
                            src={film.imageUrl}
                            alt={film.title}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No img</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{film.title}</div>
                        <div className="text-sm text-gray-500">{film.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {film.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {film.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {film.genres.map((genre, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/films/edit/${film._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(film._id as string)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}