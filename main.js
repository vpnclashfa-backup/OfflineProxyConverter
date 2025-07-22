// main.js - فایل اصلی Electron

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let subconverterProcess;

// تابع برای پیدا کردن مسیر subconverter.exe
// این تابع برای حالت توسعه و حالت پکیج شده کار می‌کند
function findSubconverterPath() {
  let subconverterExePath;
  if (app.isPackaged) {
    // در حالت پکیج شده، subconverter.exe باید در پوشه extraResources قرار گیرد
    // که electron-builder آن را به پوشه منابع (resources) کپی می‌کند.
    subconverterExePath = path.join(process.resourcesPath, 'subconverter.exe');
  } else {
    // در حالت توسعه، فرض می‌کنیم subconverter.exe در پوشه روت پروژه (کنار package.json) قرار دارد
    subconverterExePath = path.join(__dirname, '..', 'subconverter.exe');
  }
  return subconverterExePath;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // برای ارتباط امن بین رندر و مین پروسس (اختیاری اما توصیه شده)
      nodeIntegration: false, // Node.js API در رندر پروسس غیرفعال است
      contextIsolation: true, // برای امنیت بیشتر
    },
    icon: path.join(__dirname, 'icon.png') // آیکون برنامه (اگر دارید)
  });

  // در حالت توسعه، React Dev Server را بارگذاری کنید
  // در حالت پکیج شده، فایل index.html ساخته شده توسط React را بارگذاری کنید
  const startUrl = app.isPackaged
    ? `file://${path.join(__dirname, '..', 'build', 'index.html')}` // مسیر فایل build شده React
    : 'http://localhost:3000'; // آدرس React Dev Server

  mainWindow.loadURL(startUrl);

  // باز کردن DevTools (فقط در حالت توسعه)
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // وقتی پنجره بسته می‌شود، منابع را آزاد کنید
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// تابع برای شروع subconverter.exe
function startSubconverter() {
  const subconverterPath = findSubconverterPath();
  console.log(`Trying to start subconverter from: ${subconverterPath}`);

  // بررسی می‌کنیم که فایل subconverter.exe وجود دارد
  if (!fs.existsSync(subconverterPath)) {
    console.error(`Error: subconverter.exe not found at ${subconverterPath}`);
    // در اینجا می‌توانید یک پیام خطا به کاربر نمایش دهید
    // مثلاً: dialog.showErrorBox('خطا', 'فایل subconverter.exe پیدا نشد!');
    return;
  }

  // بررسی می‌کنیم که آیا subconverter قبلاً در حال اجرا است یا خیر
  if (subconverterProcess && !subconverterProcess.killed) {
    console.log('subconverter is already running.');
    return;
  }

  subconverterProcess = spawn(subconverterPath, [], {
    // برای اینکه پنجره CMD باز نشود (فقط در ویندوز)
    detached: true,
    stdio: 'ignore' // 'pipe' برای لاگ کردن خروجی، 'ignore' برای نادیده گرفتن
  });

  subconverterProcess.unref(); // اجازه می‌دهد که پروسس Electron بسته شود حتی اگر subconverter هنوز در حال اجرا باشد

  subconverterProcess.on('error', (err) => {
    console.error('Failed to start subconverter process:', err);
    // می‌توانید به کاربر اطلاع دهید که subconverter اجرا نشد
  });

  subconverterProcess.on('exit', (code, signal) => {
    console.log(`subconverter process exited with code ${code} and signal ${signal}`);
    subconverterProcess = null;
  });

  console.log('subconverter process started.');
}

// تابع برای پایان دادن به subconverter.exe
function stopSubconverter() {
  if (subconverterProcess) {
    console.log('Stopping subconverter process...');
    // در ویندوز، kill() ممکن است پروسس‌های فرزند را نکشد.
    // برای اطمینان بیشتر، می‌توانید از tree-kill (یک پکیج npm) استفاده کنید
    // یا به صورت دستی پروسس را پیدا و kill کنید.
    // اما برای سادگی، kill() را امتحان می‌کنیم.
    subconverterProcess.kill();
    subconverterProcess = null;
  }
}

// وقتی Electron آماده شد، پنجره را ایجاد و subconverter را شروع کنید
app.whenReady().then(() => {
  startSubconverter(); // ابتدا subconverter را شروع کنید
  createWindow();

  app.on('activate', () => {
    // در macOS، وقتی داک آیکون کلیک می‌شود و پنجره‌ای باز نیست، پنجره جدید ایجاد کنید
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// وقتی همه پنجره‌ها بسته می‌شوند، برنامه را ببندید
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopSubconverter(); // subconverter را هم ببندید
    app.quit();
  }
});

// وقتی برنامه قبل از بسته شدن کامل، سیگنال خروج دریافت می‌کند
app.on('before-quit', () => {
  stopSubconverter();
});

// preload.js (اگر از آن استفاده می‌کنید)
// این فایل برای ارتباط امن بین رندر پروسس و مین پروسس استفاده می‌شود.
// برای این مثال ساده، نیازی به محتوای خاصی ندارد، اما برای امنیت بهتر، آن را خالی بگذارید.
// (می‌توانید یک فایل preload.js خالی در کنار main.js ایجاد کنید)
