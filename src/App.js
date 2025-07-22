import React, { useState } from 'react';

// Tailwind CSS is assumed to be available
// Make sure you've loaded Vazirmatn font in public/index.html and configured Tailwind CSS.

function App() {
  // Basic States
  const [subscriptionUrl, setSubscriptionUrl] = useState('');
  const [targetFormat, setTargetFormat] = useState('clash');
  const [outputFilename, setOutputFilename] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Advanced Options States (re-introducing all from previous comprehensive version)
  const [externalConfigUrl, setExternalConfigUrl] = useState('');
  const [includeRemarks, setIncludeRemarks] = useState('');
  const [excludeRemarks, setExcludeRemarks] = useState('');
  const [renameRule, setRenameRule] = useState('');
  const [devId, setDevId] = useState('');
  const [interval, setInterval] = useState('');
  const [strict, setStrict] = useState(false);
  const [emoji, setEmoji] = useState(true);
  const [addEmoji, setAddEmoji] = useState(true);
  const [removeOldEmoji, setRemoveOldEmoji] = useState(true);
  const [appendType, setAppendType] = useState(false);
  const [tfo, setTfo] = useState(false);
  const [udp, setUdp] = useState(false);
  const [list, setList] = useState(false);
  const [sort, setSort] = useState(false);
  const [script, setScript] = useState(false); // For Clash Script
  const [insert, setInsert] = useState(true); // For insert_url
  const [skipCertVerify, setSkipCertVerify] = useState(false); // scv
  const [filterDeprecatedNodes, setFilterDeprecatedNodes] = useState(true); // fdn
  const [expand, setExpand] = useState(true);
  const [appendInfo, setAppendInfo] = useState(true);
  const [prepend, setPrepend] = useState(true);
  const [classic, setClassic] = useState(false); // For Clash classical rule-provider
  const [tls13, setTls13] = useState(false);
  const [newName, setNewName] = useState(false); // For Clash new field name
  const [userAgent, setUserAgent] = useState('');
  const [groupName, setGroupName] = useState(''); // For SSD/SSR group name

  // Collapsible section states
  const [showNodeFiltering, setShowNodeFiltering] = useState(false);
  const [showNodeRenaming, setShowNodeRenaming] = useState(false);
  const [showNodeFeatures, setShowNodeFeatures] = useState(false);
  const [showOutputOptions, setShowOutputOptions] = useState(false);
  const [showClashSpecific, setShowClashSpecific] = useState(false);
  const [showOtherAdvanced, setShowOtherAdvanced] = useState(false);


  // Function to handle the actual conversion via a backend subconverter
  const performConversion = async () => {
    if (!subscriptionUrl) {
      setMessage("خطا: لطفاً لینک اشتراک را وارد کنید.");
      return null;
    }

    setIsLoading(true);
    setMessage('در حال تبدیل...');

    try {
      // The Electron main process will handle launching subconverter.exe
      // We will assume it's running locally on 25500
      const subconverterBackendUrl = 'http://127.0.0.1:25500';

      // Construct the URL for the subconverter backend with all parameters
      const encodedUrl = encodeURIComponent(subscriptionUrl);
      let backendApiUrl = `${subconverterBackendUrl}/sub?target=${targetFormat}&url=${encodedUrl}`;

      // Add all advanced parameters if they are set
      if (externalConfigUrl) backendApiUrl += `&config=${encodeURIComponent(externalConfigUrl)}`;
      if (includeRemarks) backendApiUrl += `&include=${encodeURIComponent(includeRemarks)}`;
      if (excludeRemarks) backendApiUrl += `&exclude=${encodeURIComponent(excludeRemarks)}`;
      if (renameRule) backendApiUrl += `&rename=${encodeURIComponent(renameRule)}`;
      if (devId) backendApiUrl += `&dev_id=${encodeURIComponent(devId)}`;
      if (interval) backendApiUrl += `&interval=${interval}`;
      if (strict) backendApiUrl += `&strict=true`;
      if (!emoji) backendApiUrl += `&emoji=false`; // Only add if false, default is true
      if (!addEmoji) backendApiUrl += `&add_emoji=false`;
      if (!removeOldEmoji) backendApiUrl += `&remove_emoji=false`;
      if (appendType) backendApiUrl += `&append_type=true`;
      if (tfo) backendApiUrl += `&tfo=true`;
      if (udp) backendApiUrl += `&udp=true`;
      if (list) backendApiUrl += `&list=true`;
      if (sort) backendApiUrl += `&sort=true`;
      // filter_script and sort_script are complex (JS code), not directly exposed as simple inputs here.
      // If needed, they would require a more advanced input or pre-defined scripts.
      if (script) backendApiUrl += `&script=true`;
      if (!insert) backendApiUrl += `&insert=false`;
      if (skipCertVerify) backendApiUrl += `&scv=true`;
      if (!filterDeprecatedNodes) backendApiUrl += `&fdn=false`;
      if (!expand) backendApiUrl += `&expand=false`;
      if (!appendInfo) backendApiUrl += `&append_info=false`;
      if (!prepend) backendApiUrl += `&prepend=false`;
      if (classic) backendApiUrl += `&classic=true`;
      if (tls13) backendApiUrl += `&tls13=true`;
      if (newName) backendApiUrl += `&new_name=true`;
      if (userAgent) backendApiUrl += `&ua=${encodeURIComponent(userAgent)}`;
      if (groupName) backendApiUrl += `&group=${encodeURIComponent(groupName)}`;


      const response = await fetch(backendApiUrl);

      if (!response.ok) {
        throw new Error(`خطا در بک‌اند subconverter: ${response.statusText} (${response.status})`);
      }

      const content = await response.text();
      setMessage('تبدیل با موفقیت انجام شد.');
      return content;

    } catch (error) {
      setMessage(`خطا در تبدیل: ${error.message}. لطفاً مطمئن شوید subconverter.exe در حال اجرا است.`);
      console.error('Conversion error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertAndDownload = async () => {
    const convertedContent = await performConversion();
    if (convertedContent) {
      const filename = outputFilename || `converted_${targetFormat}.txt`;
      const blob = new Blob([convertedContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage(`فایل "${filename}" با موفقیت دانلود شد.`);
    }
  };

  // Helper for collapsible sections
  const CollapsibleSection = ({ title, children, isOpen, toggleOpen }) => (
    <div className="mb-4 border border-gray-200 rounded-2xl overflow-hidden"> {/* More rounded */}
      <button
        className="flex justify-between items-center w-full p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none transition-colors duration-200"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-bold text-gray-800">{title}</h3> {/* Bolder text */}
        <svg
          className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center p-4 font-vazirmatn"> {/* More vibrant gradient, Vazirmatn font */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl"> {/* More rounded, subtle hover shadow */}
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">مبدل اشتراک پراکسی لوکال</h1> {/* Bolder title */}

        <div className="mb-4">
          <label htmlFor="subscriptionUrl" className="block text-gray-700 text-sm font-semibold mb-2">
            لینک اشتراک:
          </label>
          <input
            type="url"
            id="subscriptionUrl"
            className="shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
            placeholder="مثال: https://your-provider.com/sub"
            value={subscriptionUrl}
            onChange={(e) => setSubscriptionUrl(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="targetFormat" className="block text-gray-700 text-sm font-semibold mb-2">
            فرمت خروجی:
          </label>
          <select
            id="targetFormat"
            className="shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
          >
            <option value="clash">Clash</option>
            <option value="surge&ver=4">Surge 4</option>
            <option value="v2ray">V2Ray</option>
            <option value="ss">SS (Shadowsocks)</option>
            <option value="quanx">Quantumult X</option>
            <option value="loon">Loon</option>
            <option value="ssr">SSR</option>
            <option value="mixed">Mixed (همه گره‌ها)</option>
            <option value="auto">Auto (تشخیص خودکار)</option>
            <option value="clashr">ClashR</option>
            <option value="quan">Quantumult</option>
            <option value="sssub">SS Android</option>
            <option value="ssd">SSD</option>
            <option value="surfboard">Surfboard</option>
            <option value="surge&ver=2">Surge 2</option>
            <option value="surge&ver=3">Surge 3</option>
            <option value="trojan">Trojan</option>
            <option value="mellow">Mellow</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="outputFilename" className="block text-gray-700 text-sm font-semibold mb-2">
            نام فایل خروجی (اختیاری):
          </label>
          <input
            type="text"
            id="outputFilename"
            className="shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
            placeholder="مثال: my_config.yaml"
            value={outputFilename}
            onChange={(e) => setOutputFilename(e.target.value)}
          />
        </div>

        {/* Advanced Options Sections */}
        <CollapsibleSection
          title="فیلتر و تغییر نام گره‌ها"
          isOpen={showNodeFiltering}
          toggleOpen={() => setShowNodeFiltering(!showNodeFiltering)}
        >
          <div className="mb-4">
            <label htmlFor="includeRemarks" className="block text-gray-700 text-sm font-semibold mb-2">
              شامل کردن گره‌ها (Regex):
            </label>
            <input
              type="text"
              id="includeRemarks"
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="مثال: (ایران|IR)"
              value={includeRemarks}
              onChange={(e) => setIncludeRemarks(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">فقط گره‌هایی که با این الگوی Regex مطابقت دارند، حفظ می‌شوند.</p>
          </div>
          <div className="mb-4">
            <label htmlFor="excludeRemarks" className="block text-gray-700 text-sm font-semibold mb-2">
              حذف گره‌ها (Regex):
            </label>
            <input
              type="text"
              id="excludeRemarks"
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="مثال: (تبلیغ|منقضی)"
              value={excludeRemarks}
              onChange={(e) => setExcludeRemarks(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">گره‌هایی که با این الگوی Regex مطابقت دارند، حذف می‌شوند.</p>
          </div>
          <div className="mb-4">
            <label htmlFor="renameRule" className="block text-gray-700 text-sm font-semibold mb-2">
              قانون تغییر نام (Regex):
            </label>
            <input
              type="text"
              id="renameRule"
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="مثال: (قدیم)@جدید"
              value={renameRule}
              onChange={(e) => setRenameRule(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">فرمت: `الگوی_Regex@جایگزین`. (مثال: `(قدیم)@جدید` برای تغییر "قدیم" به "جدید")</p>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="emoji"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={emoji}
              onChange={(e) => setEmoji(e.target.checked)}
            />
            <label htmlFor="emoji" className="ml-2 text-gray-700 text-sm">شامل کردن Emoji در نام گره‌ها</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="addEmoji"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={addEmoji}
              onChange={(e) => setAddEmoji(e.target.checked)}
            />
            <label htmlFor="addEmoji" className="ml-2 text-gray-700 text-sm">افزودن Emoji جدید (اگر `emoji` فعال باشد)</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="removeOldEmoji"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={removeOldEmoji}
              onChange={(e) => setRemoveOldEmoji(e.target.checked)}
            />
            <label htmlFor="removeOldEmoji" className="ml-2 text-gray-700 text-sm">حذف Emojiهای موجود</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="appendType"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={appendType}
              onChange={(e) => setAppendType(e.target.checked)}
            />
            <label htmlFor="appendType" className="ml-2 text-gray-700 text-sm">افزودن نوع گره به نام (مثال: [SS])</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="appendInfo"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={appendInfo}
              onChange={(e) => setAppendInfo(e.target.checked)}
            />
            <label htmlFor="appendInfo" className="ml-2 text-gray-700 text-sm">افزودن اطلاعات ترافیک/انقضا به نام گره</label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="تنظیمات شبکه و گره"
          isOpen={showNodeFeatures}
          toggleOpen={() => setShowNodeFeatures(!showNodeFeatures)}
        >
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="tfo"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={tfo}
              onChange={(e) => setTfo(e.target.checked)}
            />
            <label htmlFor="tfo" className="ml-2 text-gray-700 text-sm">فعال کردن TCP Fast Open (TFO)</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="udp"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={udp}
              onChange={(e) => setUdp(e.target.checked)}
            />
            <label htmlFor="udp" className="ml-2 text-gray-700 text-sm">فعال کردن UDP</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="tls13"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={tls13}
              onChange={(e) => setTls13(e.target.checked)}
            />
            <label htmlFor="tls13" className="ml-2 text-gray-700 text-sm">فعال کردن TLS 1.3</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="skipCertVerify"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={skipCertVerify}
              onChange={(e) => setSkipCertVerify(e.target.checked)}
            />
            <label htmlFor="skipCertVerify" className="ml-2 text-gray-700 text-sm">غیرفعال کردن بررسی گواهی TLS (SCV)</label>
          </div>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-gray-700 text-sm font-semibold mb-2">
              نام گروه (برای SSD/SSR):
            </label>
            <input
              type="text"
              id="groupName"
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="مثال: MySSGroup"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="گزینه‌های خروجی و پیکربندی"
          isOpen={showOutputOptions}
          toggleOpen={() => setShowOutputOptions(!showOutputOptions)}
        >
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="list"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={list}
              onChange={(e) => setList(e.target.checked)}
            />
            <label htmlFor="list" className="ml-2 text-gray-700 text-sm">خروجی به عنوان لیست گره‌ها/Proxy Provider</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="sort"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={sort}
              onChange={(e) => setSort(e.target.checked)}
            />
            <label htmlFor="sort" className="ml-2 text-gray-700 text-sm">مرتب‌سازی گره‌ها بر اساس نام</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="script"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={script}
              onChange={(e) => setScript(e.target.checked)}
            />
            <label htmlFor="script" className="ml-2 text-gray-700 text-sm">تولید Clash Script</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="insert"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={insert}
              onChange={(e) => setInsert(e.target.checked)}
            />
            <label htmlFor="insert" className="ml-2 text-gray-700 text-sm">شامل کردن گره‌های `insert_url` از پیکربندی بک‌اند</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="prepend"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={prepend}
              onChange={(e) => setPrepend(e.target.checked)}
            />
            <label htmlFor="prepend" className="ml-2 text-gray-700 text-sm">افزودن گره‌های `insert_url` در ابتدای لیست</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="filterDeprecatedNodes"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={filterDeprecatedNodes}
              onChange={(e) => setFilterDeprecatedNodes(e.target.checked)}
            />
            <label htmlFor="filterDeprecatedNodes" className="ml-2 text-gray-700 text-sm">فیلتر کردن گره‌های نامعتبر برای فرمت هدف</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="expand"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={expand}
              onChange={(e) => setExpand(e.target.checked)}
            />
            <label htmlFor="expand" className="ml-2 text-gray-700 text-sm">گسترش RuleSetها (قوانین کامل در خروجی)</label>
          </div>
          <div className="mb-4">
            <label htmlFor="externalConfigUrl" className="block text-gray-700 text-sm font-semibold mb-2">
              لینک پیکربندی خارجی (`config`):
            </label>
            <input
              type="url"
              id="externalConfigUrl"
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="مثال: https://your-gist.com/config.ini"
              value={externalConfigUrl}
              onChange={(e) => setExternalConfigUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">آدرس فایل پیکربندی خارجی (INI, YAML, TOML) برای تنظیمات پیشرفته.</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="تنظیمات خاص Clash"
          isOpen={showClashSpecific}
          toggleOpen={() => setShowClashSpecific(!showClashSpecific)}
        >
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="classic"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={classic}
              onChange={(e) => setClassic(e.target.checked)}
            />
            <label htmlFor="classic" className="ml-2 text-gray-700 text-sm">تولید Clash classical rule-provider</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="newName"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={newName}
              onChange={(e) => setNewName(e.target.checked)}
            />
            <label htmlFor="newName" className="ml-2 text-gray-700 text-sm">استفاده از نام‌های فیلد جدید Clash (proxies, proxy-groups, rules)</label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="سایر تنظیمات پیشرفته"
          isOpen={showOtherAdvanced}
          toggleOpen={() => setShowOtherAdvanced(!showOtherAdvanced)}
        >
          <div className="mb-4">
            <label htmlFor="devId" className="block text-gray-700 text-sm font-semibold mb-2">
              Quantumult X Device ID (`dev_id`):
            </label>
            <input
              type="text"
              id="devId"
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="مثال: A1B2C3D4"
              value={devId}
              onChange={(e) => setDevId(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">برای فعال کردن اسکریپت‌های ریموت در Quantumult X.</p>
          </div>
          <div className="mb-4">
            <label htmlFor="interval" className="block text-gray-700 text-sm font-semibold mb-2">
              فاصله به‌روزرسانی (ثانیه):
            </label>
            <input
              type="number"
              id="interval"
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="مثال: 43200 (12 ساعت)"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">تعیین می‌کند که پیکربندی هر چند وقت یکبار به‌روزرسانی شود.</p>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="strict"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={strict}
              onChange={(e) => setStrict(e.target.checked)}
            />
            <label htmlFor="strict" className="ml-2 text-gray-700 text-sm">به‌روزرسانی اجباری (فقط برای Surge)</label>
          </div>
          <div className="mb-4">
            <label htmlFor="userAgent" className="block text-gray-700 text-sm font-semibold mb-2">
              User-Agent سفارشی:
            </label>
            <input
              type="text"
              id="userAgent"
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="مثال: Shadowrocket/2.2.65"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">رشته User-Agent برای درخواست‌های اشتراک.</p>
          </div>
        </CollapsibleSection>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleConvertAndDownload}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-opacity-75"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال تبدیل و دانلود...
              </span>
            ) : (
              'تبدیل و دانلود فایل'
            )}
          </button>
        </div>

        {message && (
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
