import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Pulse OS Admin",
  description: "Manage service catalog, pricing, and product availability for partners.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
