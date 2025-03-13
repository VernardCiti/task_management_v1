const OPENAI_ENDPOINT = 'http://localhost:3000/ask'; // Your protected endpoint

document.querySelector('.chat-icon').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('chatbot-container').classList.toggle('active');
});

document.getElementById('close-chat').addEventListener('click', () => {
  document.getElementById('chatbot-container').classList.remove('active');
});
const portfolioFAQ = {
  "skills": "My technical skills include: Full Stack Development (JavaScript, Python, Java), AI/ML (TensorFlow, PyTorch), and Cloud DevOps (AWS, Docker).",
  "experience": "I have X years of experience in software development with a focus on AI-driven solutions.",
  "projects": "Check out my Solutions tab for detailed project information!",
  "education": "I hold an Honours degree in Computer Science and Information Technology from Lobachevsky State University of Nizhny Novgorod, Russia. I matriculated from Magwagwaza High School in Acornhoek, Mpumalanga.",
  "contact": "You can reach me through the contact form on my website or via email at example@example.com.",
  "location": "I am based in Cape Town, Western Cape, South Africa.",
  "availability": "I am currently open to freelance projects and full-time opportunities. Feel free to get in touch!",
  "services": "I offer services in software development, AI/ML solutions, and cloud infrastructure management.",
  "testimonials": "See what my clients have to say in the Testimonials section of my website.",
  "blog": "I share insights on technology and development in my Blog section.",
  "social": "Connect with me on LinkedIn, Twitter, and GitHub through the links provided on my website.",
  "portfolio": "Browse my portfolio to see examples of my work and projects.",
  "certifications": "I hold certifications in AWS Solutions Architect and TensorFlow Developer.",
  "languages": "I am fluent in English and have conversational proficiency in Russian.",
  "hobbies": "In my free time, I enjoy hiking, photography, and contributing to open-source projects."
};
// Chat Logic
async function processMessage() {
  const input = document.getElementById('user-input').value.trim();
  if (!input) return;

  const messages = document.getElementById('chat-messages');

  // Clear input immediately
  document.getElementById('user-input').value = '';

  // Add user message safely
  messages.innerHTML += `<div class="user-msg">${input}</div>`;

  try {
    // Show typing indicator
    messages.innerHTML += `<div class="typing-indicator">...</div>`;
    
    // Update fetch request
const response = await fetch(OPENAI_ENDPOINT, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Add security header
  },
  body: JSON.stringify({ question: input }),
  credentials: 'same-origin',
  mode: 'no-cors'
});
    const data = await response.json();
    
    // Add source attribution
    const sourceTag = data.source === 'portfolio' ? 
      '<span class="source-tag">(from portfolio)</span>' : 
      '<span class="source-tag">(AI-powered response)</span>';
    
    messages.innerHTML += `
      <div class="bot-msg">
        ${data.answer}
        <div class="source">${sourceTag}</div>
      </div>
    `;

  } catch (error) {
    console.error('Client Error:', error);
    messages.innerHTML += `<div class="bot-msg error">Service temporarily unavailable</div>`;
  } finally {
    // Remove typing indicator
    const typing = document.querySelector('.typing-indicator');
    if (typing) typing.remove();

    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight;
  }
}

document.getElementById('send-btn').addEventListener('click', processMessage);

document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevents line break in textarea
    processMessage();
  }
});