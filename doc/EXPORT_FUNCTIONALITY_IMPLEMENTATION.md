# Export Functionality Implementation Plan

## Overview
Implement Excel and PDF export with date range selection and proper formatting (overview + monthly breakdown).

## Current Status
- ✅ Date range selector UI implemented
- ✅ Month range validation (max 12 months)
- ✅ Modal design completed
- ❌ Actual export logic not implemented
- ❌ Data fetching for export not implemented
- ❌ Excel/PDF generation libraries not installed

## Technical Requirements

### 1. Install Dependencies

```bash
npm install exceljs jspdf jspdf-autotable
```

**Libraries:**
- `exceljs`: Excel file generation with multiple sheets
- `jspdf`: PDF generation
- `jspdf-autotable`: Table formatting for PDF

### 2. Create Export Service

Create `/lib/services/exportService.ts`:

```typescript
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatIDR } from '@/lib/utils/currency';

interface Transaction {
  id: string;
  date: string;
  category_name: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
}

interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
}

export async function exportToExcel(
  startMonth: string,
  endMonth: string,
  userId: string
): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  
  // Fetch data from Supabase
  const monthlyData = await fetchMonthlyData(startMonth, endMonth, userId);
  
  // Sheet 1: Overview
  const overviewSheet = workbook.addWorksheet('Overview');
  createOverviewSheet(overviewSheet, monthlyData);
  
  // Sheets 2-N: Monthly data
  for (const monthData of monthlyData) {
    const monthSheet = workbook.addWorksheet(monthData.month);
    createMonthSheet(monthSheet, monthData);
  }
  
  // Generate blob
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

export async function exportToPDF(
  startMonth: string,
  endMonth: string,
  userId: string
): Promise<Blob> {
  const doc = new jsPDF();
  
  // Fetch data
  const monthlyData = await fetchMonthlyData(startMonth, endMonth, userId);
  
  // Page 1: Overview
  createOverviewPage(doc, monthlyData);
  
  // Pages 2-N: Monthly tables
  for (const monthData of monthlyData) {
    doc.addPage();
    createMonthPage(doc, monthData);
  }
  
  return doc.output('blob');
}

// Helper functions
async function fetchMonthlyData(
  startMonth: string,
  endMonth: string,
  userId: string
): Promise<MonthlyData[]> {
  // TODO: Implement Supabase query
  // Query transactions grouped by month
  return [];
}

function createOverviewSheet(
  sheet: ExcelJS.Worksheet,
  data: MonthlyData[]
) {
  // Add title
  sheet.getCell('A1').value = 'Financial Overview';
  sheet.getCell('A1').font = { bold: true, size: 16 };
  
  // Add headers
  sheet.addRow(['Month', 'Income', 'Expense', 'Balance']);
  
  // Add data
  data.forEach(month => {
    sheet.addRow([
      month.month,
      month.totalIncome,
      month.totalExpense,
      month.balance
    ]);
  });
  
  // Format currency columns
  sheet.getColumn(2).numFmt = 'Rp #,##0';
  sheet.getColumn(3).numFmt = 'Rp #,##0';
  sheet.getColumn(4).numFmt = 'Rp #,##0';
  
  // Auto-fit columns
  sheet.columns.forEach(column => {
    column.width = 15;
  });
}

function createMonthSheet(
  sheet: ExcelJS.Worksheet,
  monthData: MonthlyData
) {
  // Add title
  sheet.getCell('A1').value = monthData.month;
  sheet.getCell('A1').font = { bold: true, size: 14 };
  
  // Add summary
  sheet.addRow([]);
  sheet.addRow(['Total Income', monthData.totalIncome]);
  sheet.addRow(['Total Expense', monthData.totalExpense]);
  sheet.addRow(['Balance', monthData.balance]);
  
  // Add transactions table
  sheet.addRow([]);
  sheet.addRow(['Date', 'Category', 'Type', 'Amount', 'Description']);
  
  monthData.transactions.forEach(tx => {
    sheet.addRow([
      tx.date,
      tx.category_name,
      tx.type,
      tx.amount,
      tx.description
    ]);
  });
  
  // Format
  sheet.getColumn(4).numFmt = 'Rp #,##0';
}

function createOverviewPage(
  doc: jsPDF,
  data: MonthlyData[]
) {
  // Title
  doc.setFontSize(18);
  doc.text('Financial Overview', 14, 20);
  
  // Table
  autoTable(doc, {
    startY: 30,
    head: [['Month', 'Income', 'Expense', 'Balance']],
    body: data.map(m => [
      m.month,
      formatIDR(m.totalIncome),
      formatIDR(m.totalExpense),
      formatIDR(m.balance)
    ]),
  });
}

function createMonthPage(
  doc: jsPDF,
  monthData: MonthlyData
) {
  // Title
  doc.setFontSize(16);
  doc.text(monthData.month, 14, 20);
  
  // Summary
  doc.setFontSize(12);
  doc.text(`Income: ${formatIDR(monthData.totalIncome)}`, 14, 30);
  doc.text(`Expense: ${formatIDR(monthData.totalExpense)}`, 14, 37);
  doc.text(`Balance: ${formatIDR(monthData.balance)}`, 14, 44);
  
  // Transactions table
  autoTable(doc, {
    startY: 50,
    head: [['Date', 'Category', 'Type', 'Amount', 'Description']],
    body: monthData.transactions.map(tx => [
      tx.date,
      tx.category_name,
      tx.type,
      formatIDR(tx.amount),
      tx.description
    ]),
  });
}
```

