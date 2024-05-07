const resumeData = `
Michael Crawford
922 Stone Crossing Dr.
Wentzville, MO 63385
...
`;

async function fetchAPIKey() {
  const endpoint = "https://script.google.com/macros/s/AKfycbxZex4KMqB1jtRENvbqH66ujgwByeV5tFhVnvHCudyTIvBcQ11GCkl3u3hXK6Q3bfvMPg/exec";
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
    return data.apiKey;
  } catch (error) {
    console.error('API Key fetch error:', error);
    return '';
  }
}

async function fetchGPTResponse(prompt) {
  const OPENAI_API_KEY = await fetchAPIKey();
  if (!OPENAI_API_KEY) {
    console.error('Missing OpenAI API Key');
    return 'Error: Missing API Key';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
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

    return data.choices[0].text.trim();
  } catch (error) {
    console.error('Fetch error:', error);
    return 'Fetch error occurred';
  }
}

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
