import React from 'react';
import { Cloud, RefreshCw } from 'lucide-react';
import Section from './Section';
import MenuRow from './MenuRow';

export default function DataContinuity() {
  return (
    <Section label="Data & Continuity">
      <MenuRow
        icon={<Cloud className="w-5 h-5" />}
        title="Cloud Sync"
        subtitle="Last synced 2 minutes ago"
        badge="Active"
        onClick={() => console.log('View cloud sync')}
      />
      <MenuRow
        icon={<RefreshCw className="w-5 h-5" />}
        title="Export History"
        subtitle="Access previous report downloads"
        onClick={() => console.log('View export history')}
        hasBorder
      />
    </Section>
  );
}
