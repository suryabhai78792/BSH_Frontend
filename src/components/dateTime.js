import React, { useState, useEffect } from 'react';

export default function dateTime() {
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

return { formattedDate, formattedTime };
};
