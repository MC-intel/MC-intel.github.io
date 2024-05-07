/**
 * HTTP GET endpoint that returns the OpenAI API key.
 *
 * @param {object} e - The event object (request data).
 * @return {ContentService} - The API key as plain text.
 */
function doGet(e) {
 
  var allowedOrigin = "https://mc-intel.github.io/subpage.html";

  // Set CORS headers
  var headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Content-Type': 'application/json'
  };


  var apiKey = " ";
  return ContentService.createTextOutput(JSON.stringify({ apiKey: apiKey }))
                       .setMimeType(ContentService.MimeType.JSON)
                       .setHeaders(headers);
}