### 3. Create API Endpoint for Data Fetching

Create `/app/api/export/transactions/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startMonth = searchParams.get('startMonth');
  const endMonth = searchParams.get('endMonth');
  
  const supabase = createClient();
  
  // Get user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Parse dates
  const startDate = new Date(`${startMonth}-01`);
  const endDate = new Date(`${endMonth}-01`);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0); // Last day of end month
  
  // Fetch transactions
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      id,
      date,
      type,
      amount,
      description,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Group by month
  const monthlyData = groupByMonth(transactions);
  
  return NextResponse.json({ data: monthlyData });
}

function groupByMonth(transactions: any[]) {
  const grouped = new Map();
  
  transactions.forEach(tx => {
    const monthKey = tx.date.substring(0, 7); // YYYY-MM
    
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, {
        month: monthKey,
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactions: []
      });
    }
    
    const monthData = grouped.get(monthKey);
    
    if (tx.type === 'income') {
      monthData.totalIncome += tx.amount;
      monthData.balance += tx.amount;
    } else {
      monthData.totalExpense += tx.amount;
      monthData.balance -= tx.amount;
    }
    
    monthData.transactions.push({
      ...tx,
      category_name: tx.categories?.name || 'Uncategorized'
    });
  });
  
  return Array.from(grouped.values());
}
```

### 4. Update ExportSection Component

Update `/components/features/profile/ExportSection.tsx`:

```typescript
import { exportToExcel, exportToPDF } from '@/lib/services/exportService';

const handleConfirmExport = async () => {
  // ... validation code ...
  
  setLoading(true);
  
  try {
    let blob: Blob;
    let filename: string;
    
    if (exportType === 'excel') {
      blob = await exportToExcel(dateRange.startMonth, dateRange.endMonth, userId);
      filename = `transactions_${dateRange.startMonth}_to_${dateRange.endMonth}.xlsx`;
    } else {
      blob = await exportToPDF(dateRange.startMonth, dateRange.endMonth, userId);
      filename = `transactions_${dateRange.startMonth}_to_${dateRange.endMonth}.pdf`;
    }
    
    // Download file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    setShowModal(false);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Gagal mengekspor data');
  } finally {
    setLoading(false);
  }
};
```

### 5. Add Loading State

Update modal to show loading state during export:

```typescript
const [loading, setLoading] = useState(false);

// In modal:
<button
  onClick={handleConfirmExport}
  disabled={loading}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? 'Mengekspor...' : 'Ekspor Sekarang'}
</button>
```

## Excel Format Specifications

**Tab 1 - Overview:**
- Title: "Financial Overview"
- Columns: Month | Income | Expense | Balance
- Summary row at bottom

**Tab 2-N - Monthly Sheets:**
- Sheet name: Month name (e.g., "Mei 2026")
- Summary section at top
- Transactions table below
- Columns: Date | Category | Type | Amount | Description

## PDF Format Specifications

**Page 1 - Overview:**
- Title: "Financial Overview"
- Summary statistics
- Monthly breakdown table

**Page 2-N - Monthly Pages:**
- One page per month
- Month name as header
- Summary box (Income, Expense, Balance)
- Transactions table

## Testing Checklist

- [ ] Date range validation works (max 12 months)
- [ ] Excel file downloads correctly
- [ ] PDF file downloads correctly
- [ ] Excel has correct number of sheets
- [ ] PDF has correct number of pages
- [ ] All transactions included
- [ ] Totals calculated correctly
- [ ] Currency formatting correct
- [ ] Works with empty months
- [ ] Loading state displays properly

## Cost Efficiency Notes

- Cache export data for 5 minutes to reduce repeated queries
- Limit to max 5000 transactions per export
- Use efficient Supabase query with proper indexes
- Generate files client-side (no server storage needed)

## Estimated Effort

- **Library setup:** 30 minutes
- **Export service:** 2 hours
- **API endpoint:** 1 hour
- **Component integration:** 1 hour
- **Testing & styling:** 1 hour

**Total:** ~5-6 hours
