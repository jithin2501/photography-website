import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MaternityServicePageContent from '@/pages/MaternityServicePage';

export const metadata = {
  title: 'Maternity Photoshoot | AuraLens Studio',
  description: 'Celebrate the glow, love, and excitement of your journey into motherhood with premium, customized maternity portraits from AuraLens Studio.',
};

export default function MaternityServicePage() {
  return (
    <>
      <Header />
      <MaternityServicePageContent />
      <Footer />
    </>
  );
}
