import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translation } from '../Config'

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init( translation.i18Settings );

export default i18n;