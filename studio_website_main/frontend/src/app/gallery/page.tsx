import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryPageContent from '@/pages/GalleryPage';

export const metadata = {
  title: 'Our Gallery | AuraLens Studio',
  description: 'Explore the creative portfolio and timeless photography memories captured by AuraLens Studio.',
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <GalleryPageContent />
      <Footer />
    </>
  );
}
