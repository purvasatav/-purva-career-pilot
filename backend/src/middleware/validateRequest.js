const { ZodError } = require('zod');

/**
 * Reusable Express middleware to validate incoming request data using Zod.
 * Supports validation for request body, query parameters, and URL parameters.
 *
 * @param {import('zod').AnyZodObject} schema - The Zod schema to validate against.
 */
const validateRequest = (schema) => async (req, res, next) => {
  try {
    // Parse and validate incoming inputs safely
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Reassign sanitized data back to the request object
    req.body = parsed.body || req.body;
    req.query = parsed.query || req.query;
    req.params = parsed.params || req.params;

    return next();
  } catch (error) {
    // Intercept validation failures and format details cleanly
    // Also check error.name in case of monorepo dependency duplication
    if (error instanceof ZodError || error.name === 'ZodError') {
      
      // Safely grab the array, whether Zod stored it in .issues or .errors
      const validationErrors = error.issues || error.errors || [];
        
      const formattedErrors = validationErrors.map((err) => ({
        location: err.path[0], // e.g., 'body' or 'query'
        field: err.path.slice(1).join('.'), // e.g., 'email' or 'profile.firstName'
        message: err.message,
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    // Forward unexpected runtime problems to the global error handler
    return next(error);
  }
};

module.exports = validateRequest;