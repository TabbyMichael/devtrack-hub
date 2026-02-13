const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Simple fetch wrapper with auth
export const api = {
  async get<T>(url: string): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  },

  async post<T>(url: string, data: any): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  },

  async patch<T>(url: string, data: any): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  },

  async delete<T>(url: string): Promise<T> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  },
};