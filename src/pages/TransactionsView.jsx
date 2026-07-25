import React from 'react';

const TransactionsView = ({ data }) => {

  // अपना सॉर्टिंग लॉजिक यहाँ लिखें या Props के जरिए पास करें
  // यह डेटा को सही क्रम में लगाएगा
const processedData = React.useMemo(() => {
  // अगर डेटा एरे नहीं है, तो खाली एरे रिटर्न करें ताकि एरर न आए
  if (!Array.isArray(data)) return []; 
  
  return [...data].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}, [data]);

  return (
     
    <div className="p-5 bg-white rounded-xl border border-gray-300 mb-0">
      <h2 className="text-xl font-bold mb-4 w-full text-center">All Transactions ({processedData.length})</h2>    
      <p className="font-semibold text-gray-800"> Date Income<span className="font-semibold text-center text-gray-800">Total Income</span> </p>               
      <div className=" h-[690px] overflow-y-auto mb-0 ">
        <ul className="space-y-2">
          {processedData.length > 0 ? (
            processedData.map((item, index) => (
              <li key={index} className="p-3 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50 ">
                <div className="flex items-center gap-4">
                  {/* 1. सीरियल नंबर */}
                  <p className="font-semibold text-gray-800"> {index + 1}</p>
                  {/* 2. ट्रांजेक्शन का नाम और डेट */}
                  <div>
                    
                    <p className="text-semibold text-blue-500 font-medium">
                      {new Date(item.date).toLocaleDateString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* 3. इनकम और वैल्यू */}
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{item.income || 0}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 italic">अभी कोई ट्रांजेक्शन उपलब्ध नहीं है।</p>
          )}
        </ul>
      </div>


      </div>
    
  );
};
export default TransactionsView;