import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClassesServicePageContent from '@/pages/ClassesServicePage';

export const metadata = {
  title: 'Photoshoot Classes | AuraLens Studio',
  description: 'Learn photography from professionals and turn your passion into stunning visual stories with premium photoshoot classes from AuraLens Studio.',
};

export default function ClassesServicePage() {
  return (
    <>
      <Header />
      <ClassesServicePageContent />
      <Footer />
    </>
  );
}
