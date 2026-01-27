import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-[#119098] hover:bg-[#0d7a81] text-white font-medium rounded-lg",
          card: "shadow-none",
          headerTitle: "text-[#2D2A26] font-semibold",
          headerSubtitle: "text-[#6B6560]",
          socialButtonsBlockButton:
            "border border-[#E8E4DF] text-[#2D2A26] hover:bg-[#F7F4F0] rounded-lg",
          formFieldLabel: "text-[#2D2A26] font-medium",
          formFieldInput:
            "border-[#E8E4DF] focus:border-[#119098] focus:ring-[#119098]/20 rounded-lg",
          footerActionLink: "text-[#119098] hover:text-[#0d7a81]",
        },
        variables: {
          colorPrimary: "#119098",
          colorText: "#2D2A26",
          colorTextSecondary: "#6B6560",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#FFFFFF",
          colorInputText: "#2D2A26",
          borderRadius: "8px",
        },
      }}
    />
  );
}
