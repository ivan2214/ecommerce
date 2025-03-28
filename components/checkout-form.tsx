"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createOrder } from "@/lib/actions"

type Address = {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

type CheckoutFormProps = {
  addresses: Address[]
}

export function CheckoutForm({ addresses }: CheckoutFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find(a => a.isDefault)?.id || addresses[0]?.id || ""
  )
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAddressId) {
      toast({
        title: "Error",
        description: "Please select a shipping address",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const selectedAddress = addresses.find(a => a.id === selectedAddressId)
      if (!selectedAddress) throw new Error("Address not found")
      
      const formattedAddress = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`
      
      const formData = new FormData()
      formData.append("shippingAddress", formattedAddress)
      formData.append("paymentMethod", paymentMethod)
      
      const order = await createOrder
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

