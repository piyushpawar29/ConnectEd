"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for getting started with mentorship",
    features: [
      { text: "1 mentor connection per month", included: true },
      { text: "30-minute sessions", included: true },
      { text: "Basic matching algorithm", included: true },
      { text: "Community forum access", included: true },
      { text: "Email support", included: true },
      { text: "Advanced matching", included: false },
      { text: "Session recordings", included: false },
      { text: "Priority booking", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 29, annual: 290 },
    description: "For professionals seeking regular mentorship",
    features: [
      { text: "3 mentor connections per month", included: true },
      { text: "60-minute sessions", included: true },
      { text: "Advanced matching algorithm", included: true },
      { text: "Community forum access", included: true },
      { text: "Priority email support", included: true },
      { text: "Session recordings", included: true },
      { text: "Priority booking", included: true },
      { text: "Group mentorship sessions", included: false },
    ],
    cta: "Start Pro Plan",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 99, annual: 990 },
    description: "For teams and serious career advancement",
    features: [
      { text: "Unlimited mentor connections", included: true },
      { text: "90-minute sessions", included: true },
      { text: "Premium matching algorithm", included: true },
      { text: "Private community access", included: true },
      { text: "24/7 phone & email support", included: true },
      { text: "Session recordings & notes", included: true },
      { text: "VIP booking", included: true },
      { text: "Group mentorship sessions", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingCards() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center items-center mb-10">
        <div className="flex items-center gap-3 bg-gray-900 p-1 rounded-lg border border-gray-800">
          <span className={`px-3 py-1 rounded ${!annual ? "bg-gray-800 text-white" : "text-gray-400"}`}>Monthly</span>
          <Switch
            checked={annual}
            onCheckedChange={setAnnual}
            className="data-[state=checked]:bg-gradient-to-r from-cyan-500 to-purple-600"
          />
          <span
            className={`px-3 py-1 rounded flex items-center gap-2 ${annual ? "bg-gray-800 text-white" : "text-gray-400"}`}
          >
            Annual
            <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white">Save 20%</Badge>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative rounded-xl overflow-hidden ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-center text-sm font-medium py-1">
                <Sparkles className="h-4 w-4 inline-block mr-1" />
                Most Popular
              </div>
            )}

            <div
              className={`h-full flex flex-col border ${plan.popular ? "border-cyan-500/50" : "border-gray-800"} rounded-xl bg-gray-900 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 group`}
            >
              <div className="p-6 md:p-8 flex-grow">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">${annual ? plan.price.annual : plan.price.monthly}</span>
                    {(annual ? plan.price.annual : plan.price.monthly) > 0 && (
                      <span className="text-gray-400 ml-2 mb-1">{annual ? "/year" : "/month"}</span>
                    )}
                  </div>
                  {(annual ? plan.price.annual : plan.price.monthly) === 0 && (
                    <p className="text-gray-400 text-sm">Free forever</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <div className="mr-3 mt-0.5 h-5 w-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs shrink-0">
                          ✓
                        </div>
                      ) : (
                        <X className="h-5 w-5 text-gray-600 mr-3 mt-0.5 shrink-0" />
                      )}
                      <span className={feature.included ? "text-gray-300" : "text-gray-500"}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-8 pt-0">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
                <p className="text-xs text-center text-gray-500 mt-3">No credit card required</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-xl font-bold mb-4">Need a custom plan for your team?</h3>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          We offer custom enterprise solutions for teams of all sizes. Get in touch with our sales team to learn more.
        </p>
        <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
          Contact Enterprise Sales
        </Button>
      </div>
    </div>
  )
}

