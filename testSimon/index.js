exports.handler = async (event) => {
  // TODO implement
  const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda @ SIMON TEST!'),
  };
  return response;
};