import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { handleError } from './error-handler';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://api.example.com';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      SecureStore.setItemAsync('authToken', token);
    } else {
      SecureStore.deleteItemAsync('authToken');
    }
  }

  public async getToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }
    this.token = await SecureStore.getItemAsync('authToken');
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getToken();

    const headers = new Headers(options.headers || {});
    headers.append('Content-Type', 'application/json');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = { ...options, headers };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          router.replace('/login');
        }
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'An error occurred');
      }
      return await response.json();
    } catch (error: any) {
      handleError(error, `API request to ${endpoint} failed`);
      throw error;
    }
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: 'GET' });
  }

  public async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_URL);
