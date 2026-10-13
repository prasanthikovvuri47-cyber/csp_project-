import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 4000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const knowledgeBase = [
  {
    id: 'upi-safety',
    keywords: ['upi', 'payment', 'pin', 'otp', 'transaction', 'banking'],
    answer: {
      en: 'Never share your UPI PIN, OTP, or card CVV with anyone. Always verify the payment request before approving it and confirm the receiver name before paying. If a caller or message asks for urgent payment, pause, verify, and call your bank directly.',
      te: 'UPI PIN, OTP లేదా CVV మీకు ఎవరితోనైనా పంచుకోకండి. చెల్లింపును అంగీకరిస్తే ముందుగా పంపిన వివరాలను పరిశీలించండి మరియు వాస్తవ స్వీకర్త పేరు నమోదు అయిందో చూసుకోండి. ఎవరైనా వెంటనే చెల్లింపుని కోరితే, ఆగండి, ధృవీకరించండి, బ్యాంక్‌ను నేరుగా కాల్ చేయండి.'
    }
  },
  {
    id: 'phishing',
    keywords: ['link', 'phishing', 'fake', 'website', 'sms', 'message'],
    answer: {
      en: 'Carefully check the website address before entering login details. Fake messages often use urgent language, shortened links, or lookalike domains. Do not click unknown links, and verify the official app or website from a trusted source.',
      te: 'లాగిన్ వివరాలను నమోదు చేయడానికి ముందుగా వెబ్సైట్ చిరునామాను పరిశీలించండి. చెడ్డ సందేశాలు అత్యవసర భాష, చిన్న చేసిన లింకులు లేదా పోలిక వున్న డొమైన్లను ఉపయోగిస్తాయి. తెలియని లింకులను నొక్కవద్దు. అధికారిక యాప్ లేదా వెబ్సైట్‌ను సురక్షిత వనరునుంచి ధృవీకరించండి.'
    }
  },
  {
    id: 'job-scam',
    keywords: ['job', 'work from home', 'salary', 'offer', 'scam'],
    answer: {
      en: 'A real job offer will not ask you to pay a fee, share OTPs, or complete a payment before the work starts. Be careful with “easy money” promises and verify the employer through official company channels.',
      te: 'నిజమైన ఉద్యోగ ఆఫర్ మీకు ఫీజు చెల్లించమని, OTPలను పంచుకోమని, పనులు ప్రారంభమయ్యేదాకా ముందుగానే చెల్లింపు చేయమని అడగదు. “సులభమైన సంపాదన” వాగ్దానాలపై జాగ్రత్త వహించండి మరియు కంపెనీ అధికారిక ఛానెళ్ల ద్వారా నియామకాన్ని ధృవీకరించండి.'
    }
  },
  {
    id: 'report-fraud',
    keywords: ['report', 'fraud', 'cybercrime', '1930', 'help'],
    answer: {
      en: 'If you suspect cyber fraud, report it immediately to your bank and the National Cyber Crime Reporting Portal. In India, the financial fraud helpline is 1930, and you should also save screenshots of the scam message and payment details.',
      te: 'సైబర్ మోసం అనుమానంగా ఉంటే, బ్యాంక్‌కు వెంటనే తెలియజేయండి మరియు జాతీయ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్‌లో నివేదించండి. ఇండియాలో మొత్తం మోసానికి 1930 హెల్ప్‌లైన్ ఉంది. స్కామ్ సందేశం, చెల్లింపు వివరాల స్క్రీన్ షాట్లు నిల్వ చేయండి.'
    }
  },
  {
    id: 'digital-arrest',
    keywords: ['digital arrest', 'police', 'threat', 'caller', 'video call', 'money'],
    answer: {
      en: 'No genuine officer will demand immediate payment, remote access to your phone, or your UPI PIN/OTP under threat or pressure. Stay calm, end the call, and verify the claim through the official office or police helpline.',
      te: 'నిజమైన అధికారులు ఎప్పుడూ వెంటనే చెల్లింపు, ఫోన్‌ను దూరస్థితిలో ఆన్ చేయించుకోవడం, UPI PIN/OTPలు భయపెట్టినపుడు అడగరు. ప్రశాంతంగా ఉండండి, కాల్‌ను ముగించండి, అధికారిక కార్యాలయం లేదా పోలీసు హెల్ప్‌లైన్ ద్వారా ధృవీకరించండి.'
    }
  }
];

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Digital Suraksha API is running' });
});

app.get('/api/knowledge-base', (_req, res) => {
  res.json({ items: knowledgeBase });
});

app.post('/api/assistant/query', (req, res) => {
  const question = String(req.body?.question || '').trim();
  const language = String(req.body?.language || 'en').toLowerCase();

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const lowered = question.toLowerCase();
  let bestMatch = knowledgeBase[0];
  let bestScore = 0;

  for (const item of knowledgeBase) {
    const score = item.keywords.reduce((total, keyword) => {
      return total + (lowered.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  const answerText = bestMatch.answer[language === 'te' ? 'te' : 'en'];
  res.json({
    answer: answerText,
    language,
    source: 'grounded knowledge base',
    matches: bestMatch.keywords,
    confidence: bestScore > 0 ? 'medium' : 'fallback'
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Digital Suraksha API listening on http://localhost:${port}`);
});
