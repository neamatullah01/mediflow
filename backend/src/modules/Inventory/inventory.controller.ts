import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { addInventoryItemSchema, updateInventoryItemSchema } from './inventory.validation';
import inventoryService from './inventory.service';
import AppError from '../../errors/AppError';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import PDFDocument from 'pdfkit';

const parseCSV = (buffer: Buffer): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    Readable.from(buffer)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const inventoryController = {
  getInventory: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const { page, limit, search, category, status, sortBy, sortOrder } = req.query;

    const result = await inventoryService.getInventory(pharmacyId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string | undefined,
      category: category as string | undefined,
      status: status as string | undefined,
      sortBy: sortBy as string | undefined,
      sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory retrieved successfully',
      meta: result.meta,
      data: result.items,
    });
  }),

  getInventoryItem: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const item = await inventoryService.getInventoryItem(pharmacyId, req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item retrieved successfully',
      data: item,
    });
  }),

  addItem: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const validated = addInventoryItemSchema.parse(req.body);
    const item = await inventoryService.addItem(pharmacyId, validated);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Inventory item added successfully',
      data: item,
    });
  }),

  updateItem: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const validated = updateInventoryItemSchema.parse(req.body);
    const item = await inventoryService.updateItem(pharmacyId, req.params.id as string, validated);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item updated successfully',
      data: item,
    });
  }),

  deleteItem: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    await inventoryService.deleteItem(pharmacyId, req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Inventory item deleted successfully',
      data: null,
    });
  }),

  getLowStockAlerts: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const items = await inventoryService.getLowStockAlerts(pharmacyId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Low stock alerts retrieved',
      data: items,
    });
  }),

  getExpiringAlerts: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const items = await inventoryService.getExpiringAlerts(pharmacyId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Expiring items retrieved',
      data: items,
    });
  }),

  importCSV: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    if (!req.file) {
      throw new AppError('No CSV file uploaded', 400);
    }

    const items = await parseCSV(req.file.buffer);
    if (!items || items.length === 0) {
      throw new AppError('Uploaded CSV is empty or improperly formatted', 400);
    }

    const results = await inventoryService.importBulkInventory(pharmacyId, items);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Bulk import processed',
      data: results,
    });
  }),

  exportCSV: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const items = await inventoryService.getAllInventory(pharmacyId);

    const fields = [
      'ID', 'Drug Name', 'Generic Name', 'Category', 'Dosage Form',
      'Batch Number', 'Quantity', 'Unit Price', 'Reorder Level',
      'Expiry Date', 'Status', 'Supplier',
    ];

    const csvRows = [fields.join(',')];

    for (const item of items) {
      const row = [
        item.id,
        `"${item.drug.name}"`,
        `"${item.drug.genericName}"`,
        `"${item.drug.category}"`,
        `"${item.drug.dosageForm}"`,
        `"${item.batchNumber || ''}"`,
        item.quantity,
        item.unitPrice,
        item.reorderLevel,
        item.expiryDate.toISOString().split('T')[0],
        item.status,
        `"${item.supplierName || ''}"`,
      ];
      csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory.csv');
    res.status(200).send(csvString);
  }),

  exportPDF: catchAsync(async (req: Request, res: Response) => {
    const pharmacyId = req.user?.pharmacyId;
    if (!pharmacyId) throw new AppError('Pharmacy not associated with your account', 400);

    const items = await inventoryService.getAllInventory(pharmacyId);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory.pdf');

    doc.pipe(res);

    // Document Title
    doc.fontSize(20).text('Inventory Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Table settings
    const tableTop = doc.y;
    const columns = [
      { header: 'Drug Name', x: 30, width: 140 },
      { header: 'Batch', x: 170, width: 70 },
      { header: 'Qty', x: 240, width: 40 },
      { header: 'Price', x: 280, width: 50 },
      { header: 'Expiry', x: 330, width: 80 },
      { header: 'Status', x: 410, width: 80 },
    ];

    // Draw headers
    doc.fontSize(10).font('Helvetica-Bold');
    columns.forEach(col => {
      doc.text(col.header, col.x, tableTop);
    });

    // Draw horizontal line
    doc.moveTo(30, tableTop + 15).lineTo(560, tableTop + 15).stroke();

    let y = tableTop + 25;
    doc.font('Helvetica');

    // Draw rows
    items.forEach((item, i) => {
      // Check for page break
      if (y > 750) {
        doc.addPage();
        y = 30;
        
        doc.fontSize(10).font('Helvetica-Bold');
        columns.forEach(col => {
          doc.text(col.header, col.x, y);
        });
        doc.moveTo(30, y + 15).lineTo(560, y + 15).stroke();
        y += 25;
        doc.font('Helvetica');
      }

      doc.text(item.drug.name.substring(0, 25), columns[0]!.x, y);
      doc.text((item.batchNumber || '-').substring(0, 10), columns[1]!.x, y);
      doc.text(item.quantity.toString(), columns[2]!.x, y);
      doc.text(`$${item.unitPrice.toString()}`, columns[3]!.x, y);
      doc.text(item.expiryDate ? item.expiryDate.toISOString().slice(0, 10) : '-', columns[4]!.x, y);
      doc.text(item.status || '', columns[5]!.x, y);

      y += 20;
    });

    doc.end();
  }),
};

export default inventoryController;
