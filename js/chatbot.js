const OPENAI_ENDPOINT = 'http://localhost:3000/ask'; // Your protected endpoint
const portfolioFAQ = {
  "skills": "My technical skills include: Full Stack Development (JavaScript, Python, Java), AI/ML (TensorFlow, PyTorch), and Cloud DevOps (AWS, Docker).",
  "experience": "I have X years of experience in software development with a focus on AI-driven solutions.",
  "projects": "Check out my Solutions tab for detailed project information!",
  "education": "I hold an Honours degree in Computer Science and Information Technology from Lobachevsky State University of Nizhny Novgorog Russian Fed \n I matriculated from Magwagwaza High School, a school located down in Acornhoek Mpumalanga"
  };
  document.querySelector('.chat-icon').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('chatbot-container').classList.toggle('active');
  });
  
  document.getElementById('close-chat').addEventListener('click', () => {
  document.getElementById('chatbot-container').classList.remove('active');
  });
  
  // Chat Logic
  document.getElementById('send-btn').addEventListener('click', processMessage);
  document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') processMessage();
  });
  
  function processMessage() {
  const input = document.getElementById('user-input').value.toLowerCase();
  const messages = document.getElementById('chat-messages');
  
  // Add user message
  messages.innerHTML += `<div class="user-msg">${input}</div>`;
  
  // Bot response
  let response = "I'm sorry, I can answer questions about: skills, experience, projects, education.";
  Object.keys(portfolioFAQ).forEach(key => {
    if(input.includes(key)) response = portfolioFAQ[key];
  });
  
  // Add bot response
  messages.innerHTML += `<div class="bot-msg">${response}</div>`;
  
  // Clear input
  document.getElementById('user-input').value = '';
  messages.scrollTop = messages.scrollHeight;
  }

async function processMessage() {
  const input = document.getElementById('user-input').value.trim();
  if (!input) return;

  const messages = document.getElementById('chat-messages');
  
  // Add user message
  messages.innerHTML += `<div class="user-msg">${input}</div>`;
  
  // Check local FAQ first
  let response = portfolioFAQ[Object.keys(portfolioFAQ).find(key => input.toLowerCase().includes(key))];
  
  // If no local answer, query OpenAI
  if (!response) {
    messages.innerHTML += `<div class="typing-indicator">...</div>`;
    
    try {
      const aiResponse = await fetch(OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          context: "I'm a portfolio assistant. The user is Vernard Ngomane, a Computer Science graduate with expertise in AI/ML and Full Stack Development. Limit responses to 2-3 sentences."
        })
      });

      if (!aiResponse.ok) throw new Error('API error');
      const data = await aiResponse.json();
      response = data.answer || "I couldn't find an answer to that question.";
    } catch (error) {
      response = "Sorry, I'm having trouble connecting to the knowledge base.";
    }
    
    document.querySelector('.typing-indicator').remove();
  }

  // Add response
  messages.innerHTML += `<div class="bot-msg">${response}</div>`;
  messages.scrollTop = messages.scrollHeight;
  document.getElementById('user-input').value = '';
}