// Cookie consent management for Quantificate
const CookieConsent = {
  consentKey: 'cookieConsent',
  
  hasConsent: function() {
    const consent = localStorage.getItem(this.consentKey);
    return consent !== null;
  },
  
  getConsent: function() {
    const consent = localStorage.getItem(this.consentKey);
    return consent ? JSON.parse(consent) : null;
  },
  
  saveConsent: function(preferences) {
    localStorage.setItem(this.consentKey, JSON.stringify(preferences));
    this.applyCookiePreferences(preferences);
  },
  
  applyCookiePreferences: function(preferences) {
    // Update Google Analytics consent
    if (typeof gtag === 'function') {
      if (preferences.analytics) {
        console.log('✅ Google Analytics enabled');
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      } else {
        console.log('❌ Google Analytics disabled');
        gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
    }
  },
  
  showBanner: function() {
    document.getElementById('cookieConsent').classList.add('show');
  },
  
  hideBanner: function() {
    document.getElementById('cookieConsent').classList.remove('show');
  }
};

function acceptAllCookies() {
  const preferences = {
    essential: true,
    analytics: true,
    timestamp: new Date().toISOString()
  };
  CookieConsent.saveConsent(preferences);
  CookieConsent.hideBanner();
}

function declineAllCookies() {
  const preferences = {
    essential: true,
    analytics: false,
    timestamp: new Date().toISOString()
  };
  CookieConsent.saveConsent(preferences);
  CookieConsent.hideBanner();
}

function showSettings() {
  const consent = CookieConsent.getConsent();
  if (consent) {
    document.getElementById('analyticsCookies').checked = consent.analytics;
  }
  document.getElementById('cookieSettings').classList.add('show');
}

function closeSettings() {
  document.getElementById('cookieSettings').classList.remove('show');
}

function saveSettings() {
  const preferences = {
    essential: true,
    analytics: document.getElementById('analyticsCookies').checked,
    timestamp: new Date().toISOString()
  };
  CookieConsent.saveConsent(preferences);
  CookieConsent.hideBanner();
  closeSettings();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  if (!CookieConsent.hasConsent()) {
    CookieConsent.showBanner();
  } else {
    const consent = CookieConsent.getConsent();
    CookieConsent.applyCookiePreferences(consent);
  }
});