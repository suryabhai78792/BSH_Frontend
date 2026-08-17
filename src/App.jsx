import React, { useState, useEffect } from 'react';
import SuperAdminLogin from './pages/login/SuperAdminLogin';
import ClientAdminLogin from './pages/login/ClientAdminLogin';

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [authView, setAuthView] = useState('client'); // डिफ़ॉल्ट रूप से सुपर एडमिन लॉगिन दिखाएं

  // अगर यूजर सुपर एडमिन के रूप में लॉगिन है
  if (role === 'super_admin') {
    return (
      <SuperAdminLogin
        onLogout={() => {
          localStorage.clear();
          setRole("");
          setToken("");
        }}
      />
    );
  }

  // अगर कोई क्लाइंट एडमिन लॉगिन करना चाहे
  if (role === 'client_admin') {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">यह क्लाइंट एडमिन पोर्टल है।</h2>
        <p className="text-gray-600 mb-4">आपका फाइनेंस ट्रैकर ऐप सफलतापूर्वक लॉगिन है।</p>
        <button
          onClick={() => { localStorage.clear(); setRole(""); setToken(""); }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          लॉग आउट करें
        </button>
      </div>
    );
  }

  // लॉगिन स्क्रीन (क्लाइंट / सुपर एडमिन स्विच करने का विकल्प)
  return (
    <div>
      {authView === 'client' ? (
        <ClientAdminLogin
          onSwitchToSuperAdmin={() => setAuthView('super')}
          onLoginSuccess={() => {
            setRole(localStorage.getItem("role"));
            setToken(localStorage.getItem("token"));
          }}
        />
      ) : (
        <SuperAdminLogin
          onSwitchToClient={() => setAuthView('client')}
          onLoginSuccess={() => {
            setRole(localStorage.getItem("role"));
            setToken(localStorage.getItem("token"));
          }}
        />
      )}
    </div>
  );
}