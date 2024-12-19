const Transaction = require('../models/Transactions');
const TransactionHistory = require('../models/TransactionHistory');

const sales ={
  getSalesData : async (req, res) => {
  try {
    // Fetch the latest closed transaction history
    const latestHistory = await TransactionHistory.findOne({ isOpen: false }).sort({ openDate: -1 });
    if (!latestHistory) {
      return res.status(404).json({ success: false, message: 'No closed transaction history found.' });
    }
    const latestHistorys = await TransactionHistory.findOne({ isOpen: false }).sort({ openDate: -1 });
    console.log(latestHistorys);
    
    // Get transactions between openDate and closeDate
    const transactions = await Transaction.find({
      transactionDate: { $gte: latestHistory.openDate, $lte: latestHistory.closeDate },
      status: { $ne: 'Canceled' },
    });

    res.status(200).json({ success: true, data: transactions }); // Directly return the transactions
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch sales data.' });
  }
}

}


module.exports = sales