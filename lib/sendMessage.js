const core = require('@actions/core')
const fetch = require('node-fetch')

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);
    this.response = response;
  }
}

function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    throw new HTTPResponseError(response);
  }
}

async function sendMessage(message, to) {
  const response = await fetch(to, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(message),
  });

  try {
    const validResponse = checkStatus(response);
    return validResponse.statusText;
  } catch (error) {
    const errorBody = await error.response.text();
    core.error(`Error body: ${errorBody}`);
    throw error;
  }
}

module.exports = sendMessage
