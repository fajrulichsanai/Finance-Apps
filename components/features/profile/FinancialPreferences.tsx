import React from 'react';
import { Monitor, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Section from './Section';
import MenuRow from './MenuRow';

export default function FinancialPreferences() {
  const router = useRouter();

  return (
    <Section label="Financial Preferences">
      <MenuRow
        icon={<Monitor className="w-5 h-5" />}
        title="Budget Settings"
        subtitle="Global limits and rollover rules"
        onClick={() => router.push('/budget')}
      />
      <MenuRow
        icon={<Settings className="w-5 h-5" />}
        title="Categories Management"
        subtitle="Custom labels and icon mapping"
        onClick={() => console.log('Navigate to categories')}
        hasBorder
      />
    </Section>
  );
}
