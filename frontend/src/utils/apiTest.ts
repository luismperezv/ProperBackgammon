import api from '../services/axiosConfig';
import { LoginCredentials, RegisterCredentials } from '../types/auth';

export const testAuthEndpoints = async () => {
  try {
    // Test registration
    const testUser: RegisterCredentials = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    console.log('🔍 Testing registration endpoint...');
    const registerResponse = await api.post('/users/register', testUser);
    console.log('✅ Registration successful:', registerResponse.status === 200);

    // Test login
    const loginCredentials: LoginCredentials = {
      email: testUser.email,
      password: testUser.password,
    };

    console.log('🔍 Testing login endpoint...');
    const loginResponse = await api.post('/auth/token', loginCredentials);
    console.log('✅ Login successful:', loginResponse.status === 200);
    console.log('🔑 Token received:', !!loginResponse.data.access_token);

    // Test protected endpoint
    console.log('🔍 Testing protected endpoint...');
    const userResponse = await api.get('/users/me');
    console.log('✅ Protected endpoint accessible:', userResponse.status === 200);

    // Test invalid login
    console.log('🔍 Testing invalid login...');
    try {
      await api.post('/auth/token', {
        email: 'wrong@email.com',
        password: 'wrongpassword',
      });
    } catch (error: any) {
      console.log('✅ Invalid login handled correctly:', error.response?.status === 401);
    }

    return true;
  } catch (error) {
    console.error('❌ API Test failed:', error);
    return false;
  }
}; 