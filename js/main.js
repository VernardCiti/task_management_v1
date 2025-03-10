document.addEventListener('DOMContentLoaded', () => {
    // Show Home tab by default
    document.querySelector('#home').classList.add('active');
    // Also set the "Home" link active if you want
    const homeLink = document.querySelector('.nav a[href="#home"]');
    if (homeLink) homeLink.classList.add('active');
  });
  
  // Listen globally for any anchor that starts with "#"
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;  // Not a hash link, ignore
  
    e.preventDefault(); // Prevent default jump
  
    // Which ID do we want to show?
    const targetId = link.getAttribute('href').slice(1);
  
    // 1) Remove "active" class from all nav links
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
  
    // 2) If there's a matching nav link for this hash, highlight it
    const matchingNavLink = document.querySelector(`.nav a[href="#${targetId}"]`);
    if (matchingNavLink) matchingNavLink.classList.add('active');
  
    // 3) Show the matching tab, hide the others
    document.querySelectorAll('.tab-content').forEach((content) => {
      content.classList.toggle('active', content.id === targetId);
    });
  });

  /// Chatbot////////////////////////////
