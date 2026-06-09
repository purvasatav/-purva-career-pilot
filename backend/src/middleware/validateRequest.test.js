const validateRequest = require('./validateRequest');
const { z } = require('zod');

describe('validateRequest Middleware', () => {
  // A dummy schema for testing
  const testSchema = z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      age: z.number().min(18, 'Must be at least 18'),
    }).optional(),
  });

  const middleware = validateRequest(testSchema);

  it('should call next() without errors if the payload is completely valid', async () => {
    const req = { body: { email: 'test@example.com', age: 25 }, query: {}, params: {} };
    const res = {};
    const next = jest.fn(); // Mock the next function

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Called without arguments (success)
  });

  it('should return a 400 status and formatted errors if validation fails', async () => {
    const req = { body: { email: 'not-an-email', age: 15 }, query: {}, params: {} };
    
    // Mock the Express response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'error',
      message: 'Validation failed',
      errors: expect.arrayContaining([
        expect.objectContaining({ field: 'email', location: 'body' }),
        expect.objectContaining({ field: 'age', location: 'body' })
      ])
    }));
    expect(next).not.toHaveBeenCalled(); // Should not proceed to the next middleware
  });
});