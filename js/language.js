/**
 * BusTrack AI - Multilingual Localization Engine
 * Supports: English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം)
 */

const LanguageManager = (() => {
  const STORAGE_KEY = 'selectedLanguage';
  const DEFAULT_LANG = 'en';

  const translations = {
    en: {
      tagline: "Know Your Bus. Know Your Time. Travel Smarter.",
      subtagline: "Your Journey, Smarter & Easier",
      landingDesc: "Find buses, predict arrival times, track your journey, compare travel options and experience smarter public transportation.",
      getStarted: "Get Started →",
      chooseLanguage: "Choose Your Comfortable Language",
      futureVisionTitle: "The Future of Smart Public Transportation",
      home: "Home",
      dashboard: "Dashboard",
      findBus: "Find Bus",
      bookTicket: "Book Ticket",
      myBookings: "My Bookings",
      liveTracking: "Live Tracking",
      myTrips: "My Trips",
      feedback: "Feedback",
      helpCenter: "Help Center",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      aiAssistant: "AI Assistant",
      login: "Login",
      whereTravelling: "Where are you travelling today?",
      from: "From",
      to: "To",
      date: "Date",
      time: "Time",
      passengers: "Passengers",
      findBusesBtn: "🔍 Find Buses",
      searchBusesBtn: "Search Buses",
      viewDetails: "View Details",
      liveTrack: "Live Track",
      startJourney: "Start Journey",
      aiEta: "AI Arrival Prediction",
      predictedArrival: "Predicted Arrival",
      crowdLevel: "Crowd Level",
      rating: "Rating",
      government: "Government",
      private: "Private",
      all: "All",
      compareBuses: "Compare Bus Options",
      selectSeats: "Select Your Seats",
      continueToPayment: "Continue to Payment",
      secureDemoPayment: "🔐 Secure Demo Payment",
      payNow: "Pay",
      eticket: "Digital E-Ticket",
      cancelBooking: "Cancel Booking",
      downloadTicket: "Download Ticket",
      printTicket: "Print Ticket",
      fleetOverview: "Fleet Overview",
      commandCenter: "Smart Transport Command Center",
      aiAnalytics: "AI Transport Analytics",
      reportIssue: "Report Issue",
      demoData: "Demo Data",
      prototypeSimulation: "Prototype Simulation",
      aiPrototype: "AI Prototype",
      futureIntegration: "Future Real-World Integration"
    },
    ta: {
      tagline: "உங்கள் பேருந்தை அறியுங்கள். நேரத்தை மிச்சப்படுத்துங்கள்.",
      subtagline: "உங்கள் பயணம், எளிதாகவும் புத்திசாலித்தனமாகவும்",
      landingDesc: "பேருந்துகளைக் கண்டறியவும், வருகை நேரத்தைக் கணிக்கவும், நேரலையில் கண்காணிக்கவும் மற்றும் சிறந்த பொதுப் போக்குவரத்தைப் பெறவும்.",
      getStarted: "தொடங்கவும் →",
      chooseLanguage: "உங்கள் வசதியான மொழியைத் தேர்வுசெய்யவும்",
      futureVisionTitle: "எதிர்கால நவீன பொதுப் போக்குவரத்து",
      home: "முகப்பு",
      dashboard: "டாஷ்போர்டு",
      findBus: "பேருந்தைத் தேடுங்கள்",
      bookTicket: "டிக்கெட் முன்பதிவு",
      myBookings: "என் முன்பதிவுகள்",
      liveTracking: "நேரலை கண்காணிப்பு",
      myTrips: "என் பயணங்கள்",
      feedback: "கருத்து",
      helpCenter: "உதவி மையம்",
      profile: "சுயவிவரம்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",
      aiAssistant: "AI உதவியாளர்",
      login: "உள்நுழைய",
      whereTravelling: "இன்று நீங்கள் எங்கு செல்கிறீர்கள்?",
      from: "புறப்படும் இடம்",
      to: "சேருமிடம்",
      date: "தேதி",
      time: "நேரம்",
      passengers: "பயணிகள்",
      findBusesBtn: "🔍 பேருந்துகளைத் தேடு",
      searchBusesBtn: "பேருந்துகளைக் காண்க",
      viewDetails: "விவரங்களைப் பார்",
      liveTrack: "நேரலை கண்காணி",
      startJourney: "பயணத்தைத் தொடங்கு",
      aiEta: "AI வருகை நேர கணிப்பு",
      predictedArrival: "எதிர்பார்க்கப்படும் வருகை",
      crowdLevel: "கூட்ட நெரிசல்",
      rating: "மதிப்பீடு",
      government: "அரசு பேருந்து",
      private: "தனியார் பேருந்து",
      all: "அனைத்தும்",
      compareBuses: "பேருந்துகளை ஒப்பிடுக",
      selectSeats: "இருக்கையைத் தேர்ந்தெடுக்கவும்",
      continueToPayment: "கட்டணத்திற்குச் செல்லவும்",
      secureDemoPayment: "🔐 பாதுகாப்பான மாதிரி கட்டணம்",
      payNow: "செலுத்துக",
      eticket: "மின்-டிக்கெட்",
      cancelBooking: "ரத்து செய்",
      downloadTicket: "பதிவிறக்கு",
      printTicket: "அச்சிடுக",
      fleetOverview: "பேருந்து கடற்படை",
      commandCenter: "போக்குவரத்து கட்டுப்பாட்டு மையம்",
      aiAnalytics: "AI போக்குவரத்து பகுப்பாய்வு",
      reportIssue: "பிரச்சினையைப் புகாரளி",
      demoData: "மாதிரித் தரவு",
      prototypeSimulation: "மாதிரி உருவகப்படுத்துதல்",
      aiPrototype: "AI மாதிரி",
      futureIntegration: "எதிர்கால நேரடி இணைப்பு"
    },
    hi: {
      tagline: "अपनी बस जानें। अपना समय जानें। स्मार्ट यात्रा करें।",
      subtagline: "आपकी यात्रा, आसान और स्मार्ट",
      landingDesc: "बसें खोजें, आगमन समय का अनुमान लगाएं, लाइव ट्रैक करें और आधुनिक सार्वजनिक परिवहन का अनुभव करें।",
      getStarted: "शुरू करें →",
      chooseLanguage: "अपनी सुविधाजनक भाषा चुनें",
      futureVisionTitle: "स्मार्ट सार्वजनिक परिवहन का भविष्य",
      home: "होम",
      dashboard: "डैशबोर्ड",
      findBus: "बस खोजें",
      bookTicket: "टिकट बुक करें",
      myBookings: "मेरी बुकिंग",
      liveTracking: "लाइव ट्रैकिंग",
      myTrips: "मेरी यात्राएं",
      feedback: "प्रतिक्रिया",
      helpCenter: "सहायता केंद्र",
      profile: "प्रोफ़ाइल",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      aiAssistant: "AI सहायक",
      login: "लॉग इन",
      whereTravelling: "आज आप कहाँ जा रहे हैं?",
      from: "कहाँ से",
      to: "कहाँ तक",
      date: "दिनांक",
      time: "समय",
      passengers: "यात्री",
      findBusesBtn: "🔍 बसें खोजें",
      searchBusesBtn: "बस खोजें",
      viewDetails: "विवरण देखें",
      liveTrack: "लाइव ट्रैक करें",
      startJourney: "यात्रा शुरू करें",
      aiEta: "AI आगमन अनुमान",
      predictedArrival: "अनुमानित आगमन",
      crowdLevel: "भीड़ का स्तर",
      rating: "रेटिंग",
      government: "सरकारी",
      private: "निजी",
      all: "सभी",
      compareBuses: "बसों की तुलना करें",
      selectSeats: "सीट चुनें",
      continueToPayment: "भुगतान के लिए आगे बढ़ें",
      secureDemoPayment: "🔐 सुरक्षित डेमो भुगतान",
      payNow: "भुगतान करें",
      eticket: "ई-टिकट",
      cancelBooking: "बुकिंग रद्द करें",
      downloadTicket: "टिकट डाउनलोड करें",
      printTicket: "प्रिंट टिकट",
      fleetOverview: "फ्लीट अवलोकन",
      commandCenter: "स्मार्ट परिवहन कमांड सेंटर",
      aiAnalytics: "AI परिवहन विश्लेषण",
      reportIssue: "समस्या रिपोर्ट करें",
      demoData: "डेमो डेटा",
      prototypeSimulation: "प्रोटोटाइप सिमुलेशन",
      aiPrototype: "AI प्रोटोटाइप",
      futureIntegration: "भविष्य वास्तविक एकीकरण"
    },
    te: {
      tagline: "మీ బస్సును తెలుసుకోండి. మీ సమయాన్ని ఆదా చేసుకోండి. స్మార్ట్‌గా ప్రయాణించండి.",
      subtagline: "మీ ప్రయాణం, సులభం మరియు స్మార్ట్",
      landingDesc: "బస్సులను కనుగొనండి, వచ్చే సమయాన్ని అంచనా వేయండి, లైవ్ ట్రాకింగ్ చేయండి మరియు అధునాతన రవాణాను అనుభవించండి.",
      getStarted: "ప్రారంభించండి →",
      chooseLanguage: "మీకు అనుకూలమైన భాషను ఎంచుకోండి",
      futureVisionTitle: "భవిష్యత్ స్మార్ట్ ప్రజా రవాణా",
      home: "హోమ్",
      dashboard: "డ్యాష్‌బోర్డ్",
      findBus: "బస్సు వెతకండి",
      bookTicket: "టికెట్ బుక్ చేయండి",
      myBookings: "నా బుకింగ్స్",
      liveTracking: "లైవ్ ట్రాకింగ్",
      myTrips: "నా ప్రయాణాలు",
      feedback: "అభిప్రాయం",
      helpCenter: "సహాయ కేంద్రం",
      profile: "ప్రొఫైల్",
      settings: "సెట్టింగ్స్",
      logout: "లాగ్అవుట్",
      aiAssistant: "AI సహాయకుడు",
      login: "లాగిన్",
      whereTravelling: "మీరు ఈరోజు ఎక్కడికి ప్రయాణిస్తున్నారు?",
      from: "ఎక్కడ నుండి",
      to: "ఎక్కడికి",
      date: "తేదీ",
      time: "సమయం",
      passengers: "ప్రయాణీకులు",
      findBusesBtn: "🔍 బస్సులను కనుగొనండి",
      searchBusesBtn: "బస్సులను శోధించండి",
      viewDetails: "వివరాలు చూడండి",
      liveTrack: "లైవ్ ట్రాక్",
      startJourney: "ప్రయాణం ప్రారంభించండి",
      aiEta: "AI రాక సమయ అంచనా",
      predictedArrival: "అంచనా వేసిన రాక",
      crowdLevel: "రద్దీ స్థాయి",
      rating: "రేటింగ్",
      government: "ప్రభుత్వ",
      private: "ప్రైవేట్",
      all: "అన్నీ",
      compareBuses: "బస్సులను సరిపోల్చండి",
      selectSeats: "సీట్లను ఎంచుకోండి",
      continueToPayment: "చెల్లింపుకు వెళ్లండి",
      secureDemoPayment: "🔐 సురక్షిత డెమో చెల్లింపు",
      payNow: "చెల్లించండి",
      eticket: "డిజిటల్ ఇ-టికెట్",
      cancelBooking: "బుకింగ్ రద్దు చేయండి",
      downloadTicket: "డౌన్‌లోడ్",
      printTicket: "ప్రింట్",
      fleetOverview: "ఫ్లీట్ సమాచారం",
      commandCenter: "రవాణా కమాండ్ సెంటర్",
      aiAnalytics: "AI రవాణా విశ్లేషణ",
      reportIssue: "సమస్యను నివేదించండి",
      demoData: "డెమో డేటా",
      prototypeSimulation: "ప్రోటోటైప్ సిమ్యులేషన్",
      aiPrototype: "AI ప్రోటోటైప్",
      futureIntegration: "భవిష్యత్ రియల్ ఇంటిగ్రేషన్"
    },
    kn: {
      tagline: "ನಿಮ್ಮ ಬಸ್ ತಿಳಿಯಿರಿ. ನಿಮ್ಮ ಸಮಯ ತಿಳಿಯಿರಿ. ಸ್ಮಾರ್ಟ್ ಆಗಿ ಪ್ರಯಾಣಿಸಿ.",
      subtagline: "ನಿಮ್ಮ ಪ್ರಯಾಣ, ಸುಲಭ ಮತ್ತು ಸ್ಮಾರ್ಟ್",
      landingDesc: "ಬಸ್ಸುಗಳನ್ನು ಹುಡುಕಿ, ಆಗಮನದ ಸಮಯ ಊಹಿಸಿ, ಲೈವ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಸಾರಿಗೆಯನ್ನು ಅನುಭವಿಸಿ.",
      getStarted: "ಪ್ರಾರಂಭಿಸಿ →",
      chooseLanguage: "ನಿಮ್ಮ ಅನುಕೂಲಕರ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      futureVisionTitle: "ಸ್ಮಾರ್ಟ್ ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆಯ ಭವಿಷ್ಯ",
      home: "ಮುಖಪುಟ",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      findBus: "ಬಸ್ ಹುಡುಕಿ",
      bookTicket: "ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ",
      myBookings: "ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು",
      liveTracking: "ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್",
      myTrips: "ನನ್ನ ಪ್ರಯಾಣಗಳು",
      feedback: "ಪ್ರತಿಕ್ರಿಯೆ",
      helpCenter: "ಸಹಾಯ ಕೇಂದ್ರ",
      profile: "ಪ್ರೊಫೈಲ್",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      logout: "ಲಾಗ್‌ಔಟ್",
      aiAssistant: "AI ಸಹಾಯಕ",
      login: "ಲಾಗಿನ್",
      whereTravelling: "ಇಂದು ನೀವು ಎಲ್ಲಿಗೆ ಪ್ರಯಾಣಿಸುತ್ತಿದ್ದೀರಿ?",
      from: "ಎಲ್ಲಿಂದ",
      to: "ಎಲ್ಲಿಗೆ",
      date: "ದಿನಾಂಕ",
      time: "ಸಮಯ",
      passengers: "ಪ್ರಯಾಣಿಕರು",
      findBusesBtn: "🔍 ಬಸ್ ಹುಡುಕಿ",
      searchBusesBtn: "ಬಸ್‌ಗಳನ್ನು ಹುಡುಕಿ",
      viewDetails: "ವಿವರ ವೀಕ್ಷಿಸಿ",
      liveTrack: "ಲೈವ್ ಟ್ರ್ಯಾಕ್",
      startJourney: "ಪ್ರಯಾಣ ಆರಂಭಿಸಿ",
      aiEta: "AI ಆಗಮನ ಸಮಯ ಅಂದಾಜು",
      predictedArrival: "ಅಂದಾಜು ಆಗಮನ",
      crowdLevel: "ಜನಸಂದಣಿ ಮಟ್ಟ",
      rating: "ರೇಟಿಂಗ್",
      government: "ಸರ್ಕಾರಿ",
      private: "ಖಾಸಗಿ",
      all: "ಎಲ್ಲವೂ",
      compareBuses: "ಬಸ್‌ಗಳನ್ನು ಹೋಲಿಸಿ",
      selectSeats: "ಆಸನ ಆಯ್ಕೆಮಾಡಿ",
      continueToPayment: "ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ",
      secureDemoPayment: "🔐 ಸುರಕ್ಷಿತ ಡೆಮೊ ಪಾವತಿ",
      payNow: "ಪಾವತಿಸಿ",
      eticket: "ಡಿಜಿಟಲ್ ಇ-ಟಿಕೆಟ್",
      cancelBooking: "ಬುಕಿಂಗ್ ರದ್ದುಮಾಡಿ",
      downloadTicket: "ಡೌನ್‌ಲೋಡ್",
      printTicket: "ಪ್ರಿಂಟ್",
      fleetOverview: "ಫ್ಲೀಟ್ ಅವಲೋಕನ",
      commandCenter: "ಸಾರಿಗೆ ಕಮಾಂಡ್ ಸೆಂಟರ್",
      aiAnalytics: "AI ಸಾರಿಗೆ ವಿಶ್ಲೇಷಣೆ",
      reportIssue: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
      demoData: "ಡೆಮೊ ಡೇಟಾ",
      prototypeSimulation: "ಪ್ರೋಟೋಟೈಪ್ ಸಿಮ್ಯುಲೇಶನ್",
      aiPrototype: "AI ಪ್ರೋಟೋಟೈಪ್",
      futureIntegration: "ಭವಿಷ್ಯದ ರಿಯಲ್ ಇಂಟಿಗ್ರೇಷನ್"
    },
    ml: {
      tagline: "നിങ്ങളുടെ ബസ് അറിയുക. നിങ്ങളുടെ സമയം അറിയുക. കൂടുതൽ മിടുക്കോടെ യാത്ര ചെയ്യുക.",
      subtagline: "നിങ്ങളുടെ യാത്ര, ലളിതവും സ്മാർട്ടും",
      landingDesc: "ബസുകൾ കണ്ടെത്തുക, എത്തുന്ന സമയം മുൻകൂട്ടി അറിയുക, ലൈവ് ട്രാക്ക് ചെയ്യുക, മികച്ച പൊതുഗതാഗതം അനുഭവിക്കുക.",
      getStarted: "തുടങ്ങുക →",
      chooseLanguage: "നിങ്ങളുടെ സൗകര്യപ്രദമായ ഭാഷ തിരഞ്ഞെടുക്കുക",
      futureVisionTitle: "സ്മാർട്ട് പൊതുഗതാഗതത്തിന്റെ ഭാവി",
      home: "ഹോം",
      dashboard: "ഡാഷ്‌ബോർഡ്",
      findBus: "ബസ് കണ്ടെത്തുക",
      bookTicket: "ടിക്കറ്റ് ബുക്ക് ചെയ്യുക",
      myBookings: "എന്റെ ബുക്കിംഗുകൾ",
      liveTracking: "തത്സമയ ട്രാക്കിംഗ്",
      myTrips: "എന്റെ യാത്രകൾ",
      feedback: "അഭിപ്രായം",
      helpCenter: "സഹായ കേന്ദ്രം",
      profile: "പ്രൊഫൈൽ",
      settings: "ക്രമീകരണങ്ങൾ",
      logout: "ലോഗ്ഔട്ട്",
      aiAssistant: "AI സഹായി",
      login: "ലോഗിൻ",
      whereTravelling: "ഇന്ന് നിങ്ങൾ എങ്ങോട്ടാണ് യാത്ര ചെയ്യുന്നത്?",
      from: "എവിടെ നിന്ന്",
      to: "എവിടേക്ക്",
      date: "തീയതി",
      time: "സമയം",
      passengers: "യാത്രക്കാർ",
      findBusesBtn: "🔍 ബസുകൾ തിരയുക",
      searchBusesBtn: "ബസുകൾ കണ്ടെത്തുക",
      viewDetails: "വിശദാംശങ്ങൾ",
      liveTrack: "ലൈവ് ട്രാക്ക് ചെയ്യുക",
      startJourney: "യാത്ര ആരംഭിക്കുക",
      aiEta: "AI എത്തിച്ചേരൽ സമയം",
      predictedArrival: "പ്രതീക്ഷിക്കുന്ന സമയം",
      crowdLevel: "തിരക്ക് നില",
      rating: "റേറ്റിംഗ്",
      government: "സർക്കാർ",
      private: "സ്വകാര്യ",
      all: "എല്ലാം",
      compareBuses: "ബസുകൾ താരതമ്യം ചെയ്യുക",
      selectSeats: "സീറ്റുകൾ തിരഞ്ഞെടുക്കുക",
      continueToPayment: "പേയ്‌മെന്റിലേക്ക് പോകുക",
      secureDemoPayment: "🔐 സുരക്ഷിത ഡെമോ പേയ്‌മെന്റ്",
      payNow: "പണമടയ്ക്കുക",
      eticket: "ഡിജിറ്റൽ ഇ-ടിക്കറ്റ്",
      cancelBooking: "റദ്ദാക്കുക",
      downloadTicket: "ഡൗൺലോഡ്",
      printTicket: "പ്രിന്റ്",
      fleetOverview: "ഫ്ലീറ്റ് വിവരങ്ങൾ",
      commandCenter: "ഗതാഗത കമാൻഡ് സെന്റർ",
      aiAnalytics: "AI ഗതാഗത വിശകലനം",
      reportIssue: "പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക",
      demoData: "ഡെമോ ഡാറ്റ",
      prototypeSimulation: "പ്രോട്ടോടൈപ്പ് സിമുലേഷൻ",
      aiPrototype: "AI പ്രോട്ടോടൈപ്പ്",
      futureIntegration: "യഥാർത്ഥ സംയോജനം"
    }
  };

  const getLanguage = () => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  };

  const setLanguage = (lang) => {
    if (translations[lang]) {
      localStorage.setItem(STORAGE_KEY, lang);
      applyLanguage(lang);
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  };

  const t = (key) => {
    const lang = getLanguage();
    return (translations[lang] && translations[lang][key]) || (translations.en && translations.en[key]) || key;
  };

  const applyLanguage = (lang) => {
    const activeLang = lang || getLanguage();
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && translations[activeLang] && translations[activeLang][key]) {
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', translations[activeLang][key]);
        } else {
          el.textContent = translations[activeLang][key];
        }
      }
    });

    // Update language select elements if present
    const langSelects = document.querySelectorAll('.language-selector-select');
    langSelects.forEach(select => {
      select.value = activeLang;
    });

    // Update active state on language cards
    const langCards = document.querySelectorAll('.language-card');
    langCards.forEach(card => {
      if (card.dataset.lang === activeLang) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  };

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(getLanguage());
  });

  return {
    getLanguage,
    setLanguage,
    t,
    applyLanguage,
    languages: [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
      { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
      { code: 'te', name: 'Telugu', native: 'తెలుగు' },
      { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
    ]
  };
})();

window.LanguageManager = LanguageManager;
