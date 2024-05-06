const OPENAI_API_KEY = 'sk-proj-kTEAW1yFcCt6zRmHPynYT3BlbkFJk5SsTvVVJWinD4FsHmaf';

const resumeData = `
Michael Crawford
922 Stone Crossing Dr.
Wentzville, MO 63385
Mobile: (636) 357-7823
Email: acemcemail@gmail.com, midwestmichael636@gmail.com

LinkedIn: www.linkedin.com/in/michael-crawford-b49668219/ 
GitHub: https://github.com/MC-intel
Webpage: https://mc-intel.github.io/ 
Fiverr: https://www.fiverr.com/michael_dev_stl 

ㅡ
Summary:
Comfortable in dynamic, and rigid environments alike. Team player.
An emphasis of skill in: Programming, Automation, Maintenance, and Project Management. 
ㅡ
Experience
Bayer,  Hazelwood, MO;  Chesterfield, MO  Maintenance Supervisor- Continuity and Innovation   full-time
Jan 2022-

Open/close maintenance tickets, and determine escalations to third-party callouts. 
Troubleshoot issues to provide cost-effective solutions. Exceed KPI turnaround times.
Monitor assets and craft reports using Maintenance Connection, and other in-house software.
Operate automation equipment as an end-user when necessary. 
Perform data analysis using Python and Power BI.
Reimagine and streamline existing procedures with a LEAN mindset.

Assisted project managers in spearheading automation deployment and new SOPs. 
Personalized and scaled applications using internal cloud architecture. (Git, AWS, etc.)
Developed IoT systems and applications with Agile software engineering.
Used Maint. Connection API and Python to automate asset monitoring processes. 
Used Microsoft Power Apps to automate the vendor scheduling process. 
General Motors, Wentzville, MO  QA/Assembly- Quality Assurance   full-time
Mar 2021-Nov 2021,

Supported assembly line to maintain production flow. 
Prepared vehicles for shipment from the QA department and inspected parts for the Chassis department. Operated automation equipment.
Attended focused staff meetings and quality trainings. 
BJC Hospital, St. Charles, MO Patient Care Tech- Healthcare   part-time
Oct 2018-Oct 2020,

Executed certified skills and assisted healthcare personnel with acute care. 
Documented data and updated patient files via EPIC.
Excelled in collecting blood samples. Instructed orientees regarding blood draw methods, and dynamic safety procedures.
Oversaw supply inventory.
Renewed certifications. Attended focused staff meetings and related training.

UPS, Earth City, MO   Package Handler/Preload- Logistics   seasonal
Oct 2018-May 2019,

Scanned and sorted high volumes of parcels with limited time. Interacted with scanning software to prepare loads for shipment. Helped reduce department misloads to <1%.
ㅡ
Education:
SCC: community college, St. Peters, MO- some college credit  
Aug 2019-
Christian Hospital, St. Louis, MO- Vocational Certifications 
Jan 2020-Jul 2020
Holt HighSchool, Wentzville, MO —High School Diploma 
2014- May 2018
Lewis and Clark Tech, St. Charles, MO  —Vocational Certifications  Aug 2017- May 2018
ㅡ
Highlights:
Familiar:  LEAN processes, Agile and Dev-Ops, Data Integrity, Quality and Safety, Troubleshooting
Proficient:  Python, JavaScript, Bash
EMS training: BLS Certifications (CPR/AED)
BJC Lab-Certified Trainer: (phlebotomy)
Blood Drive Organizer/Participant via SkillsUSA
Software development experience using:
Windows, Linux, Ras-Pi, Git, Docker, AWS, Azure, GoogleCloud, Vercel, React, Node.js, Flask, MongoDB, Kaggle, Huggingface, OpenAi and OpenAPI.
`;

async function fetchGPTResponse(prompt) {
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
