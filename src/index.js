import React from 'react';
import ReactDOM from 'react-dom/client'; // استفاده از createRoot برای React 18
import './index.css'; // ایمپورت فایل CSS اصلی
import App from './App'; // ایمپورت کامپوننت App
import reportWebVitals from './reportWebVitals'; // برای گزارش‌دهی عملکرد وب

// نقطه ورود اصلی برنامه React.
// این کد کامپوننت <App /> را در عنصر DOM با شناسه 'root' رندر می‌کند.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*
      <React.StrictMode> یک ابزار برای شناسایی مشکلات احتمالی در برنامه است.
      این ابزار هیچ UI قابل مشاهده‌ای را رندر نمی‌کند و فقط هشدارهایی را در حالت توسعه می‌دهد.
    */}
    <App />
  </React.StrictMode>
);

// اگر می‌خواهید عملکرد برنامه خود را اندازه‌گیری کنید، می‌توانید یک تابع را ارسال کنید
// تا نتایج را لاگ کند (مثلاً: reportWebVitals(console.log))
// یا به یک نقطه پایانی تحلیلی ارسال کند.
// برای اطلاعات بیشتر: https://bit.ly/CRA-vitals
reportWebVitals();
