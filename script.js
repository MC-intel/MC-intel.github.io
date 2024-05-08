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

async function makeOpenAiApiRequestWithBackoff(prompt, retries = 3, delay = 1000) {
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
    max_tokens: 1000,
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

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay * Math.pow(2, i);
        console.warn(`Too Many Requests: Retrying in ${waitTime / 1000} seconds.`);
        displayResponse(`Too Many Requests: Retrying in ${waitTime / 1000} seconds.`);
        await new Promise(res => setTimeout(res, waitTime));
        continue;
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonResponse = await response.json();
      const message = jsonResponse.choices[0].message.content.trim();
      console.log(message);
      displayResponse(message);
      return;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      displayResponse(`Error: ${error.message}`);
    }
  }

  console.error('Exceeded maximum retries.');
  displayResponse('Exceeded maximum retries.');
}

function displayResponse(message) {
  const responseDisplay = document.getElementById('responseDisplay');
  responseDisplay.textContent = message;
}

// Add event listener to the button to trigger the OpenAI API request with backoff
document.getElementById('sendButton').addEventListener('click', () => {
  const chatInput = document.getElementById('chatInput').value;
  makeOpenAiApiRequestWithBackoff(chatInput);
});
