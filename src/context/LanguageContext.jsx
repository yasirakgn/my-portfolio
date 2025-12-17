import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // 1. Initialize state from localStorage or default to 'tr'
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('app_language');
        // Validate that saved language exists in our dictionary, else fallback to 'tr'
        return saved && translations[saved] ? saved : 'tr';
    });

    // 2. Persist to localStorage whenever language changes
    useEffect(() => {
        localStorage.setItem('app_language', language);
        // Optional: Set html lang attribute for simple SEO/Access helper
        document.documentElement.lang = language;
    }, [language]);

    // 3. Translation function with parameter interpolation
    const t = (key, params = {}) => {
        const dict = translations[language] || translations['tr'];
        let text = dict[key] || translations['tr'][key] || key;

        // Interpolate params: replaced {{key}} with params.key
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(paramKey => {
                const regex = new RegExp(`{{${paramKey}}}`, 'g');
                text = text.replace(regex, params[paramKey]);
            });
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
