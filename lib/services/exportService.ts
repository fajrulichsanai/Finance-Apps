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
  monthName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
}

/**
 * Fetch transaction data for export from API
 */
export async function fetchExportData(
  startMonth: string,
  endMonth: string
): Promise<MonthlyData[]> {
  const response = await fetch(
    `/api/export/transactions?startMonth=${startMonth}&endMonth=${endMonth}`
  );
  
  if (!response.ok) {
    throw new Error('Gagal mengambil data transaksi');
  }
  
  const { data } = await response.json();
  return data;
}

/**
 * Export to Excel using ExcelJS
 * Format: Tab 1 = Overview, Tab 2-N = Monthly sheets
 */
export async function exportToExcel(
  startMonth: string,
  endMonth: string
): Promise<void> {
  // Dynamic import to reduce bundle size
  const ExcelJS = (await import('exceljs')).default;
  
  const workbook = new ExcelJS.Workbook();
  const monthlyData = await fetchExportData(startMonth, endMonth);
  
  // Sheet 1: Overview
  const overviewSheet = workbook.addWorksheet('Overview');
  
  // Add title
  overviewSheet.mergeCells('A1:D1');
  const titleCell = overviewSheet.getCell('A1');
  titleCell.value = 'Ringkasan Keuangan';
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: 'center' };
  
  // Add export info
  overviewSheet.getCell('A2').value = `Periode: ${formatMonthName(startMonth)} - ${formatMonthName(endMonth)}`;
  overviewSheet.getCell('A3').value = `Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`;
  
  // Add headers
  overviewSheet.addRow([]);
  const headerRow = overviewSheet.addRow(['Bulan', 'Pemasukan', 'Pengeluaran', 'Saldo']);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };
  
  // Add monthly data
  let totalIncome = 0;
  let totalExpense = 0;
  let totalBalance = 0;
  
  monthlyData.forEach(month => {
    overviewSheet.addRow([
      month.monthName,
      month.totalIncome,
      month.totalExpense,
      month.balance
    ]);
    
    totalIncome += month.totalIncome;
    totalExpense += month.totalExpense;
    totalBalance += month.balance;
  });
  
  // Add totals
  overviewSheet.addRow([]);
  const totalRow = overviewSheet.addRow(['TOTAL', totalIncome, totalExpense, totalBalance]);
  totalRow.font = { bold: true };
  
  // Format currency columns
  overviewSheet.getColumn(2).numFmt = 'Rp #,##0';
  overviewSheet.getColumn(3).numFmt = 'Rp #,##0';
  overviewSheet.getColumn(4).numFmt = 'Rp #,##0';
  
  // Auto-fit columns
  overviewSheet.columns = [
    { key: 'month', width: 20 },
    { key: 'income', width: 18 },
    { key: 'expense', width: 18 },
    { key: 'balance', width: 18 }
  ];
  
  // Create monthly sheets
  monthlyData.forEach(monthData => {
    const monthSheet = workbook.addWorksheet(monthData.monthName);
    
    // Title
    monthSheet.mergeCells('A1:E1');
    const monthTitle = monthSheet.getCell('A1');
    monthTitle.value = monthData.monthName;
    monthTitle.font = { bold: true, size: 14 };
    monthTitle.alignment = { horizontal: 'center' };
    
    // Summary
    monthSheet.addRow([]);
    monthSheet.addRow(['Total Pemasukan', monthData.totalIncome]);
    monthSheet.addRow(['Total Pengeluaran', monthData.totalExpense]);
    monthSheet.addRow(['Saldo', monthData.balance]);
    
    // Style summary
    monthSheet.getCell('B3').numFmt = 'Rp #,##0';
    monthSheet.getCell('B4').numFmt = 'Rp #,##0';
    monthSheet.getCell('B5').numFmt = 'Rp #,##0';
    
    // Transactions table
    monthSheet.addRow([]);
    monthSheet.addRow([]);
    const txHeaderRow = monthSheet.addRow(['Tanggal', 'Kategori', 'Tipe', 'Jumlah', 'Keterangan']);
    txHeaderRow.font = { bold: true };
    txHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    monthData.transactions.forEach(tx => {
      monthSheet.addRow([
        new Date(tx.date).toLocaleDateString('id-ID'),
        tx.category_name,
        tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        tx.amount,
        tx.description || '-'
      ]);
    });
    
    // Format
    monthSheet.getColumn(4).numFmt = 'Rp #,##0';
    monthSheet.columns = [
      { key: 'date', width: 15 },
      { key: 'category', width: 20 },
      { key: 'type', width: 15 },
      { key: 'amount', width: 18 },
      { key: 'description', width: 30 }
    ];
  });
  
  // Generate and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  
  downloadFile(blob, `transaksi_${startMonth}_to_${endMonth}.xlsx`);
}

