import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from './api';
import './App.css';
import SuperAdminLogin from './pages/login/SuperAdminLogin'; // 👈 अपने सुपर एडमिन लॉगिन पेज का पाथ दें
//import SuperAdminDashboard from './pages/SuperAdminDashboard'; // 👈 आपका मुख्य सुपर एडमिन डैशबोर्ड

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [historyDataList, setHistoryDataList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('clients');
  const socketRef = useRef(null);

  // 🔄 एक मुख्य फंक्शन जो अंदर ही अंदर टोकन चेक, सॉकेट कनेक्ट और डेटा फेच करेगा
  const initApp = () => {
    setIsLoading(true); // काम शुरू होने पर लोडिंग ऑन करें
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuth(true);
      loadUserHistory();
    } else {
      setIsAuth(false);      
    }
    setIsLoading(false);
  };

  // 1. ऐप पहली बार लोड होने पर यह चलेगा
  useEffect(() => {
    initApp();
  }, []);

  // 🚀 बदलाव 2: यह नया useEffect जोड़ा गया है जो लॉगिन होते ही बैकग्राउंड में एक्टिव हो जाएगा
  useEffect(() => {
    if (!isAuth) return;
    const token = localStorage.getItem('token');

    // 2. सॉकेट कनेक्शन को बैकग्राउंड में कनेक्ट होने दें
    // 3. पुराना सॉकेट बंद करके नया कनेक्ट करें
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(API_BASE_URL, {
      query: { token: token, productId: "Super_Admin_Panel" }
    });

    socketRef.current.on('connect', () => {
      console.log("🟢 सुपर एडमिन सॉकेट कनेक्ट हो गया! ID:", socketRef.current.id);
    });

    // सॉकेट का रिफ्रेश लिसनर बैकग्राउंड में काम करता रहेगा
    socketRef.current.on('refreshTable', () => {
      console.log("🔄 रिफ्रेश टेबल का सिग्नल मिला!");
      loadUserHistory();
    });

    // सफाई (Cleanup) जब यूजर लॉगआउट करे या कंपोनेंट हटे
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuth]);

  // केवल क्लाइंट्स की हिस्ट्री फेच करने के लिए
  async function loadUserHistory() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/super-admin/api/user-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const histories = await response.json();

      // सुपर एडमिन खुद को सूची में न देखे, इसलिए उसे फ़िल्टर कर दें
      setHistoryDataList(histories.filter(item => item.role !== 'super_admin'));
    } catch (err) {
      console.error("हिस्ट्री लोड करने में एरर:", err);
    }
  }

  function formatDuration(totalSec) {
    if (totalSec < 0) totalSec = 0;
    const hrs = Math.floor((totalSec % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setHistoryDataList(prev => [...prev]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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


  function logout() {
    localStorage.clear();
    setIsAuth(false); // 👈 बिना रीलोड किए सीधे स्टेट फॉल्स कर दें
  }

  // जब तक चेक हो रहा है, तब तक गोल घूमने वाला स्पिनर दिखेगा
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🔴 अगर ऑथेंटिकेटेड नहीं है, तो सीधा सुपर एडमिन का लॉगिन पेज दिखाएं
  if (!isAuth) {
    return (
      <SuperAdminLogin
        onLoginSuccess={() => {
          setIsAuth(true);
          initApp(); // 👈 पेज रीलोड करने के बजाय सिर्फ यह फंक्शन चलाएँ
        }}
      />
    );
  }

  // 🟢 अगर ऑथेंटिकेटेड है, तो सुपर एडमिन का मुख्य डैशबोर्ड दिखेगा
  return (
    <div className="body-content">

      {/*-- 👑 सुपर एडमिन डैशबोर्ड (सिर्फ सुपर एडमिन के लिए) --*/}
      <div id="super-admin-dashboard" >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>👑 सुपर एडमिन लाइव डैशबोर्ड</h1>
          <button onClick={logout}
            style={{ background: '#dc3545 ', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            लॉग आउट (Logout)
          </button>
        </div>

        <div className="box">
          <h2 style={{ color: '#007bff' }}>📊 क्लाइंट यूजर्स की एक्टिविटी हिस्ट्री</h2>
          <button onClick={clearAllHistory}
            style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}
          >
            🗑️ सारी हिस्ट्री साफ़ करें (Clear History)
          </button>

          {/* 🔘 यहाँ दोनों बटन जोड़ें */}
          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={() => setSelectedProduct('clients')}
              style={{
                backgroundColor: selectedProduct === 'clients' ? '#007bff' : '#6c757d',
                color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer'
              }}
            >
              👥 क्लाइंट यूजर्स की हिस्ट्री
            </button>

            <button
              onClick={() => setSelectedProduct('superAdmin')}
              style={{
                backgroundColor: selectedProduct === 'superAdmin' ? '#dc3545' : '#6c757d',
                color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px'
              }}
            >
              👑 सुपर एडमिन लॉगिन हिस्ट्री
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>S.N</th>
                <th>Date</th>
                <th>User Name</th>
                <th>address</th>
                <th>mobile</th>
                <th>Product</th>
                <th>Online Time</th>
                <th>Offline Time</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody id="history-table-body">
              {/*-- डेटा यहाँ डायनेमिक लोड होगा --*/}
              {historyDataList.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>कोई क्लाइंट हिस्ट्री उपलब्ध नहीं है</td>
                </tr>
              ) : (
                historyDataList

                  .filter(item => {
                    // 🔍 यहीं पर चुने गए बटन के हिसाब से तुरंत फ़िल्टर कर देगा
                    if (selectedProduct === 'clients') {
                      return item.productId !== 'Super_Admin_Panel'; // क्लाइंट्स दिखाएं
                    } else {
                      return item.productId === 'Super_Admin_Panel'; // सुपर एडमिन दिखाएं
                    }
                  })

                  .map((item, index) => {
                    const onlineDateObj = new Date(item.onlineDateTime);
                    const onlineDateFormatted = onlineDateObj.toLocaleDateString();
                    const onlineTimeFormatted = onlineDateObj.toLocaleTimeString();

                    let offlineFormatted = "";
                    let durationText = "";
                    let dotClass = "dot-black";

                    if (!item.offlineDateTime) {
                      dotClass = "dot-green";
                      offlineFormatted = <span style={{ color: 'green', fontWeight: 'bold' }}>🟢 अभी ऑनलाइन है</span>;

                      const diffMs = Date.now() - onlineDateObj.getTime();
                      const totalSec = Math.floor(diffMs / 1000);
                      durationText = <span style={{ color: 'green', fontWeight: 'bold' }}>{formatDuration(totalSec)}</span>;
                    } else {
                      const offlineDateObj = new Date(item.offlineDateTime);
                      const isSameDay = onlineDateObj.toDateString() === offlineDateObj.toDateString();
                      offlineFormatted = isSameDay ? offlineDateObj.toLocaleTimeString() : offlineDateObj.toLocaleString();

                      const diffMs = offlineDateObj - onlineDateObj;
                      const totalSec = Math.floor(diffMs / 1000);
                      durationText = <b>{formatDuration(totalSec)}</b>;
                    }

                    return (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>{onlineDateFormatted}</td>
                        <td><span className={dotClass}></span>{item.name || item.user_id}</td>
                        <td>{item.address || 'उपलब्ध नहीं'}</td>
                        <td>{item.mobile || 'उपलब्ध नहीं'}</td>
                        <td>{item.productId}</td>
                        <td>{onlineTimeFormatted}</td>
                        <td>{offlineFormatted}</td>
                        <td>{durationText}</td>
                      </tr>
                    );
                  })
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;