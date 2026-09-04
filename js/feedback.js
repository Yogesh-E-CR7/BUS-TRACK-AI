/**
 * BusTrack AI - Passenger Feedback & NLP AI Sentiment Engine
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

  /**
   * Prototype NLP Sentiment & Issue Classification Engine
   * Technique: Multilingual NLP Sentiment Analysis (Lexicon + Keyword Extraction Rulebase)
   */
  const analyzeFeedbackNLP = (text, rating) => {
    const lower = text.toLowerCase();
    
    // Sentiment calculation
    let sentiment = 'Neutral';
    if (rating >= 4) sentiment = 'Positive';
    else if (rating <= 2) sentiment = 'Negative';
    else {
      if (lower.includes('good') || lower.includes('great') || lower.includes('clean') || lower.includes('fast') || lower.includes('helpful')) {
        sentiment = 'Positive';
      } else if (lower.includes('bad') || lower.includes('late') || lower.includes('crowded') || lower.includes('dirty') || lower.includes('rude') || lower.includes('delay')) {
        sentiment = 'Negative';
      }
    }

    // Issues detection
    const issues = [];
    if (lower.includes('late') || lower.includes('delay') || lower.includes('slow') || lower.includes('waiting')) {
      issues.push('Schedule Delay');
    }
    if (lower.includes('crowd') || lower.includes('rush') || lower.includes('standing') || lower.includes('no seat')) {
      issues.push('Overcrowding');
    }
    if (lower.includes('rude') || lower.includes('rash') || lower.includes('speeding') || lower.includes('behavior')) {
      issues.push('Driver Behavior');
    }
    if (lower.includes('dirty') || lower.includes('clean') && lower.includes('not') || lower.includes('smell')) {
      issues.push('Cleanliness Defect');
    }
    if (lower.includes('fare') || lower.includes('cost') || lower.includes('expensive') || lower.includes('high')) {
      issues.push('High Fare');
    }
    if (lower.includes('ac') && (lower.includes('not') || lower.includes('hot') || lower.includes('warm'))) {
      issues.push('AC Malfunction');
    }
    if (issues.length === 0 && sentiment === 'Negative') {
      issues.push('General Service Dissatisfaction');
    } else if (issues.length === 0) {
      issues.push('None');
    }

    // Positive factors detection
    const positives = [];
    if (lower.includes('on time') || lower.includes('punctual') || lower.includes('fast')) {
      positives.push('On-Time Arrival');
    }
    if (lower.includes('polite') || lower.includes('helpful') || lower.includes('smooth driver') || lower.includes('good driver')) {
      positives.push('Helpful Driver');
    }
    if (lower.includes('clean') && !lower.includes('not')) {
      positives.push('Clean Bus Interior');
    }
    if (lower.includes('ac') && (lower.includes('good') || lower.includes('cool') || lower.includes('chilled'))) {
      positives.push('Comfortable AC');
    }
    if (positives.length === 0 && sentiment === 'Positive') {
      positives.push('Smooth Overall Experience');
    } else if (positives.length === 0) {
      positives.push('None');
    }

    // Suggested Action
    let suggestedAction = 'Maintain regular fleet schedule and driver training standards.';
    if (issues.includes('Overcrowding') || issues.includes('Schedule Delay')) {
      suggestedAction = 'Increase peak-hour bus dispatch frequency on this corridor and add schedule buffer time.';
    } else if (issues.includes('Cleanliness Defect')) {
      suggestedAction = 'Schedule depot sanitization and cleaning review before next morning departure.';
    } else if (issues.includes('Driver Behavior')) {
      suggestedAction = 'Assign driver refresher workshop on commuter courtesy and defensive driving.';
    }

    return { sentiment, issues, positives, suggestedAction };
  };

  // Populate Buses into dropdown
  if (busSelect) {
    const buses = BusTrackData.getBuses();
    busSelect.innerHTML = buses.map(b => `<option value="${b.number}">${b.number} (${b.type}) — ${b.routeName}</option>`).join('');
  }

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
          <span>Issues: <strong style="color:#f87171;">${item.issues.join(', ')}</strong></span>
          <span>•</span>
          <span>Positives: <strong style="color:#4ade80;">${item.positiveFactors ? item.positiveFactors.join(', ') : 'None'}</strong></span>
        </div>
      `;
      historyContainer.appendChild(el);
    });
  };

  // Live NLP feedback preview on typing
  if (commentInput) {
    commentInput.addEventListener('input', () => {
      const text = commentInput.value.trim();
      if (text.length > 5 && nlpCard) {
        nlpCard.style.display = 'flex';
        const res = analyzeFeedbackNLP(text, activeRating);
        
        nlpSentiment.className = `sentiment-meter ${res.sentiment.toLowerCase()}`;
        nlpSentiment.innerHTML = `
          <span>Sentiment: <strong>${res.sentiment}</strong></span>
          <span style="font-size:1.2rem;">${res.sentiment === 'Positive' ? '😊' : (res.sentiment === 'Negative' ? '😞' : '😐')}</span>
        `;
        nlpIssues.textContent = res.issues.join(', ');
        nlpPositives.textContent = res.positives.join(', ');
        nlpAction.textContent = res.suggestedAction;
      }
    });
  }

  // Submit Feedback
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = commentInput.value.trim();
      const bus = busSelect.value;
      const user = AuthManager.getCurrentUser();

      if (!text) {
        UI.showToast('Please provide feedback comments.', 'warning');
        return;
      }

      const nlp = analyzeFeedbackNLP(text, activeRating);

      const newFeedback = {
        id: `FB-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().slice(0, 10),
        busNumber: bus,
        passenger: user?.name || 'Priya Sharma',
        rating: activeRating,
        comment: text,
        sentiment: nlp.sentiment,
        issues: nlp.issues,
        positiveFactors: nlp.positives
      };

      const feedbacks = BusTrackData.getFeedback();
      feedbacks.unshift(newFeedback);
      BusTrackData.saveFeedback(feedbacks);

      UI.showToast('⭐ Thank you! AI Sentiment Analysis processed your feedback.', 'success');
      commentInput.value = '';
      activeRating = 5;
      updateStars(5);
      renderHistory();
    });
  }

  renderHistory();
});
