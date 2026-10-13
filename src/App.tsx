import { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Globe2,
  Landmark,
  Mic,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Users,
  Volume2,
  Wallet,
} from 'lucide-react';

type Language = 'en' | 'te';

type LocalizedText = {
  en: string;
  te: string;
};

type HistoryItem = {
  question: string;
  answer: string;
};

type Suggestion = {
  en: string;
  te: string;
};

const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const saved = window.localStorage.getItem('digital-suraksha-language');
  return saved === 'te' ? 'te' : 'en';
};

const t = (value: LocalizedText, language: Language) => value[language];

const fraudCategories = [
  {
    title: { en: 'UPI & Bank Safety', te: 'UPI & బ్యాంక్ భద్రత' },
    description: {
      en: 'Spot fake payment requests, verify account details, and protect OTPs.',
      te: 'తప్పుడు చెల్లింపు అభ్యర్థనలను గుర్తించడం, అకౌంట్ వివరాలను ధృవీకరించడం మరియు OTPలను రక్షించడం.',
    },
    accent: 'from-emerald-500 to-teal-600',
    icon: CreditCard,
  },
  {
    title: { en: 'Phishing & Fake Links', te: 'ఫిషింగ్ & నకిలీ లింక్లు' },
    description: {
      en: 'Learn how to inspect domains, verify URLs, and avoid scam messages.',
      te: 'డొమైన్‌లను పరిశీలించడం, URLలను ధృవీకరించడం మరియు స్కామ్ సందేశాలను నివారించడం.',
    },
    accent: 'from-sky-500 to-cyan-600',
    icon: ShieldAlert,
  },
  {
    title: { en: 'Job & Investment Fraud', te: 'జాబ్ & ఇన్వెస్ట్మెంట్ మోసం' },
    description: {
      en: 'Recognize fake work-from-home offers and investment traps.',
      te: 'నకిలీ వర్క్-ఫ్రమ్-హోమ్ ఆఫర్లు మరియు ఇన్వెస్ట్మెంట్ బారిన పడకుండా జాగ్రత్త.',
    },
    accent: 'from-amber-500 to-orange-600',
    icon: Wallet,
  },
  {
    title: { en: 'Digital Arrest Threats', te: 'డిజిటల్ అరెస్ట్ బెదిరింపులు' },
    description: {
      en: 'Protect yourself against pressure tactics and impersonation calls.',
      te: 'పీడన ధోరణులు మరియు గుర్తింపు కాల్‌ల నుండి మీర్ని రక్షించుకోండి.',
    },
    accent: 'from-rose-500 to-red-600',
    icon: ShieldCheck,
  },
];

const recentAlerts = [
  {
    title: { en: 'UPI QR code scam warning', te: 'UPI QR కోడ్ స్కామ్ హెచ్చరిక' },
    detail: {
      en: 'Fraudsters are sharing fake QR images that redirect payments to fake merchants.',
      te: 'మోసగాళ్ళు కపట లావాదేవీ రcతో QR చిత్రాలను పంపుతున్నారు.',
    },
    time: 'Live',
  },
  {
    title: { en: 'Fake loan app alert', te: 'నకిలీ లోన్ యాప్ హెచ్చరిక' },
    detail: {
      en: 'Unverified loan apps may steal personal data and force payment to unlock access.',
      te: 'ధృవీకరించబడని లోన్ యాప్‌లు వ్యక్తిగత సమాచారాన్ని దొంగిలించి, యాక్సెస్ desbloకింగ్ కోసం చెల్లింపులు కోరుతాయి.',
    },
    time: '1 day ago',
  },
  {
    title: { en: 'Investor impersonation trend', te: 'ఇన్వెస్టర్ మోసపాటు ధోరణి' },
    detail: {
      en: 'Scammers pose as “investment experts” on WhatsApp and Telegram.',
      te: 'మోసగాళ్ళు WhatsApp మరియు Telegramలో “ఇన్వెస్ట్మెంట్ నిపుణులు” వలె నటిస్తున్నారు.',
    },
    time: '3 days ago',
  },
];

const dailyTips = [
  { en: 'Before you pay, confirm the beneficiary name and amount once again.', te: 'చెల్లించడానికి ముందు, స్వీకర్త పేరు మరియు మొత్తం మళ్లీ ధృవీకరించండి.' },
  { en: 'Never share OTPs, banking passwords, or one-time codes with anyone.', te: 'OTPలు, బ్యాంకింగ్ పాస్వర్డ్‌లు లేదా వన్-టైమ్ కోడ్‌లను ఎవరితోనూ పంచుకోకండి.' },
  { en: 'If a caller sounds urgent, step away and verify through an official helpline.', te: 'కాలర్ అత్యవసరంగా మాట్లాడితే, కనీసం బయటకు వెళ్లి అధికారిక హెల్ప్‌లైన్ ద్వారా ధృవీకరించండి.' },
];

