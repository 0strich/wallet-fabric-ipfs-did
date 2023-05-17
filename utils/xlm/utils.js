const parseOperationError = (error) => {
  return {
    operations: error.response?.data?.extras?.result_codes?.operations,
    transaction: error.response?.data?.extras?.result_codes?.transaction,
  };
};

const TIMEOUT = 180;

module.exports = {
  parseOperationError,
  TIMEOUT,
};
