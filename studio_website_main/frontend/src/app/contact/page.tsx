import Header from '@/components/Header';
import ContactContent from '@/components/ContactContent';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | AuraLens Photography',
  description:
    'Get in touch with AuraLens Photography Studio. Book a session, send us a message, or find directions to our creative studio space.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactContent />
      <Footer />
    </>
  );
}
