// Replace with your actual Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby4BJMSJMqEdJ14WRnpWU3HUki1ehphAKliXAP2jcH6RPuxXYhFnBLL-mABe9J0WWvKcA/exec';

async function fetchOpenAiApiKey() {
  try {
    const response = await fetch(WEB_APP_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const apiKey = data.api_key;

    if (!apiKey) {
      throw new Error('API key could not be retrieved from the web app.');
    }

    return apiKey;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function exampleOpenAiApiRequest() {
  const apiKey = await fetchOpenAiApiKey();
  if (!apiKey) {
    console.error('Failed to retrieve the OpenAI API Key');
    return;
  }

  const url = 'https://api.openai.com/v1/models';
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonResponse = await response.json();
    console.log(jsonResponse);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Usage example
exampleOpenAiApiRequest();
