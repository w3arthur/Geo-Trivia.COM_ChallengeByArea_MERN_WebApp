
const translation = {
    translationCookieName: 'i18next'
    , defaultLanguage: 'english'
    , i18Settings: {
        supportedLngs: [ 'english', 'hebrew', 'russian']
        , fallbackLng: 'english'
        , detection: { order: ['cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'], caches: ['cookie'], }
        , backend: { loadPath: '/translation/{{lng}}.json',  }
        }
    , languages: [
        { code: 'english', country_code: 'us', name: 'English' }
        , { code: 'hebrew', country_code: 'il', name: 'עברית', dir: 'rtl' }
        , { code: 'russian', country_code: 'ru', name: 'Русский' }     
        ]
}

export default translation;