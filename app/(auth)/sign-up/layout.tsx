import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Pulse OS",
  description: "Create your Pulse OS partner account to start booking DarDoc services for your customers.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
