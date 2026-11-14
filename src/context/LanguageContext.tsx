import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Branding
    'app.name': 'GAC Advisors',
    'app.tagline': 'Visa Consultancy Management System',
    'app.subtitle': 'Premier Immigration & Global Visa Advisory',

    // Nav & Tabs
    'nav.dashboard': 'Dashboard',
    'nav.services': 'Visa Services',
    'nav.apply': 'Apply Online',
    'nav.tracking': 'Track Application',
    'nav.documents': 'Documents',
    'nav.appointments': 'Appointments',
    'nav.payments': 'Payments',
    'nav.staff': 'Staff Management',
    'nav.settings': 'Settings',
    'nav.androidProject': 'Android Studio (Kotlin)',
    'nav.adminMaster': 'Master Admin Vault',

    // Role switcher
    'role.client': 'Client View',
    'role.staff': 'Staff View',
    'role.super_admin': 'Super Admin',
    'role.switch': 'Switch Active Persona',

    // Client Dashboard
    'dashboard.welcome': 'Welcome back,',
    'dashboard.visaSummary': 'Your Visa Consultation Portfolio',
    'dashboard.totalApps': 'Total Applications',
    'dashboard.pending': 'Under Review',
    'dashboard.processing': 'In Process',
    'dashboard.completed': 'Completed Cases',
    'dashboard.quickApply': 'Start New Visa Application',
    'dashboard.exploreServices': 'Browse All Visa Services',
    'dashboard.bookAppointment': 'Schedule Consultation',
    'dashboard.recentActivity': 'Recent Case Updates',
    'dashboard.noApps': 'No applications submitted yet. Start your visa journey today!',
    'dashboard.viewTracking': 'Track Status',

    // Statuses
    'status.draft': 'Draft',
    'status.submitted': 'Submitted',
    'status.under_initial_review': 'Under Initial Review',
    'status.documents_required': 'Documents Required',
    'status.documents_under_review': 'Documents Under Review',
    'status.processing': 'Processing',
    'status.ready_for_submission': 'Ready for Submission',
    'status.submitted_to_embassy': 'Submitted to Embassy',
    'status.decision_received': 'Decision Received',
    'status.completed': 'Completed',
    'status.on_hold': 'On Hold',
    'status.cancelled': 'Cancelled',

    // Application Form
    'apply.title': '7-Step Online Visa Application',
    'apply.step1': 'Select Country',
    'apply.step2': 'Visa Category',
    'apply.step3': 'Personal Info',
    'apply.step4': 'Travel Details',
    'apply.step5': 'Financial & Job',
    'apply.step6': 'Upload Documents',
    'apply.step7': 'Review & Submit',
    'apply.saveDraft': 'Save as Draft',
    'apply.next': 'Continue',
    'apply.prev': 'Back',
    'apply.submit': 'Submit Visa Application',
    'apply.success': 'Application Submitted Successfully!',

    // Common
    'common.office': 'Islamabad Head Office',
    'common.pakistanWhatsApp': 'Pakistan WhatsApp',
    'common.uaeWhatsApp': 'UAE WhatsApp',
    'common.chatWhatsApp': 'Chat on WhatsApp',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.download': 'Download',
    'common.approved': 'Approved',
    'common.rejected': 'Rejected',
    'common.pending': 'Pending',
    'common.reupload': 'Re-upload Requested',
    'common.disclaimer': 'Official Disclaimer: Visa approvals and processing times are determined exclusively by respective foreign embassies and immigration authorities.',
  },
  ur: {
    // Branding
    'app.name': 'جی اے سی ایڈوائزرز',
    'app.tagline': 'ویزا کنسلٹنسی مینجمنٹ سسٹم',
    'app.subtitle': 'عالمی ویزا اور امیگریشن کے ماہر مشیر',

    // Nav & Tabs
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.services': 'ویزا سروسز',
    'nav.apply': 'آن لائن درخواست',
    'nav.tracking': 'درخواست ٹریک کریں',
    'nav.documents': 'دستاویزات',
    'nav.appointments': 'ملاقات کا وقت',
    'nav.payments': 'ادائیگی ریکارڈ',
    'nav.staff': 'اسٹاف مینجمنٹ',
    'nav.settings': 'سیٹنگز',
    'nav.androidProject': 'اینڈرائیڈ اسٹوڈیو پروجیکٹ',
    'nav.adminMaster': 'ماسٹر ایڈمن کنٹرول والٹ',

    // Role switcher
    'role.client': 'کلائنٹ منظر',
    'role.staff': 'اسٹاف منظر',
    'role.super_admin': 'سپر ایڈمن',
    'role.switch': 'کردار تبدیل کریں',

    // Client Dashboard
    'dashboard.welcome': 'خوش آمدید،',
    'dashboard.visaSummary': 'آپ کا ویزا کنسلٹنسی پورٹ فولیو',
    'dashboard.totalApps': 'کل درخواستیں',
    'dashboard.pending': 'زیرِ جائزہ',
    'dashboard.processing': 'زیرِ عمل',
    'dashboard.completed': 'مکمل کیسز',
    'dashboard.quickApply': 'نئی ویزا درخواست شروع کریں',
    'dashboard.exploreServices': 'تمام ویزا خدمات دیکھیں',
    'dashboard.bookAppointment': 'مشاورت کا وقت طے کریں',
    'dashboard.recentActivity': 'حالیہ اپ ڈیٹس',
    'dashboard.noApps': 'ابھی تک کوئی درخواست جمع نہیں ہوئی۔ آج ہی اپنا سفر شروع کریں!',
    'dashboard.viewTracking': 'اسٹیٹس دیکھیں',

    // Statuses
    'status.draft': 'ڈرافٹ (نامکمل)',
    'status.submitted': 'جمع ہو گئی',
    'status.under_initial_review': 'ابتدائی جائزے میں',
    'status.documents_required': 'مزید دستاویزات درکار ہیں',
    'status.documents_under_review': 'دستاویزات کی تصدیق جاری',
    'status.processing': 'فائل تیار ہو رہی ہے',
    'status.ready_for_submission': 'سفارتخانے کیلئے تیار',
    'status.submitted_to_embassy': 'سفارتخانے میں جمع',
    'status.decision_received': 'فیصلہ موصول ہو گیا',
    'status.completed': 'کامیابی سے مکمل',
    'status.on_hold': 'التوا میں',
    'status.cancelled': 'منسوخ شدہ',

    // Application Form
    'apply.title': '7 مراحل پر مشتمل آن لائن ویزا درخواست',
    'apply.step1': 'ملک کا انتخاب',
    'apply.step2': 'ویزا کی قسم',
    'apply.step3': 'ذاتی معلومات',
    'apply.step4': 'سفر کی تفصیلات',
    'apply.step5': 'ملازمت اور مالی تفصیل',
    'apply.step6': 'دستاویزات اپلوڈ',
    'apply.step7': 'جائزہ اور تصدیق',
    'apply.saveDraft': 'بطور ڈرافٹ محفوظ کریں',
    'apply.next': 'آگے بڑھیں',
    'apply.prev': 'پیچھے',
    'apply.submit': 'درخواست جمع کروائیں',
    'apply.success': 'درخواست کامیابی سے جمع ہو گئی ہے!',

    // Common
    'common.office': 'اسلام آباد ہیڈ آفس',
    'common.pakistanWhatsApp': 'پاکستان واٹس ایپ',
    'common.uaeWhatsApp': 'یو اے ای واٹس ایپ',
    'common.chatWhatsApp': 'واٹس ایپ پر رابطہ کریں',
    'common.view': 'دیکھیں',
    'common.edit': 'ترمیم',
    'common.delete': 'حذف کریں',
    'common.save': 'تبدیلیاں محفوظ کریں',
    'common.cancel': 'منسوخ',
    'common.download': 'ڈاؤن لوڈ',
    'common.approved': 'منظور شدہ',
    'common.rejected': 'مسترد',
    'common.pending': 'زیرِ انتظار',
    'common.reupload': 'دوبارہ اپلوڈ کریں',
    'common.disclaimer': 'سرکاری وضاحت: ویزا دینے یا مسترد کرنے اور پروسیسنگ وقت کا تمام تر اختیار متعلقہ سفارتخانوں اور امیگریشن حکام کے پاس ہے۔',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isRtl: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gac_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gac_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const isRtl = language === 'ur';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
