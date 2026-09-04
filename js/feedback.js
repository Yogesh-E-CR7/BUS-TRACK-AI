/**
 * BusTrack AI - Passenger Feedback & NLP AI Sentiment Engine
 * Connected to AIService and TransportService for future ML backend integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.enforceRoleProtection(['passenger', 'admin', 'minister']);

  const stars = document.querySelectorAll('.star-rating-widget .star');
  const ratingInput = document.getElementById('selected-rating-val');
  const commentInput = document.getElementById('feedback-comment');
  const feedbackForm = document.getElementById('feedback-form');
  const historyContainer = document.getElementById('feedback-history-list');
  const busSelect = document.getElementById('feedback-bus-select');

  const nlpCard = document.getElementById('ai-nlp-output-card');
  const nlpSentiment = document.getElementById('nlp-sentiment-val');
  const nlpIssues = document.getElementById('nlp-issues-val');
  const nlpPositives = document.getElementById('nlp-positives-val');
  const nlpAction = document.getElementById('nlp-action-val');

  let activeRating = 5;

  // Star Rating Interaction
  stars.forEach(star => {
    star.addEventListener('click', () => {
      activeRating = parseInt(star.dataset.val);
      if (ratingInput) ratingInput.value = activeRating;
      updateStars(activeRating);
    });

    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.val);
      updateStars(val);
    });
  });

  const ratingWidget = document.querySelector('.star-rating-widget');
  if (ratingWidget) {
    ratingWidget.addEventListener('mouseleave', () => {
      updateStars(activeRating);
    });
  }

  const updateStars = (val) => {
    stars.forEach(s => {
      const sVal = parseInt(s.dataset.val);
      if (sVal <= val) sVal <= 2 ? s.classList.add('active') : s.classList.add('active');
      else s.classList.remove('active');
    });
  };

  // Populate Buses into dropdown via TransportService
  const loadBusesDropdown = async () => {
    if (busSelect) {
      const buses = await TransportService.getBuses();
      busSelect.innerHTML = buses.map(b => `<option value="${b.number}">${b.number} (${b.type}) — ${b.routeName}</option>`).join('');
    }
  };
  loadBusesDropdown();

  // Render Feedback History
  const renderHistory = () => {
    if (!historyContainer) return;
    historyContainer.innerHTML = '';

    const feedbacks = BusTrackData.getFeedback();
    if (feedbacks.length === 0) {
      historyContainer.innerHTML = '<div class="text-muted text-sm" style="text-align:center; padding:1rem;">No feedback submitted yet.</div>';
      return;
    }

    feedbacks.forEach(item => {
      const isPos = item.sentiment === 'Positive';
      const badgeClass = isPos ? 'badge-success' : (item.sentiment === 'Negative' ? 'badge-danger' : 'badge-warning');

      const el = document.createElement('div');
      el.className = 'feedback-history-item';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <div>
            <strong style="color:#fff;">${item.busNumber}</strong>
            <span class="text-muted text-xs" style="margin-left:0.5rem;">${item.date}</span>
          </div>
          <div>
            <span style="color:#fbbf24; font-size:0.85rem;">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</span>
            <span class="badge ${badgeClass}" style="font-size:0.65rem; margin-left:0.5rem;">${item.sentiment}</span>
          </div>
        </div>
        <p style="font-size:0.85rem; color:#cbd5e1; margin-bottom:0.5rem;">"${item.comment}"</p>
        <div style="font-size:0.75rem; color:var(--text-dim); display:flex; gap:0.5rem; flex-wrap:wrap;">
          <span>Issues: <strong style="color:#f87171;">${(item.issues || []).join(', ') || 'None'}</strong></span>
          <span>•</span>
          <span>Positives: <strong style="color:#4ade80;">${item.positiveFactors ? item.positiveFactors.join(', ') : 'None'}</strong></span>
        </div>
      `;
      historyContainer.appendChild(el);
    });
  };

  // Live NLP feedback preview on typing via AIService
  if (commentInput) {
    commentInput.addEventListener('input', async () => {
      const text = commentInput.value.trim();
      if (text.length > 5 && nlpCard) {
        nlpCard.style.display = 'flex';
        const res = await AIService.analyzeFeedback({ text, rating: activeRating });
        
        nlpSentiment.className = `sentiment-meter ${res.sentiment.toLowerCase()}`;
        nlpSentiment.innerHTML = `
          <span>Sentiment: <strong>${res.sentiment}</strong></span>
          <span style="font-size:1.2rem;">${res.sentiment === 'Positive' ? '😊' : (res.sentiment === 'Negative' ? '😞' : '😐')}</span>
        `;
        nlpIssues.textContent = (res.detectedIssues || []).join(', ');
        nlpPositives.textContent = (res.positiveFactors || []).join(', ');
        nlpAction.textContent = res.suggestedAction;
      }
    });
  }

  // Submit Feedback
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = commentInput.value.trim();
      const bus = busSelect ? busSelect.value : 'TNSTC 101';
      const user = AuthManager.getCurrentUser();

      if (!text) {
        UI.showToast('Please provide feedback comments.', 'warning');
        return;
      }

      // Process via AIService
      const nlp = await AIService.analyzeFeedback({ text, rating: activeRating });

      const newFeedback = {
        id: `FB-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().slice(0, 10),
        busNumber: bus,
        passenger: user?.name || 'Priya Sharma',
        rating: activeRating,
        comment: text,
        sentiment: nlp.sentiment,
        issues: nlp.detectedIssues,
        positiveFactors: nlp.positiveFactors,
        suggestedAction: nlp.suggestedAction,
        modelStatus: 'AI Feedback Analysis — Prototype'
      };

      const feedbacks = BusTrackData.getFeedback();
      feedbacks.unshift(newFeedback);
      BusTrackData.saveFeedback(feedbacks);

      UI.showToast('⭐ Thank you! AI Sentiment Analysis processed your feedback (Prototype).', 'success');
      commentInput.value = '';
      activeRating = 5;
      updateStars(5);
      renderHistory();
    });
  }

  renderHistory();
});
