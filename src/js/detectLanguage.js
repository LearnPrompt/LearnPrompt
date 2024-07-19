export default function detectLanguage() {
    // 获取浏览器语言
    const userLang = navigator.language || navigator.userLanguage;
    console.log('Browser language detected:', userLang);  // 调试输出
  
    // 支持的语言列表
    const supportedLanguages = ['en', 'zh'];
  
    // 默认语言
    const defaultLanguage = 'en';
  
  // 检查语言是否支持，并获取对应的语言代码
  const languagePrefix = userLang.slice(0, 2); // 获取前两位字符
  console.log('Language prefix:', languagePrefix);  // 调试输出

  const selectedLanguage = supportedLanguages.includes(languagePrefix)
    ? (languagePrefix === 'zh' ? 'zh-Hans' : languagePrefix)
    : defaultLanguage;
  
  console.log('Selected language:', selectedLanguage);  // 调试输出
  
  // 如果当前语言不是用户的浏览器语言，进行重定向
  if (selectedLanguage !== document.documentElement.lang) {
    const basePath = window.location.pathname.split('/')[1];
    const newPath = `/${selectedLanguage}/${window.location.pathname.split('/').slice(2).join('/')}`;
    console.log('Redirecting to:', newPath);  // 调试输出
    window.location.replace(newPath);
  }
}