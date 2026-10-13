# Digital Suraksha

Digital Suraksha is a mobile-first civic-tech portal designed to help citizens understand cybercrime prevention, secure digital payments, and everyday financial literacy. It is built for English and Telugu audiences and includes a homepage, multilingual voice assistant, knowledge library, downloadable awareness materials, and a simple admin dashboard.

## Features

- Responsive homepage and civic-style design system
- English/Telugu language toggle
- Voice assistant panel with microphone input and text-to-speech output
- Searchable knowledge base for common scam scenarios
- Fraud awareness cards, safety tips, checklist, quiz, and case studies
- Official help center with verified public links
- Downloadable educational materials stored in the project
- Admin dashboard mock workflow for content and publication status

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Express API server
- Browser Web Speech API for speech recognition and playback

## Project structure

- `src/App.tsx` — main application and route structure
- `src/index.css` — Tailwind and global styling
- `server/index.js` — local Express API and grounded answer logic
- `public/materials/` — downloadable awareness files
- `public/qrcodes/` — local demo QR asset

## Setup

```bash
npm install
npm run dev
```

The app runs at:

- Frontend: http://localhost:5173/
- API: http://localhost:4000/api/health

## Production build

```bash
npm run build
npm run preview
```

## Notes

- The assistant uses a local, grounded knowledge base and does not ask for OTPs, UPI PINs, passwords, or payment credentials.
- Voice features depend on browser support and microphone permissions.
- This is a local demo environment and uses a clearly labelled local URL for demonstration.
- For production deployment, add secure auth, database storage, and cloud-hosted infrastructure.

## Demo flow

1. Open the homepage.
2. Toggle English/Telugu.
3. Use the microphone on the homepage or the assistant route.
4. Ask a question such as: “How do I protect my UPI payment?” or “What should I do if a scammer asks for OTP?”
5. Read the answer, use the speech feature, and browse the library and help center.
6. Download the included awareness materials and inspect the urgent-support section.
