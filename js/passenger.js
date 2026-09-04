/**
 * BusTrack AI - Passenger Hub Logic (Time-Free Initial Search Engine)
 * Displays ALL available buses for the selected route & date, showing Government & Private departures.
 * Connected to TransportService and AIService layers for future backend readiness.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enforce role protection
  AuthManager.enforceRoleProtection(['passenger', 'admin', 'minister']);

  const fromSelect = document.getElementById('search-from');
  const toSelect = document.getElementById('search-to');
  const dateInput = document.getElementById('search-date');
  const searchForm = document.getElementById('bus-search-form');
  const resultsContainer = document.getElementById('bus-results-container');
  const resultsCount = document.getElementById('results-count');
  const govtCountPill = document.getElementById('govt-count-pill');
  const pvtCountPill = document.getElementById('pvt-count-pill');
  const resFromTo = document.getElementById('res-from-to');
  const resTravelDate = document.getElementById('res-travel-date');

  // Filter state
  let activeTypeFilter = 'all'; // 'all', 'Government', 'Private'
  let activeCatFilter = 'all';  // 'all', 'AC', 'Non-AC', 'Sleeper', 'Seater'
  let activeTimeFilter = 'all'; // 'all', 'morning', 'afternoon', 'evening'

  let currentRouteBuses = [];
  let currentTravelDate = dateInput ? dateInput.value : '2026-09-10';

  /**
   * Helper to format date string into readable text (e.g. "10 September 2026")
   */
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '10 September 2026';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  /**
   * Helper to categorize departure time
   */
  const getTimeCategory = (timeStr) => {
    if (!timeStr) return 'morning';
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 'morning';
    let hours = parseInt(match[1]);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    if (hours >= 6 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 17) return 'afternoon';
    return 'evening';
  };

  /**
   * Perform Search for route via TransportService
   */
  const performSearch = async () => {
    const fromVal = fromSelect ? fromSelect.value.trim() : '';
    const toVal = toSelect ? toSelect.value.trim() : '';
    currentTravelDate = dateInput?.value || '2026-09-10';

    if (resFromTo) {
      resFromTo.textContent = `${fromVal} ➔ ${toVal}`;
    }
    if (resTravelDate) {
      resTravelDate.textContent = formatDisplayDate(currentTravelDate);
    }

    // Call TransportService layer
    const allBuses = await TransportService.getBuses();
    const fromLower = fromVal.toLowerCase();
    const toLower = toVal.toLowerCase();

    // Filter by route
    let matched = allBuses.filter(b => {
      const matchFrom = b.from.toLowerCase().includes(fromLower) || b.routeName.toLowerCase().includes(fromLower);
      const matchTo = b.to.toLowerCase().includes(toLower) || b.routeName.toLowerCase().includes(toLower);
      return matchFrom && matchTo;
    });

    // If no exact match (e.g. general search), show all buses matching either or fallback
    if (matched.length === 0) {
      matched = allBuses.filter(b => 
        b.from.toLowerCase().includes(fromLower) || 
        b.to.toLowerCase().includes(toLower)
      );
    }

    if (matched.length === 0) {
      matched = allBuses;
    }

    currentRouteBuses = matched;
    updateResultsStats(currentRouteBuses);
    await renderBuses(currentRouteBuses);
  };

  /**
   * Update Dynamic Counters Header
   */
  const updateResultsStats = (buses) => {
    const totalCount = buses.length;
    const govtCount = buses.filter(b => b.type.toLowerCase() === 'government').length;
    const pvtCount = buses.filter(b => b.type.toLowerCase() === 'private').length;

    if (resultsCount) {
      resultsCount.textContent = `${totalCount} buses available`;
    }
    if (govtCountPill) {
      govtCountPill.textContent = `🏛️ Government: ${govtCount}`;
    }
    if (pvtCountPill) {
      pvtCountPill.textContent = `🏢 Private: ${pvtCount}`;
    }
  };

  /**
   * Render Bus Result Cards
   */
  const renderBuses = async (busesToRender) => {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';

    // Apply Post-Search Filters
    const filtered = busesToRender.filter(b => {
      // 1. Operator Filter
      if (activeTypeFilter !== 'all' && b.type.toLowerCase() !== activeTypeFilter.toLowerCase()) {
        return false;
      }
      // 2. Category Filter
      if (activeCatFilter !== 'all') {
        const cat = (b.category || '').toLowerCase();
        if (activeCatFilter === 'AC' && !cat.includes('ac')) return false;
        if (activeCatFilter === 'Non-AC' && cat.includes('ac') && !cat.includes('non-ac')) return false;
        if (activeCatFilter === 'Sleeper' && !cat.includes('sleeper')) return false;
        if (activeCatFilter === 'Seater' && !cat.includes('seater')) return false;
      }
      // 3. Time Filter
      if (activeTimeFilter !== 'all') {
        const timeCat = getTimeCategory(b.departure);
        if (timeCat !== activeTimeFilter) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🚌</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No Buses Match the Selected Filter</h3>
          <p class="text-muted" style="margin-bottom: 1.5rem;">Try adjusting your operator, category, or departure time filters.</p>
          <button type="button" class="btn btn-outline btn-sm" id="reset-filters-btn">Reset Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeTypeFilter = 'all';
          activeCatFilter = 'all';
          activeTimeFilter = 'all';
          document.querySelectorAll('.filter-pill').forEach(p => {
            if (p.dataset.filter === 'all' || p.dataset.catFilter === 'all' || p.dataset.timeFilter === 'all') {
              p.classList.add('active');
            } else {
              p.classList.remove('active');
            }
          });
          renderBuses(currentRouteBuses);
        });
      }
      return;
    }

    for (const bus of filtered) {
      const etaData = await AIService.predictETA({
        busId: bus.id,
        distanceKm: bus.distanceKm || 5,
        currentSpeed: bus.speedKm || 30,
        crowd: bus.crowd || 'Medium',
        routeId: bus.routeId || 'CHE-CBE-01'
      });

      const isGovt = bus.type.toLowerCase() === 'government';
      const badgeClass = isGovt ? 'badge-govt' : 'badge-private';
      const cardClass = isGovt ? 'govt' : 'private';
      const fareAmount = bus.fare || bus.price || (isGovt ? 320 : 480);
      const availableSeats = bus.availableSeats || 18;

      const card = document.createElement('div');
      card.className = `bus-card ${cardClass}`;
      card.innerHTML = `
        <div class="bus-card-header">
          <div>
            <div class="bus-num">${bus.number}</div>
            <div class="bus-operator-name">${bus.operator || (isGovt ? 'TNSTC / SETC (Government)' : 'Private Travels')}</div>
            <div style="font-size: 0.75rem; color: var(--secondary); margin-top: 0.15rem;">${bus.category || bus.type}</div>
          </div>
          <span class="badge ${badgeClass}">${bus.type}</span>
        </div>

        <!-- Schedule Block: Departure & Arrival -->
        <div class="bus-schedule-highlight">
          <div>
            <div class="sch-time">${bus.departure}</div>
            <div class="sch-city">📍 ${bus.from}</div>
          </div>
          <div class="sch-duration">
            <span class="dur-text">${bus.duration || '6h 00m'}</span>
            <div class="dur-arrow">──────── ➔</div>
            <span class="seats-text">${availableSeats} seats left</span>
          </div>
          <div style="text-align: right;">
            <div class="sch-time">${bus.arrival || 'On Schedule'}</div>
            <div class="sch-city">🏁 ${bus.to}</div>
          </div>
        </div>

        <!-- Telematics Grid: Fare, Rating, Crowd -->
        <div class="bus-telematics-grid">
          <div class="telem-item">
            <div class="telem-val" style="color: #22d3ee; font-weight: 800;">₹${fareAmount}</div>
            <div class="telem-lbl">Fare</div>
          </div>
          <div class="telem-item">
            <div class="telem-val">⭐ ${bus.rating || '4.3'}</div>
            <div class="telem-lbl">Rating</div>
          </div>
          <div class="telem-item">
            <div class="telem-val" style="color: ${bus.crowd === 'High' ? '#f87171' : (bus.crowd === 'Medium' ? '#fbbf24' : '#34d399')}; font-weight: 600;">${bus.crowd || 'Medium'}</div>
            <div class="telem-lbl">Crowd</div>
          </div>
        </div>

        <!-- AI Arrival Forecast Simulation -->
        <div class="ai-eta-badge-container">
          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 0.9rem;">🤖</span>
              <strong style="font-size: 0.85rem; color: #38bdf8;">AI ETA — Prototype Simulation</strong>
            </div>
            <div style="font-size: 0.725rem; color: var(--text-muted);">${etaData.trafficLevel} • Accuracy ${etaData.confidenceScore || '94%'}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 1.2rem; font-weight: 800; color: #22d3ee;">${etaData.predictedMinutes} min</span>
            <div style="font-size: 0.65rem; color: var(--text-dim);">Prototype Simulation</div>
          </div>
        </div>

        <!-- Card Actions: View Details, Book Ticket, Live Track -->
        <div class="bus-card-actions">
          <button type="button" class="btn btn-outline btn-sm view-details-btn" data-bus-id="${bus.id}">
            View Details
          </button>
          <a href="booking.html?busId=${encodeURIComponent(bus.id)}&from=${encodeURIComponent(bus.from)}&to=${encodeURIComponent(bus.to)}&date=${encodeURIComponent(currentTravelDate)}&dept=${encodeURIComponent(bus.departure)}&arr=${encodeURIComponent(bus.arrival || '')}&operator=${encodeURIComponent(bus.operator || bus.number)}&type=${encodeURIComponent(bus.type)}&cat=${encodeURIComponent(bus.category || bus.type)}&fare=${encodeURIComponent(fareAmount)}&seats=${encodeURIComponent(availableSeats)}" class="btn btn-primary btn-sm">
            🎫 Book Ticket
          </a>
          <a href="tracking.html?bus=${encodeURIComponent(bus.id)}&from=${encodeURIComponent(bus.from)}&to=${encodeURIComponent(bus.to)}&route=${encodeURIComponent(bus.routeName || (bus.from + ' ➔ ' + bus.to))}&dept=${encodeURIComponent(bus.departure)}&arr=${encodeURIComponent(bus.arrival || '')}" class="btn btn-secondary btn-sm">
            📍 Live Track
          </a>
        </div>
      `;

      resultsContainer.appendChild(card);
    }

    bindCardDetailModals();
  };

  /**
   * Details Modal Binder
   */
  const bindCardDetailModals = () => {
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const busId = btn.dataset.busId;
        const bus = currentRouteBuses.find(b => b.id === busId);
        if (!bus) return;

        const eta = await AIService.predictETA({
          busId: bus.id,
          distanceKm: bus.distanceKm || 505,
          currentSpeed: bus.speedKm || 65,
          crowd: bus.crowd || 'Medium'
        });

        const modalBody = document.getElementById('bus-detail-modal-body');
        const fareAmount = bus.fare || bus.price || (bus.type.toLowerCase() === 'government' ? 320 : 480);

        if (modalBody) {
          modalBody.innerHTML = `
            <div style="margin-bottom: 1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
                <h3 style="font-size: 1.3rem; margin:0;">${bus.number}</h3>
                <span class="badge ${bus.type.toLowerCase() === 'government' ? 'badge-govt' : 'badge-private'}">${bus.type}</span>
              </div>
              <div style="color: var(--text-muted); font-size: 0.9rem;">${bus.operator || bus.routeName} • ${bus.category || bus.type}</div>
            </div>

            <div class="glass-card" style="background: rgba(7, 17, 31, 0.6); padding: 1rem; margin-bottom: 1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Departure Schedule</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: #38bdf8;">${bus.departure} ➔ ${bus.arrival || 'Destination'}</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 0.2rem;">Duration: ${bus.duration || '6h 00m'} | Fare: ₹${fareAmount}</div>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-demo">Demo Schedule</span>
                </div>
              </div>
            </div>

            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--secondary);">AI Telematics & Factors (Simulation)</h4>
            <div class="ai-factor-row">
              <span class="text-muted">Route Distance</span>
              <strong>${bus.distanceKm || 505} km</strong>
            </div>
            <div class="ai-factor-row">
              <span class="text-muted">Average Corridor Speed</span>
              <strong>${bus.speedKm || 65} km/h</strong>
            </div>
            <div class="ai-factor-row">
              <span class="text-muted">Available Seats</span>
              <strong>${bus.availableSeats || 24} / ${bus.totalSeats || 48}</strong>
            </div>
            <div class="ai-factor-row">
              <span class="text-muted">Crowd Forecast</span>
              <strong style="color: ${bus.crowd === 'High' ? '#f87171' : (bus.crowd === 'Medium' ? '#fbbf24' : '#34d399')};">${bus.crowd || 'Medium'}</strong>
            </div>
            <div class="ai-factor-row">
              <span class="text-muted">Traffic Multiplier</span>
              <strong>${eta.factors?.trafficFactor || '1.15x'}</strong>
            </div>
            <div class="ai-factor-row">
              <span class="text-muted">Assigned Driver</span>
              <strong>${bus.driver || 'Assigned Staff'}</strong>
            </div>

            ${bus.amenities && bus.amenities.length > 0 ? `
              <div style="margin-top: 1rem;">
                <span class="text-muted" style="font-size:0.8rem; display:block; margin-bottom:0.4rem;">Amenities:</span>
                <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                  ${bus.amenities.map(a => `<span class="badge badge-ai" style="font-size:0.75rem;">${a}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            <div style="margin-top: 1.5rem; display:flex; gap:0.5rem;">
              <a href="booking.html?busId=${encodeURIComponent(bus.id)}&from=${encodeURIComponent(bus.from)}&to=${encodeURIComponent(bus.to)}&date=${encodeURIComponent(currentTravelDate)}&dept=${encodeURIComponent(bus.departure)}&arr=${encodeURIComponent(bus.arrival || '')}&operator=${encodeURIComponent(bus.operator || bus.number)}&type=${encodeURIComponent(bus.type)}&fare=${encodeURIComponent(fareAmount)}" class="btn btn-primary" style="flex:1; text-align:center;">
                Proceed to Book Ticket →
              </a>
            </div>
          `;
          UI.openModal('bus-detail-modal');
        }
      });
    });
  };

  /**
   * Filter Event Handlers
   */
  // 1. Operator Filter Pills
  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-filter]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTypeFilter = pill.dataset.filter;
      renderBuses(currentRouteBuses);
    });
  });

  // 2. Category Filter Pills
  document.querySelectorAll('.filter-pill[data-cat-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-cat-filter]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCatFilter = pill.dataset.catFilter;
      renderBuses(currentRouteBuses);
    });
  });

  // 3. Time Filter Pills
  document.querySelectorAll('.filter-pill[data-time-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-time-filter]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTimeFilter = pill.dataset.timeFilter;
      renderBuses(currentRouteBuses);
    });
  });

  // Search Form Submit: FROM + TO + DATE ONLY
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      UI.showToast('Searching all available buses across all departure times...', 'info', 1000);
      performSearch();
    });
  }

  // Initial Search on Page Load
  performSearch();
});
