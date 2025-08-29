const Joi = require('joi');

/**
 * Validation schema for BFHL API request
 */
const bfhlRequestSchema = Joi.object({
  data: Joi.array().items(
    Joi.string().min(1).max(100)
  ).min(1).max(1000).required()
    .messages({
      'array.base': 'Data must be an array',
      'array.min': 'Data array must contain at least one element',
      'array.max': 'Data array cannot exceed 1000 elements',
      'any.required': 'Data field is required',
      'string.min': 'Each element must be at least 1 character long',
      'string.max': 'Each element cannot exceed 100 characters'
    })
});

/**
 * Middleware to validate BFHL request
 */
const validateBfhlRequest = (req, res, next) => {
  try {
    const { error, value } = bfhlRequestSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        is_success: false,
        details: errorDetails
      });
    }

    // Store validated data
    req.validatedData = value;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateBfhlRequest
};
