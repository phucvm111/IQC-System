import type { Product } from '../store/useInspectionStore';

// Determine base URL, handle cases where API is on localhost:5198 or relative to host
// The user backend is running on HTTP 5198 or HTTPS 7264. We will use HTTP 5198 for simplicity.
// For testing across network, you'll need the backend to bind to 0.0.0.0 and replace localhost with the backend IP.
// Since frontend is exposed to network via --host, we'll try to use the host's IP if possible.
const BASE_URL = '/api';

export const scanProductQR = async (qrData: string): Promise<Product> => {
  try {
    const response = await fetch(`${BASE_URL}/products/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ qrData }),
    });

    if (!response.ok) {
      throw new Error(`Failed to scan QR code: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error scanning QR:', error);
    throw error;
  }
};

export const getInspectionHistory = async (inspectorName: string, date: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products/history?inspectorName=${encodeURIComponent(inspectorName)}&date=${encodeURIComponent(date)}`);
    if (!response.ok) throw new Error('Failed to fetch inspections history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const updateProductStatus = async (id: number, status: string, inspectorName: string = '') => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, inspectorName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Invalid credentials');
  return await response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
};

export const createUser = async (user: any) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!response.ok) throw new Error('Failed to create user');
  return await response.json();
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete user');
  return true;
};

export const getAllProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return await response.json();
};

export const getProduct = async (id: number) => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return await response.json();
};

export const uploadProductStep = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${BASE_URL}/products/${id}/step`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Failed to upload file');
  return await response.json();
};

