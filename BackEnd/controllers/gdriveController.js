const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const Transaction = require('../models/Transactions');
const TransactionHistory = require('../models/TransactionHistory');
const Config = require('../models/Config');

// Path to Google API credentials
const CREDENTIALS_PATH = path.join(__dirname, '../google-api.json');

// Function to upload a file to Google Drive
async function uploadToDrive(filePath, fileName, folderId) {
  const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: fileName,
    parents: [folderId], // Specify the target folder ID here
  };

  const media = {
    mimeType: 'text/csv',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  });

  return response.data.id;
}

// Reusable function to export transaction data and upload file
exports.exportData = async (req, res) => {
  try {
    // Fetch the latest open transaction history
    const latestHistory = await TransactionHistory.findOne({ isOpen: false }).sort({ openDate: -1 });
    if (!latestHistory) {
      return res.status(404).json({ error: 'No open transaction history found.' });
    }

    // Get transactions between openDate and closeDate
    const transactions = await Transaction.find({
      transactionDate: { $gte: latestHistory.openDate, $lte: latestHistory.closeDate },
      status: { $ne: 'Canceled' }, // Exclude canceled transactions
    });

    // Calculate total sales
    let totalSales = 0;
    const transactionData = transactions.map(transaction => {
      let totalAmount = transaction.totalAmount;
      totalSales += totalAmount;
      return {
        transactionId: transaction.transactionId,
        totalAmount: totalAmount,
        paymentMethod: transaction.paymentMethod,
        transactionDate: transaction.transactionDate,
        employee: transaction.employee,
      };
    });

    // Add a row for total sales at the bottom
    transactionData.push({
      transactionId: 'Total Sales',
      totalAmount: totalSales,
      paymentMethod: '',
      transactionDate: '',
      employee: '',
    });

    // Get folder ID from Config model
    const config = await Config.findOne();
    if (!config || !config.status) {
      return res.status(400).json({ error: 'File upload is not allowed as the config status is false.' });
    }

    const folderId = config.folderID;

    // Define the file name and path
    const closeDate = latestHistory.closeDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const fileName = `${closeDate} Sales-Report.csv`;
    const filePath = path.join(__dirname, '../records', fileName);

    // Configure CSV writer
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'transactionId', title: 'Transaction ID' },
        { id: 'totalAmount', title: 'Total Amount' },
        { id: 'paymentMethod', title: 'Payment Method' },
        { id: 'transactionDate', title: 'Transaction Date' },
        { id: 'employee', title: 'Employee' },
      ],
    });

    // Write data to CSV file
    await csvWriter.writeRecords(transactionData);

    // Upload CSV file to Google Drive
    const fileId = await uploadToDrive(filePath, fileName, folderId);

    // Respond with the file ID and file path
    res.status(201).json({
      message: 'File uploaded successfully to Google Drive',
      fileId: fileId,
      filePath: filePath,  // Returning the file path
    });

    // Clean up - delete the file after uploading if needed

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during the file export process.' });
  }
};
