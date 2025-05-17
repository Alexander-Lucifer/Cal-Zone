'use client';

import { motion, AnimatePresence } from "framer-motion";
import { DashboardNavbar } from "@/components/navbar/dashboard-navbar";
import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon } from "@heroicons/react/24/outline";

interface SubscriptionTier {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
}

export default function SubscriptionsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const tiers: SubscriptionTier[] = [
    {
      name: "Free",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      features: [
        "Basic meal tracking",
        "Daily calorie goals",
        "Basic progress tracking",
        "Limited meal history",
      ],
      buttonText: "Current Plan",
    },
    {
      name: "Pro",
      monthlyPrice: "$9.99",
      yearlyPrice: "$99.99",
      features: [
        "Everything in Free",
        "Advanced meal analytics",
        "Custom meal plans",
        "Nutrition insights",
        "Unlimited meal history",
        "Priority support",
      ],
      popular: true,
      buttonText: "Upgrade to Pro",
    },
    {
      name: "Elite",
      monthlyPrice: "$19.99",
      yearlyPrice: "$199.99",
      features: [
        "Everything in Pro",
        "Personal nutrition coach",
        "AI-powered meal suggestions",
        "Advanced progress tracking",
        "Custom goals and challenges",
        "24/7 priority support",
        "Early access to new features",
      ],
      buttonText: "Upgrade to Elite",
    },
  ];

  const handleSubscription = async (tier: SubscriptionTier) => {
    if (tier.name === "Free") return;
    
    setIsProcessing(true);
    try {
      // TODO: Implement subscription logic with Stripe
      toast.success(`Upgrading to ${tier.name} plan...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully upgraded to ${tier.name}!`);
    } catch {
      toast.error("Failed to process subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <AnimatePresence>
        <motion.main
          key="subscriptions-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20 p-8"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Choose Your Plan
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Select the perfect plan to accelerate your health journey. All plans include our core features,
                  with additional benefits as you upgrade.
                </p>

                {/* Billing Toggle */}
                <div className="flex justify-center mt-8">
                  <div className="relative flex items-center rounded-full bg-gray-800 border border-gray-700 p-1">
                    <motion.button
                      onClick={() => setIsYearly(false)}
                      className={`relative px-6 py-2 rounded-full font-medium z-10 ${
                        !isYearly ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-400'
                      }`}
                      animate={{
                        color: !isYearly ? '#ffffff' : '#9ca3af', // Animate text color
                        scale: !isYearly ? 1.05 : 1, // Subtle scale effect
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      Monthly
                    </motion.button>
                    <motion.button
                      onClick={() => setIsYearly(true)}
                      className={`relative px-6 py-2 rounded-full font-medium z-10 ${
                        isYearly ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-400'
                      }`}
                       animate={{
                        color: isYearly ? '#ffffff' : '#9ca3af', // Animate text color
                        scale: isYearly ? 1.05 : 1, // Subtle scale effect
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      Yearly
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {tiers.map((tier) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`relative p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border ${
                      tier.popular
                        ? "border-blue-500 shadow-lg shadow-blue-500/20"
                        : "border-gray-700"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    )}

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-4xl font-bold text-white">
                            {isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                          </span>
                          {tier.monthlyPrice !== "$0" && (
                            <span className="ml-2 text-gray-400">
                              /{isYearly ? 'year' : 'month'}
                            </span>
                          )}
                          {isYearly && tier.monthlyPrice !== "$0" && (
                            <span className="ml-4 text-lg font-semibold text-green-400">
                              {`Save ${(
                                ((parseFloat(tier.monthlyPrice.slice(1)) * 12 - parseFloat(tier.yearlyPrice.slice(1))) / (parseFloat(tier.monthlyPrice.slice(1)) * 12)) * 100
                              ).toFixed(0)}%`}
                            </span>
                          )}
                        </div>
                        {isYearly && tier.monthlyPrice !== "$0" && (
                          <p className="mt-2 text-sm text-gray-400">
                            ${(parseFloat(tier.yearlyPrice.slice(1)) / 12).toFixed(2)}/month
                          </p>
                        )}
                      </div>

                      <ul className="space-y-4">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckIcon className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSubscription(tier)}
                        disabled={isProcessing || tier.name === "Free"}
                        className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                          tier.popular
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                            : "bg-gray-700 text-white hover:bg-gray-600"
                        } ${
                          (isProcessing || tier.name === "Free") && "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {isProcessing
                          ? "Processing..."
                          : tier.buttonText}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center text-gray-400 text-sm">
                <p>All plans include a 14-day free trial. No credit card required.</p>
                <p className="mt-2">
                  Need help choosing?{" "}
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    Compare plans
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.main>
      </AnimatePresence>
    </>
  );
} 