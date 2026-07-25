import React from 'react';
import { LayoutDashboard, CreditCard, Receipt, BarChart3, Settings, Plus, Bell, User, Menu, X  } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'

import './App.css'
import InternetClock from './components/InternetClock';
import { convertDataByMode } from './components/dataConverter';
import MyButton from './components/MyButton';
import DashboardView from './pages/DashboardView';
import TransactionsView from './pages/TransactionsView';
import LoanManager from './pages/loanManagers';

const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'];

// --- मुख्य डैशबोर्ड कंपोनेंट ---
 function App() {

 // स्टेट्स (States)


  const [databaseData, setDatabaseData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const latestDataRef = useRef({}) // 🔥 लेटेस्ट डेटा को बिना री-रेंडर ट्रैक करने के लिए
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedMonth, setSelectedMonth] = useState('Jan')
  const [incomeInput, setIncomeInput] = useState('')
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' या 'transactions' loanManager
  
  const [viewMode, setViewMode] = useState('yearly'); // 'daily', 'yearly', 'final'
  const [dateInput, setDateInput] = useState(''); // YYYY-MM-DD फॉर्मेट के लिए
  const [isLoading, setIsLoading] = useState(true); // शुरू में लोडिंग दिखाएं
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);




  const modalContainerRef = useRef(null)
  const modalRef = useRef(null);

  // API URLs
  const GET_DATA_URL = 'https://my-income-backend.onrender.com/getdata'
  const SAVE_DATA_URL = 'https://my-income-backend.onrender.com/save'


