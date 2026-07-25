import React, { useState, useEffect } from 'react';

export default function InternetClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // हर 1 सेकंड में लाइव टाइम अपडेट करने के लिए
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // तारीख और महीने को हिंदी शब्दों में फॉर्मेट करने के लिए (जैसे: 25 जुलाई 2026, शनिवार)
  const optionsDate = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    weekday: 'long' 
  };
  const formattedDate = currentDateTime.toLocaleDateString('hi-IN', optionsDate);

  // समय को साफ़-सुथरे फॉर्मेट में दिखाने के लिए
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
      {/* ग्रीन इंडिकेटर डॉट */}
      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>

      {/* तारीख और महीना (अक्षरों में) */}
      <div className="text-sm font-medium text-gray-600 border-r pr-3 border-gray-200">
        📅 {formattedDate}
      </div>

      {/* बड़ा और बोल्ड लाइव टाइम */}
      <div className="text-lg font-bold text-gray-900 tracking-wide">
        ⏰ {formattedTime}
      </div>
    </div>
  );
}