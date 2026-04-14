import React from 'react';
import { FileText, Download } from 'lucide-react';
import ExportButton from './ExportButton';

export default function ExportSection() {
  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log('Export to Excel');
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log('Export to PDF');
  };

  return (
    <div className="bg-white rounded-[18px] shadow-sm p-4">
      <div className="flex gap-3 mb-2">
        <ExportButton 
          label="Excel" 
          icon={<FileText className="w-5 h-5 text-green-700" />}
          onClick={handleExportExcel}
        />
        <ExportButton 
          label="PDF" 
          icon={<Download className="w-5 h-5 text-red-600" />}
          onClick={handleExportPDF}
        />
      </div>
      <p className="text-[11.5px] text-gray-400 text-center py-1">
        Reports include last 12 months of financial data
      </p>
    </div>
  );
}
