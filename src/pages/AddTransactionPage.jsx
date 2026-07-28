import React, { useState, useRef } from 'react';
import {  useEffect } from 'react'
import './AddTransactionPage.css'


export default function AddTransactionPage({ showModal, setShowModal }) {



    const [incomeInput, setIncomeInput] = useState('')
    const [dateInput, setDateInput] = useState(''); // YYYY-MM-DD फॉर्मेट के लिए
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    const modalRef = useRef(null);


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

        // Input Validation Effect
  useEffect(() => {
    if (incomeInput.trim() !== "" && dateInput.trim() !== "") {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
  }, [incomeInput, dateInput]);



return (
          <div id="entryModal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content" id="modalContainer" ref={modalRef}>
              <div className="modal-header draggable-header" id="modalHeader" onMouseDown={handleMouseDown}>
                नई एंट्री जोड़ें 📝
                <span onClick={() => setShowModal(false)} style={{ float: 'right', cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' }}>×</span>
              </div>
                            <div className="modal-body " >
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
                                  backgroundColor: isSaveDisabled ? '#ccc' : '#303f9f', 
                                  width: '100%',                                   
                                  padding: '10px', 
                                  color: '#fff', 
                                  border: 'none', 
                                  borderRadius: '8px',
                                  cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                                  fontWeight: 'bold',
                                }}
                              >
                                सेव करें
                              </button>
                            </div>
            </div>
          </div>

    );
}