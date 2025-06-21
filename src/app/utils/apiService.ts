import { IFilm } from "@/app/_models/Film";
import { ISeries } from "@/app/_models/Series";
import { ICategory } from "@/app/_models/Category";
import { ITag } from "@/app/_models/Tag";
import { IAuthor } from "@/app/_models/Author";
import { IBlog } from "@/app/_models/Blog";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	(typeof window !== "undefined" ? window.location.origin : "");

console.log("API_BASE_URL:", API_BASE_URL); // Debug log

interface ApiResponse {
	success: boolean;
	message?: string;
}

interface FilmsResponse extends ApiResponse {
	films?: IFilm[];
}

interface FilmResponse extends ApiResponse {
	film?: IFilm;
}

interface SeriesResponse extends ApiResponse {
	series?: ISeries[];
}

interface SingleSeriesResponse extends ApiResponse {
	series?: ISeries;
}

// Categories interfaces
interface CategoriesResponse extends ApiResponse {
	data?: ICategory[];
}

interface CategoryResponse extends ApiResponse {
	data?: ICategory;
}

// Tags interfaces
interface TagsResponse extends ApiResponse {
	data?: ITag[];
}

interface TagResponse extends ApiResponse {
	data?: ITag;
}

// Authors interfaces
interface AuthorsResponse extends ApiResponse {
	data?: IAuthor[];
}

interface AuthorResponse extends ApiResponse {
	data?: IAuthor;
}

// Blogs interfaces
interface BlogsResponse extends ApiResponse {
	blogs?: IBlog[];
	pagination?: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		hasMore: boolean;
		itemsPerPage: number;
	};
}

interface BlogResponse extends ApiResponse {
	blog?: IBlog;
}

class ApiService {
	private getHeaders() {
		return {
			"Content-Type": "application/json",
		};
	}

