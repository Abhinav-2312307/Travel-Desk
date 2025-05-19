export const maxDuration = 30

// Mock responses for different user queries
const MOCK_RESPONSES: Record<string, string> = {
  default: "Hello! I can help you book flights, hotels, and plan your trip. How can I assist you today?",
  flight:
    "I'd be happy to help you book a flight. Could you please tell me your departure city, destination, and travel dates?",
  hotel:
    "I can help you find the perfect hotel. What's your destination, check-in and check-out dates, and how many guests will be staying?",
  package:
    "Looking for a complete travel package? Great choice! Where would you like to go, and when are you planning to travel?",
  manali:
    "Manali is a beautiful destination! Would you like me to help you find flights to Manali, hotels in the area, or a complete package?",
  goa: "Goa is a fantastic choice! Are you interested in beach resorts, budget accommodations, or luxury hotels in Goa?",
  booking:
    "I've found some great options for you. To proceed with the booking, I'll need some details. Would you like to continue?",
  payment:
    "Your booking has been confirmed! Your confirmation number is TRV-2025-58742. You'll receive a detailed itinerary via email shortly. Thank you for booking with TravelAI!",
  hindi: "नमस्ते! मैं आपकी यात्रा की योजना बनाने में मदद कर सकता हूं। आप कहां जाना चाहते हैं?",
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    // If we have an API key, try to use the real service
    if (apiKey) {
      try {
        // Create a system prompt
        const systemPrompt = `You are an AI travel assistant that helps users book flights, hotels, and activities. 
        You can communicate in multiple languages including English and Hindi.
        
        When users ask about travel, ask clarifying questions about:
        - Their destination
        - Travel dates
        - Number of travelers
        - Budget constraints
        - Preferences (e.g., direct flights, hotel amenities)
        
        When recommending options:
        - Suggest 2-3 options with different price points
        - Mention key features of each option
        - Ask which option they prefer
        
        For flight bookings, collect:
        - Full name
        - Email
        - Phone number
        - Date of birth
        
        For hotel bookings, collect:
        - Check-in/check-out dates
        - Number of rooms
        - Special requests
        
        Keep your responses concise and focused on helping the user complete their travel booking.
        If the user switches languages, respond in that language.
        
        Current date: ${new Date().toLocaleDateString()}`

        // Format user messages for Gemini
        const userMessages = messages.filter((msg: any) => msg.role !== "system")

        // Prepare the conversation for Gemini
        const formattedMessages = userMessages.map((msg: any) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }))

        // Add system prompt as the first message if there are user messages
        if (formattedMessages.length > 0) {
          formattedMessages.unshift({
            role: "user",
            parts: [{ text: systemPrompt }],
          })

          // Add a model response acknowledging the instructions
          formattedMessages.unshift({
            role: "model",
            parts: [{ text: "I understand my role as a travel assistant." }],
          })
        }

        // Make a direct request to Gemini API (non-streaming for reliability)
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: formattedMessages,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            }),
          },
        )

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`)
        }

        const data = await response.json()

        // Extract the generated text from Gemini's response
        let generatedText = ""
        if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
          generatedText = data.candidates[0].content.parts[0].text || ""
        }

        // Return the response in the format expected by the AI SDK
        return Response.json({ role: "assistant", content: generatedText })
      } catch (error) {
        console.error("Error with Gemini API, falling back to mock responses:", error)
        // Fall back to mock implementation if the API call fails
      }
    }

    // Use mock implementation when no API key is available or API call failed
    console.log("Using mock chat implementation")

    // Get the last user message
    const lastUserMessage = [...messages].reverse().find((msg: any) => msg.role === "user")?.content || ""

    // Determine which mock response to use based on the user's message
    let responseContent = MOCK_RESPONSES.default

    const lowerCaseMessage = lastUserMessage.toLowerCase()

    if (lowerCaseMessage.includes("flight") || lowerCaseMessage.includes("fly")) {
      responseContent = MOCK_RESPONSES.flight
    } else if (
      lowerCaseMessage.includes("hotel") ||
      lowerCaseMessage.includes("stay") ||
      lowerCaseMessage.includes("room")
    ) {
      responseContent = MOCK_RESPONSES.hotel
    } else if (lowerCaseMessage.includes("package") || lowerCaseMessage.includes("all inclusive")) {
      responseContent = MOCK_RESPONSES.package
    } else if (lowerCaseMessage.includes("manali")) {
      responseContent = MOCK_RESPONSES.manali
    } else if (lowerCaseMessage.includes("goa")) {
      responseContent = MOCK_RESPONSES.goa
    } else if (lowerCaseMessage.includes("book") || lowerCaseMessage.includes("reserve")) {
      responseContent = MOCK_RESPONSES.booking
    } else if (
      lowerCaseMessage.includes("payment") ||
      lowerCaseMessage.includes("pay") ||
      lowerCaseMessage.includes("completed")
    ) {
      responseContent = MOCK_RESPONSES.payment
    } else if (lowerCaseMessage.includes("hindi") || lowerCaseMessage.includes("हिंदी")) {
      responseContent = MOCK_RESPONSES.hindi
    }

    // If the user selected an option, show booking details prompt
    if (lowerCaseMessage.includes("like to book this")) {
      responseContent =
        "Great choice! To proceed with the booking, I'll need some details:\n\n1. Your full name\n2. Email address\n3. Phone number\n\nOnce you provide these details, I can confirm your booking."
    }

    // If the user provided booking details, show payment options
    if (lowerCaseMessage.includes("name") && lowerCaseMessage.includes("email") && lowerCaseMessage.includes("phone")) {
      responseContent =
        "Thank you for providing your details. You can now proceed to payment to complete your booking. Would you like to pay now?"
    }

    // Add a slight delay to simulate processing time (300-800ms)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 300))

    return Response.json({ role: "assistant", content: responseContent })
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return Response.json({ error: `Failed to process request: ${error.message}` }, { status: 500 })
  }
}
