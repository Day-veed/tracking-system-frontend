import { Injectable } from '@angular/core';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
    this.axiosInstance.interceptors.request.use(this.addAuthToken);
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      this.handleErrorResponse
    );
  }

  private addAuthToken = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = this.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  };

  private handleErrorResponse = async (error: any) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await this.refreshAccessToken();
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return this.axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  };

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    const response = await axios.post(`${this.apiUrl}/token`, { token: refreshToken });
    const { accessToken } = response.data;
    this.setAccessToken(accessToken);
    return accessToken;
  }

  async login(email: string, password: string) {
    const response = await axios.post(`${this.apiUrl}/login`, { email, password });
    const { accessToken, refreshToken } = response.data;
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    await axios.post(`${this.apiUrl}/register`, { username, email, password });
  }

  logout() {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable()) {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }

  getAccessToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private setAccessToken(token: string) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('accessToken', token);
    }
  }

  private setRefreshToken(token: string) {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('refreshToken', token);
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  async get(url: string) {
    return this.axiosInstance.get(url);
  }

  async post(url: string, data: any) {
    return this.axiosInstance.post(url, data);
  }

  async put(url: string, data: any) {
    return this.axiosInstance.put(url, data);
  }

  async delete(url: string) {
    return this.axiosInstance.delete(url);
  }
}
