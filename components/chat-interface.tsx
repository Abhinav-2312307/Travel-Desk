"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Mic, Send, Loader2, Volume2, Globe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for flight options
const FLIGHT_OPTIONS = [
  {
    id: "f1",
    airline: "IndiGo",
    from: "Delhi",
    to: "Manali",
    departDate: "2025-05-15",
    departTime: "06:30",
    arriveTime: "08:00",
    price: 4500,
    duration: "1h 30m",
  },
  {
    id: "f2",
    airline: "Air India",
    from: "Delhi",
    to: "Manali",
    departDate: "2025-05-15",
    departTime: "10:15",
    arriveTime: "11:45",
    price: 5200,
    duration: "1h 30m",
  },
]

// Mock data for hotel options
const HOTEL_OPTIONS = [
  {
    id: "h1",
    name: "Mountain View Resort",
    location: "Manali",
    price: 2800,
    rating: 4.5,
    amenities: ["Free WiFi", "Breakfast", "Mountain View"],
  },
  {
    id: "h2",
    name: "Riverside Retreat",
    location: "Manali",
    price: 1950,
    rating: 4.2,
    amenities: ["Free WiFi", "Restaurant", "River View"],
  },
]

type MessageType = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export default function ChatInterface() {
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showOptions, setShowOptions] = useState<"flights" | "hotels" | "payment" | null>(null)
  const [bookingStage, setBookingStage] = useState<
    "initial" | "searching" | "selecting" | "details" | "payment" | "confirmed"
  >("initial")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [recognitionSupported, setRecognitionSupported] = useState(true)

  // State for chat functionality
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Analyze the message content to determine what options to show
  const analyzeMessage = (content: string) => {
    const lowerContent = content.toLowerCase()

    // Check for flight-related content
    if (
      (lowerContent.includes("flight") || lowerContent.includes("air")) &&
      (lowerContent.includes("option") || lowerContent.includes("available") || lowerContent.includes("choose"))
    ) {
      setShowOptions("flights")
      setBookingStage("selecting")
    }
    // Check for hotel-related content
    else if (
      (lowerContent.includes("hotel") || lowerContent.includes("stay") || lowerContent.includes("accommodation")) &&
      (lowerContent.includes("option") || lowerContent.includes("available") || lowerContent.includes("choose"))
    ) {
      setShowOptions("hotels")
      setBookingStage("selecting")
    }
    // Check for payment-related content
    else if (
      lowerContent.includes("payment") ||
      lowerContent.includes("pay") ||
      lowerContent.includes("credit card") ||
      lowerContent.includes("proceed to")
    ) {
      setShowOptions("payment")
      setBookingStage("payment")
    }
    // Check for booking confirmation
    else if (
      lowerContent.includes("confirm") &&
      (lowerContent.includes("book") || lowerContent.includes("reservation"))
    ) {
      setBookingStage("details")
    }
    // Check for booking completion
    else if (
      lowerContent.includes("success") ||
      lowerContent.includes("confirmed") ||
      lowerContent.includes("reference")
    ) {
      setShowOptions(null)
      setBookingStage("confirmed")
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, showOptions])

  // Check if SpeechRecognition is supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setRecognitionSupported(false)
      }
    }
  }, [])

  const handleVoiceInput = () => {
    if (!recognitionSupported) {
      alert("Speech recognition is not supported in your browser.")
      return
    }

    setIsListening(true)

    // Use the Web Speech API for voice recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = language === "en" ? "en-US" : "hi-IN"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // If we're showing options, hide them when sending a new message
    if (showOptions) {
      setShowOptions(null)
    }

    // Add user message to chat
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Send the message to the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()

      // Add assistant message to chat
      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
      }

      setMessages([...updatedMessages, assistantMessage])

      // Analyze the message to update UI state
      analyzeMessage(data.content)
    } catch (error: any) {
      console.error("Error sending message:", error)

      // Add a fallback response when there's an error
      const errorFallbackMessage: MessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I'm having trouble connecting to my services right now. Please try again or ask me something else about travel planning.",
      }

      setMessages([...updatedMessages, errorFallbackMessage])
      setError("There was a problem with the chat service. Using fallback responses.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectOption = (type: "flights" | "hotels", id: string) => {
    setSelectedOption(id)

    // Create a message to send to the AI
    const optionType = type === "flights" ? "flight" : "hotel"
    const option = type === "flights" ? FLIGHT_OPTIONS.find((f) => f.id === id) : HOTEL_OPTIONS.find((h) => h.id === id)

    let optionDetails = ""
    if (type === "flights" && option) {
      const flight = option as (typeof FLIGHT_OPTIONS)[0]
      optionDetails = `${flight.airline} from ${flight.from} to ${flight.to} on ${flight.departDate} at ${flight.departTime} for ₹${flight.price}`
    } else if (type === "hotels" && option) {
      const hotel = option as (typeof HOTEL_OPTIONS)[0]
      optionDetails = `${hotel.name} in ${hotel.location} for ₹${hotel.price} per night with a rating of ${hotel.rating}`
    }

    const newMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: `I'd like to book this ${optionType}: ${optionDetails}`,
    }

    setMessages([...messages, newMessage])
    setShowOptions(null)
    setBookingStage("details")

    // Automatically send this message to get a response
    setTimeout(() => {
      handleSendMessage(new Event("submit") as any)
    }, 100)
  }

  const handlePayment = () => {
    // In a real app, this would integrate with a payment gateway
    setShowOptions(null)

    const newMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: "I've completed the payment for my booking.",
    }

    setMessages([...messages, newMessage])
    setBookingStage("confirmed")

    // Automatically send this message to get a response
    setTimeout(() => {
      handleSendMessage(new Event("submit") as any)
    }, 100)
  }

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en"
    setLanguage(newLanguage)

    // Send a message to the AI to switch languages
    const languageMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: `Please respond in ${newLanguage === "en" ? "English" : "Hindi"} from now on.`,
    }

    setMessages([...messages, languageMessage])

    // Automatically send this message to get a response
    setTimeout(() => {
      handleSendMessage(new Event("submit") as any)
    }, 100)
  }

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: MessageType = {
        id: "1",
        role: "assistant",
        content:
          language === "en"
            ? "Hello! I can help you book flights, hotels, and plan your trip. How can I assist you today?"
            : "नमस्ते! मैं आपको उड़ानें, होटल बुक करने और आपकी यात्रा की योजना बनाने में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      }
      setMessages([welcomeMessage])
    }
  }, [])

  return (
    <Card className="border shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-primary p-4 flex justify-between items-center">
        <h3 className="text-primary-foreground font-medium">AI Travel Assistant</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/90"
            onClick={toggleLanguage}
            title={language === "en" ? "Switch to Hindi" : "Switch to English"}
          >
            <Globe className="h-5 w-5" />
          </Button>
          {isLoading && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsLoading(false)}
              title="Stop generating"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat messages */}
      <div className="h-[500px] overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map(
          (message, index) =>
            message.role !== "system" && (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ),
        )}

        {/* Display options based on context */}
        {showOptions === "flights" && (
          <div className="my-2">
            <h4 className="text-sm font-medium mb-2">Available Flights:</h4>
            <div className="space-y-2">
              {FLIGHT_OPTIONS.map((flight) => (
                <div
                  key={flight.id}
                  className={`border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors ${
                    selectedOption === flight.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => selectOption("flights", flight.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{flight.airline}</span>
                    <span className="text-sm font-bold">₹{flight.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{flight.departTime}</div>
                      <div className="text-muted-foreground">{flight.from}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">{flight.duration}</div>
                      <div className="w-16 h-[1px] bg-border my-1"></div>
                      <div className="text-xs text-muted-foreground">Direct</div>
                    </div>
                    <div>
                      <div className="font-medium">{flight.arriveTime}</div>
                      <div className="text-muted-foreground">{flight.to}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{flight.departDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showOptions === "hotels" && (
          <div className="my-2">
            <h4 className="text-sm font-medium mb-2">Available Hotels:</h4>
            <div className="space-y-2">
              {HOTEL_OPTIONS.map((hotel) => (
                <div
                  key={hotel.id}
                  className={`border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors ${
                    selectedOption === hotel.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => selectOption("hotels", hotel.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{hotel.name}</span>
                    <span className="text-sm font-bold">₹{hotel.price}/night</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{hotel.rating} ★</span>
                    <span className="text-muted-foreground">{hotel.location}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hotel.amenities.map((amenity, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showOptions === "payment" && (
          <div className="my-2 border rounded-lg p-4">
            <h4 className="font-medium mb-3">Complete Your Payment</h4>
            <Tabs defaultValue="card">
              <TabsList className="mb-4">
                <TabsTrigger value="card">Credit Card</TabsTrigger>
                <TabsTrigger value="upi">UPI</TabsTrigger>
                <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full p-2 border rounded-md mt-1" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">CVV</label>
                    <input type="text" placeholder="123" className="w-full p-2 border rounded-md mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Name on Card</label>
                  <input type="text" placeholder="John Doe" className="w-full p-2 border rounded-md mt-1" />
                </div>
                <Button className="w-full mt-2" onClick={handlePayment}>
                  Pay Now
                </Button>
              </TabsContent>
              <TabsContent value="upi">
                <div className="text-center p-4">
                  <p className="mb-4">Enter your UPI ID to pay</p>
                  <input type="text" placeholder="yourname@upi" className="w-full p-2 border rounded-md mb-4" />
                  <Button onClick={handlePayment}>Pay with UPI</Button>
                </div>
              </TabsContent>
              <TabsContent value="netbanking">
                <div className="text-center p-4">
                  <p className="mb-4">Select your bank</p>
                  <select className="w-full p-2 border rounded-md mb-4">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>SBI</option>
                    <option>Axis Bank</option>
                  </select>
                  <Button onClick={handlePayment}>Continue to Net Banking</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-destructive/10 text-destructive rounded-lg p-3">Error: {error}. Please try again.</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            disabled={isListening || !recognitionSupported || isLoading}
            className={isListening ? "bg-primary text-primary-foreground" : ""}
            title={recognitionSupported ? "Voice input" : "Voice input not supported in your browser"}
          >
            {isListening ? <Volume2 className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
          </Button>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={language === "en" ? "Ask me anything..." : "कुछ भी पूछें..."}
            className="flex-1 p-2 border rounded-md"
            disabled={isListening || isLoading}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
