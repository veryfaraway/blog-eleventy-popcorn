module.exports = {
  // Google Analytics
  googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || "",
  
  // Google AdSense
  adsense: {
    enabled: process.env.ADSENSE_ENABLED === "true",
    client: process.env.ADSENSE_CLIENT_ID || "",
    slots: {
      inArticle: process.env.ADSENSE_SLOT_IN_ARTICLE || "",
      display: process.env.ADSENSE_SLOT_DISPLAY || ""
    }
  },
  
  // Utterances (댓글)
  utterances: {
    enabled: process.env.UTTERANCES_ENABLED === "true",
    repo: process.env.UTTERANCES_REPO || ""
  }
};

// 빌드 시 환경 변수 확인 (디버깅용)
if (process.env.NODE_ENV === 'production' || process.env.ELEVENTY_ENV === 'production') {
  console.log('🔍 Environment Variables Check:');
  console.log('- GOOGLE_ANALYTICS_ID:', process.env.GOOGLE_ANALYTICS_ID ? '✅ Set' : '❌ Not set');
  console.log('- ADSENSE_ENABLED:', process.env.ADSENSE_ENABLED);
  console.log('- ADSENSE_CLIENT_ID:', process.env.ADSENSE_CLIENT_ID ? '✅ Set (ca-pub-...)' : '❌ Not set');
  console.log('- ADSENSE_SLOT_IN_ARTICLE:', process.env.ADSENSE_SLOT_IN_ARTICLE ? '✅ Set' : '❌ Not set');
  console.log('- ADSENSE_SLOT_DISPLAY:', process.env.ADSENSE_SLOT_DISPLAY ? '✅ Set' : '❌ Not set');
}
