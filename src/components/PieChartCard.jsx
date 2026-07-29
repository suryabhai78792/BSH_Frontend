import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LabelList } from 'recharts';
import { useState, useEffect} from 'react'

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

export default function PieChartCard({ title, subtitle, data, showPercentage = true, isDonut=true }) {
  // 1. कॉम्पोनेंट के अंदर ही डेटा की लोकल स्टेट बना ली
  // 1. एक स्टेट बना लें
  const [pieKey, setPieKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  // 2. useEffect के अंदर टाइमर लगा दें जो हर 12 सेकंड में की (Key) को बदल देगा
  useEffect(() => {
    const interval = setInterval(() => {
      setPieKey(prev => prev + 1); // 👈 हर 12 सेकंड में की बदलते ही चार्ट बिना किसी लैग के फ्रेश एनिमेट होगा
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const onPieClick = (_, index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };

  const selectedItem = activeIndex !== null && data[activeIndex] ? data[activeIndex] : null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-300">
      <h3 className="font-bold mb-2 flex flex-col">
        <span className="text-gray-900 text-base">{title}</span>
        <span className="text-gray-500 text-sm font-normal">{subtitle}</span>
      </h3>
      
      {selectedItem && (
          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200">
            <span className="font-semibold">{selectedItem.name}</span>: ₹{selectedItem.value.toLocaleString()}
          </div>
        )}
     
      <ResponsiveContainer width="100%" height={200} key={pieKey} >
        <PieChart >
          <Pie 
            data={data} 
            // अगर परसेंटेज दिखाना है तो innerRadius 0 होगा (भरा हुआ पाई चार्ट), वरना डोनट चार्ट बनेगा
            innerRadius={isDonut ? 58 : 0} 
            outerRadius={isDonut ? 83 : 80} 
            paddingAngle={0} 
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={isDonut ? 5 : 2}
            isAnimationActive={activeIndex === null}
            animationDuration={1000}
            activeIndex={activeIndex}
            onClick={onPieClick}
            style={{cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}

            <LabelList 
              dataKey={showPercentage ? "interest" : "value"} 
              position="inside" 
              formatter={(value) => {
                // अगर showPercentage true है, तो सीधा interest (या जो डेटा में है) दिखाएगा
                if (showPercentage) {
                  return value; 
                }
                
                // अगर showPercentage false है, तब कुल योग का प्रतिशत (Percentage) कैलकुलेट करके दिखाएगा
                const total = data.reduce((sum, entry) => sum + entry.value, 0);
                const percentage = Math.round((value / total) * 100);
                return `${percentage}%`;
              }}

              fill="#ffffff" 
              stroke="none"
              fontSize={12}
              fontWeight="bold"
              style={{cursor: 'pointer'}}
              onClick={(e) => setActiveIndex(e.index)}
            />
          </Pie>

          
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle" 
            iconType="circle"
            formatter={(value, entry) => {
              const { payload } = entry;
              if (!payload || payload.value === undefined) return null;
              return (
                <span className="text-sm text-gray-700 font-medium inline-flex justify-between w-30 pr-4">
                  <span>{payload.name}</span>
                  <span className="font-semibold">₹{payload.value.toLocaleString()}</span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
  
    </div>
  );
}