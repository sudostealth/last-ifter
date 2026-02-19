
import { 
  Coffee, 
  Utensils, 
  Waves, 
  Beef, 
  Cookie, 
  Flame,
  Droplets,
  Apple,
  Zap
} from 'lucide-react';
import { MenuItem, EventConfig } from './types';

export const EVENT_CONFIG: EventConfig = {
  date: "February 25, 2026",
  time: "4:30 PM - 8:30 PM",
  venue: "Central Field, Green University of Bangladesh",
  fee: 300
};

export const RAMADAN_QUOTES = [
  {
    arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ",
    en: "The month of Ramadan [is that] in which was revealed the Qur'an.",
    bn: "রমজান মাস, যাতে কুরআন অবতীর্ণ করা হয়েছে।"
  },
  {
    arabic: "الصَّوْمُ جُنَّةٌ",
    en: "Fasting is a shield.",
    bn: "রোজা একটি ঢাল।"
  },
  {
    arabic: "لِكُلِّ شَيْءٍ زَكَاةٌ وَزَكَاةُ الْجَسَدِ الصَّوْمُ",
    en: "Everything has a Zakat, and the Zakat of the body is fasting.",
    bn: "প্রত্যেক জিনিসের জাকাত আছে, আর শরীরের জাকাত হলো রোজা।"
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    name: { en: "Premium Dates", bn: "খেজুর" },
    icon: "Coffee",
    description: { en: "Sweet Medjool dates to break the fast", bn: "ইফতারের শুরুতে মিষ্টি উন্নতমানের খেজুর" }
  },
  {
    name: { en: "Lemon Sherbet", bn: "লেবুর শরবত" },
    icon: "Droplets",
    description: { en: "Refreshing chilled lemon nectar", bn: "তৃপ্তিদায়ক ঠাণ্ডা লেবুর শরবত" }
  },
  {
    name: { en: "Crispy Jalebi", bn: "জিলাপি" },
    icon: "Waves",
    description: { en: "Traditional sugary crunch", bn: "ঐতিহ্যবাহী মুচমুচে জিলাপি" }
  },
  {
    name: { en: "Piyaju & Chop", bn: "পিঁয়াজু ও চপ" },
    icon: "Cookie",
    description: { en: "Spicy fried appetizers", bn: "মসলাদার পিঁয়াজু ও আলুর চপ" }
  },
  {
    name: { en: "Assorted Fruit", bn: "ফলমূল" },
    icon: "Apple",
    description: { en: "Fresh seasonal sliced fruits", bn: "তাজা মৌসুমী ফলের সমাহার" }
  },
  {
    name: { en: "Mutton Kacchi", bn: "মাটন কাচ্চি" },
    icon: "Beef",
    description: { en: "Slow-cooked fragrant mutton biryani", bn: "মন মাতানো স্বাদের মাটন কাচ্চি বিরিয়ানি" }
  },
  {
    name: { en: "Mojo", bn: "মোজো" },
    icon: "Zap",
    description: { en: "Chilled carbonated soft drink", bn: "ঠাণ্ডা কার্বোনেটেড পানীয়" }
  }
];

export const TRANSLATIONS = {
  en: {
    title: "Last Iftar Party",
    subtitle: "GUB Batch 231 | Department of CSE",
    quote: "The breath of the fasting person is more pleasant to Allah than the fragrance of musk.",
    countdown: "Countdown to Iftar",
    register: "Join the Table",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    menu: "Iftar Menu",
    details: "Event Information",
    fee: "Entry Fee",
    payment: "Secure Your Seat",
    success: "Alhamdulillah! Registration Successful",
    back: "Back",
    next: "Next",
    submit: "Complete Payment",
    batchWarning: "Registration is exclusive to Batch 231",
    deptWarning: "Only CSE department students allowed",
    location: "Location",
    time: "Time",
    date: "Date",
    studentId: "Student ID",
    section: "Section",
    invalidPhone: "Invalid phone number",
    invalidId: "Invalid student ID format",
    required: "This field is required",
    mapLabel: "Find Us Here"
  },
  bn: {
    title: "শেষ ইফতার পার্টি",
    subtitle: "জিইউবি ব্যাচ ২৩১ | সিএসই বিভাগ",
    quote: "রোজাদারের মুখের ঘ্রাণ আল্লাহর কাছে মিশক-আম্বরের চেয়েও প্রিয়।",
    countdown: "ইফতারের বাকি",
    register: "রেজিস্ট্রেশন করুন",
    days: "দিন",
    hours: "ঘণ্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    menu: "ইফতার মেনু",
    details: "ইভেন্টের বিস্তারিত",
    fee: "প্রবেশ মূল্য",
    payment: "আসন নিশ্চিত করুন",
    success: "আলহামদুলিল্লাহ! রেজিস্ট্রেশন সফল হয়েছে",
    back: "পিছনে",
    next: "পরবর্তী",
    submit: "পেমেন্ট সম্পন্ন করুন",
    batchWarning: "শুধুমাত্র ২৩১ ব্যাচের জন্য প্রযোজ্য",
    deptWarning: "শুধুমাত্র সিএসই বিভাগের শিক্ষার্থীদের জন্য",
    location: "স্থান",
    time: "সময়",
    date: "তারিখ",
    studentId: "স্টুডেন্ট আইডি",
    section: "সেকশন",
    invalidPhone: "ভুল ফোন নাম্বার",
    invalidId: "ভুল আইডি ফরম্যাট",
    required: "এই তথ্যটি আবশ্যক",
    mapLabel: "আমাদের অবস্থান"
  }
};
