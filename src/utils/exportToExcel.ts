// utils/exportToExcel.ts
import ExcelJS from 'exceljs';
import { Response } from 'express';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
  transform?: (value: any, row?: any) => any;
  style?: Partial<ExcelJS.Style>;
}

export interface ExportToExcelOptions {
  res: Response;
  filename: string;
  columns: ExportColumn[];
  data: any[];
  sheetName?: string;
  headerStyle?: Partial<ExcelJS.Style>;
  freezeHeader?: boolean;
  autoFilter?: boolean;
}

const DEFAULT_HEADER_STYLE: Partial<ExcelJS.Style> = {
  font: { bold: true, size: 11, color: { argb: 'FFFFFFFF' } },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  },
  alignment: { vertical: 'middle', horizontal: 'left' },
  border: {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } },
  },
};

const DEFAULT_CELL_STYLE: Partial<ExcelJS.Style> = {
  alignment: { vertical: 'middle', horizontal: 'left' },
  border: {
    top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
    right: { style: 'thin', color: { argb: 'FFD3D3D3' } },
  },
};

/**
 * Sanitize filename to prevent security issues
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_\-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 200);
}

/**
 * Format cell value safely
 */
function formatCellValue(value: any): string | number | Date | boolean {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    // Prevent formula injection
    if (
      value.startsWith('=') ||
      value.startsWith('+') ||
      value.startsWith('-') ||
      value.startsWith('@')
    ) {
      return `'${value}`;
    }
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Export data to Excel with streaming for large datasets
 */
export async function exportToExcel({
  res,
  filename,
  columns,
  data,
  sheetName = 'Sheet1',
  headerStyle = DEFAULT_HEADER_STYLE,
  freezeHeader = true,
  autoFilter = true,
}: ExportToExcelOptions): Promise<void> {
  try {
    // Sanitize filename
    const safeFilename = sanitizeFilename(filename);

    // Set response headers FIRST before any writing
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.xlsx"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Create workbook with streaming
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: true,
      useSharedStrings: true,
    });

    // Add worksheet with freeze and filter options
    const worksheet = workbook.addWorksheet(sheetName, {
      properties: { defaultRowHeight: 20 },
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      },
      // ✅ FIX: Set views during worksheet creation
      views: freezeHeader ? [{ state: 'frozen', ySplit: 1 }] : undefined,
    });

    // Configure columns
    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width || 20,
      style: DEFAULT_CELL_STYLE,
    }));

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.style = headerStyle;
    });
    headerRow.commit();

    // Add auto filter (must be done after header row)
    if (autoFilter && columns.length > 0) {
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: columns.length },
      };
    }

    // Add data rows with streaming
    for (const row of data) {
      const formattedRow: Record<string, any> = {};

      for (const col of columns) {
        try {
          const rawValue = row[col.key];
          const transformedValue = col.transform ? col.transform(rawValue, row) : rawValue;
          formattedRow[col.key] = formatCellValue(transformedValue);
        } catch (error) {
          console.error(`Error processing column ${col.key}:`, error);
          formattedRow[col.key] = 'Error';
        }
      }

      const excelRow = worksheet.addRow(formattedRow);

      // Apply custom column styles if specified
      columns.forEach((col, index) => {
        if (col.style) {
          const cell = excelRow.getCell(index + 1);
          cell.style = { ...DEFAULT_CELL_STYLE, ...col.style };
        }
      });

      excelRow.commit();
    }

    // Add footer with metadata
    const footerRow = worksheet.addRow([]);
    footerRow.commit();

    const metadataRow = worksheet.addRow([
      `Generated on: ${new Date().toLocaleString()}`,
      `Total Records: ${data.length}`,
    ]);
    metadataRow.font = { italic: true, size: 9, color: { argb: 'FF666666' } };
    metadataRow.commit();

    // Commit worksheet and workbook
    worksheet.commit();
    await workbook.commit();

    console.log('✅ Excel file generated and sent successfully');
  } catch (error) {
    console.error('❌ Error generating Excel file:', error);

    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate Excel file',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } else {
      // If headers were already sent, we can't send JSON
      // Just end the response
      res.end();
    }
  }
}
