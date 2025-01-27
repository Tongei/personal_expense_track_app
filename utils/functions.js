// Export the validateObj function as a named export
export const validateObj = (schema) => (payload) => {
    const { error } = schema.validate(payload, { abortEarly: false });
    if (error) {
      const errResponse = {};
      error.details.forEach((item) => {
        errResponse[item.context.key] = item.message;
      });
      return errResponse;
    }
    return error;
  };
  
  // Export the resObj function as a named export
  export const resObj = (data = [], message = '', result = true) => {
    return {
      result,
      message,
      data,
    };
  };