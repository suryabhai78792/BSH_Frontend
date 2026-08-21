import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../api'; // (ध्यान रखें कि पाथ आपकी फाइल के हिसाब से सही हो)

// ड्यूरेशन कैलकुलेट करने के लिए एक छोटा हेलपर फंक्शन
function formatDuration(totalSec) {
  if (totalSec < 0) totalSec = 0;
  const hrs = Math.floor((totalSec % (3600 * 24)) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// यह छोटा कंपोनेंट सिर्फ अपने अंदर के समय को हर 1 सेकंड में अपडेट करेगा, बाकी पूरा पेज शांत रहेगा
function DurationTimer({ onlineDateTime, offlineDateTime }) {
  const [durationText, setDurationText] = useState("");

  useEffect(() => {
    // कैलकुलेट करने का फंक्शन
    const updateDuration = () => {
      const onlineDateObj = new Date(onlineDateTime);
      let totalSec = 0;

      if (!offlineDateTime) {
        const diffMs = Date.now() - onlineDateObj.getTime();
        totalSec = Math.floor(diffMs / 1000);
      } else {
        const offlineDateObj = new Date(offlineDateTime);
        const diffMs = offlineDateObj - onlineDateObj;
        totalSec = Math.floor(diffMs / 1000);
      }
      setDurationText(formatDuration(totalSec));
    };

    updateDuration(); // पहली बार तुरंत चलाएं

    // अगर यूजर अभी भी ऑनलाइन है, तभी हर 1 सेकंड में इंटरवल चलाएं
    let timer = null;
    if (!offlineDateTime) {
      timer = setInterval(updateDuration, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [onlineDateTime, offlineDateTime]);

  return <span className="font-mono font-semibold">{durationText}</span>;
}

export default function SuperAdminLoginold({ onSwitchToClient }) {
  const [userId, setUserId] = useState("surya@spreeti.com");
  const [password, setPassword] = useState("Surya%12345");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [historyDataList, setHistoryDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === 'super_admin') {
      setIsLoggedIn(true);
      initSuperAdminDashboard();
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    const product_id = "Business_Software_Hub";
    try {
      const response = await fetch(`${API_BASE_URL}/api/client-admin/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password, product_id })
      });
      const result = await response.json();

      if (response.ok) {
        if (result.role !== 'super_admin') {
          alert("यह सुपर एडमिन लॉगिन पेज है! कृपया क्लाइंट लॉगिन का उपयोग करें।");
          return;
        }
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
        localStorage.setItem("name", result.name || userId);
        setIsLoggedIn(true);
        initSuperAdminDashboard();
      } else {
        alert(result.message || "लॉगिन विफल रहा!");
      }
    } catch (err) {
      console.error("लॉगिन एरर:", err);
      alert("सर्वर से कनेक्ट करने में समस्या आ रही है।");
    } finally {
      setIsLoading(false); // 👈 2. काम पूरा होने पर लोडिंग बंद (चाहे सक्सेस हो या एरर)
    }
  }

  function initSuperAdminDashboard() {
    const socket = io(API_BASE_URL, {
      query: { userId: "super_admin_dashboard", role: "super_admin" }
    });
    socket.on('refreshTable', () => {
      loadUserHistory();
    });
    loadUserHistory();
  }



  async function loadUserHistory() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/super-admin/api/user-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const histories = await response.json();
      setHistoryDataList(histories.filter(item => item.role !== 'super_admin'));
    } catch (err) {
      console.error("हिस्ट्री लोड करने में एरर:", err);
    }
  }

  function logout() {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  }

  async function clearAllHistory() {
    if (confirm("क्या आप वाकई सारी पुरानी हिस्ट्री डिलीट करना चाहते हैं?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/super-admin/api/clear-history`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          alert("हिस्ट्री साफ़ कर दी गई है!");
          loadUserHistory();
        }
      } catch (err) {
        console.error("क्लियर करने में एरर:", err);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!isLoggedIn ? (
        <div>
          {/* स्विच बटन */}
          <div className="text-right mb-5">
            <button
              onClick={onSwitchToClient}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              👥 Client Login पर जाएं
            </button>
          </div>

          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">👑 सुपर एडमिन लॉगिन</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">यूजर आईडी (User ID):</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="यूजर आईडी डालें"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">पासवर्ड (Password):</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="पासवर्ड डालें"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                {isLoading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800">👑 सुपर एडमिन लाइव डैशबोर्ड</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              लॉग आउट (Logout)
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">📊 क्लाइंट यूजर्स की एक्टिविटी हिस्ट्री</h2>
            <button
              onClick={clearAllHistory}
              className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-red-700 transition"
            >
              🗑️ सारी हिस्ट्री साफ़ करें
            </button>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm">
                    <th className="border p-2">S.N</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">User Name</th>
                    <th className="border p-2">Address</th>
                    <th className="border p-2">Mobile</th>
                    <th className="border p-2">Product</th>
                    <th className="border p-2">Online Time</th>
                    <th className="border p-2">Offline Time</th>
                    <th className="border p-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {historyDataList.map((item, index) => {
                    const onlineDateObj = new Date(item.onlineDateTime);
                    let durationText = "";

                    if (!item.offlineDateTime) {
                      // अगर यूजर अभी ऑनलाइन है
                      const diffMs = Date.now() - onlineDateObj.getTime();
                      const totalSec = Math.floor(diffMs / 1000);
                      durationText = formatDuration(totalSec);
                    } else {
                      // अगर यूजर ऑफलाइन हो चुका है
                      const offlineDateObj = new Date(item.offlineDateTime);
                      const diffMs = offlineDateObj - onlineDateObj;
                      const totalSec = Math.floor(diffMs / 1000);
                      durationText = formatDuration(totalSec);
                    }

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{onlineDateObj.toLocaleDateString()}</td>
                        <td className="border p-2 font-medium">{item.name || item.user_id}</td>
                        <td className="border p-2">{item.address || 'उपलब्ध नहीं'}</td>
                        <td className="border p-2">{item.mobile || 'उपलब्ध नहीं'}</td>
                        <td className="border p-2">{item.productId}</td>
                        <td className="border p-2">{onlineDateObj.toLocaleTimeString()}</td>
                        <td className="border p-2">
                          {!item.offlineDateTime ? (
                            <span className="text-green-600 font-bold">🟢 ऑनलाइन है</span>
                          ) : (
                            new Date(item.offlineDateTime).toLocaleTimeString()
                          )}
                        </td>
                        {/* 🟢 यह रहा सही ड्यूरेशन और समय दिखाने वाला कोड */}
                        <td className="border p-2">
                          <DurationTimer
                            onlineDateTime={item.onlineDateTime}
                            offlineDateTime={item.offlineDateTime}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

