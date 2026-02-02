// API Configuration and Helper Functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'patient' | 'caregiver' | 'clinician';
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hyperwatch_token');
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API Client Class
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Authentication APIs
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  }

  // User Profile APIs
  async getUserProfile(): Promise<any> {
    const response = await fetch(`${this.baseURL}/users/profile`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    return response.json();
  }

  async updateUserProfile(data: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  // Patient APIs
  async getAssignedPatients(): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/users/patients`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get patients');
    }

    return response.json();
  }

  async getPatientsOverview(): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/users/patients/overview`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get patients overview');
    }

    return response.json();
  }

  async getPatientDetail(patientId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/users/patients/${patientId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get patient details');
    }

    return response.json();
  }

  async createPatient(data: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/users/patients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create patient');
    }

    return response.json();
  }

  // Vitals APIs
  async submitVitals(data: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/vitals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit vitals');
    }

    return response.json();
  }

  async getLiveVitals(patientId?: string): Promise<any> {
    const url = patientId 
      ? `${this.baseURL}/vitals/live?patient_id=${patientId}`
      : `${this.baseURL}/vitals/live`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get live vitals');
    }

    return response.json();
  }

  async getVitalsHistory(patientId?: string, hours: number = 24, limit: number = 100): Promise<any[]> {
    let url = `${this.baseURL}/vitals/history?hours=${hours}&limit=${limit}`;
    if (patientId) {
      url += `&patient_id=${patientId}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get vitals history');
    }

    return response.json();
  }

  async getVitalsTrends(patientId?: string, period: string = '24h'): Promise<any[]> {
    let url = `${this.baseURL}/vitals/trends?period=${period}`;
    if (patientId) {
      url += `&patient_id=${patientId}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get vitals trends');
    }

    return response.json();
  }

  async calibrateDevice(): Promise<any> {
    const response = await fetch(`${this.baseURL}/vitals/calibrate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to calibrate device');
    }

    return response.json();
  }

  async getCalibrationStatus(): Promise<any> {
    const response = await fetch(`${this.baseURL}/vitals/calibration-status`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get calibration status');
    }

    return response.json();
  }

  // Alerts APIs
  async getAlerts(params?: { patient_id?: string; alert_type?: string; is_read?: boolean; limit?: number }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.patient_id) queryParams.append('patient_id', params.patient_id);
    if (params?.alert_type) queryParams.append('alert_type', params.alert_type);
    if (params?.is_read !== undefined) queryParams.append('is_read', String(params.is_read));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    const url = `${this.baseURL}/alerts?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get alerts');
    }

    return response.json();
  }

  async createAlert(data: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/alerts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create alert');
    }

    return response.json();
  }

  async markAlertAsRead(alertId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/alerts/${alertId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to mark alert as read');
    }

    return response.json();
  }

  async resolveAlert(alertId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/alerts/${alertId}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to resolve alert');
    }

    return response.json();
  }

  async getAlertStats(patientId?: string): Promise<any> {
    const url = patientId 
      ? `${this.baseURL}/alerts/stats?patient_id=${patientId}`
      : `${this.baseURL}/alerts/stats`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get alert stats');
    }

    return response.json();
  }

  // Dashboard APIs
  async getPatientDashboard(): Promise<any> {
    const response = await fetch(`${this.baseURL}/dashboard/patient`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get patient dashboard');
    }

    return response.json();
  }

  async getCaregiverDashboard(): Promise<any> {
    const response = await fetch(`${this.baseURL}/dashboard/caregiver`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get caregiver dashboard');
    }

    return response.json();
  }

  async getClinicianDashboard(): Promise<any> {
    const response = await fetch(`${this.baseURL}/dashboard/clinician`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get clinician dashboard');
    }

    return response.json();
  }

  // Health Check
  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseURL}/health`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new APIClient(API_BASE_URL);

// Export API base URL
export { API_BASE_URL };
