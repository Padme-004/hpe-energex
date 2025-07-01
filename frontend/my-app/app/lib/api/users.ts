// app/lib/api/users.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
}

export interface User {
  userId: number;
  email: string;
  anonymousName: string;
  profileStatus: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  houseId: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  decodedToken: {
    userId: number;
    houseId: number;
    email: string;
    username: string;
    role: string;
  };
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileStatusPayload {
  userId: number;
  profileStatus: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const UserService = {
  async register(
    payload: RegisterPayload
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('This email is already registered');
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      }
    } catch (parseError) {
      if (!response.ok) {
        throw new Error(responseText || 'Registration failed');
      }
    }
  },

  async login(
    payload: LoginPayload
  ): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const authHeader = response.headers.get('Authorization');
    const accessToken = authHeader ? authHeader.replace('Bearer ', '') : data.accessToken;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    // Decode token
    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));

    if (!decodedToken) {
      throw new Error('Received invalid token format');
    }

    return {
      accessToken,
      decodedToken: {
        userId: decodedToken.userId,
        houseId: decodedToken.houseId,
        email: decodedToken.email,
        username: decodedToken.username,
        role: decodedToken.role
      }
    };
  },

  async changePassword(
    passwordData: ChangePasswordPayload,
    token?: string | null
  ): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(passwordData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText);
    }

    return responseText;
  },

  async getAllUsers(token: string): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/users/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  },

  async updateProfileStatus(
    payload: UpdateProfileStatusPayload,
    token: string
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users/profile-status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update status');
    }
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }
  },

  async logout(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },
};