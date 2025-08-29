const express = require('express');
const { validateBfhlRequest } = require('../middleware/validation');
const DataProcessor = require('../utils/dataProcessor');

const router = express.Router();

/**
 * POST /bfhl
 * Process input data array and return categorized results
 * 
 * Request body:
 * {
 *   "data": ["a", "1", "334", "4", "R", "$"]
 * }
 * 
 * Response:
 * {
 *   "is_success": true,
 *   "user_id": "john_doe_17091999",
 *   "email": "john@xyz.com",
 *   "roll_number": "ABCD123",
 *   "odd_numbers": ["1"],
 *   "even_numbers": ["334", "4"],
 *   "alphabets": ["A", "R"],
 *   "special_characters": ["$"],
 *   "sum": "339",
 *   "concat_string": "Ra"
 * }
 */
router.post('/', validateBfhlRequest, async (req, res, next) => {
  try {
    const { data } = req.validatedData;

    // Process the data
    const processedData = DataProcessor.processData(data);

    // Get user information
    const userInfo = DataProcessor.getUserInfo();
    const userId = DataProcessor.generateUserId();

    // Prepare response
    const response = {
      is_success: true,
      user_id: userId,
      email: userInfo.email,
      roll_number: userInfo.roll_number,
      ...processedData
    };

    // Log successful request
    console.log(`✅ BFHL request processed successfully - ${data.length} items`);

    // Send response
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error processing BFHL request:', error);
    next(error);
  }
});


module.exports = router;
