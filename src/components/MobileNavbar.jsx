import React from 'react';
import { Home, Receipt, Wallet, Target, CreditCard, BarChart3, FileText, Clock } from 'lucide-react';

export default function MobileNavbar({ activeTab, setActiveTab }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg flex justify-around items-center py-2 px-1 z-50">
{/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/}      
      {/* Home Button (डैशबोर्ड की जगह) */}
      <button 
        onClick={() => setActiveTab('dashboard')} 
        className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
      >
        <Home size={22} />
        <span className="text-xs mt-1">Home</span>
      </button>
{/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
      {/* IncomeExpese Button */}
      <button 
        onClick={() => setActiveTab('incomeExpese')} 
        className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'incomeExpese' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
      >
        <Wallet size={22} />
        <span className="text-xs mt-1">Income/Exp</span>
      </button>
{/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
      {/* Budgets Button */}
      <button 
        onClick={() => setActiveTab('budgets')} 
        className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'budgets' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
      >
        <Target size={22} />
        <span className="text-xs mt-1">Budgets</span>
      </button>
{/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
      {/* Loan Button */}
      <button 
        onClick={() => setActiveTab('loanManager')} 
        className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'loanManager' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
      >
        <CreditCard size={22} />
        <span className="text-xs mt-1">Loans</span>
      </button>
{/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
      {/* Reports Button */}
      <button 
        onClick={() => setActiveTab('reports')} 
        className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'reports' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
      >
        <FileText size={22} />
        <span className="text-xs mt-1">Reports</span>
      </button>
{/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
      {/* Transactions Button */}
      <button 
        onClick={() => setActiveTab('transactions')} 
        className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'transactions' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
      >
        <Clock  size={22} />
        <span className="text-xs mt-1">History</span>
      </button>
{/*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/}
    </div>
  );
}