const checklist = [
  { en: 'Verify the beneficiary name before sending money.', te: 'డబ్బు పంపే ముందు స్వీకర్త పేరు పరిశీలించండి.' },
  { en: 'Check if the app is the official one from the bank or payment provider.', te: 'యాప్ బ్యాంక్ లేదా పేమెంట్ ప్రొవైడర్ అధికారికదో చూసుకోండి.' },
  { en: 'Do not approve payment requests from unknown numbers.', te: 'తెలియని నంబర్ల నుంచి వచ్చే చెల్లింపు అభ్యర్థనలకు అంగీకరించకండి.' },
  { en: 'Keep screenshots and save the transaction ID for follow-up.', te: 'సంభాషణను అలాగే టైప్ చేసి, ట్రాన్జాక్షన్ IDను భద్రపరచండి.' },
];

const learningCards = [
  {
    title: { en: 'Smart budgeting', te: 'స్మార్ట్ బడ్జెట్' },
    description: { en: 'Track spending, set emergency savings, and avoid impulse purchases.', te: 'ఖర్చులను ట్రాక్ చేసి, ఎమర్జెన్సీ పొదుపు చేయండి మరియు ఆక్షేపించబడిన కొనుగోళ్లను నివారించండి.' },
    icon: Landmark,
  },
  {
    title: { en: 'Safe borrowing', te: 'సురక్షిత ఋణం' },
    description: { en: 'Understand loan terms and avoid hidden charges or fake lenders.', te: 'లోన్ షరతులను అర్థం చేసుకుని, మరుగున ఉన్న ఛార్జీలు లేదా నకిలీ అప్పు సంస్థలను నివారించండి.' },
    icon: BookOpen,
  },
  {
    title: { en: 'Family money habits', te: 'కుటుంబ ఆర్థిక అలవాట్లు' },
    description: { en: 'Create household goals and protect the family from quick-money traps.', te: 'కుటుంబ లక్ష్యాలను రూపొందించండి మరియు త్వరిత సంపాదన బారిన పడకుండా రక్షించండి.' },
    icon: Users,
  },
];

const quizQuestions = [
  {
    question: {
      en: 'What is the safest action before approving a UPI payment?',
      te: 'UPI చెల్లింపును అంగీకరించే ముందు సరైన చర్య ఏమిటి?',
    },
    options: [
      { en: 'Share the OTP immediately', te: 'OTPను వెంటనే పంచండి' },
      { en: 'Verify the recipient name and amount', te: 'స్వీకర్త పేరు మరియు మొత్తం ధృవీకరించండి' },
      { en: 'Click every link in the message', te: 'సందేశంలోని అన్ని లింకులను నొక్కండి' },
    ],
    answerIndex: 1,
  },
  {
    question: {
      en: 'Which message should be treated as suspicious?',
      te: 'ఏ సందేశాన్ని అనుమానంగా treatment చేయాలి?',
    },
    options: [
      { en: 'An official bank SMS with your real transaction reference', te: 'మీ నిజమైన ట్రాన్జాక్షన్ రిఫరెన్స్‌తో అధికారిక బ్యాంక్ SMS' },
      { en: 'A message asking for OTP and urgent payment', te: 'OTPను అడిగి, వెంటనే చెల్లింపు కోరే సందేశం' },
      { en: 'A reminder to update your app', te: 'యాప్‌ అప్డేట్ కోసం సూచన' },
    ],
    answerIndex: 1,
  },
];

const caseStudies = [
  {
    title: { en: 'Fake courier fee scam', te: 'నకిలీ కురియర్ ఫీజు మోసం' },
    summary: {
      en: 'A family paid a fake courier fee after receiving a convincing message from a scammer posing as a parcel service.',
      te: 'పార్శిల్ సర్వీస్‌గా నటిస్తున్న మోసగాడు పంపిన నమ్మకమైన సందేశం తర్వాత కుటుంబం నకిలీ కురియర్ ఫీజు చెల్లించింది.',
    },
    outcome: { en: 'Lesson: verify the sender and call the company directly.', te: 'పాఠం: పంపినవారిని ధృవీకరించి, కంపెనీకి నేరుగా కాల్ చేయండి.' },
  },
  {
    title: { en: 'Fake job offer trap', te: 'నకిలీ ఉద్యోగ ఆఫర్ బారిన పడిన ఉదాహరణ' },
    summary: {
      en: 'A student was asked to pay a registration fee before interview details were confirmed.',
      te: 'ఒక విద్యార్థిని ఇంటర్వ్యూ వివరాలు ధృవీకరిస్తే ముందు రిజిస్ట్రేషన్ ఫీజు చెల్లించమని అడిగారు.',
    },
    outcome: { en: 'Lesson: real employers do not ask for fees before work begins.', te: 'పాఠం: నిజమైన యజమానులు పని ప్రారంభమయ్యే ముందు ఫీజు అడగరు.' },
  },
];

