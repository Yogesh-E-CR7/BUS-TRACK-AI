/**
 * BusTrack AI - Admin Fleet Management & AI Analytics Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.enforceRoleProtection(['admin', 'minister']);

  const busTableBody = document.getElementById('admin-bus-table-body');
  const addBusForm = document.getElementById('add-bus-form');
  const addBusBtn = document.getElementById('add-bus-modal-btn');
  const generateReportBtn = document.getElementById('generate-admin-report-btn');

  let buses = BusTrackData.getBuses();

  // 1. Render Buses Table
  const renderBusesTable = () => {
    if (!busTableBody) return;
    busTableBody.innerHTML = '';

    buses.forEach(b => {
      const isGovt = b.type.toLowerCase() === 'government';
      const badgeClass = isGovt ? 'badge-govt' : 'badge-private';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color:#fff;">${b.number}</strong></td>
        <td><span class="badge ${badgeClass}">${b.type}</span></td>
        <td>${b.routeName}</td>
        <td>${b.driver || 'Assigned Driver'}</td>
        <td><span class="badge ${b.status === 'Approaching' ? 'badge-warning' : 'badge-success'}">${b.status}</span></td>
        <td><span style="color:#38bdf8; font-weight:700;">${b.etaMinutes} mins</span></td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button type="button" class="btn btn-outline btn-sm edit-bus-btn" data-id="${b.id}">Edit</button>
            <button type="button" class="btn btn-danger btn-sm delete-bus-btn" data-id="${b.id}">Delete</button>
          </div>
        </td>
      `;
      busTableBody.appendChild(tr);
    });

    bindTableEvents();
  };

  const bindTableEvents = () => {
    // Delete Bus
    document.querySelectorAll('.delete-bus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm(`Are you sure you want to remove bus ${id} from fleet?`)) {
          buses = buses.filter(b => b.id !== id);
          BusTrackData.saveBuses(buses);
          renderBusesTable();
          UI.showToast(`Bus ${id} removed from fleet records.`, 'warning');
        }
      });
    });

    // Edit Bus
    document.querySelectorAll('.edit-bus-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const bus = buses.find(b => b.id === id);
        if (bus) {
          const newStatus = prompt('Update Bus Schedule Status (e.g. On Time, Delayed, Approaching):', bus.status);
          if (newStatus) {
            bus.status = newStatus;
            BusTrackData.saveBuses(buses);
            renderBusesTable();
            UI.showToast(`Updated status for ${bus.number}!`, 'success');
          }
        }
      });
    });
  };

  // Add Bus Modal & Form
  if (addBusBtn) {
    addBusBtn.addEventListener('click', () => {
      UI.openModal('add-bus-modal');
    });
  }

  if (addBusForm) {
    addBusForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const num = document.getElementById('new-bus-number').value.trim();
      const type = document.getElementById('new-bus-type').value;
      const from = document.getElementById('new-bus-from').value;
      const to = document.getElementById('new-bus-to').value;
      const driver = document.getElementById('new-bus-driver').value.trim() || 'Assigned Driver';

      const newBus = {
        id: num,
        number: num,
        type,
        routeId: `R-${Math.floor(100 + Math.random() * 900)}`,
        routeName: `${from} → ${to}`,
        from,
        to,
        departure: '11:30 AM',
        etaMinutes: 10,
        distanceKm: 4.5,
        speedKm: 30,
        status: 'On Time',
        crowd: 'Medium',
        rating: 4.4,
        driver
      };

      buses.unshift(newBus);
      BusTrackData.saveBuses(buses);
      UI.closeModal('add-bus-modal');
      UI.showToast(`✅ Bus ${num} added to active fleet!`, 'success');
      addBusForm.reset();
      renderBusesTable();
    });
  }

  // 2. Initialize Charts
  const initCharts = () => {
    // Chart 1: Hourly Passenger Demand (Line / Area)
    new BusTrackChart('chart-passenger-demand', {
      type: 'area',
      data: {
        labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
        datasets: [{
          label: 'Passengers / Hour',
          data: [210, 840, 720, 390, 420, 680, 950, 780, 310],
          color: '#38bdf8'
        }]
      }
    });

    // Chart 2: Average Delay Trends (Bar)
    new BusTrackChart('chart-delay-trends', {
      type: 'bar',
      data: {
        labels: ['R-101', 'R-102', 'R-103', 'R-104', 'R-105', 'R-106'],
        datasets: [{
          label: 'Avg Delay (Minutes)',
          data: [3.2, 8.5, 4.1, 2.0, 7.8, 5.0],
          color: '#fbbf24'
        }]
      }
    });

    // Chart 3: Route Performance (Bar)
    new BusTrackChart('chart-route-performance', {
      type: 'bar',
      data: {
        labels: ['Gandhipuram', 'Ukkadam', 'Singanallur', 'Peelamedu', 'Town Hall'],
        datasets: [{
          label: 'On-Time Rate (%)',
          data: [92, 88, 76, 89, 94],
          color: '#34d399'
        }]
      }
    });

    // Chart 4: Feedback Sentiment Breakdown (Donut)
    new BusTrackChart('chart-sentiment-donut', {
      type: 'donut',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          label: 'Total Reviews',
          data: [68, 18, 14],
          colors: ['#34d399', '#fbbf24', '#f87171']
        }]
      }
    });
  };

  // 3. Report Generation
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', () => {
      UI.openModal('admin-report-modal');
    });
  }

  const printReportBtn = document.getElementById('print-admin-report-btn');
  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  renderBusesTable();
  setTimeout(initCharts, 100);
});
