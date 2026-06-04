import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingPageContent from '@/pages/BookingPage';

export const metadata = {
  title: 'Book a Session | AuraLens Studio',
  description: 'Reserve your photoshoot session with AuraLens Studio. Select package, date, and customize your experience.',
};

export default function BookingPage() {
  return (
    <>
      <Header />
      <BookingPageContent />
      <Footer />
    </>
  );
}
