"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createOrder } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Landmark, Truck } from "lucide-react";
import { toast } from "sonner";

type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type CheckoutFormProps = {
  addresses: Address[];
};

export function CheckoutForm({ addresses }: CheckoutFormProps) {
  const router = useRouter();

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) {
      toast.error("Error", {
        description: "Please select a shipping address",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
      if (!selectedAddress) throw new Error("Address not found");

      const formattedAddress = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}, ${selectedAddress.country}`;

      const formData = new FormData();
      formData.append("shippingAddress", formattedAddress);
      formData.append("paymentMethod", paymentMethod);

      const order = await createOrder(formData);

      toast("Order placed successfully!", {
        description: `Your order #${order.id.substring(0, 8)} has been placed.`,
      });

      // Redirect to order confirmation page
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length > 0 ? (
              <RadioGroup
                value={selectedAddressId}
                onValueChange={setSelectedAddressId}
                className="space-y-4"
              >
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex items-start space-x-3 rounded-md border p-3"
                  >
                    <RadioGroupItem
                      value={address.id}
                      id={`address-${address.id}`}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`address-${address.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {address.street}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.country}
                      </p>
                      {address.isDefault && (
                        <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  You have no saved addresses.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => router.push("/profile?tab=addresses")}
                >
                  Add New Address
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 rounded-md border p-3">
                <RadioGroupItem
                  value="CREDIT_CARD"
                  id="payment-credit-card"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="payment-credit-card"
                    className="flex items-center font-medium cursor-pointer"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit / Debit Card
                  </Label>

                  {paymentMethod === "CREDIT_CARD" && (
                    <div className="mt-3 grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cardNumber: e.target.value,
                            })
                          }
                          required={paymentMethod === "CREDIT_CARD"}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input
                          id="card-name"
                          placeholder="J. Smith"
                          value={cardDetails.cardName}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cardName: e.target.value,
                            })
                          }
                          required={paymentMethod === "CREDIT_CARD"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                expiry: e.target.value,
                              })
                            }
                            required={paymentMethod === "CREDIT_CARD"}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={cardDetails.cvc}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                cvc: e.target.value,
                              })
                            }
                            required={paymentMethod === "CREDIT_CARD"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-md border p-3">
                <RadioGroupItem
                  value="BANK_TRANSFER"
                  id="payment-bank"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="payment-bank"
                    className="flex items-center font-medium cursor-pointer"
                  >
                    <Landmark className="mr-2 h-4 w-4" />
                    Bank Transfer
                  </Label>
                  {paymentMethod === "BANK_TRANSFER" && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        Please use the following details to make your bank
                        transfer:
                      </p>
                      <p className="mt-1">Account Name: E-Shop Inc.</p>
                      <p>Account Number: 1234567890</p>
                      <p>Sort Code: 12-34-56</p>
                      <p>
                        Reference: Your order number will be provided after
                        checkout
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-md border p-3">
                <RadioGroupItem
                  value="CASH_ON_DELIVERY"
                  id="payment-cod"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="payment-cod"
                    className="flex items-center font-medium cursor-pointer"
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Cash on Delivery
                  </Label>
                  {paymentMethod === "CASH_ON_DELIVERY" && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Pay with cash when your order is delivered.
                    </p>
                  )}
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !selectedAddressId}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </form>
  );
}
