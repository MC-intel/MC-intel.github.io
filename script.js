const resumeData = `
Michael Crawford
922 Stone Crossing Dr.
Wentzville, MO 63385
...
`;

/**
 * Fetch the OpenAI API Key securely from the Google Apps Script endpoint.
 * @returns {string} - The OpenAI API Key.
 */
async function fetchAPIKey() {
  // Replace with your Google Apps Script Web App deployment URL
  const endpoint = "https://script.google.com/macros/s/AKfycbxB5-oIsBxNBF_jZ2PYWhe2DjALkQrTQobt_Ad03UAmRxrjGUOiB4S_NP0W3u73LiEz3w/exec";
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching API Key: ${response.status}`);
    }
    const data = await response.json();
    return data.apiKey; // Return the OpenAI API Key
  } catch (error) {
    console.error('API Key fetch error:', error);
    return '';
  }
}

/**
 * Fetch a GPT response using the OpenAI API with a secure key.
 * @param {string} prompt - The prompt to send to the OpenAI model.
 * @returns {string} - The GPT model's response.
 */
async function fetchGPTResponse(prompt) {
  const OPENAI_API_KEY = await fetchAPIKey(); // Fetch the OpenAI API Key securely
  if (!OPENAI_API_KEY) {
    console.error('Missing OpenAI API Key');
    return 'Error: Missing API Key';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}` // Use the fetched API key
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      return 'Error fetching response';
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error('API returned no choices');
      return 'No response choices available';
    }

    return data.choices[0].text.trim(); // Return the GPT response
  } catch (error) {
    console.error('Fetch error:', error);
    return 'Fetch error occurred';
  }
}

/**
 * Update the chat interface with user input and bot response.
 * @param {string} userInput - The user's input query.
 * @param {string} botResponse - The bot's response.
 */
function updateChat(userInput, botResponse) {
  const chatMessageContainer = document.getElementById('chatMessageContainer');
  const userMessage = document.createElement('div');
  userMessage.className = 'user-message d-flex justify-content-end mb-2';
  userMessage.innerHTML = `<div class="alert alert-success"><strong>You:</strong> ${userInput}</div>`;

  const botMessage = document.createElement('div');
  botMessage.className = 'bot-message d-flex justify-content-start mb-2';
  botMessage.innerHTML = `<div class="alert alert-secondary"><strong>Bot:</strong> ${botResponse}</div>`;

  chatMessageContainer.appendChild(userMessage);
  chatMessageContainer.appendChild(botMessage);

  document.getElementById('chatWindow').scrollTop = chatMessageContainer.scrollHeight;
}

document.getElementById('sendButton').addEventListener('click', async () => {
  const userInput = document.getElementById('userInput').value.trim();
  const promptInput = document.getElementById('promptInput').value.trim();

  if (userInput) {
    const combinedPrompt = `${promptInput}\n\nResume Data: ${resumeData}\n\nUser Query: ${userInput}`;
    const botResponse = await fetchGPTResponse(combinedPrompt);

    updateChat(userInput, botResponse);
    document.getElementById('userInput').value = '';
  }
});
