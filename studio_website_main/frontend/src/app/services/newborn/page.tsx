import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewbornServicePageContent from '@/pages/NewbornServicePage';

export const metadata = {
  title: 'Newborn Photoshoot | AuraLens Studio',
  description: 'Capture your baby’s first moments with love, care, and professional newborn photography sessions from AuraLens Studio.',
};

export default function NewbornServicePage() {
  return (
    <>
      <Header />
      <NewbornServicePageContent />
      <Footer />
    </>
  );
}
