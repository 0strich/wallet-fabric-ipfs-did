const impAuthHeader = (token) => {
  return {
    headers: {
      Authorization: token,
    },
  };
};

const impPostJson = (token) => {
  return {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  };
};

module.exports = {
  impAuthHeader,
  impPostJson,
};
