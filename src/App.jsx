import React, { useState, useEffect } from 'react';
import SuperAdminLogin from './pages/login/SuperAdminLogin';
import ClientAdminLogin from './pages/login/ClientAdminLogin';

export default function App() {
  // यह सिर्फ यह तय करेगा कि कौन सा लॉगिन पेज दिखे (client या super)
  const [authView, setAuthView] = useState('client'); // डिफ़ॉल्ट रूप से सुपर एडमिन लॉगिन दिखाएं

  // लॉगिन स्क्रीन (क्लाइंट / सुपर एडमिन स्विच करने का विकल्प)
  return (
    <div>
      {authView === 'client' ? (
        <ClientAdminLogin
          onSwitchToSuperAdmin={() => setAuthView('super')}
        />
      ) : (
        <SuperAdminLogin
          onSwitchToClient={() => setAuthView('client')}
        />
      )}
    </div>
  );
}

