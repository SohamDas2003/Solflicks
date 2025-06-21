"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiService } from "@/app/utils/apiService";
import { ISeries } from "@/app/_models/Series";

export default function SeriesPage() {
	const [series, setSeries] = useState<ISeries[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchSeries();
	}, []);

	async function fetchSeries(search?: string) {
		setLoading(true);
		setError(null);
		try {
			const response = await apiService.getSeries(search);
			if (response.success && response.series) {
				setSeries(response.series);
			} else {
				setError(response.message || "Failed to fetch series");
			}
		} catch (err) {
			console.error("Error fetching series:", err);
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	}

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		fetchSeries(searchQuery);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this series?")) return;

		try {
			const response = await apiService.deleteSeries(id);
			if (response.success) {
				// Remove the deleted series from the state
				setSeries(series.filter((s) => s._id !== id));
			} else {
				setError(response.message || "Failed to delete series");
			}
		} catch (err) {
			console.error("Error deleting series:", err);
			setError("An unexpected error occurred");
		}
	};

	const getStatusBadge = (status: string) => {
		const statusColors = {
			ongoing: "bg-blue-100 text-blue-800",
			completed: "bg-green-100 text-green-800",
			upcoming: "bg-yellow-100 text-yellow-800",
		};

		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${
					statusColors[status as keyof typeof statusColors] ||
					"bg-gray-100 text-gray-800"
				}`}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-900">Series Management</h1>
				<Link
					href="/dashboard/series/add"
					className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
					Add New Series
				</Link>
			</div>

			{/* Search Form */}
			<form
				onSubmit={handleSearch}
				className="mb-6">
				<div className="flex gap-4">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search series..."
						className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					<button
						type="submit"
						className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
						Search
					</button>
					<button
						type="button"
						onClick={() => {
							setSearchQuery("");
							fetchSeries();
						}}
						className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors">
						Reset
					</button>
				</div>
			</form>

			{/* Error Message */}
			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
					{error}
				</div>
			)}

			{/* Loading State */}
			{loading ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
				</div>
			) : series.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No series found.</p>
					<Link
						href="/dashboard/series/add"
						className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
						Add Your First Series
					</Link>
				</div>
			) : (
				/* Series Table */ <div className="bg-white shadow-md rounded-lg overflow-hidden">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Series
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Year
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Seasons/Episodes
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Genres
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{series.map((s) => (
								<tr
									key={s._id as string}
									className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-16 w-24 flex-shrink-0">
												{s.imageUrl ? (
													<Image
														src={s.imageUrl}
														alt={s.title}
														width={96}
														height={64}
														className="h-16 w-24 object-cover rounded-lg"
													/>
												) : (
													<div className="h-16 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
														<span className="text-gray-400 text-xs">
															No Image
														</span>
													</div>
												)}
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">
													{s.title}
												</div>
												<div className="text-sm text-gray-500">{s.slug}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{s.year}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{s.seasons} seasons, {s.episodes} episodes
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(s.status)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex flex-wrap gap-1">
											{s.genres.slice(0, 2).map((genre, index) => (
												<span
													key={index}
													className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
													{genre}
												</span>
											))}
											{s.genres.length > 2 && (
												<span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
													+{s.genres.length - 2}
												</span>
											)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<Link
											href={`/dashboard/series/edit/${s._id}`}
											className="text-indigo-600 hover:text-indigo-900 mr-4">
											Edit{" "}
										</Link>
										<button
											onClick={() => handleDelete(s._id as string)}
											className="text-red-600 hover:text-red-900">
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
