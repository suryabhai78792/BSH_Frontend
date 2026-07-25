import React from 'react';
import './StatsCard.css';
import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';


const StatsCard = ({ income, expense, budget, savings, loan }) => {

  // इस महीने का लाइव ब्याज (जो प्रति सेकंड 0.025 बढ़ रहा है)
  const [currentMonthInterest, setCurrentMonthInterest] = useState(8623.47);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMonthInterest((prev) => prev + 0.025);
    }, 1000); // हर 1 सेकंड पर अपडेट होगा

    return () => clearInterval(timer);
  }, []);

  // आपके आंकड़े:
  const principalAmount = loan; // मूलधन (या कुल कर्ज)
  const pastInterest = "60,000";     // पिछले 5 महीनों का कुल ब्याज
  const maxMonthlyInterest = "12000"; // इस महीने का कुल लक्षित ब्याज

  // यह फंक्शन पता लगाता है कि अभी कौन सा कार्ड सेंटर में है
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      // इंडेक्स कैलकुलेट करना
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };


  return (


<div className="flex flex-col gap-4">
      {/* 1. कार्ड्स वाला हिस्सा */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="grid grid-flow-col auto-cols-[85vw] 
                   md:grid-flow-row md:grid-cols-2 
                   landscape-grid
                   lg:grid-cols-4 
                   gap-4 px-4 pb-0 md:pb-4 
                   overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide"
      >
        {/* आपके चारों कार्ड्स यहाँ आएंगे */}
          <div className="bg-green-50 p-4 pb-0 rounded-xl border border-green-700 min-w-[85vw] md:min-w-0  snap-center snap-always">
            <p className="font-bold">कुल आय <span className="font-normal text-gray-500">(Total Income)</span></p>
            <h2 className="text-2xl font-bold">₹{income}<span className="text-black text-gray-500 text-sm ">/₹{budget}(लक्ष्य)</span></h2>
            {/* यहाँ प्रोग्रेस बार डालें */}
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div className="bg-green-700 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>     
            <p className="flex items-center gap-1 mt-1 whitespace-nowrap">पिछले महीने से <span className="font-normal text-green-700">+5.2%</span><TrendingUp size={14} className="mr-1 text-green-700" /></p>
          </div>

          <div className="h-full p-[1px] rounded-xl bg-gradient-to-r from-gray-500 to-orange-400 min-w-[85vw] md:min-w-0 snap-center snap-always">                  
            {/* अंदर वाले कार्ड को भी h-full और flex-col दें ताकि वो ऊपर से नीचे पूरा भरे */}
            <div className="h-full bg-gray-100 p-4 pb-0 rounded-[11px] flex flex-col justify-between">
              <div>
                <p className="font-bold">कुल खर्च <span className="font-normal text-gray-500">(Total Expense)</span></p>
                <h2 className="text-2xl font-bold">₹{expense}<span className="text-black text-gray-500 text-sm ">/₹{budget}(बजट बैलेंस)</span></h2>
              </div>
            {/* यहाँ प्रोग्रेस बार डालें */}
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div className="bg-orange-400 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="flex items-center gap-1 mb-0 mt-1 whitespace-nowrap">पिछले महीने से <span className="font-normal text-red-700"> +8.1% </span> <TrendingUp size={14} className="mr-1 text-red-700" /></p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 pb-0 rounded-xl border border-blue-700 min-w-[85vw] md:min-w-0 snap-center snap-always">
            <p className="font-bold">बचत <span className="font-normal text-gray-500">(Savings)</span></p>
            <h2 className="text-2xl font-bold">₹{savings}<span className="text-black text-gray-500 text-sm ">/₹{income}(कमाई)</span></h2>
            {/* यहाँ प्रोग्रेस बार डालें */}
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div className="bg-blue-700 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="flex items-center gap-1 mt-1 whitespace-nowrap text-blue-500">बजट से अधिक</p>
          </div>

          <div className="bg-red-50 p-4 pb-0 rounded-xl border border-red-700 min-w-[85vw] md:min-w-0 snap-center snap-always">
            <div>
              <p className="font-bold">कुल कर्ज <span className="font-normal text-gray-500">(Total Loan)<span className="text-black text-gray-500 text-sm "> ब्याज-0.025/s</span></span></p>
              <h2 className="text-2xl font-bold">₹{principalAmount}<span className="text-black text-gray-500 text-sm ">/₹{pastInterest}+8{currentMonthInterest.toFixed(2)}({maxMonthlyInterest})</span></h2>
            </div>                
            {/* यहाँ प्रोग्रेस बार डालें */}
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div className="bg-red-700 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="flex items-center gap-1 mb-0 mt-1 whitespace-nowrap">पिछले महीने से <span className="font-normal text-red-700"> +8.1% </span> <TrendingUp size={14} className="mr-1 text-red-700" /></p>
          </div>

      </div>

      {/* 2. डॉट्स (Indicators) वाला हिस्सा - जो मोबाइल पर दिखेगा */}
      <div className="flex justify-center mb-2 gap-2 md:hidden lg:hidden" >
        {[0, 1, 2, 3].map((index) => (
          <div 
            key={index}
            className={`h-1 w-1 rounded-full transition-all duration-300 ${
              activeIndex === index ? 'bg-blue-600 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>



  );
};

export default StatsCard;