	// Films API methods
	async getFilms(search?: string): Promise<FilmsResponse> {
		const url = search
			? `${API_BASE_URL}/api/films?search=${encodeURIComponent(search)}`
			: `${API_BASE_URL}/api/films`;

		const response = await fetch(url, {
			headers: this.getHeaders(),
		});

		return response.json();
	}
	async getFilm(id: string): Promise<FilmResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/films/${id}`, {
				headers: this.getHeaders(),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error in getFilm:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async getFilmBySlug(slug: string): Promise<FilmResponse> {
		const response = await fetch(`${API_BASE_URL}/api/films/slug/${slug}`, {
			headers: this.getHeaders(),
		});

		return response.json();
	}

	async createFilm(filmData: Partial<IFilm>): Promise<FilmResponse> {
		const response = await fetch(`${API_BASE_URL}/api/films`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(filmData),
		});

		return response.json();
	}
	async updateFilm(
		id: string,
		filmData: Partial<IFilm>
	): Promise<FilmResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/films/${id}`, {
				method: "PUT",
				headers: this.getHeaders(),
				body: JSON.stringify(filmData),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error in updateFilm:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async deleteFilm(id: string): Promise<ApiResponse> {
		const response = await fetch(`${API_BASE_URL}/api/films/${id}`, {
			method: "DELETE",
			headers: this.getHeaders(),
		});

		return response.json();
	}

	// Series API methods
	async getSeries(search?: string): Promise<SeriesResponse> {
		const url = search
			? `${API_BASE_URL}/api/series?search=${encodeURIComponent(search)}`
			: `${API_BASE_URL}/api/series`;

		const response = await fetch(url, {
			headers: this.getHeaders(),
		});

		return response.json();
	}
	async getSeriesById(id: string): Promise<SingleSeriesResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/series/${id}`, {
				headers: this.getHeaders(),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error in getSeriesById:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async getSeriesBySlug(slug: string): Promise<SingleSeriesResponse> {
		const response = await fetch(`${API_BASE_URL}/api/series/slug/${slug}`, {
			headers: this.getHeaders(),
		});

		return response.json();
	}

	async createSeries(
		seriesData: Partial<ISeries>
	): Promise<SingleSeriesResponse> {
		const response = await fetch(`${API_BASE_URL}/api/series`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(seriesData),
		});

		return response.json();
	}
	async updateSeries(
		id: string,
		seriesData: Partial<ISeries>
	): Promise<SingleSeriesResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/series/${id}`, {
				method: "PUT",
				headers: this.getHeaders(),
				body: JSON.stringify(seriesData),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error in updateSeries:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}
	async deleteSeries(id: string): Promise<ApiResponse> {
		const response = await fetch(`${API_BASE_URL}/api/series/${id}`, {
			method: "DELETE",
			headers: this.getHeaders(),
		});

		return response.json();
	}
	// Categories API methods
	async getCategories(): Promise<CategoriesResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/categories`, {
				headers: this.getHeaders(),
			});
			return response.json();
		} catch (error) {
			console.error("Error fetching categories:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async createCategory(
		categoryData: Partial<ICategory>
	): Promise<CategoryResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/categories`, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify(categoryData),
			});
			return response.json();
		} catch (error) {
			console.error("Error creating category:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}
	async updateCategory(
		id: string,
		categoryData: Partial<ICategory>
	): Promise<CategoryResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/categories`, {
				method: "PUT",
				headers: this.getHeaders(),
				body: JSON.stringify({ id, ...categoryData }),
			});
			return response.json();
		} catch (error) {
			console.error("Error updating category:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async deleteCategory(id: string): Promise<ApiResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/categories?id=${id}`, {
				method: "DELETE",
				headers: this.getHeaders(),
			});
			return response.json();
		} catch (error) {
			console.error("Error deleting category:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}
	// Tags API methods
	async getTags(): Promise<TagsResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/tags`, {
				headers: this.getHeaders(),
			});
			return response.json();
		} catch (error) {
			console.error("Error fetching tags:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async createTag(tagData: Partial<ITag>): Promise<TagResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/tags`, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify(tagData),
			});
			return response.json();
		} catch (error) {
			console.error("Error creating tag:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async deleteTag(id: string): Promise<ApiResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/tags?id=${id}`, {
				method: "DELETE",
				headers: this.getHeaders(),
			});
			return response.json();
		} catch (error) {
			console.error("Error deleting tag:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}
	// Authors API methods
	async getAuthors(): Promise<AuthorsResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/authors`, {
				headers: this.getHeaders(),
			});
			return response.json();
		} catch (error) {
			console.error("Error fetching authors:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async createAuthor(authorData: Partial<IAuthor>): Promise<AuthorResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/authors`, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify(authorData),
			});
			return response.json();
		} catch (error) {
			console.error("Error creating author:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}
	async deleteAuthor(id: string): Promise<ApiResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/authors?id=${id}`, {
				method: "DELETE",
				headers: this.getHeaders(),
			});
			return response.json();
		} catch (error) {
			console.error("Error deleting author:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}
	// Blogs API methods
	async getBlogs(params?: {
		page?: number;
		limit?: number;
		published?: boolean;
		search?: string;
		categories?: string[];
	}): Promise<BlogsResponse> {
		try {
			const searchParams = new URLSearchParams();

			if (params?.page) searchParams.append("page", params.page.toString());
			if (params?.limit) searchParams.append("limit", params.limit.toString());
			if (params?.published !== undefined)
				searchParams.append("published", params.published.toString());
			if (params?.search) searchParams.append("search", params.search);
			if (params?.categories?.length) {
				params.categories.forEach((cat) =>
					searchParams.append("categories", cat)
				);
			}

			const url = `${API_BASE_URL}/api/blogs${
				searchParams.toString() ? `?${searchParams.toString()}` : ""
			}`;

			console.log("Fetching blogs from URL:", url); // Debug log

			const response = await fetch(url, {
				headers: this.getHeaders(),
			});

			console.log("Response status:", response.status); // Debug log

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Response error:", errorText); // Debug log
				throw new Error(
					`HTTP error! status: ${response.status}, message: ${errorText}`
				);
			}

			const data = await response.json();
			console.log("Response data:", data); // Debug log

			return data;
		} catch (error) {
			console.error("Error fetching blogs:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async getBlog(id: string): Promise<BlogResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
				headers: this.getHeaders(),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response.json();
		} catch (error) {
			console.error("Error fetching blog:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	async getBlogBySlug(slug: string): Promise<BlogResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/api/blogs/slug/${slug}`, {
				headers: this.getHeaders(),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response.json();
		} catch (error) {
			console.error("Error fetching blog by slug:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}
}

export const apiService = new ApiService();
