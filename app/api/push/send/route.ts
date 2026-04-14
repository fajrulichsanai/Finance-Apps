import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// VAPID CONFIGURATION
// ============================================================

// Only configure web-push if all required env vars are present
if (
  process.env.VAPID_EMAIL &&
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY
) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// ============================================================
// TYPES
// ============================================================

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    [key: string]: any;
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface RequestBody {
  userId: string;
  payload: PushPayload;
}

interface PushSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

// ============================================================
// API ROUTE: POST /api/push/send
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body: RequestBody = await request.json();
    const { userId, payload } = body;

    // 2. Validation
    if (!userId || !payload) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'userId and payload are required' 
        },
        { status: 400 }
      );
    }

    if (!payload.title || !payload.body) {
      return NextResponse.json(
        { 
          error: 'Invalid payload',
          details: 'title and body are required in payload' 
        },
        { status: 400 }
      );
    }

    // 3. Validate environment variables
    if (!process.env.VAPID_EMAIL || 
        !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
        !process.env.VAPID_PRIVATE_KEY) {
      console.error('❌ Missing VAPID environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 4. Fetch user's push subscriptions from database
    console.log(`📨 Fetching push subscriptions for user: ${userId}`);
    
    // Create Supabase client dengan service role key (bypass RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth, device_type')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('❌ Database error:', fetchError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch subscriptions',
          details: fetchError.message 
        },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`⚠️ No push subscriptions found for user: ${userId}`);
      return NextResponse.json(
        { 
          error: 'No subscriptions found',
          details: 'User has not enabled push notifications on any device'
        },
        { status: 404 }
      );
    }

    console.log(`📱 Found ${subscriptions.length} device(s) for user`);

    // 5. Send push notification to all user devices
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: PushSubscription) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          console.log(`📤 Sending push to: ${sub.endpoint.substring(0, 50)}...`);
          
          // Send notification
          const response = await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload),
            {
              TTL: 86400, // 24 hours
            }
          );

          console.log(`✅ Push sent successfully (status: ${response.statusCode})`);

          // Update last_used_at timestamp
          await supabase
            .from('push_subscriptions')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', sub.id);

          return { 
            success: true, 
            endpoint: sub.endpoint,
            statusCode: response.statusCode
          };

        } catch (error: any) {
          console.error(`❌ Push send error:`, error);

          // Handle expired/invalid subscriptions
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`🗑️ Deleting invalid subscription: ${sub.id}`);
            
            // Delete expired subscription from database
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id);
          }

          return { 
            success: false, 
            endpoint: sub.endpoint,
            error: error.message,
            statusCode: error.statusCode
          };
        }
      })
    );

    // 6. Analyze results
    const successful = results.filter(
      r => r.status === 'fulfilled' && (r.value as any).success
    ).length;
    
    const failed = results.filter(
      r => r.status === 'rejected' || !(r.value as any).success
    ).length;

    console.log(`📊 Results: ${successful} successful, ${failed} failed`);

    // 7. Return response
    return NextResponse.json({
      success: true,
      message: `Push notification sent to ${successful} device(s)`,
      stats: {
        total: subscriptions.length,
        successful,
        failed
      },
      details: results.map(r => 
        r.status === 'fulfilled' ? r.value : { error: 'Promise rejected' }
      )
    });

  } catch (error: any) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// ============================================================
// API ROUTE: GET /api/push/send (Method not allowed)
// ============================================================

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
