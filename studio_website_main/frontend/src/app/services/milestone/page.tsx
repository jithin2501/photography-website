import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MilestoneServicePageContent from '@/pages/MilestoneServicePage';

export const metadata = {
  title: 'Milestone Photoshoot | AuraLens Studio',
  description: 'From tiny smiles to big achievements, we capture every special milestone in your little one\'s journey with premium, customized milestone portraits from AuraLens Studio.',
};

export default function MilestoneServicePage() {
  return (
    <>
      <Header />
      <MilestoneServicePageContent />
      <Footer />
    </>
  );
}
