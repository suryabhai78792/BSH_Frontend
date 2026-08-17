import React, { useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../api'; // (ध्यान रखें कि पाथ आपकी फाइल के हिसाब से सही हो)



export default function ClientAdminLogin({ onSwitchToSuperAdmin }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [email, setEmail] = useState("surya@spreeti.com");
  const [password, setPassword] = useState("Surya%12345");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liveData, setLiveData] = useState({ count: 0, users: [] });

  function selectProduct(productId) {
    setSelectedProduct(productId);
  }

  async function loginAndConnect() {
    if (!selectedProduct) {
      alert("कृपया पहले ऊपर दिए गए बटनों में से कोई एक प्रोडक्ट चुनें!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/client-admin/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: email,
          password: password,
          product_id: selectedProduct
        })
      });

      const data = await response.json();

      if (response.ok) {        
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'client_admin');
        alert("Login Success! Token value: " + data.token);
        
        // 🔍 यहाँ चेक करें कि कौन सा प्रोडक्ट चुना गया है
        if (selectedProduct === 'Finance_Tracker') {
          // अगर फाइनेंस ऐप है, तो सीधे आपके इस रेंडर वाले लाइव एड्रेस पर भेज देगा
          window.location.href = `https://surya-income-deshboard.onrender.com?token=${data.token}&role=client_admin`;
        } else {
          // अगर कमेटी ऐप है, तो पुराना वाला सिंपल डैशबोर्ड ही दिखेगा
          setIsLoggedIn(true);
        }

        const socket = io(API_BASE_URL, {
          query: {
            token: data.token,
            productId: selectedProduct
          }
        });

        setInterval(() => {
          if (socket && socket.connected) {
            socket.emit('client_heartbeat');
          }
        }, 60000);

        socket.on('liveUsersUpdate', (socketData) => {
          setLiveData(socketData);
        });

      } else {
        alert("लॉगिन फेल: " + data.message);
      }
    } catch (err) {
      console.error("एरर:", err);
      alert("सर्वर से कनेक्ट करने में समस्या हुई!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!isLoggedIn ? (
        <div>
          {/* सुपर एडमिन पर जाने के लिए बटन */}
          <div className="text-right mb-5">
            <button
              onClick={onSwitchToSuperAdmin}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              👥 Super-Admin Login पर जाएं
            </button>
          </div>

          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">क्लाइंट एडमिन लॉगिन</h3>
            <p className="text-sm text-gray-600 text-center mb-6">पहले अपना प्रोडक्ट चुनें:</p>

            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => selectProduct('Finance_Tracker')}
                className={`w-full py-3 px-4 rounded-md font-bold text-white transition ${selectedProduct === 'Finance_Tracker' ? 'bg-blue-600 shadow-md' : 'bg-gray-500 hover:bg-gray-600'}`}
              >
                💰 फाइनेंस ऐप (Finance Tracker)
              </button>
              <button
                type="button"
                onClick={() => selectProduct('Committee_Management')}
                className={`w-full py-3 px-4 rounded-md font-bold text-white transition ${selectedProduct === 'Committee_Management' ? 'bg-blue-600 shadow-md' : 'bg-gray-500 hover:bg-gray-600'}`}
              >
                🤝 कमेटी ऐप (Committee Management)
              </button>
            </div>

            {selectedProduct && (
              <div className="border-t pt-4 space-y-4">
                <h4 className="text-blue-600 font-semibold text-center">
                  Selected: {selectedProduct === 'Finance_Tracker' ? 'Finance Tracker ऐप' : 'Committee Management ऐप'}
                </h4>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ईमेल दर्ज करें"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="पासवर्ड दर्ज करें"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm"
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={loginAndConnect}
                  className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition"
                >
                  लॉगिन करके सॉकेट जोड़ें
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">✔ लॉगिन सफल! सॉकेट कनेक्ट हो गया है।</h2>
          <h3 className="text-gray-700 font-medium mb-4">सक्रिय ऐप: {selectedProduct}</h3>
          <h3 className="text-lg font-semibold mb-2">ऑनलाइन यूजर काउंट: <span className="text-blue-600">{liveData.count}</span></h3>
          <h3 className="text-md font-semibold text-left mt-4 mb-2">ऑनलाइन यूजर्स की लाइव लिस्ट:</h3>
          <ul className="text-left bg-gray-50 p-4 rounded border space-y-2">
            {liveData.users.map((user, idx) => (
              <li key={idx} className="text-sm border-b pb-1">
                यूजर: <span className="font-medium">{user.name}</span> | सॉफ्टवेयर: {user.productId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}