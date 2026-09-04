/**
 * BusTrack AI - Long-Distance Booking, Seat Selection, Demo Payment & E-Ticket Engine
 * With Strict Indian Mobile Number Validation & Contact Verification
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.enforceRoleProtection(['passenger', 'admin', 'minister']);

  const searchForm = document.getElementById('ld-search-form');
  const busesContainer = document.getElementById('ld-buses-container');
  const fromInput = document.getElementById('ld-from');
  const toInput = document.getElementById('ld-to');
  const dateInput = document.getElementById('ld-date');
  const passengersInput = document.getElementById('ld-passengers');
  const filterPills = document.querySelectorAll('.ld-filter-pill');

  let activeTypeFilter = 'all';
  let longDistanceBuses = BusTrackData.getLongDistance();
  let currentSelectedBus = null;
  let selectedSeats = [];
  let currentPassengersCount = 1;

  // Booking Contact State
  let bookingContact = {
    name: '',
    email: '',
    mobile: ''
  };

  /**
   * Strict Indian Mobile Number Validator
   * Accepts: 9876543210, +91 9876543210, +919876543210, 09876543210
   * Rejects: empty, alphabetic, <10 digits, >10 digits
   */
  const validateIndianMobile = (mobileStr) => {
    if (!mobileStr || !mobileStr.trim()) {
      return { 
        valid: false, 
        message: 'Mobile number is required to complete your booking.' 
      };
    }
    
    // Strip spaces, dashes, parentheses
    const cleaned = mobileStr.trim().replace(/[\s\-\(\)]/g, '');
    
    // Must match valid 10-digit Indian mobile number
    const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
    if (!match) {
      return { 
        valid: false, 
        message: 'Please enter a valid 10-digit mobile number.' 
      };
    }
    
    const tenDigit = match[1];
    const normalized = `+91 ${tenDigit.slice(0, 5)} ${tenDigit.slice(5)}`;
    return { 
      valid: true, 
      normalized, 
      rawTenDigit: tenDigit 
    };
  };

  // Render Buses List
  const renderLDBuses = (buses) => {
    if (!busesContainer) return;
    busesContainer.innerHTML = '';

    const filtered = buses.filter(b => {
      if (activeTypeFilter === 'all') return true;
      return b.type.toLowerCase() === activeTypeFilter.toLowerCase();
    });

    if (filtered.length === 0) {
      busesContainer.innerHTML = `
        <div class="glass-card" style="text-align:center; padding:3rem 1.5rem;">
          <div style="font-size:3rem; margin-bottom:0.75rem;">🎫</div>
          <h3>No Long-Distance Buses Found</h3>
          <p class="text-muted">Try another date or destination.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(bus => {
      const isGovt = bus.type.toLowerCase() === 'government';
      const badgeClass = isGovt ? 'badge-govt' : 'badge-private';

      const card = document.createElement('div');
      card.className = 'ld-bus-card';
      card.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <span class="bus-num">${bus.busNumber || bus.number}</span>
            <span class="badge ${badgeClass}">${bus.type}</span>
          </div>
          <div style="font-size:1.05rem; font-weight:700; color:#fff;">${bus.operator}</div>
          <div style="font-size:0.85rem; color:var(--secondary); margin-top:0.2rem;">${bus.category}</div>
          <div class="amenities-list">
            ${(bus.amenities || ['💺 Seater', '🥤 Water Bottle']).map(a => `<span class="amenity-chip">${a}</span>`).join('')}
          </div>
        </div>

        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
            <div>
              <div style="font-size:1.25rem; font-weight:800; color:#38bdf8;">${bus.departure}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">${bus.from}</div>
            </div>
            <div style="text-align:center; padding:0 0.75rem;">
              <div style="font-size:0.75rem; color:var(--text-dim);">${bus.duration || '6h 00m'}</div>
              <div style="color:var(--secondary); font-size:1rem;">━━━━ ➔</div>
              <div style="font-size:0.7rem; color:var(--text-dim);">${bus.availableSeats || 18} Seats Left</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.25rem; font-weight:800; color:#38bdf8;">${bus.arrival || 'On Schedule'}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">${bus.to}</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem; font-size:0.8rem; color:var(--text-muted);">
            <span>⭐ ${bus.rating || '4.5'} / 5.0</span>
            <span>•</span>
            <span class="badge badge-demo" style="font-size:0.65rem;">Demo Schedule</span>
          </div>
        </div>

        <div style="text-align:right; display:flex; flex-direction:column; justify-content:center; gap:0.5rem; border-left:1px solid var(--border-glass); padding-left:1.5rem;">
          <div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Starting from</div>
            <div style="font-size:1.6rem; font-weight:800; color:#22d3ee;">₹${bus.price || bus.fare || 320}</div>
            <div style="font-size:0.7rem; color:var(--text-dim);">per passenger</div>
          </div>
          <button class="btn btn-primary select-seats-btn" data-bus-id="${bus.id}">
            Select Seats →
          </button>
        </div>
      `;

      busesContainer.appendChild(card);
    });

    bindSeatButtons();
  };

  // Seat Map Logic
  const openSeatModal = (bus) => {
    currentSelectedBus = bus;
    selectedSeats = [];
    currentPassengersCount = parseInt(passengersInput.value) || 1;

    const modalTitle = document.getElementById('seat-modal-title');
    const busInfo = document.getElementById('seat-modal-bus-info');
    const gridContainer = document.getElementById('interactive-seat-grid');

    if (modalTitle) modalTitle.textContent = `Select Seats — ${bus.operator}`;
    if (busInfo) {
      busInfo.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${bus.from} ➔ ${bus.to}</strong> | ${bus.category}
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">Departure: <span style="color:#38bdf8; font-weight:700;">${bus.departure}</span></div>
          </div>
          <div style="font-size:1.1rem; font-weight:700; color:#22d3ee;">
            ₹${bus.price || bus.fare || 320} / seat
          </div>
        </div>
      `;
    }

    // Build 2x2 grid (16 seats for prototype demo)
    if (gridContainer) {
      gridContainer.innerHTML = '';
      const seatLayout = [
        ['01', '02', 'aisle', '03', '04'],
        ['05', '06', 'aisle', '07', '08'],
        ['09', '10', 'aisle', '11', '12'],
        ['13', '14', 'aisle', '15', '16']
      ];

      const reservedSeats = ['02', '07', '10'];

      seatLayout.forEach(row => {
        row.forEach(seatNum => {
          if (seatNum === 'aisle') {
            const aisle = document.createElement('div');
            aisle.className = 'seat-aisle';
            gridContainer.appendChild(aisle);
          } else {
            const isReserved = reservedSeats.includes(seatNum);
            const seat = document.createElement('div');
            seat.className = `bus-seat ${isReserved ? 'reserved' : 'available'}`;
            seat.dataset.seat = seatNum;
            seat.textContent = seatNum;

            if (!isReserved) {
              seat.addEventListener('click', () => toggleSeat(seat, seatNum));
            }
            gridContainer.appendChild(seat);
          }
        });
      });
    }

    updateSeatSummary();
    UI.openModal('seat-selection-modal');
  };

  const toggleSeat = (seatEl, seatNum) => {
    if (selectedSeats.includes(seatNum)) {
      selectedSeats = selectedSeats.filter(s => s !== seatNum);
      seatEl.classList.remove('selected');
      seatEl.classList.add('available');
    } else {
      if (selectedSeats.length >= currentPassengersCount) {
        UI.showToast(`You selected ${currentPassengersCount} passenger(s). Deselect a seat or increase passenger count.`, 'warning');
        return;
      }
      selectedSeats.push(seatNum);
      seatEl.classList.remove('available');
      seatEl.classList.add('selected');
    }
    updateSeatSummary();
  };

  const updateSeatSummary = () => {
    const summaryEl = document.getElementById('seat-selection-summary');
    const proceedBtn = document.getElementById('proceed-passenger-details-btn');
    if (!summaryEl || !proceedBtn) return;

    const totalFare = selectedSeats.length * (currentSelectedBus ? (currentSelectedBus.price || currentSelectedBus.fare || 320) : 320);
    summaryEl.innerHTML = `
      <div>
        <span>Selected Seats: <strong>${selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong></span>
        <span style="margin-left: 1rem;">Required: <strong>${currentPassengersCount}</strong></span>
      </div>
      <div style="font-size: 1.15rem; font-weight: 800; color: #22d3ee;">
        Total: ₹${totalFare.toLocaleString()}
      </div>
    `;

    proceedBtn.disabled = selectedSeats.length !== currentPassengersCount;
  };

  const bindSeatButtons = () => {
    document.querySelectorAll('.select-seats-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const busId = btn.dataset.busId;
        const allBuses = [...longDistanceBuses, ...BusTrackData.getBuses()];
        const bus = allBuses.find(b => b.id === busId || b.number === busId);
        if (bus) openSeatModal(bus);
      });
    });
  };

  // Open Passenger Details Modal (With REQUIRED Mobile Number & Contact Pre-fill)
  const openPassengerDetailsModal = () => {
    UI.closeModal('seat-selection-modal');
    const formContainer = document.getElementById('passenger-form-rows');
    const user = AuthManager.getCurrentUser() || {};
    const defaultPhone = user.phone || user.mobile || '';
    const defaultEmail = user.email || (user.username && user.username.includes('@') ? user.username : 'passenger@bustrack.ai');
    const defaultName = user.name || 'Priya Sharma';

    if (formContainer) {
      formContainer.innerHTML = `
        <!-- Primary Booking Contact Section (REQUIRED Mobile & Email) -->
        <div class="glass-card" style="background: rgba(15, 23, 42, 0.85); border: 1px solid var(--border-glass-glow); margin-bottom: 1.25rem; padding: 1rem 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h4 style="font-size:0.95rem; color:#38bdf8; margin:0;">
              📱 Primary Booking Contact
            </h4>
            <span class="badge badge-demo" style="font-size:0.65rem;">SMS & E-Ticket Dispatch</span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem;">
            <div>
              <label class="form-label" style="font-size:0.75rem;" for="contact-email">
                Contact Email <span style="color:#f87171;">*</span>
              </label>
              <input type="email" id="contact-email" class="form-control" placeholder="e.g. priya@bustrack.ai" required value="${defaultEmail}" />
            </div>

            <div>
              <label class="form-label" style="font-size:0.75rem;" for="contact-mobile">
                Mobile Number <span style="color:#f87171;">*</span>
              </label>
              <input type="tel" id="contact-mobile" class="form-control" placeholder="e.g. 9876543210 or +91 98765 43210" required value="${defaultPhone}" autocomplete="tel" />
              <div id="mobile-validation-feedback" style="font-size:0.7rem; color:#f87171; margin-top:0.25rem; display:none;"></div>
            </div>
          </div>
        </div>

        <!-- Seat Passenger Details List -->
        <h4 style="font-size:0.9rem; color:var(--secondary); margin-bottom:0.75rem;">
          Seat Passenger Details (${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''})
        </h4>
      `;

      selectedSeats.forEach((seat, idx) => {
        const row = document.createElement('div');
        row.className = 'glass-card';
        row.style.background = 'rgba(7, 17, 31, 0.6)';
        row.style.marginBottom = '0.75rem';
        row.style.padding = '0.85rem';
        row.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <strong style="font-size:0.85rem; color:#fff;">Passenger ${idx + 1}</strong>
            <span class="badge badge-ai" style="font-size:0.7rem;">Seat ${seat}</span>
          </div>
          <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:0.75rem;">
            <div>
              <label class="form-label" style="font-size:0.75rem;">Full Name <span style="color:#f87171;">*</span></label>
              <input type="text" class="form-control p-name" placeholder="e.g. Priya Sharma" required value="${idx === 0 ? defaultName : 'Co-Passenger ' + (idx + 1)}" />
            </div>
            <div>
              <label class="form-label" style="font-size:0.75rem;">Age <span style="color:#f87171;">*</span></label>
              <input type="number" class="form-control p-age" placeholder="Age" min="1" max="120" value="${24 + idx * 3}" required />
            </div>
            <div>
              <label class="form-label" style="font-size:0.75rem;">Gender <span style="color:#f87171;">*</span></label>
              <select class="form-control form-select p-gender">
                <option value="Female" ${idx === 0 ? 'selected' : ''}>Female</option>
                <option value="Male" ${idx === 1 ? 'selected' : ''}>Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        `;
        formContainer.appendChild(row);
      });
    }

    UI.openModal('passenger-details-modal');
  };

  // Open Booking Summary & Demo Payment
  const openPaymentModal = () => {
    UI.closeModal('passenger-details-modal');
    const farePerSeat = currentSelectedBus ? (currentSelectedBus.price || currentSelectedBus.fare || 320) : 320;
    const totalFare = selectedSeats.length * farePerSeat;
    const summaryContainer = document.getElementById('payment-booking-summary');
    const payBtn = document.getElementById('demo-pay-btn');

    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="glass-card" style="background:rgba(7, 17, 31, 0.6); margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="text-muted">Route</span>
            <strong>${currentSelectedBus.from} ➔ ${currentSelectedBus.to}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="text-muted">Travel Date & Time</span>
            <strong>${dateInput.value || '2026-09-10'} (<span style="color:#38bdf8;">${currentSelectedBus.departure}</span>)</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="text-muted">Operator & Category</span>
            <strong>${currentSelectedBus.operator} (${currentSelectedBus.category || currentSelectedBus.type})</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="text-muted">Primary Contact</span>
            <strong>${bookingContact.name} • 📱 ${bookingContact.mobile}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span class="text-muted">Selected Seats</span>
            <strong>${selectedSeats.join(', ')} (${selectedSeats.length} Passenger${selectedSeats.length > 1 ? 's' : ''})</strong>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-glass); padding-top:0.5rem; margin-top:0.5rem;">
            <span style="font-size:1.1rem; font-weight:700;">Total Demo Fare</span>
            <span style="font-size:1.3rem; font-weight:800; color:#22d3ee;">₹${totalFare.toLocaleString()}</span>
          </div>
        </div>
      `;
    }

    if (payBtn) {
      payBtn.textContent = `Pay ₹${totalFare.toLocaleString()}`;
    }

    UI.openModal('payment-modal');
  };

  // Execute Demo Payment & Generate Digital E-Ticket
  const executePayment = () => {
    const payBtn = document.getElementById('demo-pay-btn');
    const payStatus = document.getElementById('payment-processing-status');

    if (payBtn) payBtn.disabled = true;
    if (payStatus) {
      payStatus.style.display = 'block';
      payStatus.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; gap:0.75rem; color:#38bdf8;">
          <span class="pulse-dot"></span>
          <span>Processing Demo Payment Simulation...</span>
        </div>
      `;
    }

    setTimeout(() => {
      const bookingId = `BTAI-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`;
      const user = AuthManager.getCurrentUser();
      const farePerSeat = currentSelectedBus ? (currentSelectedBus.price || currentSelectedBus.fare || 320) : 320;
      const totalFare = selectedSeats.length * farePerSeat;

      const newBooking = {
        bookingId,
        username: user?.email || user?.username || 'passenger001',
        passengerName: bookingContact.name,
        email: bookingContact.email,
        mobile: bookingContact.mobile,
        phone: bookingContact.mobile,
        from: currentSelectedBus.from,
        to: currentSelectedBus.to,
        busNumber: currentSelectedBus.busNumber || currentSelectedBus.number,
        operator: currentSelectedBus.operator,
        busType: currentSelectedBus.category || currentSelectedBus.type,
        travelDate: dateInput.value || '2026-09-10',
        departure: currentSelectedBus.departure,
        arrival: currentSelectedBus.arrival || 'On Schedule',
        seats: selectedSeats,
        passengersCount: selectedSeats.length,
        fare: totalFare,
        status: 'Upcoming',
        bookedAt: new Date().toLocaleString()
      };

      const bookings = BusTrackData.getBookings();
      bookings.unshift(newBooking);
      BusTrackData.saveBookings(bookings);

      UI.closeModal('payment-modal');
      renderETicket(newBooking);
      UI.showToast('✅ Payment Successful! Digital E-Ticket Generated.', 'success');
    }, 1200);
  };

  // Render E-Ticket (Displays Name, Email, Mobile, Route, Date, Departure, Seats, Fare)
  const renderETicket = (booking) => {
    const ticketBody = document.getElementById('eticket-modal-body');
    if (ticketBody) {
      ticketBody.innerHTML = `
        <div class="ticket-wrapper">
          <div class="ticket-header">
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #1d4ed8;">🚌 BusTrack AI</div>
              <div style="font-size: 0.75rem; color: #64748b;">OFFICIAL DIGITAL E-TICKET</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-demo" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a;">Prototype Ticket</span>
              <div style="font-size: 0.8rem; font-weight: 700; margin-top: 0.25rem;">ID: ${booking.bookingId}</div>
            </div>
          </div>

          <div class="qr-code-box">
            <canvas id="ticket-qr-canvas" width="110" height="110"></canvas>
          </div>

          <div class="ticket-grid">
            <div>
              <div class="ticket-field-lbl">Passenger Name</div>
              <div class="ticket-field-val">${booking.passengerName}</div>
            </div>
            <div>
              <div class="ticket-field-lbl">Mobile Number</div>
              <div class="ticket-field-val" style="color:#0369a1; font-weight:700;">📱 ${booking.mobile || booking.phone}</div>
            </div>
            <div>
              <div class="ticket-field-lbl">Email Address</div>
              <div class="ticket-field-val">${booking.email}</div>
            </div>
            <div>
              <div class="ticket-field-lbl">Travel Date</div>
              <div class="ticket-field-val">${booking.travelDate}</div>
            </div>
            <div>
              <div class="ticket-field-lbl">Route</div>
              <div class="ticket-field-val">${booking.from} ➔ ${booking.to}</div>
            </div>
            <div>
              <div class="ticket-field-lbl">Bus Number & Operator</div>
              <div class="ticket-field-val">${booking.busNumber} • ${booking.operator}</div>
            </div>
            <div>
              <div class="ticket-field-lbl">Departure & Arrival</div>
              <div class="ticket-field-val">${booking.departure} → ${booking.arrival}</div>
            </div>
            <div>
              <div class="ticket-field-lbl">Seats / Fare</div>
              <div class="ticket-field-val">Seats: ${booking.seats.join(', ')} (₹${booking.fare.toLocaleString()})</div>
            </div>
          </div>

          <div style="text-align:center; font-size:0.75rem; color:#64748b; border-top:1px dashed #cbd5e1; padding-top:0.75rem;">
            Show this digital QR e-ticket at the boarding terminal. Demo simulation only.
          </div>
        </div>
      `;

      // Draw simulated QR on canvas
      setTimeout(() => {
        const qrCanvas = document.getElementById('ticket-qr-canvas');
        if (qrCanvas) {
          const ctx = qrCanvas.getContext('2d');
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(10, 10, 30, 30);
          ctx.clearRect(16, 16, 18, 18);
          ctx.fillRect(20, 20, 10, 10);

          ctx.fillRect(70, 10, 30, 30);
          ctx.clearRect(76, 16, 18, 18);
          ctx.fillRect(80, 20, 10, 10);

          ctx.fillRect(10, 70, 30, 30);
          ctx.clearRect(16, 76, 18, 18);
          ctx.fillRect(20, 80, 10, 10);

          for (let i = 0; i < 60; i++) {
            const rx = Math.floor(Math.random() * 90) + 10;
            const ry = Math.floor(Math.random() * 90) + 10;
            ctx.fillRect(rx, ry, 3, 3);
          }
        }
      }, 50);

      UI.openModal('eticket-modal');
    }
  };

  // Compare Modal Builder
  const openCompareModal = () => {
    const compareBody = document.getElementById('compare-modal-body');
    const govtBus = longDistanceBuses.find(b => b.type.toLowerCase() === 'government') || longDistanceBuses[0];
    const privBus = longDistanceBuses.find(b => b.type.toLowerCase() === 'private') || longDistanceBuses[1];

    if (compareBody) {
      compareBody.innerHTML = `
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>🏛️ Government (${govtBus.operator})</th>
              <th>🏢 Private (${privBus.operator})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ticket Fare</strong></td>
              <td><span style="color:#4ade80; font-weight:700;">₹${govtBus.price || govtBus.fare} (Affordable)</span></td>
              <td><span>₹${privBus.price || privBus.fare} (Premium)</span></td>
            </tr>
            <tr>
              <td><strong>Bus Category</strong></td>
              <td>${govtBus.category}</td>
              <td>${privBus.category}</td>
            </tr>
            <tr>
              <td><strong>Departure / Arrival</strong></td>
              <td>${govtBus.departure} → ${govtBus.arrival}</td>
              <td>${privBus.departure} → ${privBus.arrival}</td>
            </tr>
            <tr>
              <td><strong>Duration</strong></td>
              <td>${govtBus.duration}</td>
              <td>${privBus.duration}</td>
            </tr>
            <tr>
              <td><strong>Rating</strong></td>
              <td>⭐ ${govtBus.rating} / 5.0</td>
              <td>⭐ ${privBus.rating} / 5.0</td>
            </tr>
            <tr>
              <td><strong>Amenities</strong></td>
              <td>${(govtBus.amenities || []).join(', ')}</td>
              <td>${(privBus.amenities || []).join(', ')}</td>
            </tr>
          </tbody>
        </table>
      `;
      UI.openModal('compare-modal');
    }
  };

  // Event Listeners
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fromVal = fromInput.value.trim().toLowerCase();
      const toVal = toInput.value.trim().toLowerCase();

      let results = BusTrackData.getLongDistance();
      if (fromVal) results = results.filter(b => b.from.toLowerCase().includes(fromVal));
      if (toVal) results = results.filter(b => b.to.toLowerCase().includes(toVal));

      longDistanceBuses = results;
      UI.showToast('Searching long-distance routes...', 'info', 1000);
      renderLDBuses(longDistanceBuses);
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTypeFilter = pill.dataset.filter;
      renderLDBuses(longDistanceBuses);
    });
  });

  const compareBtn = document.getElementById('open-compare-btn');
  if (compareBtn) compareBtn.addEventListener('click', openCompareModal);

  const proceedPassengerBtn = document.getElementById('proceed-passenger-details-btn');
  if (proceedPassengerBtn) proceedPassengerBtn.addEventListener('click', openPassengerDetailsModal);

  // Validate Passenger Information (Full Name, Email, REQUIRED 10-digit Indian Mobile)
  const passengerDetailsForm = document.getElementById('passenger-details-form');
  if (passengerDetailsForm) {
    passengerDetailsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailField = document.getElementById('contact-email');
      const mobileField = document.getElementById('contact-mobile');
      const feedback = document.getElementById('mobile-validation-feedback');
      const nameFields = document.querySelectorAll('.p-name');

      const primaryName = nameFields.length > 0 ? nameFields[0].value.trim() : 'Priya Sharma';
      const contactEmail = emailField ? emailField.value.trim() : '';
      const contactMobile = mobileField ? mobileField.value.trim() : '';

      if (!primaryName) {
        UI.showToast('Please enter passenger full name.', 'danger');
        return;
      }

      if (!contactEmail || !/^\S+@\S+\.\S+$/.test(contactEmail)) {
        UI.showToast('Please enter a valid email address.', 'danger');
        if (emailField) emailField.focus();
        return;
      }

      // STRICT MOBILE NUMBER VALIDATION
      const mobileValidation = validateIndianMobile(contactMobile);
      if (!mobileValidation.valid) {
        if (feedback) {
          feedback.textContent = mobileValidation.message;
          feedback.style.display = 'block';
        }
        UI.showToast(mobileValidation.message, 'danger');
        if (mobileField) {
          mobileField.focus();
          mobileField.classList.add('input-error');
        }
        return;
      }

      if (feedback) feedback.style.display = 'none';
      if (mobileField) mobileField.classList.remove('input-error');

      // Save verified booking contact
      bookingContact = {
        name: primaryName,
        email: contactEmail,
        mobile: mobileValidation.normalized
      };

      openPaymentModal();
    });
  }

  const paymentForm = document.getElementById('demo-payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executePayment();
    });
  }

  const printTicketBtn = document.getElementById('print-ticket-btn');
  if (printTicketBtn) {
    printTicketBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Check URL query parameters passed from passenger.html search results
  const urlParams = new URLSearchParams(window.location.search);
  const pBusId = urlParams.get('busId');
  const pFrom = urlParams.get('from');
  const pTo = urlParams.get('to');
  const pDate = urlParams.get('date');
  const pDept = urlParams.get('dept');
  const pArr = urlParams.get('arr');
  const pOperator = urlParams.get('operator');
  const pType = urlParams.get('type');
  const pCat = urlParams.get('cat');
  const pFare = urlParams.get('fare');

  if (pFrom && fromInput) {
    let exists = Array.from(fromInput.options).some(o => o.value.toLowerCase() === pFrom.toLowerCase());
    if (!exists) {
      const opt = document.createElement('option');
      opt.value = pFrom;
      opt.textContent = pFrom;
      fromInput.appendChild(opt);
    }
    fromInput.value = pFrom;
  }

  if (pTo && toInput) {
    let exists = Array.from(toInput.options).some(o => o.value.toLowerCase() === pTo.toLowerCase());
    if (!exists) {
      const opt = document.createElement('option');
      opt.value = pTo;
      opt.textContent = pTo;
      toInput.appendChild(opt);
    }
    toInput.value = pTo;
  }

  if (pDate && dateInput) {
    dateInput.value = pDate;
  }

  if (pBusId) {
    const allBuses = [...BusTrackData.getLongDistance(), ...BusTrackData.getBuses()];
    let matchedBus = allBuses.find(b => b.id === pBusId || b.number === pBusId);

    const busObj = {
      id: pBusId,
      busNumber: matchedBus ? (matchedBus.busNumber || matchedBus.number) : pBusId,
      operator: pOperator || (matchedBus ? (matchedBus.operator || matchedBus.number) : pBusId),
      type: pType || (matchedBus ? matchedBus.type : 'Government'),
      category: pCat || (matchedBus ? (matchedBus.category || matchedBus.type) : 'Standard Seater'),
      from: pFrom || (matchedBus ? matchedBus.from : 'Chennai'),
      to: pTo || (matchedBus ? matchedBus.to : 'Coimbatore'),
      departure: pDept || (matchedBus ? matchedBus.departure : '06:00 AM'),
      arrival: pArr || (matchedBus ? (matchedBus.arrival || '12:00 PM') : '12:00 PM'),
      duration: matchedBus ? (matchedBus.duration || '6h 00m') : '6h 00m',
      price: parseInt(pFare) || (matchedBus ? (matchedBus.price || matchedBus.fare || 320) : 320),
      totalSeats: matchedBus ? (matchedBus.totalSeats || 36) : 36,
      availableSeats: matchedBus ? (matchedBus.availableSeats || 18) : 18,
      rating: matchedBus ? (matchedBus.rating || 4.5) : 4.5,
      amenities: matchedBus ? (matchedBus.amenities || ['💺 Seater', '🥤 Water Bottle']) : ['💺 Seater', '🥤 Water Bottle']
    };

    renderLDBuses([busObj, ...longDistanceBuses.filter(b => b.id !== busObj.id)]);
    
    // Auto launch seat selection modal for the pre-selected departure
    setTimeout(() => {
      openSeatModal(busObj);
      UI.showToast(`Selected departure: ${busObj.departure} (${busObj.operator}). Please pick your seats.`, 'info', 3000);
    }, 250);
  } else {
    // Standard initial render
    renderLDBuses(longDistanceBuses);
  }
});