const supports = [
  { en: 'Telugu and English voice search', te: 'తెలుగు మరియు ఇంగ్లీష్ వాయిస్ సెర్చ్' },
  { en: 'Simple guidance for first-time digital users', te: 'మొద lần డిజిటల్ వినియోగదారులకు సరళ మార్గదర్శకత్వం' },
  { en: 'Verified official reporting links', te: 'ధృవీకరించిన అధికారిక నివేదన లింకులు' },
];

const resourceFiles = [
  { title: { en: 'Telugu awareness poster', te: 'తెలుగు అవగాహన పోస్టర్' }, file: '/materials/telugu-awareness-poster.txt', type: 'TXT' },
  { title: { en: 'English awareness poster', te: 'ఇంగ్లీష్ అవగాహన పోస్టర్' }, file: '/materials/english-awareness-poster.txt', type: 'TXT' },
  { title: { en: 'UPI safety checklist', te: 'UPI భద్రత చెక్‌లిస్ట్' }, file: '/materials/upi-safety-checklist.txt', type: 'TXT' },
  { title: { en: 'Senior safety guide', te: 'సీనియర్ సేఫ్టీ గైడ్' }, file: '/materials/senior-safety-guide.txt', type: 'TXT' },
];

const knowledgeBase: Array<{
  id: string;
  keywords: string[];
  answer: Record<Language, string>;
}> = [
  {
    id: 'upi-safety',
    keywords: ['upi', 'payment', 'pin', 'otp', 'transaction', 'banking'],
    answer: {
      en: 'Never share your UPI PIN, OTP, or card CVV with anyone. Always verify the payment request before approving it and confirm the receiver name before paying. If a caller or message asks for urgent payment, pause, verify, and call your bank directly.',
      te: 'UPI PIN, OTP లేదా CVV మీకు ఎవరితోనైనా పంచుకోకండి. చెల్లింపును అంగీకరిస్తే ముందుగా పంపిన వివరాలను పరిశీలించండి మరియు వాస్తవ స్వీకర్త పేరు నమోదయిందో చూసుకోండి. ఎవరైనా వెంటనే చెల్లింపుని కోరితే, ఆగండి, ధృవీకరించండి, బ్యాంక్‌ను నేరుగా కాల్ చేయండి.',
    },
  },
  {
    id: 'phishing',
    keywords: ['link', 'phishing', 'fake', 'website', 'sms', 'message'],
    answer: {
      en: 'Carefully check the website address before entering login details. Fake messages often use urgent language, shortened links, or lookalike domains. Do not click unknown links, and verify the official app or website from a trusted source.',
      te: 'లాగిన్ వివరాలను నమోదు చేయడానికి ముందుగా వెబ్సైట్ చిరునామాను పరిశీలించండి. చెడ్డ సందేశాలు అత్యవసర భాష, చిన్న చేసిన లింకులు లేదా పోలిక వున్న డొమైన్లను ఉపయోగిస్తాయి. తెలియని లింకులను నొక్కవద్దు. అధికారిక యాప్ లేదా వెబ్సైట్‌ను సురక్షిత వనరునుంచి ధృవీకరించండి.',
    },
  },
  {
    id: 'job-scam',
    keywords: ['job', 'work from home', 'salary', 'offer', 'scam'],
    answer: {
      en: 'A real job offer will not ask you to pay a fee, share OTPs, or complete a payment before the work starts. Be careful with “easy money” promises and verify the employer through official company channels.',
      te: 'నిజమైన ఉద్యోగ ఆఫర్ మీకు ఫీజు చెల్లించమని, OTPలను పంచుకోమని, పనులు ప్రారంభమయ్యేదాకా ముందుగానే చెల్లింపు చేయమని అడగదు. “సులభమైన సంపాదన” వాగ్దానాలపై జాగ్రత్త వహించండి మరియు కంపెనీ అధికారిక ఛానెళ్ల ద్వారా నియామకాన్ని ధృవీకరించండి.',
    },
  },
  {
    id: 'report-fraud',
    keywords: ['report', 'fraud', 'cybercrime', '1930', 'help'],
    answer: {
      en: 'If you suspect cyber fraud, report it immediately to your bank and the National Cyber Crime Reporting Portal. In India, the financial fraud helpline is 1930, and you should also save screenshots of the scam message and payment details.',
      te: 'సైబర్ మోసం అనుమానంగా ఉంటే, బ్యాంక్‌కు వెంటనే తెలియజేయండి మరియు జాతీయ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్‌లో నివేదించండి. ఇండియాలో మొత్తం మోసానికి 1930 హెల్ప్‌లైన్ ఉంది. స్కామ్ సందేశం, చెల్లింపు వివరాల స్క్రీన్ షాట్లు నిల్వ చేయండి.',
    },
  },
  {
    id: 'digital-arrest',
    keywords: ['digital arrest', 'police', 'threat', 'caller', 'video call', 'money'],
    answer: {
      en: 'No genuine officer will demand immediate payment, remote access to your phone, or your UPI PIN/OTP under threat or pressure. Stay calm, end the call, and verify the claim through the official office or police helpline.',
      te: 'నిజమైన అధికారులు ఎప్పుడూ వెంటనే చెల్లింపు, ఫోన్‌ను దూరస్థితిలో ఆన్ చేయించుకోవడం, UPI PIN/OTPలు భయపెట్టినపుడు అడగరు. ప్రశాంతంగా ఉండండి, కాల్‌ను ముగించండి, అధికారిక కార్యాలయం లేదా పోలీసు హెల్ప్‌లైన్ ద్వారా ధృవీకరించండి.',
    },
  },
];

