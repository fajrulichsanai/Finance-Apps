// Cost Monitoring Utilities
// Copy these to your project for development-time cost tracking

// =============================================================================
// Query Count Tracker
// =============================================================================

/**
 * Tracks number of database queries per endpoint/page
 * Usage: Call QueryTracker.track() in each page/API route
 */
export class QueryTracker {
  private static queries: { endpoint: string; count: number; timestamp: Date }[] = [];
  private static enabled = process.env.NODE_ENV === 'development';
  
  /**
   * Track queries for an endpoint
   * @param endpoint - Page route or API endpoint name
   * @param queryCount - Number of database queries executed
   */
  static track(endpoint: string, queryCount: number) {
    if (!this.enabled) return;
    
    this.queries.push({ endpoint, queryCount, timestamp: new Date() });
    
    // Console warnings
    if (queryCount > 3) {
      console.warn(`⚠️ High query count on ${endpoint}: ${queryCount} queries (target: 1-2, max: 3)`);
    } else if (queryCount <= 2) {
      console.log(`✅ Optimal query count on ${endpoint}: ${queryCount} queries`);
    }
  }
  
  /**
   * Get aggregated report of all tracked queries
   */
  static getReport(): Record<string, { total: number; average: number; max: number }> {
    const grouped = this.queries.reduce((acc, q) => {
      if (!acc[q.endpoint]) {
        acc[q.endpoint] = [];
      }
      acc[q.endpoint].push(q.count);
      return acc;
    }, {} as Record<string, number[]>);
    
    return Object.entries(grouped).reduce((acc, [endpoint, counts]) => {
      acc[endpoint] = {
        total: counts.reduce((sum, c) => sum + c, 0),
        average: counts.reduce((sum, c) => sum + c, 0) / counts.length,
        max: Math.max(...counts)
      };
      return acc;
    }, {} as Record<string, { total: number; average: number; max: number }>);
  }
  
  /**
   * Clear tracking data (useful for testing)
   */
  static reset() {
    this.queries = [];
  }
}

// =============================================================================
// Payload Size Tracker
// =============================================================================

/**
 * Tracks payload sizes for API responses
 * Usage: Call trackPayloadSize() after fetching data
 */
export function trackPayloadSize(endpoint: string, data: unknown): string {
  if (process.env.NODE_ENV !== 'development') return '0';
  
  const sizeInBytes = new Blob([JSON.stringify(data)]).size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  
  // Console logging with color coding
  if (sizeInBytes > 50 * 1024) {
    console.error(`❌ Payload too large on ${endpoint}: ${sizeInKB} KB (max 50 KB)`);
  } else if (sizeInBytes > 20 * 1024) {
    console.warn(`⚠️ Payload approaching limit on ${endpoint}: ${sizeInKB} KB (target <20 KB)`);
  } else {
    console.log(`✅ Optimal payload size on ${endpoint}: ${sizeInKB} KB`);
  }
  
  return sizeInKB;
}

/**
 * Estimate payload size before fetching
 * @param rowCount - Expected number of rows
 * @param avgRowSize - Average row size in bytes (see cost-calculations.md)
 */
export function estimatePayloadSize(rowCount: number, avgRowSize: number): { 
  sizeKB: number; 
  isOptimal: boolean;
  warning?: string;
} {
  const sizeInBytes = rowCount * avgRowSize;
  const sizeInKB = sizeInBytes / 1024;
  
  if (sizeInKB > 50) {
    return {
      sizeKB,
      isOptimal: false,
      warning: `Estimated ${sizeInKB.toFixed(2)} KB exceeds 50 KB limit`
    };
  } else if (sizeInKB > 20) {
    return {
      sizeKB,
      isOptimal: false,
      warning: `Estimated ${sizeInKB.toFixed(2)} KB exceeds 20 KB target`
    };
  }
  
  return { sizeKB, isOptimal: true };
}

// =============================================================================
// Real-Time Connection Tracker
// =============================================================================

/**
 * Tracks active Supabase real-time connections
 * Critical: Free tier only allows 2 concurrent connections
 */
export class RealtimeTracker {
  private static connections = new Map<string, { startTime: Date; endpoint: string }>();
  private static enabled = process.env.NODE_ENV === 'development';
  private static readonly MAX_CONNECTIONS = 2;
  
