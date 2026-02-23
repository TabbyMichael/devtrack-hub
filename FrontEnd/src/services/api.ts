

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      // Handle token refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { accessToken } = await refreshResponse.json();
            localStorage.setItem('accessToken', accessToken);
            
            // Retry original request
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            return await fetch(`${API_BASE_URL}${endpoint}`, config);
          } else {
            // If refresh fails, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
    }

    return response;
  }

  get = (endpoint: string, params?: Record<string, string>) => {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request(url, { method: 'GET' });
  };

  post = (endpoint: string, data?: any) => {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  put = (endpoint: string, data?: any) => {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  patch = (endpoint: string, data?: any) => {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  delete = (endpoint: string) => {
    return this.request(endpoint, { method: 'DELETE' });
  };
}

export const apiService = new ApiService();