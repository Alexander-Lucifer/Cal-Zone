'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export const clerkConfig = {
  appearance: {
    variables: {
      colorPrimary: "#3b82f6", // blue-500
      colorText: "#ffffff",
      colorBackground: "#000000",
      colorInputBackground: "#1f2937", // gray-800
      colorInputText: "#ffffff",
    },
    elements: {
      formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90",
      card: "bg-gray-900/50 backdrop-blur-sm border border-gray-700 max-w-full w-full sm:max-w-md p-2 sm:p-6",
      headerTitle: "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500",
      headerSubtitle: "text-gray-400",
      socialButtonsBlockButton: "border border-gray-700 hover:bg-gray-800",
      formFieldInput: "bg-gray-800 border-gray-700 focus:border-blue-500 w-full",
      socialButtonsIcon: {
        color: '#000',
        '@media (prefers-color-scheme: dark)': {
          color: '#fff',
        },
      },
      spinner: {
        color: '#6366f1', // blue-500
        '@media (prefers-color-scheme: dark)': {
          color: '#fff',
        },
      },
    },
  },
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignInUrl: "/dashboard",
  afterSignUpUrl: "/onboarding",
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ClerkProvider {...clerkConfig}>
      {children}
    </ClerkProvider>
  );
} 