  /**
   * Register a new real-time connection
   * @param channel - Unique channel identifier
   * @param endpoint - Where the connection is used (page/component)
   */
  static addConnection(channel: string, endpoint: string = 'unknown') {
    if (!this.enabled) return;
    
    this.connections.set(channel, { startTime: new Date(), endpoint });
    
    const activeCount = this.connections.size;
    console.log(`🔌 Real-time connection opened: ${channel} (${endpoint})`);
    console.log(`📊 Active connections: ${activeCount}/${this.MAX_CONNECTIONS}`);
    
    if (activeCount > this.MAX_CONNECTIONS) {
      console.error(`❌ CRITICAL: Exceeded free tier limit! ${activeCount}/${this.MAX_CONNECTIONS} connections active`);
      console.error('Active channels:', this.getActiveConnections());
    } else if (activeCount === this.MAX_CONNECTIONS) {
      console.warn(`⚠️ At connection limit: ${activeCount}/${this.MAX_CONNECTIONS}`);
    }
  }
  
  /**
   * Remove a real-time connection
   */
  static removeConnection(channel: string) {
    if (!this.enabled) return;
    
    const connection = this.connections.get(channel);
    if (connection) {
      const duration = Date.now() - connection.startTime.getTime();
      console.log(`🔌 Real-time connection closed: ${channel} (duration: ${(duration / 1000).toFixed(0)}s)`);
      this.connections.delete(channel);
      console.log(`📊 Active connections: ${this.connections.size}/${this.MAX_CONNECTIONS}`);
    }
  }
  
  /**
   * Get list of currently active connections
   */
  static getActiveConnections(): Array<{ channel: string; endpoint: string; durationSeconds: number }> {
    return Array.from(this.connections.entries()).map(([channel, info]) => ({
      channel,
      endpoint: info.endpoint,
      durationSeconds: (Date.now() - info.startTime.getTime()) / 1000
    }));
  }
  
  /**
   * Check if safe to add another connection
   */
  static canAddConnection(): boolean {
    return this.connections.size < this.MAX_CONNECTIONS;
  }
}

// =============================================================================
// Global Window Types (for Cost Monitor component)
// =============================================================================

declare global {
  interface Window {
    __queryCount?: number;
    __totalPayload?: number;
    __realtimeConnections?: number;
  }
}

// Update global counters (call from monitoring code)
export function updateGlobalMetrics() {
  if (typeof window === 'undefined') return;
  
  window.__realtimeConnections = RealtimeTracker.getActiveConnections().length;
}

// =============================================================================
// Usage Examples
// =============================================================================

/*

## Example 1: Page with Database Queries

```typescript
// app/dashboard/page.tsx
import { QueryTracker, trackPayloadSize } from '@/lib/monitoring/cost-tracker';

export default async function DashboardPage() {
  // Track that this page will make 2 queries
  QueryTracker.track('/dashboard', 2);
  
  // Query 1: Recent transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, amount, category, created_at')
    .limit(20);
  trackPayloadSize('/dashboard/transactions', transactions);
  
  // Query 2: User settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('theme, currency')
    .single();
  trackPayloadSize('/dashboard/settings', settings);
  
  return <div>...</div>;
}
```

## Example 2: Real-Time Subscription (if approved as exception)

```typescript
// app/activity/page.tsx
'use client';

import { useEffect } from 'react';
import { RealtimeTracker } from '@/lib/monitoring/cost-tracker';

export default function ActivityPage() {
  useEffect(() => {
    const channel = supabase
      .channel('transactions')
      .on('postgres_changes', { ... }, handleChange)
      .subscribe();
    
    // Track connection
    RealtimeTracker.addConnection('transactions', '/activity');
    
    return () => {
      channel.unsubscribe();
      RealtimeTracker.removeConnection('transactions');
    };
  }, []);
  
  return <div>...</div>;
}
```

## Example 3: Pre-Flight Estimate

```typescript
import { estimatePayloadSize } from '@/lib/monitoring/cost-tracker';

// Before implementing a feature, estimate costs
const estimate = estimatePayloadSize(
  100,  // rows
  258   // bytes per row (see cost-calculations.md)
);

if (!estimate.isOptimal) {
  console.warn(estimate.warning);
  // Consider pagination or reducing fields
}
```

*/
