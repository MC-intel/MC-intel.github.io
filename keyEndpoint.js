/**
 Initializes and retrieves the OpenAI API Key from the Properties Service.

 */
function getOpenAiApiKey() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OpenAI API Key not found in Properties Service. Please add it first.');
  }
  return apiKey;
}

/**
 * Web app endpoint that returns the OpenAI API Key in JSON format.

 */
function doGet() {
  const apiKey = getOpenAiApiKey();
  const jsonResponse = {
    'api_key': apiKey
  };

  return ContentService.createTextOutput(JSON.stringify(jsonResponse))
    .setMimeType(ContentService.MimeType.JSON);
}
