import React, { useState } from 'react';

export default function LoanManager() {
  // यदि आपको यहाँ कोई स्टेट (State) या लूप जोड़ना हो, तो आप यहाँ जोड़ सकते हैं।
  
  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>ऋण और ऋण प्रबंधक</span>
          <span className="text-gray-500 text-lg font-normal">(Loan & Debt Manager)</span>
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700">A</div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>

      {/* Active Loans Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>💳 सक्रिय ऋण की सूची</span>
            <span className="text-gray-500 text-sm font-normal">(Active Loans)</span>
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
            + नया लोन जोड़ें
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="py-3 font-medium">ऋण का नाम</th>
                <th className="py-3 font-medium">बकाया राशि</th>
                <th className="py-3 font-medium">ब्याज दर</th>
                <th className="py-3 font-medium">अगली EMI की तारीख</th>
                <th className="py-3 font-medium text-center">भुगतान प्रगति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr>
                <td className="py-4 font-medium text-gray-900">होम लोन (Home Loan)</td>
                <td className="py-4 text-gray-700">₹ 3,00,000</td>
                <td className="py-4 text-gray-700">8.5%</td>
                <td className="py-4 text-gray-700">10 मार्च 2026</td>
                <td className="py-4 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-blue-600 text-blue-700 font-bold text-xs">
                    65%<br/><span className="text-[9px] font-normal">पूर्ण</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-4 font-medium text-gray-900">कार लोन (Car Loan)</td>
                <td className="py-4 text-gray-700">₹ 50,000</td>
                <td className="py-4 text-gray-700">10.0%</td>
                <td className="py-4 text-gray-700">15 मार्च 2026</td>
                <td className="py-4 text-center">
                  {/* खाली या प्रगति अनुसार */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Loan Prepayment Simulator Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span>ऋण पूर्व भुगतान सिम्युलेटर</span>
          <span className="text-gray-500 text-sm font-normal">(Loan Prepayment Simulator)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mt-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">ऋण चुनें</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>होम लोन</option>
              <option>कार लोन</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">अतिरिक्त मासिक भुगतान जोड़ें</label>
            <input type="text" readOnly value="₹ 5,000" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">अतिरिक्त एकमुश्त भुगतान जोड़ें</label>
            <input type="text" readOnly value="₹ 50,000" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50" />
          </div>
          <div>
            <button className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-sm font-medium shadow-sm">
              सिम्युलेट करें
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-800">
          <p className="font-medium">सिमुलेशन परिणाम: अतिरिक्त भुगतान के साथ, आपका होम लोन 2 वर्ष और 3 महीने पहले पूरा हो जाएगा और आप ₹ 1,25,000 ब्याज बचाएंगे।</p>
          <p className="text-xs text-gray-500 mt-0.5">(Simulation Result: With extra payments, your Home Loan will be paid off 2 years and 3 months earlier and you will save ₹ 1,25,000 in interest.)</p>
        </div>
      </div>

      {/* Total Loan Repayment Progress Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-bold text-gray-900">कुल ऋण भुगतान प्रगति</h2>
          <span className="text-sm font-semibold text-gray-700">45% कुल भुगतान</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
          <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }}></div>
        </div>
        <p className="text-xs text-gray-500">₹ 3,50,000 में से ₹ 1,58,000 का भुगतान किया गया (₹ 1,58,000 Paid of ₹ 3,50,000 Total)</p>
      </div>
    </div>
  );
}