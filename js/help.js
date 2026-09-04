/**
 * BusTrack AI - Help Center & Support Desk
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('help-search-input');
  const categoryBtns = document.querySelectorAll('.faq-category-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  const supportForm = document.getElementById('support-ticket-form');

  let activeCategory = 'all';

  // Toggle FAQ Accordion
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // Category Filtering
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      filterFAQs();
    });
  });

  // Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterFAQs();
    });
  }

  const filterFAQs = () => {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    faqItems.forEach(item => {
      const cat = item.dataset.category;
      const text = item.textContent.toLowerCase();
      const matchCat = (activeCategory === 'all' || cat === activeCategory);
      const matchQuery = !query || text.includes(query);

      if (matchCat && matchQuery) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  };

  // Support Ticket Submit
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('support-name').value.trim();
      const email = document.getElementById('support-email').value.trim();
      const type = document.getElementById('support-type').value;
      const desc = document.getElementById('support-desc').value.trim();

      const ticket = {
        id: `TICK-${Date.now().toString().slice(-4)}`,
        name,
        email,
        type,
        desc,
        time: new Date().toLocaleString(),
        status: 'Open'
      };

      const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
      tickets.unshift(ticket);
      localStorage.setItem('supportTickets', JSON.stringify(tickets));

      UI.showToast(`✅ Support ticket ${ticket.id} logged! Our help desk will respond shortly.`, 'success');
      supportForm.reset();
    });
  }
});
