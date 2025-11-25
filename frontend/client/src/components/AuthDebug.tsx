import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebug() {
  const { user, token, isAuthenticated } = useAuth();
  
  const checkLocalStorage = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('🔍 LocalStorage Debug:', {
      token: storedToken ? `${storedToken.substring(0, 20)}...` : 'No token',
      user: storedUser ? JSON.parse(storedUser) : 'No user',
      tokenLength: storedToken?.length || 0
    });

    // Decode JWT token to see its contents
    if (storedToken) {
      try {
        const parts = storedToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log('🔍 JWT Payload:', payload);
          console.log('🔍 Token expires at:', new Date(payload.exp * 1000));
          console.log('🔍 Token issued at:', new Date(payload.iat * 1000));
          console.log('🔍 Is token expired?', Date.now() > payload.exp * 1000);
        }
      } catch (e) {
        console.error('🔍 Failed to decode JWT:', e);
      }
    }
  };

  const testApiCall = async () => {
    try {
      console.log('🧪 Testing API call to /admin/doctors...');
      const response = await fetch('/admin/doctors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('🧪 API Response:', response.status, response.statusText);
      const data = await response.json();
      console.log('🧪 API Data:', data);
    } catch (error) {
      console.error('🧪 API Error:', error);
    }
  };

  const testAxiosCall = async () => {
    try {
      console.log('🧪 Testing axios call to /admin/doctors...');
      // Import api dynamically to avoid circular imports
      const { default: api } = await import('@/lib/api');
      const response = await api.get('/admin/doctors');
      console.log('🧪 Axios Response:', response.status, response.data);
    } catch (error) {
      console.error('🧪 Axios Error:', error);
    }
  };

  const checkJavaBackend = async () => {
    try {
      console.log('🔍 Checking Java backend health...');
      // Try a simple endpoint first
      const response = await fetch('http://localhost:8080/', {
        mode: 'cors'
      });
      console.log('🔍 Java backend status:', response.status);
      
      // Also try with auth to see what happens
      const authResponse = await fetch('http://localhost:8080/admin/doctors', {
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('🔍 Direct Java auth test:', authResponse.status);
      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        console.log('🔍 Java error response:', errorData);
      }
    } catch (error) {
      console.error('🔍 Java backend error:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-sm max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {user?.name || 'None'}</div>
        <div>Role: {user?.role || 'None'}</div>
        <div>Token: {token ? `${token.substring(0, 15)}...` : 'None'}</div>
        <button 
          onClick={checkLocalStorage}
          className="mt-2 px-2 py-1 bg-blue-600 rounded text-xs mr-2"
        >
          Check localStorage
        </button>
        <button 
          onClick={testApiCall}
          className="mt-2 px-2 py-1 bg-green-600 rounded text-xs mr-2"
        >
          Test API
        </button>
        <button 
          onClick={checkJavaBackend}
          className="mt-2 px-2 py-1 bg-red-600 rounded text-xs mr-2"
        >
          Check Java
        </button>
        <button 
          onClick={testAxiosCall}
          className="mt-2 px-2 py-1 bg-purple-600 rounded text-xs"
        >
          Test Axios
        </button>
      </div>
    </div>
  );
}
