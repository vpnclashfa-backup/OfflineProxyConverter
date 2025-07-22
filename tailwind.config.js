/** @type {import('tailwindcss').Config} */
module.exports = {
  // مشخص می‌کند Tailwind کدام فایل‌ها را برای کلاس‌های CSS اسکن کند
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // اینجا می‌توانید فونت Vazirmatn را به Tailwind اضافه کنید
      fontFamily: {
        vazirmatn: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
