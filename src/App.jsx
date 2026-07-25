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
          // 🔥 मोबाइल के लैंडस्केप मॉड में जूम आउट करके कंटेंट सही दिखाने के लिए (मोबाइल का डेस्कटॉप मोड)
          document.body.style.zoom = "0.75"; // आप इसे 0.7 या 0.8 अपनी जरूरत के हिसाब से रख सकते हैं
          document.body.style.width = "100%"; // इसमें चौड़ाई को बढ़ाने की भी जरूरत नहीं पड़ेगी
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
        {deviceStatus === 'desktop' && <span>डेस्कटॉप मोड f</span>}
      </div>
    </header>

    {/* मुख्य कंटेंट जहाँ आप अलग-अलग लेआउट रेंडर करेंगे */}
    <div className="flex-1 overflow-hidden">
{/*=========================================================================================================*/}
      {/* 1. मोबाइल पोर्ट्रेट व्यू के लिए लेआउट */}
{/*=========================================================================================================*/}      
      {deviceStatus === 'mobile-portrait' && (
        <div className="h-full p-4 bg-white overflow-y-auto">
          <h2 className="text-lg font-bold text-red-600">मोबाइल पोर्ट्रेट लेआउट</h2>
          {/* यहाँ मोबाइल पोर्ट्रेट के लिए अलग कोडिंग/क्लास लिखें */}
          <div className="grid grid-cols-1 gap-4">
            {/* उदाहरण के लिए सिंगल कॉलम */}
          </div>
        </div>
      )}


{/*=========================================================================================================*/}
      {/* 2. मोबाइल लैंडस्केप व्यू के लिए लेआउट */}
{/*=========================================================================================================*/}
      {deviceStatus === 'mobile-landscape' && (
        <div className="h-full p-4 bg-blue-50 overflow-y-auto">
          <h2 className="text-lg font-bold text-blue-600">मोबाइल लैंडस्केप लेआउट</h2>
          {/* यहाँ मोबाइल लैंडस्केप के लिए अलग कोडिंग/क्लास लिखें */}
        </div>
      )}


{/*=========================================================================================================*/}
      {/* 3. टैबलेट व्यू (या डेस्कटॉप साइट ऑन + पोर्ट्रेट) के लिए लेआउट */}
{/*=========================================================================================================*/}     
      {deviceStatus === 'tablet' && (
        <div className="h-full p-6 bg-yellow-50 overflow-y-auto">
          <h2 className="text-xl font-bold text-yellow-600">टैबलेट व्यू लेआउट</h2>
          {/* यहाँ टैबलेट के लिए 2-कॉलम वाला लेआउट सेट कर सकते हैं */}
          <div className="grid grid-cols-2 gap-4">
            {/* टैबलेट का कंटेंट */}
          </div>
        </div>
      )}



