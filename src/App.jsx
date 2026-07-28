import React from 'react';
import { LayoutDashboard, CreditCard, Receipt, BarChart3, Settings, Plus, Bell, User, Menu, X  } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'

import './App.css'
import DateTime from './components/DateTime';
import { useDeviceView } from './components/useDeviceView';
import { convertDataByMode } from './components/dataConverter';
import MobileNavbar from './components/MobileNavbar';
import MyButton from './components/MyButton';
import DashboardView from './pages/DashboardView';
import AddTransactionPage from './pages/AddTransactionPage';

import TransactionsView from './pages/TransactionsView';
import LoanManager from './pages/loanManagers';

const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'];

// --- मुख्य डैशबोर्ड कंपोनेंट ---
 function App() {

 // स्टेट्स (States)

  const deviceView = useDeviceView();
  const [databaseData, setDatabaseData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const latestDataRef = useRef({}) // 🔥 लेटेस्ट डेटा को बिना री-रेंडर ट्रैक करने के लिए
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedMonth, setSelectedMonth] = useState('Jan')

  
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' या 'transactions' loanManager
  
  const [viewMode, setViewMode] = useState('yearly'); // 'daily', 'yearly', 'final'
  
  const [isLoading, setIsLoading] = useState(true); // शुरू में लोडिंग दिखाएं
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);




  const modalContainerRef = useRef(null)


  // API URLs
  const GET_DATA_URL = 'https://my-income-backend.onrender.com/getdata'
  const SAVE_DATA_URL = 'https://my-income-backend.onrender.com/save'




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




return (
<div className="min-h-screen flex flex-col bg-gray-50">
    
    {/* मुख्य कंटेंट जहाँ आप अलग-अलग लेआउट रेंडर करेंगे */}
    <div className="flex-1">
{/*=========================================================================================================*/}
      {/* 1. मोबाइल पोर्ट्रेट व्यू के लिए लेआउट */}
{/*=========================================================================================================*/}      
      {deviceView === 'mobile-portrait' && (

        <>
          
                {/* 1. हेडर (फिक्स्ड रहेगा) */}


          {/* मोबाइल पोर्ट्रेट का मुख्य कंटेंट यहाँ दिखेगा */}
          <main className="p-4 px-0">
            {activeTab === 'dashboard' && <DashboardView data={databaseData} viewMode={viewMode} />}
            {activeTab === 'transactions' && <TransactionsView data={databaseData} />}
            {activeTab === 'loanManager' && <LoanManager />}
          </main>

          {/* 🔥 यहाँ हमने नीचे फिक्स नेविगेशन बार को इम्पोर्ट करके लगा दिया है */}
          <MobileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
          
        </>

      )}


{/*=========================================================================================================*/}
      {/* 2. मोबाइल लैंडस्केप व्यू के लिए लेआउट */}
{/*=========================================================================================================*/}
      {deviceView === 'mobile-landscape' && (
        <div className="h-full p-4 bg-blue-50 overflow-y-auto">
          <h2 className="text-lg font-bold text-blue-600">मोबाइल लैंडस्केप लेआउट</h2>
          {/* यहाँ मोबाइल लैंडस्केप के लिए अलग कोडिंग/क्लास लिखें */}
        </div>
      )}


{/*=========================================================================================================*/}
      {/* 3. टैबलेट व्यू (या डेस्कटॉप साइट ऑन + पोर्ट्रेट) के लिए लेआउट */}
{/*=========================================================================================================*/}     
      {deviceView === 'tablet' && (
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
      {deviceView === 'desktop' && (
    
      // पूरे पेज को एक फिक्स्ड हाइट दें ताकि बाहर वाला स्क्रोल बार न आए
      <div className="minh-screen flex flex-col bg-gray-50">
      {/* आपका डेस्कटॉप वाला लेआउट */}


        {/* 1. हेडर (फिक्स्ड रहेगा) */}
  <header className="bg-white pt-3 pb-3 p-6 border-b border-gray-300 flex-shrink-0 flex items-center justify-between">
    
    {/* बायां हिस्सा: टाइटल */}
    <h1 className="text-2xl font-bold text-blue-600">Finance Tracker</h1>

    {/* दाहिना हिस्सा: बेल और यूजर आइकॉन */}
    <div className="flex items-center gap-4">
      


      <div className="flex items-center gap-3 bg-white p-4 py-1 rounded-xl border border-gray-200 shadow-sm">
      <DateTime showIcon="{true}"/>
      </div>
      
      
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
            <div className="flex items-center gap-3 text-gray-600"><BarChart3 size={20}/> Income & Expense</div>
            <div className="flex items-center gap-3 text-gray-600"><BarChart3 size={20}/> Budgets & Goals</div>

            <div     
              className={`cursor-pointer flex items-center gap-3 ${activeTab === 'loanManager' ? 'text-blue-600 font-bold' : 'text-gray-600'}`} 
              onClick={() => setActiveTab('loanManager')}
            >
              <CreditCard size={20} />
              Loan Managers
            </div>

            <div className="flex items-center gap-3 text-gray-600"><BarChart3 size={20}/> Investments</div>
            <div className="flex items-center gap-3 text-gray-600"><BarChart3 size={20}/> Reports</div>
            <div className="flex items-center gap-3 text-gray-600"><BarChart3 size={20}/> History</div>
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
<AddTransactionPage showModal={showModal} setShowModal={setShowModal} />
        )}


        </div>
      </div>



        )}
{/*=========================================================================================================*/}       

      </div>
    </div>
  );

}
export default App;

