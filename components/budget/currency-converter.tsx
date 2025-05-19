"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Currency data with symbols and fake exchange rates
const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 150.27 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.52 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.12 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.24 },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$", rate: 16.75 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.34 },
  { code: "THB", name: "Thai Baht", symbol: "฿", rate: 35.67 },
]

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [convertedAmount, setConvertedAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Get currency details by code
  const getCurrency = (code: string) => {
    return currencies.find((currency) => currency.code === code)
  }

  // Convert currency
  const convertCurrency = () => {
    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const fromRate = getCurrency(fromCurrency)?.rate || 1
      const toRate = getCurrency(toCurrency)?.rate || 1

      const numericAmount = Number.parseFloat(amount) || 0
      const result = (numericAmount / fromRate) * toRate

      setConvertedAmount(result.toFixed(2))
      setIsLoading(false)
    }, 500)
  }

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Convert on currency change
  useEffect(() => {
    if (amount) {
      convertCurrency()
    }
  }, [fromCurrency, toCurrency])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <div className="flex">
            <div className="flex-1">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={convertCurrency}
                placeholder="Enter amount"
                className="rounded-r-none"
              />
            </div>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-[110px] rounded-l-none border-l-0">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={swapCurrencies} className="rounded-full">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Converted Amount</label>
          <div className="flex">
            <div className="flex-1">
              <Input value={convertedAmount} readOnly className="rounded-r-none bg-muted" />
            </div>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-[110px] rounded-l-none border-l-0">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={convertCurrency} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert"
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-2">
          <p>Exchange rates are for demonstration purposes only.</p>
          <p>Last updated: May 16, 2025</p>
        </div>
      </CardContent>
    </Card>
  )
}