{/*=========================================================================================================*/}
      {/* 4. डेस्कटॉप मोड (या लैपटॉप और मोबाइल में डेस्कटॉप साइट + लैंडस्केप) के लिए लेआउट */}
{/*=========================================================================================================*/}   
      {deviceStatus === 'desktop' && (
    
      // पूरे पेज को एक फिक्स्ड हाइट दें ताकि बाहर वाला स्क्रोल बार न आए
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* आपका डेस्कटॉप वाला लेआउट */}


        {/* 1. हेडर (फिक्स्ड रहेगा) */}
  <header className="bg-white  p-6 border-b border-gray-300 flex-shrink-0 flex items-center justify-between">
    
    {/* बायां हिस्सा: टाइटल */}
    <h1 className="text-2xl font-bold text-blue-600">Finance Tracker</h1>

    {/* दाहिना हिस्सा: बेल और यूजर आइकॉन */}
    <div className="flex items-center gap-4">
      <InternetClock />
      {/* बेल आइकॉन (Lucide-react से Bell इम्पोर्ट करना न भूलें) */}
      <Bell className="text-gray-500 cursor-pointer" size={24} />
      
      {/* यूजर आइकॉन */}
      <div className="bg-gray-200 p-2 rounded-full cursor-pointer">
        <User className="text-gray-600" size={20} />
      </div>
    </div>
    
  </header>




        {/* 2. मुख्य कंटेनर (साइडबार + कंटेंट) */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* साइडबार */}
  <div className="w-64 bg-white border-r border-gray-300 p-6 flex-shrink-0 h-full">

            {/* ... आपका साइडबार कोड यहाँ रहेगा ... */}

          <button className="w-full bg-blue-600 text-white rounded-lg py-2 mb-6 flex items-center justify-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Transaction 
          </button>
          

          <nav className="space-y-4">

            <div     
              className={`cursor-pointer flex items-center mb-0 gap-3 ${activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-gray-600'}`} 
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20}/> Dashboard
            </div>

            {/* एनीमेशन वाला सब-मेनू */}
            <div className={`submenu-container ${activeTab === 'dashboard' ? 'open' : ''}`}>
              <div className="submenu-content">
                <div className="pl-8 pt-2 space-y-2 text-sm text-gray-500">
                  
                    <div className="flex items-center mt-2 gap-3 text-gray-600 cursor-pointer whitespace-nowrap" 
                        onClick={() => setViewMode('daily')} style={{ 
                        fontWeight: viewMode === 'daily' ? 'bold' : 'normal',
                        color: viewMode === 'daily' ? 'blue' : 'gray' 
                    }} >📅महीना व्यू (तारीख वार) </div>

                    <div className="flex items-center gap-3 text-gray-600 cursor-pointer" 
                          onClick={() => setViewMode('yearly')} style={{ 
                          fontWeight: viewMode === 'yearly' ? 'bold' : 'normal',
                          color: viewMode === 'yearly' ? 'blue' : 'gray' 
                    }}>📈साल व्यू (महीने वार) </div>

                    <div className="flex items-center gap-3 text-gray-600 cursor-pointer" 
                        onClick={() => setViewMode('final')} style={{ 
                        fontWeight: viewMode === 'final' ? 'bold' : 'normal',
                        color: viewMode === 'final' ? 'blue' : 'gray' 
                    }}>💰फाइनल इनकम व्यू </div>

                  </div>
                </div>
              </div>

            <div     
              className={`cursor-pointer flex items-center gap-3 ${activeTab === 'transactions' ? 'text-blue-600 font-bold' : 'text-gray-600'}`} 
              onClick={() => setActiveTab('transactions')}
            >
              <Receipt size={20}/> Transactions
            </div>
            <div     
              className={`cursor-pointer flex items-center gap-3 ${activeTab === 'transactions' ? 'text-blue-600 font-bold' : 'text-gray-600'}`} 
              onClick={() => setActiveTab('loanManager')}
            >
              <CreditCard size={20} />
              Loan Managers
            </div>

            <div className="flex items-center gap-3 text-gray-600"><BarChart3 size={20}/> Reports</div>
            <div className="flex items-center gap-3 text-gray-600"><Settings size={20}/> Settings</div>
        
          </nav>

          <button className="w-full bg-blue-600 text-white rounded-lg py-2 mt-6 flex items-center justify-center gap-2" onClick={handleDownloadBackup}>
            डेटा बैकअप (JSON)
          </button>




          </div>


  {/* मुख्य कंटेंट क्षेत्र */}
  <main className="flex-1 overflow-y-auto p-2 mb-0 lg:p-8">

    {/* 2. दूसरा 'main' हटाकर सीधे DashboardView रखें */}
    <div> 
      {activeTab === 'dashboard' && <DashboardView data={databaseData} viewMode={viewMode} />}
      {activeTab === 'transactions' && <TransactionsView data={databaseData} />}
      {activeTab === 'loanManager' && <LoanManager />}
    </div>

  </main>



        {/* Entry Modal */}
        {showModal && (
          <div id="entryModal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content" id="modalContainer" ref={modalRef}>
              <div className="modal-header draggable-header" id="modalHeader" onMouseDown={handleMouseDown}>
                नई एंट्री जोड़ें 📝
                <span onClick={() => setShowModal(false)} style={{ float: 'right', cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' }}>×</span>
              </div>
                            <div className="modal-body">
                              {/* 1. तारीख चुनने के लिए कैलेंडर बॉक्स */}
                              <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', fontWeight: 'bold' }}>तारीख चुनें (Date):</label>
                              <input 
                                type="date" 
                                value={dateInput} 
                                onChange={(e) => setDateInput(e.target.value)} 
                                style={{ padding: '8px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' }}
                              />

                              {/* 2. कमाई की राशि डालने के लिए इनपुट बॉक्स (जो छूट गया था) */}
                              <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', fontWeight: 'bold' }}>कमाई की राशि (₹):</label>
                              <input
                                type="number"
                                id="incomeInput"
                                placeholder="राशि दर्ज करें (जैसे: 5000)"
                                value={incomeInput}
                                onChange={(e) => setIncomeInput(e.target.value)}
                                style={{ padding: '8px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' }}
                              />

                              {/* 3. सेव करने का बटन */}
                              <button
                                className="btn-save"
                                id="saveBtn"
                                onClick={saveData}
                                disabled={isSaveDisabled}
                                style={{ 
                                  backgroundColor: isSaveDisabled ? '#ccc' : '#00d2ff', 
                                  width: '100%', 
                                  padding: '10px', 
                                  color: '#fff', 
                                  border: 'none', 
                                  cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                                  fontWeight: 'bold'
                                }}
                              >
                                सेव करें
                              </button>
                            </div>
            </div>
          </div>
        )}


        </div>
      </div>



        )}
===============================================================================================================        

      </div>
    </div>
  );

}
export default App;

