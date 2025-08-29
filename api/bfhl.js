const { validateBfhlRequest } = require('../middleware/validation');
const DataProcessor = require('../utils/dataProcessor');

/**
 * Vercel serverless function for BFHL API
 * Handles both GET and POST requests
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      // Validate request
      const validationResult = validateBfhlRequest({ body: req.body }, res, () => {});
      
      if (validationResult && validationResult.error) {
        return res.status(400).json({
          is_success: false,
          error: validationResult.error.details[0].message
        });
      }

      const { data } = req.body;

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
      return res.status(200).json(response);

    } else if (req.method === 'GET') {
      // Health check and API information endpoint
      return res.status(200).json({
        message: 'BFHL API is running',
        version: '1.0.0',
        endpoints: {
          'POST /bfhl': 'Process data array and return categorized results',
          'GET /bfhl': 'API information and health check'
        },
        example_request: {
          data: ["a", "1", "334", "4", "R", "$"]
        },
        example_response: {
          is_success: true,
          user_id: "john_doe_17091999",
          email: "john@xyz.com",
          roll_number: "ABCD123",
          odd_numbers: ["1"],
          even_numbers: ["334", "4"],
          alphabets: ["A", "R"],
          special_characters: ["$"],
          sum: "339",
          concat_string: "Ra"
        }
      });

    } else {
      // Method not allowed
      return res.status(405).json({
        is_success: false,
        error: 'Method not allowed',
        allowed_methods: ['GET', 'POST']
      });
    }

  } catch (error) {
    console.error('❌ Error processing BFHL request:', error);
    return res.status(500).json({
      is_success: false,
      error: 'Internal server error'
    });
  }
};
