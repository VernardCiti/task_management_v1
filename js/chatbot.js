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
  async function processMessage() {
    const input = document.getElementById('user-input').value.trim();
    if (!input) return;
  
    const messages = document.getElementById('chat-messages');
    
    // Clear input immediately
    document.getElementById('user-input').value = '';
    
    // Add user message safely
    messages.innerHTML += `<div class="user-msg">${input}</div>`;
  
    try {
      // Check local FAQ first
      let response = Object.entries(portfolioFAQ).find(([key]) => 
        input.toLowerCase().includes(key)
      )?.[1];
  
      if (!response) {
        // Show typing indicator
        messages.innerHTML += `<div class="typing-indicator">...</div>`;
        
        // API call with error handling
        const aiResponse = await fetch('http://localhost:3000/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: input,
            context: "Vernard Ngomane's Portfolio Assistant - Computer Science graduate with AI/ML expertise"
          }),
          mode: 'cors'
        });
  
        if (!aiResponse.ok) throw new Error(`HTTP ${aiResponse.status}`);
        const data = await aiResponse.json();
        response = data.answer;
      }
  
      messages.innerHTML += `<div class="bot-msg">${response}</div>`;
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
  
  

// Fix duplicate function and CORS handling
// async function processMessage() {
//   const input = document.getElementById('user-input').value.trim();
//   if (!input) return;

//   const messages = document.getElementById('chat-messages');
  
//   // Clear input immediately
//   document.getElementById('user-input').value = '';
  
//   // Add user message safely
//   messages.innerHTML += `<div class="user-msg">${input}</div>`;

//   try {
//     // Check local FAQ first
//     let response = Object.entries(portfolioFAQ).find(([key]) => 
//       input.toLowerCase().includes(key)
//     )?.[1];

//     if (!response) {
//       // Show typing indicator
//       messages.innerHTML += `<div class="typing-indicator">...</div>`;
      
//       // API call with error handling
//       const aiResponse = await fetch('http://localhost:3000/ask', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: input,
//           context: "Vernard Ngomane's Portfolio Assistant - Computer Science graduate with AI/ML expertise"
//         })
//       });

//       if (!aiResponse.ok) throw new Error(`HTTP ${aiResponse.status}`);
//       const data = await aiResponse.json();
//       response = data.answer;
//     }

//     messages.innerHTML += `<div class="bot-msg">${response}</div>`;
//   } catch (error) {
//     console.error('Client Error:', error);
//     messages.innerHTML += `<div class="bot-msg error">Service temporarily unavailable</div>`;
//   } finally {
//     // Remove typing indicator
//     const typing = document.querySelector('.typing-indicator');
//     if (typing) typing.remove();
    
//     // Scroll to bottom
//     messages.scrollTop = messages.scrollHeight;
//   }
// }