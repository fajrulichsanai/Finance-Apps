import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startMonth = searchParams.get('startMonth');
  const endMonth = searchParams.get('endMonth');
  
  if (!startMonth || !endMonth) {
    return NextResponse.json(
      { error: 'Missing startMonth or endMonth parameter' },
      { status: 400 }
    );
  }
  
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Calculate date range
    const startDate = new Date(`${startMonth}-01`);
    const endDate = new Date(`${endMonth}-01`);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Last day of end month
    
    // Fetch transactions with category info
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        id,
        date,
        type,
        amount,
        description,
        category_id,
        categories (
          name,
          color
        )
      `)
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Group transactions by month
    const monthlyData = groupTransactionsByMonth(transactions || []);
    
    return NextResponse.json({ data: monthlyData });
    
  } catch (error: any) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function groupTransactionsByMonth(transactions: any[]) {
  const grouped = new Map();
  
  transactions.forEach(tx => {
    const monthKey = tx.date.substring(0, 7); // YYYY-MM
    
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, {
        month: monthKey,
        monthName: formatMonthName(monthKey),
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactions: []
      });
    }
    
    const monthData = grouped.get(monthKey);
    
    // Calculate totals
    if (tx.type === 'income') {
      monthData.totalIncome += tx.amount;
      monthData.balance += tx.amount;
    } else {
      monthData.totalExpense += tx.amount;
      monthData.balance -= tx.amount;
    }
    
    // Add transaction to list
    monthData.transactions.push({
      id: tx.id,
      date: tx.date,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      category_name: tx.categories?.name || 'Tanpa Kategori'
    });
  });
  
  // Convert to array and sort by month (newest first)
  return Array.from(grouped.values()).sort((a, b) => 
    b.month.localeCompare(a.month)
  );
}

function formatMonthName(monthStr: string): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const [year, month] = monthStr.split('-');
  return `${months[parseInt(month) - 1]} ${year}`;
}
