import React, { useState, useEffect } from 'react';

// Tailwind CSS is assumed to be available
// Make sure you've loaded Vazirmatn font in public/index.html and configured Tailwind CSS.

// لیست پیکربندی‌های خارجی از راه دور
const remoteConfigs = [
    {
        label: "عمومی",
        options: [
            { label: "پیش‌فرض (بدون تست خودکار سرعت)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini" },
            { label: "پیش‌فرض (تست خودکار سرعت)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini" },
            { label: "پیش‌فرض (مخصوص تلویزیون سونی)", value: "https://raw.githubusercontent.com/youshandefeiyang/webcdn/main/SONY.ini" },
            { label: "پیش‌فرض (همراه با AdGuard DNS برای Clash)", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/default_with_clash_adg.yml" },
            { label: "ACL (تمام گروه‌ها، نسخه اصلاح شده Dream)", value: "https://raw.githubusercontent.com/WC-Dream/ACL4SSR/WD/Clash/config/ACL4SSR_Online_Full_Dream.ini" },
            { label: "ACL (گروه‌های فشرده، نسخه اصلاح شده Dream)", value: "https://raw.githubusercontent.com/WC-Dream/ACL4SSR/WD/Clash/config/ACL4SSR_Mini_Dream.ini" },
            { label: "امبی-تیک‌تاک (گروه‌بندی رسانه‌ای، ضد تبلیغات قوی)", value: "https://raw.githubusercontent.com/justdoiting/ClashRule/main/GeneralClashRule.ini" },
            { label: "گروه‌بندی عمومی رسانه‌ای", value: "https://raw.githubusercontent.com/cutethotw/ClashRule/main/GeneralClashRule.ini" }
        ]
    },
    {
        label: "قوانین ACL",
        options: [
            { label: "ACL (نسخه پیش‌فرض)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini" },
            { label: "ACL (بدون تست سرعت)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini" },
            { label: "ACL (حذف تبلیغات)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini" },
            { label: "ACL (چند کشوری)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_MultiCountry.ini" },
            { label: "ACL (بدون Reject)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini" },
            { label: "ACL (فشرده، بدون تست سرعت)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini" },
            { label: "ACL (تمام گروه‌ها)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini" },
            { label: "ACL (تمام گروه‌ها، گوگل)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Google.ini" },
            { label: "ACL (تمام گروه‌ها، چند حالته)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_MultiMode.ini" },
            { label: "ACL (تمام گروه‌ها، نتفلیکس)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini" },
            { label: "ACL (فشرده)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini" },
            { label: "ACL (فشرده، حذف تبلیغات)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini" },
            { label: "ACL (فشرده، Fallback)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini" },
            { label: "ACL (فشرده، چند کشوری)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiCountry.ini" },
            { label: "ACL (فشرده، چند حالته)", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini" }
        ]
    },
    {
        label: "قوانین جمع‌آوری شده از سراسر وب",
        options: [
            { label: "قوانین معمولی", value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG.ini" },
            { label: "استفاده شخصی (Cool)", value: "https://raw.githubusercontent.com/xiaoshenxian233/cool/rule/complex.ini" },
            { label: "فاروس پرو (بدون تست سرعت)", value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/special/phaors.ini" },
            { label: "انتقال خودکار خطا (بر اساس منطقه)", value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_Fallback.ini" },
            { label: "تست خودکار سرعت (بر اساس منطقه)", value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_Urltest.ini" },
            { label: "بدون تست خودکار سرعت (بر اساس منطقه)", value: "https://raw.githubusercontent.com/flyhigherpi/merlinclash_clash_related/master/Rule_config/ZHANG_Area_NoAuto.ini" },
            { label: "اوهههههه", value: "https://raw.githubusercontent.com/OoHHHHHHH/ini/master/config.ini" },
            { label: "CFW-TAP", value: "https://raw.githubusercontent.com/OoHHHHHHH/ini/master/cfw-tap.ini" },
            { label: "lhl77 (تمام گروه‌ها، به‌روزرسانی منظم)", value: "https://raw.githubusercontent.com/lhl77/sub-ini/main/tsutsu-full.ini" },
            { label: "lhl77 (نسخه ساده، به‌روزرسانی منظم)", value: "https://raw.githubusercontent.com/lhl77/sub-ini/main/tsutsu-mini-gfw.ini" },
            { label: "کانرز هوا شن‌جی (خروجی)", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/connershua_new.ini" },
            { label: "کانرز هوا شن‌جی (ورودی، بازگشت به چین)", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/connershua_backtocn.ini" },
            { label: "lhie1 دونگ‌ژو (با گروه‌بندی Clash)", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/lhie1_clash.ini" },
            { label: "lhie1 دونگ‌ژو (نسخه کامل)", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/lhie1_dler.ini" },
            { label: "eHpo1", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/ehpo1_main.ini" },
            { label: "لیست سفید پیش‌فرض (چند استراتژی گروهی)", value: "https://raw.nameless13.com/api/public/dl/ROzQqi2S/white.ini" },
            { label: "چند استراتژی گروهی (ضد حسابرسی)", value: "https://raw.nameless13.com/api/public/dl/ptLeiO3S/mayinggfw.ini" },
            { label: "لیست سفید پیش‌فرض (استراتژی ساده)", value: "https://raw.nameless13.com/api/public/dl/FWSh3dXz/easy3.ini" },
            { label: "افزودن استراتژی SMTP (به چند استراتژی)", value: "https://raw.nameless13.com/api/public/dl/L_-vxO7I/youtube.ini" },
            { label: "توصیه برای مبتدیان (بدون استراتژی)", value: "https://raw.nameless13.com/api/public/dl/zKF9vFbb/easy.ini" },
            { label: "توصیه برای مبتدیان (با گروه‌بندی کشور)", value: "https://raw.nameless13.com/api/public/dl/E69bzCaE/easy2.ini" },
            { label: "فقط IPIP CN + نهایی (بدون استراتژی)", value: "https://raw.nameless13.com/api/public/dl/XHr0miMg/ipip.ini" },
            { label: "گروه‌بندی VIP Maying (بدون استراتژی)", value: "https://raw.nameless13.com/api/public/dl/BBnfb5lD/MAYINGVIP.ini" },
            { label: "پینیون (گروه‌بندی فقط هنگ کنگ)", value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Examine.ini" },
            { label: "پینیون (گروه‌بندی تمام مناطق)", value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Examine_Full.ini" },
            { label: "nzw9314", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/nzw9314_custom.ini" },
            { label: "maicoo-l", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/maicoo-l_custom.ini" },
            { label: "DlerCloud پلاتینیوم (سفارشی شده Li Ge)", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_platinum.ini" },
            { label: "DlerCloud گلد (سفارشی شده Li Ge)", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_gold.ini" },
            { label: "DlerCloud سیلور (سفارشی شده Li Ge)", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/dlercloud_lige_silver.ini" },
            { label: "استفاده شخصی (ProxyStorage)", value: "https://unpkg.com/proxy-script/config/Clash/clash.ini" },
            { label: "شل‌کلش (اصلاح شده UlinoyaPed)", value: "https://github.com/UlinoyaPed/ShellClash/raw/master/rules/ShellClash.ini" }
        ]
    },
    {
        label: "قوانین فرودگاه‌های بزرگ",
        options: [
            { label: "اکس‌فلاکس", value: "https://gist.githubusercontent.com/jklolixxs/16964c46bad1821c70fa97109fd6faa2/raw/EXFLUX.ini" },
            { label: "نانوپورت", value: "https://gist.githubusercontent.com/jklolixxs/32d4e9a1a5d18a92beccf3be434f7966/raw/NaNoport.ini" },
            { label: "کوردکلاد", value: "https://gist.githubusercontent.com/jklolixxs/dfbe0cf71ffc547557395c772836d9a8/raw/CordCloud.ini" },
            { label: "بیگ‌ایروپورت", value: "https://gist.githubusercontent.com/jklolixxs/e2b0105c8be6023f3941816509a4c453/raw/BigAirport.ini" },
            { label: "پائولو کلاد", value: "https://gist.githubusercontent.com/jklolixxs/9f6989137a2cfcc138c6da4bd4e4cbfc/raw/PaoLuCloud.ini" },
            { label: "ویوکلاد", value: "https://gist.githubusercontent.com/jklolixxs/fccb74b6c0018b3ad7b9ed6d327035b3/raw/WaveCloud.ini" },
            { label: "جی‌جی", value: "https://gist.githubusercontent.com/jklolixxs/bfd5061dceeef85e84401482f5c92e42/raw/JiJi.ini" },
            { label: "سی‌جی جیاسو", value: "https://gist.githubusercontent.com/jklolixxs/6ff6e7658033e9b535e24ade072cf374/raw/SJ.ini" },
            { label: "ایم‌تلکام", value: "https://gist.githubusercontent.com/jklolixxs/24f4f58bb646ee2c625803eb916fe36d/raw/ImmTelecom.ini" },
            { label: "امی‌تلکام", value: "https://gist.githubusercontent.com/jklolixxs/b53d315cd1cede23af83322c625803eb916fe36d/raw/AmyTelecom.ini" },
            { label: "لینک‌کیوب", value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/convenience.ini" },
            { label: "میائونا", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/Miaona.ini" },
            { label: "فو و فرندز", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/Foo&Friends.ini" },
            { label: "ای‌بی‌کلاد", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/ABCloud.ini" },
            { label: "شیان‌یو", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/xianyu.ini" },
            { label: "بیان‌لی‌دیان", value: "https://subweb.oss-cn-hongkong.aliyuncs.com/RemoteConfig/customized/convenience.ini" },
            { label: "سی‌ان‌ایکس", value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/SSRcloud.ini" },
            { label: "نیروانا", value: "https://raw.githubusercontent.com/Mazetsz/ACL4SSR/master/Clash/config/V2rayPro.ini" },
            { label: "V2Pro", value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/V2Pro.ini" },
            { label: "استیچ (تست خودکار سرعت)", value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Stitch.ini" },
            { label: "استیچ (توازن بار)", value: "https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Stitch-Balance.ini" },
            { label: "مایینگ", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/maying.ini" },
            { label: "Ytoo", value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/ytoo.ini" },
            { label: "w8ves", value: "https://raw.nameless13.com/api/public/dl/M-We_Fn7/w8ves.ini" },
            { label: "نیان‌کت", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/nyancat.ini" },
            { label: "نکسیتالی", value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/nexitally.ini" },
            { label: "سوکلاد", value: "https://raw.githubusercontent.com/SleepyHeehead/subconverter-config/master/remote-config/customized/socloud.ini" },
            { label: "آرک", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/customized/ark.ini" },
            { label: "N3RO", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/n3ro_optimized.ini" },
            { label: "اسکالر", value: "https://gist.githubusercontent.com/tindy2013/1fa08640a9088ac8652dbd40c5d2715b/raw/scholar_optimized.ini" },
            { label: "فلاورکلاد", value: "https://subweb.s3.fr-par.scw.cloud/RemoteConfig/customized/flower.ini" }
        ]
    },
    {
        label: "ویژه",
        options: [
            { label: "نت‌ایز آن‌بلاک", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/netease.ini" },
            { label: "پایه", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/basic.ini" }
        ]
    }
];

// تابع کمکی برای خواندن فایل به صورت Data URL
const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

// تابع کمکی برای خواندن فایل به صورت متن خام
const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

// تابع کمکی برای Base64 کردن یک رشته
const base64Encode = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
};

function App() {
  // Basic States
  const [subscriptionUrl, setSubscriptionUrl] = useState('');
  const [targetFormat, setTargetFormat] = useState('clash');
  const [outputFilename, setOutputFilename] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Input Type States (URL vs File)
  const [useFileInput, setUseFileInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertToBase64, setConvertToBase64] = useState(false); // New state for Base64 conversion

  // Remote Config States
  const [useCustomConfig, setUseCustomConfig] = useState(false);
  const [selectedPredefinedConfig, setSelectedPredefinedConfig] = useState('');
  const [customConfigUrlInput, setCustomConfigUrlInput] = useState('');
  const [externalConfigUrl, setExternalConfigUrl] = useState(''); // This is the actual URL sent to subconverter


  // Advanced Options States (re-introducing all from previous comprehensive version)
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
  const [showRemoteConfig, setShowRemoteConfig] = useState(false); // New state for remote config section
  const [showClashSpecific, setShowClashSpecific] = useState(false);
  const [showOtherAdvanced, setShowOtherAdvanced] = useState(false);

  // Effect to set default remote config based on targetFormat
  useEffect(() => {
    let defaultUrl = '';
    if (targetFormat === 'clash') {
      defaultUrl = "https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/ACL4SSR/vpnclashfa.ini"; // مخصوص ایران
    } else {
      defaultUrl = "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini"; // پیش‌فرض (تست خودکار سرعت)
    }
    setSelectedPredefinedConfig(defaultUrl);
    // Update externalConfigUrl if not using custom config
    if (!useCustomConfig) {
      setExternalConfigUrl(defaultUrl);
    }
  }, [targetFormat, useCustomConfig]); // Dependency on targetFormat and useCustomConfig

  // Effect to update externalConfigUrl when predefined or custom changes
  useEffect(() => {
    if (useCustomConfig) {
      setExternalConfigUrl(customConfigUrlInput);
    } else {
      setExternalConfigUrl(selectedPredefinedConfig);
    }
  }, [useCustomConfig, selectedPredefinedConfig, customConfigUrlInput]);


  // Function to handle the actual conversion via a backend subconverter
  const performConversion = async () => {
    setMessage(''); // Clear previous messages
    setIsLoading(true);

    try {
      const subconverterBackendUrl = 'http://127.0.0.1:25500';
      let finalUrlParam = '';
      let inputContent = ''; // To hold the raw content (URL string or file text)

      if (useFileInput) {
        if (!selectedFile) {
          setMessage("خطا: لطفاً یک فایل را انتخاب کنید.");
          return null;
        }
        try {
          inputContent = await readFileAsText(selectedFile); // Read file as plain text
        } catch (fileError) {
          setMessage(`خطا در خواندن فایل: ${fileError.message}`);
          return null;
        }
      } else {
        if (!subscriptionUrl) {
          setMessage("خطا: لطفاً لینک اشتراک را وارد کنید.");
          return null;
        }
        inputContent = subscriptionUrl;
      }

      if (convertToBase64) {
          finalUrlParam = encodeURIComponent(base64Encode(inputContent));
      } else {
          // If not converting to Base64, and it's a file input, we need to send as data URI
          // If it's a URL input, send as regular URL
          if (useFileInput) {
              // Re-read as Data URL if not Base64 encoded (subconverter expects data: URI for files)
              const fileDataUrl = await readFileAsDataURL(selectedFile);
              finalUrlParam = encodeURIComponent(fileDataUrl);
          } else {
              finalUrlParam = encodeURIComponent(inputContent); // This is the original URL
          }
      }

      // FIX: Ensure targetFormat is encoded correctly
      let backendApiUrl = `${subconverterBackendUrl}/sub?target=${encodeURIComponent(targetFormat)}&url=${finalUrlParam}`;

      // Add externalConfigUrl if it's set
      if (externalConfigUrl) backendApiUrl += `&config=${encodeURIComponent(externalConfigUrl)}`;
      
      // Add all advanced parameters if they are set
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
      let errorMessage = `خطا در تبدیل: ${error.message}.`;
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage += ' لطفاً مطمئن شوید Subconverter.exe در حال اجرا است و توسط آنتی‌ویروس یا فایروال شما بلاک نشده باشد.';
      } else if (error.response && !error.response.ok) {
         errorMessage += ` (کد خطا: ${error.response.status})`;
      }
      setMessage(errorMessage);
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
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">مبدل اشتراک پراکسی لوکال</h1> {/* Bolder title */}
        <p className="text-center text-gray-600 text-sm mb-6">
          موتور تبدیل (Subconverter.exe) به صورت خودکار در پس‌زمینه توسط برنامه اجرا می‌شود.
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            نوع ورودی:
          </label>
          <div className="flex items-center space-x-4 mb-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-purple-600 h-5 w-5"
                name="inputType"
                value="url"
                checked={!useFileInput}
                onChange={() => setUseFileInput(false)}
              />
              <span className="ml-2 text-gray-700">لینک اشتراک</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-purple-600 h-5 w-5"
                name="inputType"
                value="file"
                checked={useFileInput}
                onChange={() => setUseFileInput(true)}
              />
              <span className="ml-2 text-gray-700">فایل اشتراک</span>
            </label>
          </div>

          {!useFileInput ? (
            <>
              <input
                type="url"
                id="subscriptionUrl"
                className="shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                placeholder="مثال: https://your-provider.com/sub"
                value={subscriptionUrl}
                onChange={(e) => setSubscriptionUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                می‌توانید چندین لینک را با کاراکتر `|` (پایپ) از هم جدا کنید. مثال: `لینک۱|لینک۲|لینک۳`
              </p>
            </>
          ) : (
            <>
              <input
                type="file"
                id="subscriptionFile"
                className="shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept=".txt,.conf,.yaml,.yml,.ini" // Suggest common config file types
              />
              <p className="text-xs text-gray-500 mt-1">
                فایل می‌تواند شامل چندین لینک پراکسی (هر کدام در یک خط) یا یک فایل پیکربندی کامل باشد.
              </p>
            </>
          )}
        </div>

        {/* New Base64 Conversion Option */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              id="convertToBase64"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={convertToBase64}
              onChange={(e) => setConvertToBase64(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">تبدیل محتوای ورودی به Base64 قبل از ارسال</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            اگر این گزینه فعال باشد، لینک یا محتوای فایل شما ابتدا به Base64 تبدیل شده و سپس به موتور تبدیل ارسال می‌شود.
            این برای برخی از لینک‌های اشتراک که خودشان Base64 هستند، مفید است.
          </p>
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
          title="پیکربندی خارجی (Remote Config)"
          isOpen={showRemoteConfig} // Using its own toggle
          toggleOpen={() => setShowRemoteConfig(!showRemoteConfig)}
        >
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="useCustomConfig"
              className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-400"
              checked={useCustomConfig}
              onChange={(e) => setUseCustomConfig(e.target.checked)}
            />
            <label htmlFor="useCustomConfig" className="ml-2 text-gray-700 text-sm">استفاده از لینک پیکربندی سفارشی</label>
          </div>

          {!useCustomConfig ? (
            <div className="mb-4">
              <label htmlFor="selectedPredefinedConfig" className="block text-gray-700 text-sm font-semibold mb-2">
                انتخاب پیکربندی از پیش تعریف شده:
              </label>
              <select
                id="selectedPredefinedConfig"
                className="shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                value={selectedPredefinedConfig}
                onChange={(e) => setSelectedPredefinedConfig(e.target.value)}
              >
                {/* "مخصوص ایران" option */}
                <option value="https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/ACL4SSR/vpnclashfa.ini">مخصوص ایران</option>
                {remoteConfigs.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map(config => (
                      <option key={config.value} value={config.value}>
                        {config.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="customConfigUrlInput" className="block text-gray-700 text-sm font-semibold mb-2">
                لینک پیکربندی سفارشی:
              </label>
              <input
                type="url"
                id="customConfigUrlInput"
                className="shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                placeholder="مثال: https://your-custom-config.com/config.ini"
                value={customConfigUrlInput}
                onChange={(e) => setCustomConfigUrlInput(e.target.value)}
              />
            </div>
          )}
        </CollapsibleSection>


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
          {/* ... existing content for output options ... */}
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
