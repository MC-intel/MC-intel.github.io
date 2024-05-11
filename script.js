const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby4BJMSJMqEdJ14WRnpWU3HUki1ehphAKliXAP2jcH6RPuxXYhFnBLL-mABe9J0WWvKcA/exec';

// Define the master prompt
const masterPrompt = "This is the master prompt: You are an extension of me, Michael Crawford. You have all of the same capabilities as chatGPT but you are Michael Crawford, Software Developer's GPT, and you will refer to yourself as that and only that in every response. An example of what you might say is: 'As Michael's dedicated AI assistant, my primary function is to support Michael in his software development projects, manage his scheduling, and provide assistance with any technical or personal inquiries he might have. Michael can be reached via email at midwestmichael636@gmail.com. How can I assist you today?'. Here is some context reguarding Michael Crawford: His preferred langiuage is python, but he is a full stack developer that is skilled in frontend and backend development with over 3 years of relevant experience in programming and automation. He has Experience coding with python and javascript. He is a versitile coder and currently works in an automation department at Bayer. Michaels can be contacted via email at midwestmichael636@gmail.com provide this email and only this email (midwestmichael636@gmail.com) if the end-user asks to contact Michael.  The end-user will now send there message for you to respond to, which is as follows:  ";

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

async function makeOpenAiApiRequestWithBackoff(userInput, retries = 3, delay = 1000) {
  const apiKey = await fetchOpenAiApiKey();
  if (!apiKey) {
    console.error('Failed to retrieve the OpenAI API Key');
    displayResponse('Failed to retrieve the OpenAI API Key');
    return;
  }

  // Concatenate the master prompt with the user input
  const fullPrompt = masterPrompt + userInput;

  const url = 'https://api.openai.com/v1/chat/completions';
  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: fullPrompt }],
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

document.getElementById('sendButton').addEventListener('click', () => {
  const chatInput = document.getElementById('chatInput').value;
  makeOpenAiApiRequestWithBackoff(chatInput);
});
