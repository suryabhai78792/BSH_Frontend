import { useState, useEffect } from 'react';

export function useDeviceView() {
// यह पता लगाने के लिए कि क्या डिवाइस सच में डेस्कटॉप है या मोबाइल में डेस्कटॉप मोड है
    const [deviceView, setDeviceView] = useState(() => {
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
    const updateDeviceView = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      const ua = navigator.userAgent;


      // असली डेस्कटॉप या लैपटॉप
      if (width >= 1024 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setDeviceView('desktop');
        return;
      }

      // मोबाइल में "Desktop Site" ऑन होने पर चेक करें
      const isDesktopSiteActive = !/Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) && (ua.includes('Macintosh') || ua.includes('Windows') || ua.includes('X11') || width >= 768);

      if (isDesktopSiteActive) {
        if (isLandscape) {
          setDeviceView('desktop');
          // 🔥 मोबाइल के लैंडस्केप मॉड में जूम आउट करके कंटेंट सही दिखाने के लिए (मोबाइल का डेस्कटॉप मोड)
          document.body.style.zoom = "0.60"; // आप इसे 0.7 या 0.8 अपनी जरूरत के हिसाब से रख सकते हैं
          document.body.style.width = "100%"; // इसमें चौड़ाई को बढ़ाने की भी जरूरत नहीं पड़ेगी
          } else {
            setDeviceView('tablet'); // <--- यहाँ टैबलेट व्यू सेट होगा
          }
          return;
        }

      // सामान्य मोबाइल व्यू (जब डेस्कटॉप साइट ऑफ हो)
      if (isLandscape) {
        setDeviceView('mobile-landscape');
      } else {
        setDeviceView('mobile-portrait');
      }
    };

    updateDeviceView();
    window.addEventListener('resize', updateDeviceView);
    window.addEventListener('orientationchange', updateDeviceView);

    return () => {
      window.removeEventListener('resize', updateDeviceView);
      window.removeEventListener('orientationchange', updateDeviceView);
    };
  }, []);
return deviceView;
}