const suggestedQuestions: Suggestion[] = [
  { en: 'How do I protect my UPI payment?', te: 'నా UPI చెల్లింపును ఎలా భద్రపరచుకోవాలి?' },
  { en: 'What should I do if a scammer asks for OTP?', te: 'మోసగాడు OTP అడిగితే నేను ఏమి చేయాలి?' },
  { en: 'How do I report a fraudulent message?', te: 'మోసపూరిత సందేశాన్ని ఎలా నివేదించాలి?' },
];

const getKnowledgeAnswer = (question: string, language: Language) => {
  const lower = question.toLowerCase();
  let bestMatch = knowledgeBase[0];
  let highestScore = 0;

  for (const item of knowledgeBase) {
    const score = item.keywords.reduce((total, keyword) => {
      return total + (lower.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (highestScore === 0) {
    return {
      answer:
        language === 'te'
          ? 'మార్గదర్శక సమాచారం కోసం “UPI భద్రత”, “ఫిషింగ్” లేదా “నివేదించండి” వంటి వాక్యాలను ప్రయత్నించండి.'
          : 'Try a question such as “UPI safety”, “phishing”, or “report fraud” to get a guided answer.',
    };
  }

  return {
    answer: bestMatch.answer[language],
  };
};

async function askAssistant(question: string, language: Language) {
  try {
    const response = await fetch('/api/assistant/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, language }),
    });

    if (!response.ok) {
      throw new Error('Assistant API request failed');
    }

    const data = (await response.json()) as { answer?: string };
    return data.answer ?? getKnowledgeAnswer(question, language).answer;
  } catch {
    return getKnowledgeAnswer(question, language).answer;
  }
}

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

function VoiceAssistantPanel({ language }: { language: Language }) {
  const recognitionRef = useRef<any>(null);
  const [state, setState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');

  const speakAnswer = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    setState('speaking');
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('error');
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';

    recognition.onresult = (event: any) => {
      const latestText = event.results[0][0].transcript;
      setTranscript(latestText);
    };

    recognition.onerror = () => {
      setState('error');
      setError(
        language === 'te'
          ? 'వాయిస్ గుర్తింపు సాధ్యం కాలేదు. మళ్లీ ప్రయత్నించండి.'
          : 'Voice recognition was not available. Please try again.',
      );
    };

    recognition.onend = () => {
      if (state === 'listening') {
        setState('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language, state]);

  const askQuestion = async (question: string) => {
    if (!question.trim()) {
      return;
    }

    setState('processing');
    setError('');
    setTranscript(question);

    const result = await askAssistant(question, language);
    setAnswer(result);
    setHistory((prev) => [{ question, answer: result }, ...prev].slice(0, 4));
    setState('idle');
    speakAnswer(result);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setState('error');
      setError(
        language === 'te'
          ? 'ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు.'
          : 'Voice recognition is not available in this browser.',
      );
      return;
    }

    setState('listening');
    setError('');
    recognitionRef.current.lang = language === 'te' ? 'te-IN' : 'en-IN';
    recognitionRef.current.start();
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setState('idle');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            {language === 'te' ? 'మానా డిజిటల్ సురక్ష' : 'Mana Digital Suraksha'}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">
            {language === 'te' ? 'మీ సందేహాన్ని మాట్లాడండి' : 'Speak your doubt'}
          </h3>
        </div>
        <div className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          {state === 'listening'
            ? language === 'te'
              ? 'వినిస్తోంది'
              : 'Listening'
            : state === 'processing'
              ? language === 'te'
                ? 'ప్రాసెస్ చెయ్యబడుతోంది'
                : 'Processing'
              : state === 'speaking'
                ? language === 'te'
                  ? 'మాట్లాడుతోంది'
                  : 'Speaking'
                : language === 'te'
                  ? 'సిద్ధం'
                  : 'Ready'}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center">
        <button
          type="button"
          className={`flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg transition ${
            state === 'listening' ? 'bg-rose-500 animate-pulse' : 'bg-brand-600 hover:bg-brand-700'
          }`}
          onClick={startListening}
          aria-label={language === 'te' ? 'మైక్రోఫోన్' : 'Microphone'}
        >
          <Mic className="h-10 w-10" />
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-slate-600">
        {language === 'te' ? 'మాట్లాడండి / Speak Here' : 'మాట్లాడండి / Speak Here'}
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {language === 'te' ? 'గుర్తించిన పాఠం' : 'Recognized text'}
          </p>
          <p className="mt-2 min-h-[48px] text-lg text-slate-700">{transcript || (language === 'te' ? 'మీ మాట వినబడుతోంది...' : 'Your spoken question will appear here...')}</p>
        </div>

        <div className="rounded-2xl bg-brand-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {language === 'te' ? 'సమాధానం' : 'Answer'}
          </p>
          <p className="mt-2 text-lg text-slate-800">{answer || (language === 'te' ? 'సమాధానం కోసం మీ ప్రశ్నను అడగండి.' : 'Ask a question to receive a grounded answer.')}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {suggestedQuestions.map((item) => (
          <button
            key={item.en}
            type="button"
            onClick={() => askQuestion(t(item, language))}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            {t(item, language)}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => answer && speakAnswer(answer)}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Volume2 className="h-4 w-4" />
          {language === 'te' ? 'చివరి సమాధానం వినిపించండి' : 'Read answer'}
        </button>
        <button
          type="button"
          onClick={stopSpeaking}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          <ShieldAlert className="h-4 w-4" />
          {language === 'te' ? 'మాట్లాడడం ఆపండి' : 'Stop'}
        </button>
        <button
          type="button"
          onClick={() => {
            setTranscript('');
            setAnswer('');
            setError('');
            setState('idle');
          }}
          className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          {language === 'te' ? 'మళ్లీ ప్రారంభించండి' : 'Ask another'}
        </button>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {history.length > 0 && (
        <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {language === 'te' ? 'సెషన్ చరిత్ర' : 'Current session'}
          </p>
          {history.map((item) => (
            <div key={`${item.question}-${item.answer}`} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-medium text-slate-800">Q: {item.question}</p>
              <p className="mt-2 text-sm text-slate-600">A: {item.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HomePage({ language }: { language: Language }) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);
  const tip = dailyTips[0];

  const currentQuestion = quizQuestions[quizIndex];

  const submitAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === currentQuestion.answerIndex) {
      setScore((prev) => prev + 1);
    }
    const nextIndex = quizIndex + 1;
    if (nextIndex < quizQuestions.length) {
      setTimeout(() => {
        setQuizIndex(nextIndex);
        setSelectedAnswer(null);
      }, 600);
    } else {
      setTimeout(() => setShowScore(true), 600);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowScore(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">Digital Suraksha</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Think Before You Click</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <NavLink to="/" className="transition hover:text-brand-700">Home</NavLink>
            <NavLink to="/library" className="transition hover:text-brand-700">Library</NavLink>
            <NavLink to="/assistant" className="transition hover:text-brand-700">Assistant</NavLink>
            <NavLink to="/help" className="transition hover:text-brand-700">Help</NavLink>
            <NavLink to="/admin" className="transition hover:text-brand-700">Admin</NavLink>
          </nav>

          <div className="flex items-center gap-2 text-sm font-medium">
            <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-slate-300">
              {language === 'te' ? 'తెలుగు' : 'English'}
            </button>
            <NavLink to="/assistant" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-white shadow-soft hover:bg-brand-700">
              <Mic className="h-4 w-4" />
              {language === 'te' ? 'మాట్లాడండి' : 'Speak'}
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-8 rounded-[32px] bg-gradient-to-br from-brand-50 via-white to-sky-50 p-6 shadow-soft lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700">
              <Sparkles className="h-4 w-4" />
              {language === 'te' ? 'సురక్షిత డిజిటల్ జీవితం' : 'Safe digital living'}
            </div>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {language === 'te'
                ? 'సైబర్ మోసాల నుంచి మీకు సహాయపడే డిజిటల్ సురక్ష' 
                : 'Protect your money, identity, and peace of mind online.'}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              {language === 'te'
                ? 'ఉచిత వాయిస్ సహాయం, verified case studies, మరియు సులభమైన సూచనలతో మీ కుటుంబం సురక్షితంగా డిజిటల్ ప్రపంచాన్ని ఉపయోగించగలదు.'
                : 'From scam awareness to financial literacy, Digital Suraksha gives families simple, trustworthy steps to stay safe online.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <NavLink to="/assistant" className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
                <Mic className="h-4 w-4" />
                {language === 'te' ? 'మాట్లాడండి / Speak Here' : 'మాట్లాడండి / Speak Here'}
              </NavLink>
              <NavLink to="/library" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300">
                {language === 'te' ? 'వివరణలు చూడండి' : 'Explore safety library'}
                <ArrowRight className="h-4 w-4" />
              </NavLink>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {supports.map((item) => (
                <div key={item.en} className="rounded-2xl border border-slate-200 bg-white/80 p-3">
                  <CheckCircle2 className="mb-2 h-5 w-5 text-brand-600" />
                  <p className="text-sm text-slate-700">{t(item, language)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-brand-100 bg-slate-950 p-5 text-white shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-200">Voice AI</p>
                <h2 className="mt-2 text-2xl font-bold">Mana Digital Suraksha</h2>
              </div>
              <div className="rounded-full bg-white/10 p-2">
                <Mic className="h-5 w-5 text-brand-200" />
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-200">
                {language === 'te' ? 'మీ ప్రశ్నను మాట్లాడండి. సురక్షిత సమాధానం వినండి.' : 'Speak your question. Understand your safety.'}
              </p>
            </div>
            <div className="mt-5 space-y-3">
              {suggestedQuestions.map((item) => (
                <button
                  key={item.en}
                  type="button"
                  onClick={() => undefined}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm text-slate-100 hover:bg-white/10"
                >
                  {t(item, language)}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Alerts</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Recently verified cybercrime alerts</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {recentAlerts.map((alert) => (
              <div key={alert.title.en} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="mb-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{alert.time}</div>
                <h3 className="text-lg font-bold text-slate-900">{t(alert.title, language)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t(alert.detail, language)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Categories</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Popular fraud categories</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {fraudCategories.map(({ title, description, accent, icon: Icon }) => (
              <div key={title.en} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br p-3 text-white ${accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{t(title, language)}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{t(description, language)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">Tip of the day</p>
            <h3 className="mt-3 text-3xl font-bold">{t({ en: 'Daily digital safety tip', te: 'రోజువారీ డిజిటల్ భద్రత సూచన' }, language)}</h3>
            <p className="mt-4 text-lg leading-7 text-slate-200">
              {t({ en: tip.en, te: tip.te }, language)}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">UPI safety checklist</p>
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <div key={item.en} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-600" />
                  <p className="text-sm text-slate-700">{t(item, language)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Learning</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Financial literacy modules</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {learningCards.map(({ title, description, icon: Icon }) => (
              <div key={title.en} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{t(title, language)}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{t(description, language)}</p>
                <button type="button" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                  Learn more <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Quiz</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Scam-awareness challenge</h2>

            {!showScore ? (
              <div className="mt-5">
                <p className="text-lg font-semibold text-slate-800">{t(currentQuestion.question, language)}</p>
                <div className="mt-4 space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={option.en}
                      type="button"
                      onClick={() => submitAnswer(index)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        selectedAnswer === index
                          ? index === currentQuestion.answerIndex
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border-rose-300 bg-rose-50 text-rose-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                      }`}
                    >
                      <span>{t(option, language)}</span>
                      {selectedAnswer === index && (index === currentQuestion.answerIndex ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-brand-50 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-brand-700">Score</p>
                <h3 className="mt-2 text-4xl font-black text-slate-900">{score}/{quizQuestions.length}</h3>
                <p className="mt-3 text-slate-700">
                  {language === 'te'
                    ? 'మీ అర్థMBA పాఠం ఉమ్మడిగా ఉంది. మరింత ప్రాక్టీస్ చేయడానికి మళ్లీ ప్రయత్నించండి.'
                    : 'Great job. You have the basics. Try again to improve your score.'}
                </p>
                <button type="button" onClick={resetQuiz} className="mt-4 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                  {language === 'te' ? 'మళ్లీ ప్రారంభించండి' : 'Retake quiz'}
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Case studies</p>
            <div className="mt-5 space-y-4">
              {caseStudies.map((item) => (
                <div key={item.title.en} className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="text-lg font-bold text-slate-900">{t(item.title, language)}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t(item.summary, language)}</p>
                  <p className="mt-3 text-sm font-semibold text-brand-700">{t(item.outcome, language)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Downloads</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Downloadable awareness materials</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {resourceFiles.map((item) => (
              <a key={item.file} href={item.file} download className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-300 hover:bg-brand-50">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{t(item.title, language)}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.type}</span>
                  </div>
                  <FileText className="h-5 w-5 text-brand-600" />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Community</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Community awareness initiatives</h2>
            <div className="mt-5 space-y-4 text-slate-600">
              <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <Users className="mt-1 h-5 w-5 text-brand-600" />
                <p>{language === 'te' ? 'విద్యార్థి, రైతు, మరియు సీనియర్ cittizens కోసం కాంపెయిన్‌లు.' : 'Awareness drives for students, farmers, and senior citizens.'}</p>
              </div>
              <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <BookOpen className="mt-1 h-5 w-5 text-brand-600" />
                <p>{language === 'te' ? 'శాల, కళాశాల, మరియు స్వయం సహాయక సమూహాలకు పనితీరును అందించండి.' : 'Simple workshops for schools, colleges, and self-help groups.'}</p>
              </div>
              <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <Globe2 className="mt-1 h-5 w-5 text-brand-600" />
                <p>{language === 'te' ? 'సమాజం మరియు స్థానిక అధికారులు కలిసి వ్యాప్తిని నడపండి.' : 'Local outreach and public education for community safety.'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-700">Urgent help</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">If money is at risk, act now</h2>
            <div className="mt-5 space-y-3 text-slate-700">
              <p><span className="font-bold">National Cyber Crime Helpline:</span> 1930</p>
              <p><span className="font-bold">Official portal:</span> https://cybercrime.gov.in/</p>
              <p><span className="font-bold">RBI:</span> https://www.rbi.org.in/</p>
              <p><span className="font-bold">NPCI:</span> https://www.npci.org.in/</p>
            </div>
            <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-700">
              {language === 'te' ? 'చెల్లింపు, OTP, లేదా వ్యక్తిగత సమాచారంపై అనుమానం ఉంటే, బ్యాంక్‌ను సంప్రదించండి మరియు 1930 లేదా అధికారిక పోర్టల్‌లో ఫిర్యాదు చేయండి.' : 'If a payment, OTP, or personal data is at risk, contact your bank immediately and report it via 1930 or the official portal.'}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="text-xl font-extrabold text-white">Digital Suraksha</div>
            <p className="mt-3 text-sm text-slate-300">Technology for safer digital choices, stronger financial habits, and community awareness.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><a href="/library">Safety library</a></li>
              <li><a href="/assistant">Voice assistant</a></li>
              <li><a href="/help">Official help</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Sources</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>National Cyber Crime Reporting Portal</li>
              <li>RBI</li>
              <li>NPCI</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Privacy</h3>
            <p className="mt-4 text-sm text-slate-300">No OTP, UPI PIN, or password requests are made. Voice and AI features are educational and privacy-conscious.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function LibraryPage({ language }: { language: Language }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const entries = useMemo(() => {
    const base = [
      { title: { en: 'How to recognise phishing messages', te: 'ఫిషింగ్ సందేశాలను ఎలా గుర్తించాలి' }, category: 'Phishing', summary: { en: 'Check link previews, domain names, and urgency pressures before clicking.', te: 'నొక్కే ముందు లింక్ ప్రివ్యూ, డొమైన్ పేరు మరియు అత్యవసర పీడనాన్ని పరిశీలించండి.' } },
      { title: { en: 'UPI safety basics', te: 'UPI భద్రత యొక్క ప్రాథమిక అంశాలు' }, category: 'UPI', summary: { en: 'Never share your PIN or OTP. Always confirm the recipient before paying.', te: 'PIN లేదా OTPను ఎప్పుడూ పంచుకోకండి. చెల్లించే ముందు స్వీకర్తను ధృవీకరించండి.' } },
      { title: { en: 'Digital arrest scam warning', te: 'డిజిటల్ అరెస్ట్ స్కామ్ హెచ్చరిక' }, category: 'Threats', summary: { en: 'Scammers use fear and urgency. End the call and verify through official channels.', te: 'మోసగాళ్ళు భయం మరియు అత్యవసరాన్ని ఉపయోగిస్తారు. కాల్‌ను ముగించి, అధికారిక ఛానెళ్ల ద్వారా ధృవీకరించండి.' } },
      { title: { en: 'Budgeting and private savings', te: 'బడ్జెట్ మరియు వ్యక్తిగత పొదుపు' }, category: 'Finance', summary: { en: 'Set a family savings target and keep emergency funds separate from daily expenses.', te: 'కుటుంబం కొరకు పొదుపు లక్ష్యాన్ని సెట్ చేసి, ఎమర్జెన్సీ డబ్బును రోజువారీ ఖర్చుల నుంచి వేరుగా ఉంచండి.' } },
    ];

    return base.filter((entry) => {
      const categoryMatch = selectedCategory === 'All' || entry.category === selectedCategory;
      const searchMatch = `${entry.title.en} ${entry.title.te} ${entry.summary.en} ${entry.summary.te}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [query, selectedCategory]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-sky-600 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-100">Knowledge base</p>
        <h1 className="mt-3 text-4xl font-black">{language === 'te' ? 'సురక్షిత సమాచార గ్రంథాలయం' : 'Safety knowledge library'}</h1>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={language === 'te' ? 'సందేహం, మోసం లేదా భద్రతను వెతకండి' : 'Search by fraud, safety, or learning topic'}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
          />
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400"
          >
            {['All', 'Phishing', 'UPI', 'Threats', 'Finance'].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {entries.length > 0 ? entries.map((entry) => (
          <article key={entry.title.en} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{entry.category}</span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{t(entry.title, language)}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t(entry.summary, language)}</p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              {language === 'te' ? 'సమాధానాన్ని అడగండి' : 'Ask about this'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        )) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 md:col-span-2">
            {language === 'te' ? 'ఇలాంటి సమాచారం కనపడలేదు. వేరే శోధనను ప్రయత్నించండి.' : 'No matching content found. Try another search term.'}
          </div>
        )}
      </div>
    </main>
  );
}

function HelpPage({ language }: { language: Language }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-200">Official support</p>
        <h1 className="mt-3 text-4xl font-black">{language === 'te' ? 'అధికారిక సహాయం కేంద్రం' : 'Official citizen help center'}</h1>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-slate-900">Verified sources</h2>
          <ul className="mt-4 space-y-4 text-slate-700">
            <li><a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer" className="font-medium text-brand-700 underline">National Cyber Crime Reporting Portal</a></li>
            <li><span className="font-bold">National Cyber Crime Helpline:</span> 1930</li>
            <li><a href="https://www.rbi.org.in/" target="_blank" rel="noreferrer" className="font-medium text-brand-700 underline">Reserve Bank of India</a></li>
            <li><a href="https://www.npci.org.in/" target="_blank" rel="noreferrer" className="font-medium text-brand-700 underline">NPCI</a></li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-slate-900">What to do if money is at risk</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700">
            <li>Call your bank immediately and freeze risky payment methods.</li>
            <li>Save screenshots and payment details.</li>
            <li>Report the scam through the official cybercrime portal.</li>
            <li>Ask the bank to check if the transaction can be reversed or blocked.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}

function AdminPage({ language }: { language: Language }) {
  const rows = [
    { title: 'UPI fraud alerts', status: 'Published', owner: 'Safety desk' },
    { title: 'Phishing knowledge base', status: 'Needs Review', owner: 'Content team' },
    { title: 'Senior safety guide', status: 'Draft', owner: 'Accessibility review' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-brand-600 p-8 text-white shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-brand-100">Administrator dashboard</p>
        <h1 className="mt-3 text-4xl font-black">{language === 'te' ? 'నిర్వాహక ప్యానెల్' : 'Content management dashboard'}</h1>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Fraud categories</div>
          <div className="mt-4 text-4xl font-black text-slate-900">12</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Knowledge entries</div>
          <div className="mt-4 text-4xl font-black text-slate-900">28</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Published resources</div>
          <div className="mt-4 text-4xl font-black text-slate-900">9</div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Content library</h2>
          <button type="button" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">New content</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.title} className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-800">{row.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : row.status === 'Needs Review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    window.localStorage.setItem('digital-suraksha-language', language);
  }, [language]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="flex items-center justify-end border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${language === 'en' ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('te')}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${language === 'te' ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/library" element={<LibraryPage language={language} />} />
          <Route path="/assistant" element={<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><VoiceAssistantPanel language={language} /></div>} />
          <Route path="/help" element={<HelpPage language={language} />} />
          <Route path="/admin" element={<AdminPage language={language} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
