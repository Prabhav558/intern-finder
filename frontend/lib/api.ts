const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export interface AuthResponse {
  user: { id: string; email: string; name: string; role: string };
  token: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
  code?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'API request failed');
    }
    return response.json();
  }

  // Auth
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role: 'STUDENT' }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    try { await this.request('/api/auth/logout', { method: 'POST' }); } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async getCurrentUser() { return this.request('/api/auth/me'); }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getTokens() {
    return {
      accessToken: this.getToken(),
      refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
    };
  }

  isAuthenticated(): boolean { return this.getToken() !== null; }

  // Student Profile
  async getProfile() { return this.request('/api/students/profile'); }
  async updateProfile(data: Record<string, any>) {
    return this.request('/api/students/profile', { method: 'PUT', body: JSON.stringify(data) });
  }
  async getStatistics() { return this.request('/api/students/statistics'); }

  // Opportunities
  async getOpportunities(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/api/opportunities${query}`);
  }
  async getOpportunity(id: string) { return this.request(`/api/opportunities/${id}`); }
  async getTrendingOpportunities() { return this.request('/api/opportunities/trending'); }

  // Applications
  async applyForOpportunity(opportunityId: string, data: { resumeUrl?: string; coverLetter?: string }) {
    return this.request(`/api/applications/${opportunityId}/apply`, {
      method: 'POST', body: JSON.stringify(data),
    });
  }
  async getMyApplications() { return this.request('/api/students/applications'); }
  async withdrawApplication(applicationId: string) {
    return this.request(`/api/applications/${applicationId}/withdraw`, { method: 'POST' });
  }

  // Bookmarks
  async getMyBookmarks() { return this.request('/api/bookmarks'); }
  async saveBookmark(opportunityId: string) {
    return this.request(`/api/bookmarks/${opportunityId}`, { method: 'POST' });
  }
  async removeBookmark(opportunityId: string) {
    return this.request(`/api/bookmarks/${opportunityId}`, { method: 'DELETE' });
  }
  async checkBookmark(opportunityId: string) {
    return this.request(`/api/bookmarks/check/${opportunityId}`);
  }

  // Admin - Opportunities
  async createOpportunity(data: Record<string, any>) {
    return this.request('/api/opportunities', { method: 'POST', body: JSON.stringify(data) });
  }
  async updateOpportunity(id: string, data: Record<string, any>) {
    return this.request(`/api/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  async deleteOpportunity(id: string) {
    return this.request(`/api/opportunities/${id}`, { method: 'DELETE' });
  }

  // Admin - Applications
  async getApplicationStatistics() { return this.request('/api/applications/statistics'); }
  async getApplicationsByStatus(status: string) {
    return this.request(`/api/applications/by-status/${status}`);
  }
  async updateApplicationStatus(id: string, status: string) {
    return this.request(`/api/applications/${id}/status`, {
      method: 'PATCH', body: JSON.stringify({ status }),
    });
  }
  async getOpportunityApplications(opportunityId: string) {
    return this.request(`/api/opportunities/${opportunityId}/applications`);
  }
  async bulkUpdateApplications(applicationIds: string[], status: string) {
    return this.request('/api/applications/bulk-update', {
      method: 'POST', body: JSON.stringify({ applicationIds, status }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
