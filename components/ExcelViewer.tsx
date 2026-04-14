import React, { useState } from 'react';
import * as XLSX from 'xlsx';

type SheetData = { headers: string[]; rows: any[][] };

const ExcelViewer: React.FC = () => {
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
    if (rows.length === 0) {
      setSheetData(null);
      return;
    }

    const headers = rows[0].map((cell: any, idx: number) => (cell ?? `Column ${idx + 1}`).toString());
    const bodyRows = rows.slice(1);
    setSheetData({ headers, rows: bodyRows });
  };

  return (
    <div className="rounded-3xl border border-zinc-700 bg-zinc-900/70 p-5 shadow-xl">
      <div className="mb-4">
        <label className="block text-sm font-semibold text-zinc-300 mb-2">Live Excel Preview</label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="text-sm text-zinc-200"
        />
        {fileName && <p className="text-xs text-zinc-500 mt-2">Loaded: {fileName}</p>}
      </div>
      {sheetData ? (
        <div className="max-h-72 overflow-auto rounded-xl border border-zinc-700">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-zinc-800 sticky top-0">
              <tr>
                {sheetData.headers.map((header, i) => (
                  <th key={i} className="border-b border-zinc-700 px-2 py-1 text-zinc-300">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheetData.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900'}>
                  {sheetData.headers.map((_, ci) => (
                    <td key={ci} className="border-b border-zinc-800 px-2 py-1 text-zinc-100">
                      {row[ci] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-500 text-sm">Pilih file (.xlsx/.xls/.csv) untuk preview langsung.</p>
      )}
    </div>
  );
};

export default ExcelViewer;
