import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import './App.css';

function useData(rowLength, columnLength) {
  const [data, setData] = React.useState({ columns: [], rows: [] });
  const [fileUploaded, setFileUploaded] = React.useState(false);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const rowsWithIds = parsedData.map((row, index) => ({ ...row, id: index }));

      const columns = parsedData.length > 0 ? Object.keys(parsedData[0]).map((key) => ({ field: key, headerName: key })) : [];

      setData({ columns, rows: rowsWithIds });
      setFileUploaded(true);
    };
  };

  React.useEffect(() => {
    const rows = [];

    for (let i = 0; i < rowLength; i += 1) {
      const row = { id: i };

      for (let j = 1; j <= columnLength; j += 1) {
        row[`price${j}M`] = `${i.toString()}, ${j} `;
      }

      rows.push(row);
    }

    const columns = [];

    for (let j = 1; j <= columnLength; j += 1) {
      columns.push({ field: `price${j}M`, headerName: `${j}M` });
    }

    setData({ rows, columns });
    setFileUploaded(false);
  }, [rowLength, columnLength]);

  return { data, handleFileUpload, fileUploaded };
}

export default function ColumnVirtualizationGrid() {
  const { data, handleFileUpload, fileUploaded } = useData(0, 0);

  return (
    <div className='container'>
      <input id = "box" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
{fileUploaded && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid {...data} columnBufferPx={100} />
        </div>
      )}
    </div>
  );
}