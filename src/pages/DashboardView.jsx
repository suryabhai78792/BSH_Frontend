import React from 'react';
import Chart from 'chart.js/auto' // Chart.js को इम्पोर्ट किया
import './DashboardView.css'
import DateTime from '../components/DateTime';
import StatsCard from '../components/StatsCard';
import { useDeviceView } from '../components/useDeviceView';
import { convertDataByMode } from '../components/dataConverter';
import PieChartCard from '../components/PieChartCard';
import ReusableTable from '../components/ReusableTable';
import { PieChart, Pie, Cell, ResponsiveContainer,Legend, Tooltip, LabelList } from 'recharts';
import {Bell, User} from 'lucide-react';
import { useState, useEffect, useRef } from 'react'

// --- डेटा और रंग ---
const originalPieData = [
  { name: 'Rent', value: 4000 },
  { name: 'Food', value: 3000 },
  { name: 'Travel', value: 2000 },
  { name: 'Fun', value: 1000 },
];

const originalLoanData = [
  { name: 'रामू', value: 9000, interest: '3%' },
  { name: 'बसबरीया', value: 18000, interest: '3%' },
  { name: 'श्याम', value: 37000, interest: '2%' },
  { name: 'मोहन', value: 48000, interest: '0%' },
];



const DashboardView = ({ data, viewMode }) => {
const deviceView = useDeviceView();
const [pieData, setPieData] = useState(originalPieData);
const [loanData, setLoanData] = useState(originalLoanData);
const { tableData: convertedTableData } = convertDataByMode(data, viewMode, 'income');

  // रीफ़्स (Refs) - डॉम एलिमेंट्स और चार्ट इंस्टेंस को ट्रैक करने के लिए
  const canvasRef = useRef(null);
  const activeChartInstance = useRef(null);
  const chartLoopInterval = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // शुरू में लोडिंग दिखाएं


  const [income, setIncome] = useState("2,84,345");
  const [expense, setExpense] = useState("40,234");
  const [budget, setbudget] = useState("60,000"); // <--- यह लाइन जोड़ें
  const [savings, setSavings] = useState("95,111");
  const [loan, setloan] = useState("1,40,111");



    // नया इफेक्ट: जैसे ही data or viewMode बदलेगा, चार्ट तुरंत नए मोड के साथ रीस्टार्ट होगा
  useEffect(() => {
    // यह सुनिश्चित करेगा कि डेटा उपलब्ध होने पर ही लूप चले
    if (data && Object.keys(data).length > 0) {
      startChartAutoLoop(); // बटन दबाते ही तुरंत नया लूप शुरू और ग्राफ़ रीफ्रेश!
       setIsLoading(false); // डेटा आते ही लोडिंग बंद करें  
    }
    return () => {
      if (chartLoopInterval.current) clearInterval(chartLoopInterval.current);
      if (activeChartInstance.current) activeChartInstance.current.destroy();
    };
  }, [data, viewMode]); // 👈 इसका मतलब है: जब भी viewMode बदले, यह कोड तुरंत चलाओ



        // Chart Loop Logic
  const startChartAutoLoop = () => {
    renderLiveChart();

    if (chartLoopInterval.current) clearInterval(chartLoopInterval.current);
    chartLoopInterval.current = setInterval(() => {
      renderLiveChart();
    }, 12000);
  };


  
  // 3. सांप की तरह स्मूथ चलने वाला बेजियर ग्राफ़ लॉजिक
  const generateBezierSmoothData = (dataList, totalSteps = 500) => {
    let smoothData = [];
    const n = dataList.length - 1;
    for (let step = 0; step <= totalSteps; step++) {
      let t = (step / totalSteps) * n;
      let i = Math.floor(t);
      if (i >= n) i = n - 1;
      let localT = t - i;

      let p0 = dataList[Math.max(0, i - 1)];
      let p1 = dataList[i];
      let p2 = dataList[Math.min(n, i + 1)];
      let p3 = dataList[Math.min(n, i + 2)];

      let y = 0.5 * (
        (2 * p1) +
        (-p0 + p2) * localT +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * localT * localT +
        (-p0 + 3 * p1 - 3 * p2 + p3) * localT * localT * localT
      );
      smoothData.push({ x: t, y: y });
    }
    return smoothData;
  }

    const renderLiveChart = () => {
    if (typeof Chart === 'undefined' || !canvasRef.current) return;
      // यह चेक करेगा कि स्टेट में डेटा आ गया है या नहीं
      if (!data || Object.keys(data).length === 0) return;
  
      // 1. यहाँ हमने तीसरी वैल्यू 'income' पास की है। 
      // भविष्य में अगर आप 'sales' ट्रैक करना चाहें तो बस यहाँ 'sales' लिख देना!
      const { chartData } = convertDataByMode(data, viewMode, 'income');
      const baseHeading = chartData.headers[0]
      const hArray = chartData.headers;
      const pData = chartData.processedData;

        let lastYearIncome = [0];
        let currentYearIncome = [0];

        // 2. टेबल की पहली दो रो (Rows) को viewMode के हिसाब से सही क्रम में निकालें
        let row1 = null;
        let row2 = null;

        if (viewMode === 'daily') {
          // अगर महीना व्यू (Daily) है, तो महीनों का सही क्रम (Chronological Order) सुनिश्चित करें
          const chronologicalMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          // pData में से सिर्फ वही महीने निकालें जो मौजूद हैं और उनका क्रम सही रखें
          const availableMonths = chronologicalMonths.filter(m => pData.hasOwnProperty(m));
          
          row1 = availableMonths[0] || null;
          row2 = availableMonths[1] || null; // यहाँ आपको जनवरी और फरवरी (या जो भी पहले दो महीने उपलब्ध हैं) मिल जाएंगे
        } else {
          // 'yearly' या 'final' मोड के लिए सालों को न्यूमेरिकल (संख्या के आधार पर) सॉर्ट करें (उदा: 2025, 2026)
          const availableYears = Object.keys(pData).sort((a, b) => Number(a) - Number(b));
          
          row1 = availableYears[0] || null;
          row2 = availableYears[1] || null;
        }
        

        // 3. टेबल की हेडिंग्स (Headers) के हिसाब से सीधे सेल का डेटा ग्राफ़ में डालना
        hArray.forEach(h => {
          if (h === 'Total') return; // 👈 यहाँ 'Total' को रोकना जरूरी है क्योंकि यह सिर्फ टेबल की हेडिंग में है, डेटा में नहीं।
          
          // पहली रो का डेटा डालना
          let val1 = row1 && pData[row1] && pData[row1][h] ? Number(pData[row1][h]) : 0;
          lastYearIncome.push(val1);

          // दूसरी रो का डेटा डालना (अगर दूसरी रो उपलब्ध हो)
          if (row2) {
            let val2 = pData[row2] && pData[row2][h] ? Number(pData[row2][h]) : 0;
            currentYearIncome.push(val2);
          }
        });

        const smoothLastYear = generateBezierSmoothData(lastYearIncome);
        const smoothCurrentYear = generateBezierSmoothData(currentYearIncome);
        const totalDuration = 5000;
        const delayPerPoint = totalDuration / smoothLastYear.length;

        if (activeChartInstance.current) {
          activeChartInstance.current.destroy();
        }

        const glowingEffectPlugin = {
          id: 'glowingEffect',
          beforeDatasetsDraw(chart) {
            const { ctx } = chart;
            ctx.save();
            chart.data.datasets.forEach((dataset) => {
              ctx.shadowColor = dataset.borderColor;
              ctx.shadowBlur = 18;
            });
          },
          afterDatasetsDraw(chart) {
            const { ctx } = chart;
            chart.data.datasets.forEach((dataset, datasetIndex) => {
              const meta = chart.getDatasetMeta(datasetIndex);
              let lastVisiblePoint = null;
              for (let i = meta.data.length - 1; i >= 0; i--) {
                if (meta.data[i] && !meta.data[i].skip && meta.data[i].x !== undefined) {
                  if (i > 0 && meta.data[i].x > meta.data[i - 1].x) {
                    lastVisiblePoint = meta.data[i];
                    break;
                  }
                }
              }
              if (lastVisiblePoint) {
                const x = lastVisiblePoint.x;
                const y = lastVisiblePoint.y;
                ctx.beginPath();
                ctx.arc(x, y, 11, 0, 2 * Math.PI);
                ctx.fillStyle = dataset.borderColor === '#00d2ff' ? 'rgba(0, 210, 255, 0.35)' : 'rgba(149, 165, 166, 0.35)';
                ctx.shadowBlur = 25;
                ctx.shadowColor = dataset.borderColor;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 5.5, 0, 2 * Math.PI);
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 12;
                ctx.shadowColor = dataset.borderColor;
                ctx.fill();
              }
            });
            ctx.restore();
          }
        };

        const ctx = canvasRef.current.getContext('2d');
        activeChartInstance.current = new Chart(ctx, {
          type: 'line',
          plugins: [glowingEffectPlugin],
          data: {
            datasets: [
              {
                label: row1 ? `डेटा: ${row1}` : 'रो 1', // स्वचालित रूप से 2025 या Jan दिखाएगा
                data: smoothLastYear,
                borderColor: '#95a5a6',
                backgroundColor: 'transparent',
                borderWidth: 4,
                tension: 0,
                pointRadius: 0,
                pointStyle: false,
                showLine: true
              },
              {
                label: row2 ? `डेटा: ${row2}` : 'रो 2', // स्वचालित रूप से 2026 या Feb दिखाएगा
                data: smoothCurrentYear,
                borderColor: '#00d2ff',
                backgroundColor: 'transparent',
                borderWidth: 4,
                tension: 0,
                pointRadius: 0,
                pointStyle: false,
                showLine: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              x: {
                type: 'number',
                easing: 'linear',
                duration: delayPerPoint,
                from: NaN,
                delay: (ctx) => {
                  if (ctx.type !== 'data' || ctx.xStarted) return 0;
                  ctx.xStarted = true;
                  if (ctx.datasetIndex === 0) return ctx.index * delayPerPoint;
                  return totalDuration + (ctx.index * delayPerPoint);
                }
              },
              y: { duration: 0 }
            },
            scales: {
              x: {
                type: 'linear',
                min: 0,
                // 'Total' कॉलम को हटाकर बचे हुए लेबल्स की गिनती
                max: hArray.filter(h => h !== 'Total').length, 
                title: { display: true, text: (hArray[0] === '1') ? 'तारीख' : (hArray[0] === 'Jan') ? 'महीना'  : 'साल' },
                ticks: {
                  stepSize: 1,
                  callback: value => {
                    // 'Total' को हटाकर सिर्फ शुद्ध हेडिंग्स (1-31, या Jan-Dec) को ग्राफ़ के नीचे दिखाना
                    const pureHeaders = ['0', ...hArray.filter(h => h !== 'Total')];
                    return pureHeaders[value] || '';
                  }
                }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'कुल कमाई (₹ में)' },
                ticks: { callback: value => '₹' + value.toLocaleString('en-IN') }
              }
            }
          }
        }); // यहाँ चार्ट का कोड खत्म हुआ.
  }
  

  return (
   <div >
{/*=========================================================================================================*/}
      {/* 1. मोबाइल पोर्ट्रेट व्यू के लिए लेआउट */}
{/*=========================================================================================================*/}      
      {deviceView === 'mobile-portrait' && (
        <div className="min-h-screen pt-15 pb-25 bg-white overflow-y-auto overscroll-y-none">
          <header className="fixed top-0 left-0 right-0 z-50 bg-white py-3 px-3 border-b border-gray-300 flex items-center justify-between ">
            
            {/* बायां हिस्सा: टाइटल */}
            {/* यूजर आइकॉन */}
            <div className="bg-gray-200 p-2 rounded-full cursor-pointer">
              <User className="text-gray-600" size={20} />
            </div>

          <DateTime />
            {/* दाहिना हिस्सा: बेल और यूजर आइकॉन */}
            <div className="flex items-center gap-4">         
              {/* बेल आइकॉन (Lucide-react से Bell इम्पोर्ट करना न भूलें) */}
              <Bell className="text-gray-500 cursor-pointer" size={24} />
            </div>
            
          </header>

          <StatsCard income={income} expense={expense} budget={budget} savings={savings} loan={loan} />
        
        
        
        
        
        
        
        
        </div>

      )}

{/*=========================================================================================================*/}
      {/* 2. मोबाइल लैंडस्केप व्यू के लिए लेआउट */}
{/*=========================================================================================================*/}
      {deviceView === 'mobile-landscape' && (
        <div className="h-full p-4 bg-blue-50 overflow-y-auto">
          <h2 className="text-lg font-bold text-blue-600">मोबाइल लैंडस्केप लेआउट</h2>
          {/* यहाँ मोबाइल लैंडस्केप के लिए अलग कोडिंग/क्लास लिखें */}
        </div>
      )}


{/*=========================================================================================================*/}
      {/* 3. टैबलेट व्यू (या डेस्कटॉप साइट ऑन + पोर्ट्रेट) के लिए लेआउट */}
{/*=========================================================================================================*/}     
      {deviceView === 'tablet' && (
        <div className="h-full p-6 bg-yellow-50 overflow-y-auto">
          <h2 className="text-xl font-bold text-yellow-600">टैबलेट व्यू लेआउट</h2>
          {/* यहाँ टैबलेट के लिए 2-कॉलम वाला लेआउट सेट कर सकते हैं */}
          <div className="grid grid-cols-2 gap-4">
            {/* टैबलेट का कंटेंट */}
          </div>
        </div>
      )}

{/*=========================================================================================================*/}
      {/* 4. डेस्कटॉप मोड (या लैपटॉप और मोबाइल में डेस्कटॉप साइट + लैंडस्केप) के लिए लेआउट */}
{/*=========================================================================================================*/}     
      {deviceView === 'desktop' && (
      <>
      <StatsCard income={income} expense={expense} budget={budget} savings={savings} loan={loan} />
      <div className=" rounded-xl mb-5" >
        {/* यहाँ अपना चार्ट या डैशबोर्ड वाला कोड लिखें */}
          {/* Charts Section */}
          {/* 4. चार्ट्स का भाग */}
          <div className="grid grid-cols-3 gap-6">
            {/* लाइन चार्ट भाग */}
            <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-300">        
              <h3 style={{ color: "#1a237e", marginTop: "0", marginBottom: "15px", fontSize: "16px", textAlign: "left" }}>वार्षिक इनकम प्रोग्रेस ग्राफ़ (प्रत्येक 5s में रीस्टार्ट) 📈</h3>
            <div className="chart-container" style={{ 
              height: window.innerWidth < 600 ? "200px" : "300px", 
              position: "relative" 
              }}>
              {/* लोडिंग व्हील ओवरले */}
              {isLoading && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                  <p>सर्वर जाग रहा है, कृपया प्रतीक्षा करें... ⏳</p>
                </div>
                )}
              <canvas ref={canvasRef} id="incomeChart"></canvas>            
            </div>
              {/* यहाँ आप Recharts का LineChart डाल सकते हैं */}
            </div>

            {/* पाई चार्ट भाग */}
            <PieChartCard 
              title="लोन का वर्गीकरण" 
              subtitle="(Category-wise Breakdown of Loans)" 
              data={loanData}                    
              showPercentage={false}  
              isDonut={true}  
            />          
        </div>
    </div>


    <div className=" rounded-xl " >
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-300">        
            <ReusableTable data={convertedTableData} />
          </div>

            <PieChartCard 
              title="लोन का वर्गीकरण" 
              subtitle="(Category-wise Breakdown of Loans)" 
              data={loanData}                    
              showPercentage={true}  
              isDonut={false}  
            /> 
        </div>
      </div>
      </>
      )}
</div>
  );
};
export default DashboardView;