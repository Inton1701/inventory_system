const Receipt = require("../models/Receipt");
const Config = require("../models/Config");
const asyncHandler = require("express-async-handler");

const settingsController = {
  // Get settings
  getSettings: asyncHandler(async (req, res) => {
    try {
      const receiptSettings = await Receipt.findOne();
      const configSettings = await Config.findOne();
      res.status(200).json({
        success: true,
        receipt: receiptSettings,
        config: configSettings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to fetch settings",
        error: error.message,
      });
    }
  }),

  // Update receipt settings
  updateReceiptSettings: asyncHandler(async (req, res) => {
    try {
      let receiptSettings = await Receipt.findOne();

      if (!receiptSettings) {
        receiptSettings = new Receipt();
      }

      Object.assign(receiptSettings, req.body);
      await receiptSettings.save();

      res.status(200).json({
        success: true,
        message: "Receipt settings updated successfully",
        receipt: receiptSettings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating receipt settings",
        error: error.message,
      });
    }
  }),

  // Update config settings
  updateConfigSettings: asyncHandler(async (req, res) => {
    try {
      let configSettings = await Config.findOne();

      if (!configSettings) {
        configSettings = new Config();
      }

      Object.assign(configSettings, req.body);
      await configSettings.save();

      res.status(200).json({
        success: true,
        message: "Config settings updated successfully",
        config: configSettings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating config settings",
        error: error.message,
      });
    }
  }),

  // Restore default receipt settings
  restoreDefaultReceiptSettings: asyncHandler(async (req, res) => {
    try {
      const defaultSettings = {
        logo: null,
        storeName: "POSExpress",
        storeAdress: "Store Address",
        storeSecondAddress: "Second Address",
        contact: null,
        message: null,
        description: null,
        status: true,
      };

      const receiptSettings = await Receipt.findOneAndUpdate({}, defaultSettings, {
        new: true,
        upsert: true,
      });

      res.status(200).json({
        success: true,
        message: "Receipt settings restored to defaults",
        receipt: receiptSettings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error restoring receipt settings",
        error: error.message,
      });
    }
  }),

  // Restore default config settings
  restoreDefaultConfigSettings: asyncHandler(async (req, res) => {
    try {
      const defaultSettings = {
        status: true,
        folderID: "1DpVqEewMFx4tvioAeSdvD1FjT4sbVtZk",
      };

      const configSettings = await Config.findOneAndUpdate({}, defaultSettings, {
        new: true,
        upsert: true,
      });

      res.status(200).json({
        success: true,
        message: "Config settings restored to defaults",
        config: configSettings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error restoring config settings",
        error: error.message,
      });
    }
  }),
};

module.exports = settingsController;