/**
 * Export to PDF using jsPDF
 * Format: Page 1 = Overview, Page 2-N = Monthly tables
 */
export async function exportToPDF(
  startMonth: string,
  endMonth: string
): Promise<void> {
  // Dynamic imports
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;
  
  const doc = new jsPDF();
  const monthlyData = await fetchExportData(startMonth, endMonth);
  
  let yPos = 20;
  
  // Page 1: Overview
  doc.setFontSize(18);
  doc.text('Ringkasan Keuangan', 14, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.text(`Periode: ${formatMonthName(startMonth)} - ${formatMonthName(endMonth)}`, 14, yPos);
  yPos += 6;
  doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, yPos);
  
  // Overview table
  const overviewData = monthlyData.map(m => [
    m.monthName,
    formatIDR(m.totalIncome),
    formatIDR(m.totalExpense),
    formatIDR(m.balance)
  ]);
  
  const totalIncome = monthlyData.reduce((sum, m) => sum + m.totalIncome, 0);
  const totalExpense = monthlyData.reduce((sum, m) => sum + m.totalExpense, 0);
  const totalBalance = monthlyData.reduce((sum, m) => sum + m.balance, 0);
  
  overviewData.push([
    'TOTAL',
    formatIDR(totalIncome),
    formatIDR(totalExpense),
    formatIDR(totalBalance)
  ]);
  
  autoTable(doc, {
    startY: yPos + 10,
    head: [['Bulan', 'Pemasukan', 'Pengeluaran', 'Saldo']],
    body: overviewData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 },
    footStyles: { fontStyle: 'bold' }
  });
  
  // Monthly pages
  monthlyData.forEach((monthData, index) => {
    doc.addPage();
    
    yPos = 20;
    
    // Month title
    doc.setFontSize(16);
    doc.text(monthData.monthName, 14, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    
    // Summary box
    doc.text(`Pemasukan: ${formatIDR(monthData.totalIncome)}`, 14, yPos);
    yPos += 6;
    doc.text(`Pengeluaran: ${formatIDR(monthData.totalExpense)}`, 14, yPos);
    yPos += 6;
    doc.text(`Saldo: ${formatIDR(monthData.balance)}`, 14, yPos);
    
    // Transactions table
    const txData = monthData.transactions.map(tx => [
      new Date(tx.date).toLocaleDateString('id-ID'),
      tx.category_name,
      tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      formatIDR(tx.amount),
      tx.description || '-'
    ]);
    
    autoTable(doc, {
      startY: yPos + 10,
      head: [['Tanggal', 'Kategori', 'Tipe', 'Jumlah', 'Keterangan']],
      body: txData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 60 }
      }
    });
  });
  
  // Download
  doc.save(`transaksi_${startMonth}_to_${endMonth}.pdf`);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

function formatMonthName(monthStr: string): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const [year, month] = monthStr.split('-');
  return `${months[parseInt(month) - 1]} ${year}`;
}