// यह पता लगाने के लिए कि क्या डिवाइस सच में डेस्कटॉप है या मोबाइल में डेस्कटॉप मोड है
    const [deviceStatus, setDeviceStatus] = useState(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    const ua = navigator.userAgent;
    const isDesktopSite = !/Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) && (ua.includes('Macintosh') || ua.includes('Windows') || ua.includes('X11') || width >= 768);
    
    if (width >= 1024 && !/Android|webOS|iPhone|iPad|iPod/i.test(ua)) {
      return 'desktop';
    }
    if (isDesktopSite) {
      return isLandscape ? 'desktop' : 'tablet'; // अगर डेस्कटॉप साइट ऑन है और पोर्ट्रेट है तो टैबलेट व्यू
    }
    return isLandscape ? 'mobile-landscape' : 'mobile-portrait';
  });

  // 2. useEffect को अपडेट करें
  useEffect(() => {
    const updateDeviceStatus = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      const ua = navigator.userAgent;

      // असली डेस्कटॉप या लैपटॉप
      if (width >= 1024 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setDeviceStatus('desktop');
        return;
      }

      // मोबाइल में "Desktop Site" ऑन होने पर चेक करें
      const isDesktopSiteActive = !/Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) && (ua.includes('Macintosh') || ua.includes('Windows') || ua.includes('X11') || width >= 768);

      if (isDesktopSiteActive) {
        if (isLandscape) {
          setDeviceStatus('desktop');
        } else {
          setDeviceStatus('tablet'); // <--- यहाँ टैबलेट व्यू सेट होगा
        }
        return;
      }

      // सामान्य मोबाइल व्यू (जब डेस्कटॉप साइट ऑफ हो)
      if (isLandscape) {
        setDeviceStatus('mobile-landscape');
      } else {
        setDeviceStatus('mobile-portrait');
      }
    };

    updateDeviceStatus();
    window.addEventListener('resize', updateDeviceStatus);
    window.addEventListener('orientationchange', updateDeviceStatus);

    return () => {
      window.removeEventListener('resize', updateDeviceStatus);
      window.removeEventListener('orientationchange', updateDeviceStatus);
    };
  }, []);

  // API: Load Table Data
  const loadTableData = () => {
       setIsLoading(true); // डेटा आते ही लोडिंग बंद करें
    fetch('https://my-income-backend.onrender.com/getdata')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
            setDatabaseData(data);
            latestDataRef.current = data; // 🔥 स्टेट के साथ-साथ रीफ़ में भी लेटेस्ट डेटा रख लें       
  
      })
          .catch(err => {
            console.error("लोड एरर:", err)
          } )
  };

  // 1. पहला इफेक्ट: सिर्फ स्क्रीन लोड होने पर बैकएंड से डेटा लाएगा
  useEffect(() => {
    loadTableData();
  }, []);

        // Input Validation Effect
  useEffect(() => {
    if (incomeInput.trim() !== "" && dateInput.trim() !== "") {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
  }, [incomeInput, dateInput]);

  // API: Save Data
  const saveData = () => {
    fetch('https://my-income-backend.onrender.com/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateInput, income: Number(incomeInput) })
    })
    .then(res => {
      if (!res.ok) throw new Error("सेव करने में गड़बड़");
      setIncomeInput("");
      setShowModal(false);
      loadTableData();
    })
    .catch(err => {
      console.error(err);
      alert("डेटा सेव नहीं हो पाया!");
    });
  };


  // 5. बैकअप डेटा डाउनलोड लॉजिक
  const handleDownloadBackup = () => {
    fetch(GET_DATA_URL)
      .then(res => res.json())
      .then(data => {
        let blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "MyIncomeData.json";
        a.click();
      });
  }

  // 6. ड्रैगेबल मोडल हेडर फंक्शनलिटी (रिएक्ट वे)
  const handleMouseDown = (e) => {
    if (window.innerWidth < 600) return; 
    const container = modalRef.current;
    if (!container) return;

    let offsetX = e.clientX - container.offsetLeft;
    let offsetY = e.clientY - container.offsetTop;

    function mouseMoveHandler(e) {
      container.style.position = "absolute";
      container.style.left = (e.clientX - offsetX) + "px";
      container.style.top = (e.clientY - offsetY) + "px";
      container.style.margin = "0";
    }

    function mouseUpHandler() {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

return (
<div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
    
    {/* हेडर जिसमें आपका स्टेटस दिखता है */}
    <header className="...">
      {/* ... आपका हेडर कोड ... */}
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
        {deviceStatus === 'mobile-portrait' && <span>मोबाइल पोर्ट्रेट व्यू</span>}
        {deviceStatus === 'mobile-landscape' && <span>मोबाइल लैंडस्केप व्यू</span>}
        {deviceStatus === 'tablet' && <span>टैबलेट व्यू</span>}
        {deviceStatus === 'desktop' && <span>डेस्कटॉप मोड</span>}
      </div>
    </header>

    {/* मुख्य कंटेंट जहाँ आप अलग-अलग लेआउट रेंडर करेंगे */}
    <div className="flex-1 overflow-hidden">

      {/* 1. मोबाइल पोर्ट्रेट व्यू के लिए लेआउट */}
      {deviceStatus === 'mobile-portrait' && (
        <div className="h-full p-4 bg-white overflow-y-auto">
          <h2 className="text-lg font-bold text-red-600">मोबाइल पोर्ट्रेट लेआउट</h2>
          {/* यहाँ मोबाइल पोर्ट्रेट के लिए अलग कोडिंग/क्लास लिखें */}
          <div className="grid grid-cols-1 gap-4">
            {/* उदाहरण के लिए सिंगल कॉलम */}
          </div>
        </div>
      )}

      {/* 2. मोबाइल लैंडस्केप व्यू के लिए लेआउट */}
      {deviceStatus === 'mobile-landscape' && (
        <div className="h-full p-4 bg-blue-50 overflow-y-auto">
          <h2 className="text-lg font-bold text-blue-600">मोबाइल लैंडस्केप लेआउट</h2>
          {/* यहाँ मोबाइल लैंडस्केप के लिए अलग कोडिंग/क्लास लिखें */}
        </div>
      )}

      {/* 3. टैबलेट व्यू (या डेस्कटॉप साइट ऑन + पोर्ट्रेट) के लिए लेआउट */}
      {deviceStatus === 'tablet' && (
        <div className="h-full p-6 bg-yellow-50 overflow-y-auto">
          <h2 className="text-xl font-bold text-yellow-600">टैबलेट व्यू लेआउट</h2>
          {/* यहाँ टैबलेट के लिए 2-कॉलम वाला लेआउट सेट कर सकते हैं */}
          <div className="grid grid-cols-2 gap-4">
            {/* टैबलेट का कंटेंट */}
          </div>
        </div>
      )}

      {/* 4. डेस्कटॉप मोड (या लैपटॉप और मोबाइल में डेस्कटॉप साइट + लैंडस्केप) के लिए लेआउट */}
      {deviceStatus === 'desktop' && (
        <div className="h-full p-8 bg-green-50 overflow-y-auto">
          <h2 className="text-2xl font-bold text-green-600">डेस्कटॉप मोड लेआउट</h2>
          {/* यहाँ पूरा बड़ा डेस्कटॉप लेआउट (Sidebar + Multi-column grid) सेट करें */}
          <div className="grid grid-cols-4 gap-6">
            {/* डेस्कटॉप का कंटेंट */}
          </div>
        </div>
      )}

    </div>
  </div>
  );

}
export default App;

