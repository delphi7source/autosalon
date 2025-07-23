const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'customer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  engineVolume: number;
  power: number;
  color: string;
  vin: string;
  status: 'available' | 'sold' | 'reserved';
  images: string[];
  features: string[];
  description: string;
  isNew: boolean;
  isHit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  carId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  userId: string;
  type: 'test-drive' | 'service' | 'consultation';
  appointmentDate: string;
  appointmentTime: string;
  carId?: string;
  serviceId?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeIn {
  _id: string;
  userId: string;
  evaluationNumber: string;
  carBrand: string;
  carModel: string;
  carYear: number;
  carMileage: number;
  carCondition: string;
  estimatedValue: number;
  status: 'pending' | 'evaluated' | 'approved' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Insurance {
  _id: string;
  userId: string;
  policyNumber: string;
  type: 'kasko' | 'osago';
  carId: string;
  insuranceCompany: string;
  premium: number;
  coverage: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: Partial<User> & { password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Users CRUD
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/users');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Cars CRUD
  async getCars(filters?: Record<string, string>): Promise<ApiResponse<Car[]>> {
    const queryParams = filters ? new URLSearchParams(filters).toString() : '';
    return this.request(`/cars${queryParams ? `?${queryParams}` : ''}`);
  }

  async getCarById(id: string): Promise<ApiResponse<Car>> {
    return this.request(`/cars/${id}`);
  }

  async createCar(carData: Partial<Car>): Promise<ApiResponse<Car>> {
    return this.request('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<ApiResponse<Car>> {
    return this.request(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  }

  async deleteCar(id: string): Promise<ApiResponse<void>> {
    return this.request(`/cars/${id}`, {
      method: 'DELETE',
    });
  }

  // Services CRUD
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request('/services');
  }

  async getServiceById(id: string): Promise<ApiResponse<Service>> {
    return this.request(`/services/${id}`);
  }

  async createService(serviceData: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id: string, serviceData: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id: string): Promise<ApiResponse<void>> {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders CRUD
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request('/orders');
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments CRUD
  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.request('/appointments');
  }

  async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
    return this.request(`/appointments/${id}`);
  }

  async createAppointment(appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // TradeIn CRUD
  async getTradeIns(): Promise<ApiResponse<TradeIn[]>> {
    return this.request('/tradein');
  }

  async getTradeInById(id: string): Promise<ApiResponse<TradeIn>> {
    return this.request(`/tradein/${id}`);
  }

  async createTradeIn(tradeInData: Partial<TradeIn>): Promise<ApiResponse<TradeIn>> {
    return this.request('/tradein', {
      method: 'POST',
      body: JSON.stringify(tradeInData),
    });
  }

  async updateTradeIn(id: string, tradeInData: Partial<TradeIn>): Promise<ApiResponse<TradeIn>> {
    return this.request(`/tradein/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tradeInData),
    });
  }

  async deleteTradeIn(id: string): Promise<ApiResponse<void>> {
    return this.request(`/tradein/${id}`, {
      method: 'DELETE',
    });
  }

  // Insurance CRUD
  async getInsurance(): Promise<ApiResponse<Insurance[]>> {
    return this.request('/insurance');
  }

  async getInsuranceById(id: string): Promise<ApiResponse<Insurance>> {
    return this.request(`/insurance/${id}`);
  }

  async createInsurance(insuranceData: Partial<Insurance>): Promise<ApiResponse<Insurance>> {
    return this.request('/insurance', {
      method: 'POST',
      body: JSON.stringify(insuranceData),
    });
  }

  async updateInsurance(id: string, insuranceData: Partial<Insurance>): Promise<ApiResponse<Insurance>> {
    return this.request(`/insurance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(insuranceData),
    });
  }

  async deleteInsurance(id: string): Promise<ApiResponse<void>> {
    return this.request(`/insurance/${id}`, {
      method: 'DELETE',
    });
  }

  // Statistics and additional methods
  async getCarStatistics(): Promise<ApiResponse<any>> {
    return this.request('/cars/statistics');
  }

  async getOrderStatistics(): Promise<ApiResponse<any>> {
    return this.request('/orders/statistics');
  }

  async getAvailableCars(): Promise<ApiResponse<Car[]>> {
    return this.request('/cars/available');
  }

  async getActiveServices(): Promise<ApiResponse<Service[]>> {
    return this.request('/services/active');
  }

  async getUpcomingAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.request('/appointments/upcoming');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);