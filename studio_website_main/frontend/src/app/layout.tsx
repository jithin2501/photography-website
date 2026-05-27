import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AuraLens | Professional Photography',
  description:
    'Professional photography that turns real moments into timeless visual memories. Capture portraits, events, and lifestyle stories with AuraLens.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
