// Handle Mongoose validation errors
export const handleMongooseError = (error) => {
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return {
      status: 400,
      message: errors.join(', ')
    };
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return {
      status: 400,
      message: `${field} already exists`
    };
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return {
      status: 400,
      message: 'Invalid ID format'
    };
  }

  // Default error
  return {
    status: 500,
    message: error.message || 'Server error'
  };
};
