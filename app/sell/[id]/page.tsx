import { Navigation } from '@/components/navigation';
import { SellForm } from '@/components/sell-form';

interface SellPageProps {
  params: {
    id: string;
  };
}

export default function SellPage({ params }: SellPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SellForm itemId={params.id} />
    </div>
  );
}