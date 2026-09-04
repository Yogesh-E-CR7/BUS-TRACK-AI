/**
 * BusTrack AI - My Bookings Manager
 * Connected to BookingService layer for future transactional backend integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.enforceRoleProtection(['passenger', 'admin', 'minister']);

  const bookingsList = document.getElementById('bookings-list-container');
  const tabButtons = document.querySelectorAll('.booking-tab-btn');
  let currentTab = 'Upcoming'; // 'Upcoming', 'Completed', 'Cancelled'

  const renderBookings = async () => {
    if (!bookingsList) return;
    bookingsList.innerHTML = '';

    const user = AuthManager.getCurrentUser();
    const allBookings = await BookingService.getUserBookings(user?.username);
    
    // Filter bookings for current tab
    let filtered = allBookings.filter(b => {
      return (b.status || 'Upcoming').toLowerCase() === currentTab.toLowerCase();
    });

    if (filtered.length === 0) {
      bookingsList.innerHTML = `
        <div class="glass-card" style="text-align:center; padding:3rem 1.5rem;">
          <div style="font-size:3rem; margin-bottom:0.75rem;">📋</div>
          <h3>No ${currentTab} Bookings Found</h3>
          <p class="text-muted" style="margin-bottom:1.5rem;">Ready to plan a trip?</p>
          <a href="booking.html" class="btn btn-primary btn-sm">Book New Ticket →</a>
        </div>
      `;
      return;
    }

    filtered.forEach(booking => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.marginBottom = '1.25rem';
      
      const statusBadge = booking.status === 'Upcoming' 
        ? '<span class="badge badge-success">Upcoming</span>' 
        : (booking.status === 'Completed' ? '<span class="badge badge-simulation">Completed</span>' : '<span class="badge badge-danger">Cancelled</span>');

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-bottom:1px solid var(--border-glass); padding-bottom:1rem; margin-bottom:1rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted);">BOOKING ID</div>
            <div style="font-size:1.1rem; font-weight:800; color:#38bdf8;">${booking.bookingId}</div>
          </div>
          <div>
            ${statusBadge}
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <div>
            <div class="text-muted text-xs">ROUTE</div>
            <strong>${booking.from} ➔ ${booking.to}</strong>
          </div>
          <div>
            <div class="text-muted text-xs">TRAVEL DATE</div>
            <strong>${booking.travelDate} (${booking.departure})</strong>
          </div>
          <div>
            <div class="text-muted text-xs">BUS & OPERATOR</div>
            <strong>${booking.operator}</strong>
          </div>
          <div>
            <div class="text-muted text-xs">SEATS & FARE</div>
            <strong>${booking.seats.join(', ')} (₹${booking.fare.toLocaleString()})</strong>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:flex-end; gap:0.75rem; border-top:1px solid var(--border-glass); padding-top:1rem; flex-wrap:wrap;">
          <button type="button" class="btn btn-outline btn-sm view-ticket-btn" data-id="${booking.bookingId}">
            🎫 View E-Ticket
          </button>
          ${booking.status === 'Upcoming' ? `
            <a href="tracking.html?bus=${encodeURIComponent(booking.busNumber)}" class="btn btn-secondary btn-sm">
              📍 Track Bus
            </a>
            <button type="button" class="btn btn-danger btn-sm cancel-booking-btn" data-id="${booking.bookingId}">
              Cancel Ticket
            </button>
          ` : ''}
        </div>
      `;

      bookingsList.appendChild(card);
    });

    bindActionButtons();
  };

  const bindActionButtons = () => {
    // View Ticket
    document.querySelectorAll('.view-ticket-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const res = await BookingService.verifyETicket(id);
        if (!res.valid || !res.booking) return;
        const booking = res.booking;

        const ticketBody = document.getElementById('view-eticket-body');
        if (ticketBody) {
          ticketBody.innerHTML = `
            <div class="ticket-wrapper">
              <div class="ticket-header">
                <div>
                  <div style="font-size:1.25rem; font-weight:800; color:#1d4ed8;">🚌 BusTrack AI</div>
                  <div style="font-size:0.75rem; color:#64748b;">DIGITAL BOARDING PASS</div>
                </div>
                <div style="text-align:right;">
                  <span class="badge badge-demo" style="background:#fef3c7; color:#b45309;">Prototype Ticket</span>
                  <div style="font-size:0.8rem; font-weight:700; margin-top:0.25rem;">${booking.bookingId}</div>
                </div>
              </div>

              <div class="ticket-grid">
                <div>
                  <div class="ticket-field-lbl">Passenger</div>
                  <div class="ticket-field-val">${booking.passengerName}</div>
                </div>
                <div>
                  <div class="ticket-field-lbl">Mobile Number</div>
                  <div class="ticket-field-val" style="color:#0369a1; font-weight:700;">📱 ${booking.mobile || booking.phone || '+91 98765 43210'}</div>
                </div>
                <div>
                  <div class="ticket-field-lbl">Travel Date</div>
                  <div class="ticket-field-val">${booking.travelDate}</div>
                </div>
                <div>
                  <div class="ticket-field-lbl">Departure & Arrival</div>
                  <div class="ticket-field-val">${booking.departure || '09:00 PM'} → ${booking.arrival || '06:30 AM'}</div>
                </div>
                <div>
                  <div class="ticket-field-lbl">Route</div>
                  <div class="ticket-field-val">${booking.from} ➔ ${booking.to}</div>
                </div>
                <div>
                  <div class="ticket-field-lbl">Operator</div>
                  <div class="ticket-field-val">${booking.operator}</div>
                </div>
                <div>
                  <div class="ticket-field-lbl">Seats</div>
                  <div class="ticket-field-val">${booking.seats.join(', ')}</div>
                </div>
                <div>
                  <div class="ticket-field-lbl">Fare Paid</div>
                  <div class="ticket-field-val">₹${booking.fare.toLocaleString()}</div>
                </div>
              </div>

              <div style="text-align:center; font-size:0.75rem; color:#64748b; border-top:1px dashed #cbd5e1; padding-top:0.75rem;">
                Status: <strong style="color:${booking.status === 'Cancelled' ? '#ef4444' : '#22c55e'};">${booking.status}</strong>
              </div>
            </div>
          `;
          UI.openModal('view-eticket-modal');
        }
      });
    });

    // Cancel Booking
    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const confirmBtn = document.getElementById('confirm-cancel-booking-btn');
        if (confirmBtn) {
          confirmBtn.dataset.id = id;
          UI.openModal('cancel-booking-confirm-modal');
        }
      });
    });
  };

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      renderBookings();
    });
  });

  // Confirm cancel action via BookingService
  const confirmCancelBtn = document.getElementById('confirm-cancel-booking-btn');
  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', async () => {
      const id = confirmCancelBtn.dataset.id;
      const res = await BookingService.cancelBooking(id);
      if (res.success) {
        UI.closeModal('cancel-booking-confirm-modal');
        UI.showToast(`Booking ${id} has been cancelled (Prototype).`, 'warning');
        renderBookings();
      }
    });
  }

  // Print ticket
  const printBtn = document.getElementById('print-view-ticket-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  renderBookings();
});
