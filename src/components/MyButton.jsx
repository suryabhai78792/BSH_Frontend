// components/MyButton.jsx
import React from 'react';
import './MyButton.css';

export default function MyButton({ label, onClick, disabled, style }) {
  return (
    <button 
      className="btn-Style" 
      onClick={onClick} 
      disabled={disabled} // 👈 यह बटन को सचमुच लॉक कर देगा (क्लिक नहीं होगा)
      style={{
        // 👈 अगर डिसेबल है तो बैकग्राउंड ग्रे (#ccc) होगा, नहीं तो जो बाहर से स्टाइल आएगी या जो डिफ़ॉल्ट है वो रहेगा
        ...(disabled && { backgroundColor: '#ccc' }),
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: '#fff',
        border: 'none',
        fontWeight: 'bold',
        ...style // बाकी की स्टाइल जैसे fontWeight: 'bold' आदि यहाँ जुड़ जाएगी
      }}
    >
      {label}
    </button>
  );
}





