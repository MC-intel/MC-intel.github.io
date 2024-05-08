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

async function makeOpenAiApiRequest(prompt) {
  const apiKey = await fetchOpenAiApiKey();
  if (!apiKey) {
    console.error('Failed to retrieve the OpenAI API Key');
    displayResponse('Failed to retrieve the OpenAI API Key');
    return;
  }

  const url = 'https://api.openai.com/v1/chat/completions';
  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100,
    temperature: 0.7
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonResponse = await response.json();
    const message = jsonResponse.choices[0].message.content.trim();
    console.log(message);
    displayResponse(message);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    displayResponse(`Error: ${error.message}`);
  }
}

function displayResponse(message) {
  const responseDisplay = document.getElementById('responseDisplay');
  responseDisplay.textContent = message;
}

// Add event listener to the button to trigger the OpenAI API request
document.getElementById('sendButton').addEventListener('click', () => {
  const chatInput = document.getElementById('chatInput').value;
  makeOpenAiApiRequest(chatInput);
});
