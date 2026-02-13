// src/app/calculator/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PikaCalc',           // this will show up in the browser tab
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // no extra wrapper markup is required here –
  // the root layout already provides html/body, fonts, etc.
  return <>{children}</>;
}
