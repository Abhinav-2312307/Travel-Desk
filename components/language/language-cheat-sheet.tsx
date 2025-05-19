"use client"

import { useState } from "react"

// Types
type Language =
  | "french"
  | "spanish"
  | "italian"
  | "german"
  | "japanese"
  | "mandarin"
  | "arabic"
  | "portuguese"
  | "russian"
  | "thai"
type TravelType = "tourism" | "business" | "foodie" | "family" | "adventure" | "budget" | "luxury"
type PhraseCategory =
  | "greetings"
  | "directions"
  | "dining"
  | "shopping"
  | "emergency"
  | "accommodation"
  | "transportation"
  | "smalltalk"

type Phrase = {
  english: string
  translation: string
  pronunciation: string
  category: PhraseCategory
}

// Language data
const languages: Record<Language, { name: string; nativeName: string; flag: string }> = {
  french: { name: "French", nativeName: "Français", flag: "🇫🇷" },
  spanish: { name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  italian: { name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  german: { name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  japanese: { name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  mandarin: { name: "Mandarin", nativeName: "普通话", flag: "🇨🇳" },
  arabic: { name: "Arabic", nativeName: "العربية", flag: "🇦🇪" },
  portuguese: { name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  russian: { name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  thai: { name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
}

// Travel types
const travelTypes: Record<TravelType, { name: string; icon: string; description: string }> = {
  tourism: {
    name: "Tourism",
    icon: "🏛️",
    description: "Sightseeing and cultural experiences",
  },
  business: {
    name: "Business",
    icon: "💼",
    description: "Professional meetings and networking",
  },
  foodie: {
    name: "Foodie",
    icon: "🍽️",
    description: "Culinary exploration and dining",
  },
  family: {
    name: "Family",
    icon: "👨‍👩‍👧‍👦",
    description: "Kid-friendly activities and needs",
  },
  adventure: {
    name: "Adventure",
    icon: "🧗‍♀️",
    description: "Outdoor activities and sports",
  },
  budget: {
    name: "Budget",
    icon: "💰",
    description: "Economical travel and accommodations",
  },
  luxury: {
    name: "Luxury",
    icon: "✨",
    description: "High-end experiences and services",
  },
}

// Category icons
const categoryIcons: Record<PhraseCategory, string> = {
  greetings: "👋",
  directions: "🧭",
  dining: "🍽️",
  shopping: "🛍️",
  emergency: "🚨",
  accommodation: "🏨",
  transportation: "🚆",
  smalltalk: "💬",
}

// Sample phrases for French
const frenchPhrases: Record<TravelType, Phrase[]> = {
  tourism: [
    {
      english: "Hello",
      translation: "Bonjour",
      pronunciation: "bohn-ZHOOR",
      category: "greetings",
    },
    {
      english: "Thank you",
      translation: "Merci",
      pronunciation: "mehr-SEE",
      category: "greetings",
    },
    {
      english: "Where is the museum?",
      translation: "Où est le musée?",
      pronunciation: "oo eh luh mew-ZAY",
      category: "directions",
    },
    {
      english: "I would like to visit...",
      translation: "Je voudrais visiter...",
      pronunciation: "zhuh voo-DRAY vee-zee-TAY",
      category: "tourism",
    },
    {
      english: "How much is the ticket?",
      translation: "Combien coûte le billet?",
      pronunciation: "kohm-BYEN koot luh bee-YAY",
      category: "shopping",
    },
    {
      english: "Can I take a photo?",
      translation: "Puis-je prendre une photo?",
      pronunciation: "pwee-zh PRAHN-druh oon FOH-toh",
      category: "tourism",
    },
    {
      english: "I need help",
      translation: "J'ai besoin d'aide",
      pronunciation: "zhay buh-ZWAN dehd",
      category: "emergency",
    },
    {
      english: "I don't understand",
      translation: "Je ne comprends pas",
      pronunciation: "zhuh nuh kohm-PRAHN pah",
      category: "smalltalk",
    },
    {
      english: "Where is the bathroom?",
      translation: "Où sont les toilettes?",
      pronunciation: "oo sohn lay twa-LET",
      category: "directions",
    },
    {
      english: "I would like to order...",
      translation: "Je voudrais commander...",
      pronunciation: "zhuh voo-DRAY koh-mahn-DAY",
      category: "dining",
    },
  ],
  business: [
    {
      english: "Nice to meet you",
      translation: "Enchanté",
      pronunciation: "ahn-shahn-TAY",
      category: "greetings",
    },
    {
      english: "My name is...",
      translation: "Je m'appelle...",
      pronunciation: "zhuh mah-PELL",
      category: "greetings",
    },
    {
      english: "I have a meeting with...",
      translation: "J'ai un rendez-vous avec...",
      pronunciation: "zhay uhn rahn-day-VOO ah-VEK",
      category: "business",
    },
    {
      english: "Could you send me the documents?",
      translation: "Pourriez-vous m'envoyer les documents?",
      pronunciation: "poo-ree-AY voo mahn-vwah-YAY lay doh-kew-MAHN",
      category: "business",
    },
    {
      english: "Let's discuss the project",
      translation: "Discutons du projet",
      pronunciation: "dees-kew-TOHN dew proh-ZHAY",
      category: "business",
    },
  ],
  foodie: [
    {
      english: "I would like to reserve a table",
      translation: "Je voudrais réserver une table",
      pronunciation: "zhuh voo-DRAY ray-zehr-VAY oon TAHBL",
      category: "dining",
    },
    {
      english: "What do you recommend?",
      translation: "Qu'est-ce que vous recommandez?",
      pronunciation: "kess kuh voo reh-koh-mahn-DAY",
      category: "dining",
    },
    {
      english: "I am vegetarian",
      translation: "Je suis végétarien(ne)",
      pronunciation: "zhuh swee vay-zhay-tah-ree-EN/EN",
      category: "dining",
    },
    {
      english: "Delicious!",
      translation: "Délicieux!",
      pronunciation: "day-lee-SYUH",
      category: "dining",
    },
    {
      english: "The check, please",
      translation: "L'addition, s'il vous plaît",
      pronunciation: "lah-dee-SYOHN, seel voo PLEH",
      category: "dining",
    },
  ],
  family: [
    {
      english: "We have children",
      translation: "Nous avons des enfants",
      pronunciation: "noo zah-VOHN day zahn-FAHN",
      category: "smalltalk",
    },
    {
      english: "Is this suitable for children?",
      translation: "Est-ce que c'est adapté aux enfants?",
      pronunciation: "ess kuh say ah-dap-TAY oh zahn-FAHN",
      category: "smalltalk",
    },
    {
      english: "Where is the bathroom?",
      translation: "Où sont les toilettes?",
      pronunciation: "oo sohn lay twa-LET",
      category: "directions",
    },
    {
      english: "Do you have a children's menu?",
      translation: "Avez-vous un menu enfant?",
      pronunciation: "ah-vay VOO uhn muh-NEW ahn-FAHN",
      category: "dining",
    },
    {
      english: "Where is the nearest pharmacy?",
      translation: "Où est la pharmacie la plus proche?",
      pronunciation: "oo eh lah far-mah-SEE lah plew PROSH",
      category: "emergency",
    },
  ],
  adventure: [
    {
      english: "I would like to rent a bike",
      translation: "Je voudrais louer un vélo",
      pronunciation: "zhuh voo-DRAY loo-AY uhn VAY-loh",
      category: "transportation",
    },
    {
      english: "Where can I go hiking?",
      translation: "Où puis-je faire de la randonnée?",
      pronunciation: "oo pwee-zh fehr duh lah rahn-doh-NAY",
      category: "directions",
    },
    {
      english: "Is it safe?",
      translation: "Est-ce que c'est sûr?",
      pronunciation: "ess kuh say SEWR",
      category: "emergency",
    },
    {
      english: "I need a guide",
      translation: "J'ai besoin d'un guide",
      pronunciation: "zhay buh-ZWAN duhn GEED",
      category: "tourism",
    },
    {
      english: "What equipment do I need?",
      translation: "De quel équipement ai-je besoin?",
      pronunciation: "duh kell ay-keep-MAHN eh-zh buh-ZWAN",
      category: "shopping",
    },
  ],
  budget: [
    {
      english: "How much does it cost?",
      translation: "Combien ça coûte?",
      pronunciation: "kohm-BYEN sah koot",
      category: "shopping",
    },
    {
      english: "That's too expensive",
      translation: "C'est trop cher",
      pronunciation: "say troh SHEHR",
      category: "shopping",
    },
    {
      english: "Is there a discount?",
      translation: "Y a-t-il une réduction?",
      pronunciation: "ee ah-teel oon ray-dewk-SYOHN",
      category: "shopping",
    },
    {
      english: "Where is the cheapest...?",
      translation: "Où est le/la moins cher/chère...?",
      pronunciation: "oo eh luh/lah mwahn SHEHR/SHEHR",
      category: "shopping",
    },
    {
      english: "I'm looking for a hostel",
      translation: "Je cherche une auberge de jeunesse",
      pronunciation: "zhuh shehrsh oon oh-BERZH duh zhuh-NESS",
      category: "accommodation",
    },
  ],
  luxury: [
    {
      english: "I have a reservation",
      translation: "J'ai une réservation",
      pronunciation: "zhay oon ray-zehr-vah-SYOHN",
      category: "accommodation",
    },
    {
      english: "I would like the best table",
      translation: "Je voudrais la meilleure table",
      pronunciation: "zhuh voo-DRAY lah may-YUHR TAHBL",
      category: "dining",
    },
    {
      english: "Could you recommend a fine restaurant?",
      translation: "Pourriez-vous me recommander un bon restaurant?",
      pronunciation: "poo-ree-AY voo muh reh-koh-mahn-DAY uhn bohn res-toh-RAHN",
      category: "dining",
    },
    {
      english: "I would like a suite",
      translation: "Je voudrais une suite",
      pronunciation: "zhuh voo-DRAY oon SWEET",
      category: "accommodation",
    },
    {
      english: "Is there a concierge service?",
      translation: "Y a-t-il un service de conciergerie?",
      pronunciation: "ee ah-teel uhn sehr-VEES duh kohn-syerzh-REE",
      category: "accommodation",
    },
  ],
}

// Generate phrases for other languages (simplified for demo)
const generatePhrasesForLanguage = (language: Language, travelType: TravelType): Phrase[] => {
  // In a real app, this would fetch from a database or API
  // For demo purposes, we'll just return the French phrases with modified translations
  if (language === "french") return frenchPhrases[travelType]

  return frenchPhrases[travelType].map((phrase) => ({
    ...phrase,
    translation: `[${languages[language].name} translation for "${phrase.english}"]`,
    pronunciation: `[${languages[language].name} pronunciation]`,
  }))
}

export default function LanguageCheatSheet() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("french")
  const [selectedTravelType, setSelectedTravelType] = useState<TravelType>("tourism")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<PhraseCategory | "all">("all")
  const [copiedPhraseId, setCopiedPhraseId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Get phrases based on selected language and travel type
  const phrases = generatePhrasesForLanguage(selectedLanguage, selectedTravelType)
  
  // Filter phrases based on search and category
  const filteredPhrases = phrases.filter(phrase => {
    const matchesSearch = 
      searchQuery === "" || 
      phrase.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.translation.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = activeCategory === "all" || phrase.category === activeCategory
