/**
 * BusTrack AI - Driver Operations Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.enforceRoleProtection(['driver', 'admin', 'minister']);

  const startBtn = document.getElementById('driver-start-btn');
  const pauseBtn = document.getElementById('driver-pause-btn');
  const resumeBtn = document.getElementById('driver-resume-btn');
  const completeBtn = document.getElementById('driver-complete-btn');
  const shareGpsBtn = document.getElementById('driver-share-gps-btn');
  const reportIssueBtn = document.getElementById('driver-report-issue-btn');

  const tripStatusBadge = document.getElementById('driver-trip-status');
  const liveSpeedVal = document.getElementById('driver-live-speed');
  const passengerCountVal = document.getElementById('driver-passenger-count');
  const nextStopVal = document.getElementById('driver-next-stop');
  const reportsList = document.getElementById('driver-reports-list');
  const issueForm = document.getElementById('driver-issue-form');

  let tripState = 'Scheduled'; // 'Scheduled', 'In Progress', 'Paused', 'Completed'
  let speedInterval = null;

  const updateStateUI = () => {
    if (tripStatusBadge) {
      if (tripState === 'In Progress') {
        tripStatusBadge.className = 'badge badge-success';
        tripStatusBadge.textContent = 'Trip Active';
      } else if (tripState === 'Paused') {
        tripStatusBadge.className = 'badge badge-warning';
        tripStatusBadge.textContent = 'Trip Paused';
      } else if (tripState === 'Completed') {
        tripStatusBadge.className = 'badge badge-simulation';
        tripStatusBadge.textContent = 'Trip Completed';
      } else {
        tripStatusBadge.className = 'badge badge-demo';
        tripStatusBadge.textContent = 'Ready to Depart';
      }
    }

    if (startBtn) startBtn.style.display = tripState === 'Scheduled' ? 'flex' : 'none';
    if (pauseBtn) pauseBtn.style.display = tripState === 'In Progress' ? 'flex' : 'none';
    if (resumeBtn) resumeBtn.style.display = tripState === 'Paused' ? 'flex' : 'none';
    if (completeBtn) completeBtn.style.display = (tripState === 'In Progress' || tripState === 'Paused') ? 'flex' : 'none';
  };

  const startSpeedSimulation = () => {
    if (speedInterval) clearInterval(speedInterval);
    speedInterval = setInterval(() => {
      if (tripState === 'In Progress') {
        const speed = Math.round(28 + Math.random() * 14);
        if (liveSpeedVal) liveSpeedVal.textContent = speed;
      } else {
        if (liveSpeedVal) liveSpeedVal.textContent = '0';
      }
    }, 2000);
  };

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      tripState = 'In Progress';
      updateStateUI();
      startSpeedSimulation();
      UI.showToast('🚀 Trip Started! GPS broadcasts live telemetry to central command.', 'success');
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      tripState = 'Paused';
      updateStateUI();
      UI.showToast('⏸️ Trip Paused. Stop time logged.', 'warning');
    });
  }

  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      tripState = 'In Progress';
      updateStateUI();
      UI.showToast('▶️ Trip Resumed.', 'success');
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      if (confirm('Complete this journey route?')) {
        tripState = 'Completed';
        updateStateUI();
        if (speedInterval) clearInterval(speedInterval);
        if (liveSpeedVal) liveSpeedVal.textContent = '0';
        UI.showToast('✅ Journey completed! Depot log synced.', 'success');
      }
    });
  }

  if (shareGpsBtn) {
    shareGpsBtn.addEventListener('click', () => {
      UI.showToast('📡 GPS Ping Broadcasted: Lat 11.0168° N, Lng 76.9558° E', 'info');
    });
  }

  if (reportIssueBtn) {
    reportIssueBtn.addEventListener('click', () => {
      UI.openModal('driver-issue-modal');
    });
  }

  // Render Reports List
  const renderReports = () => {
    if (!reportsList) return;
    reportsList.innerHTML = '';

    const reports = BusTrackData.getDriverReports();
    if (reports.length === 0) {
      reportsList.innerHTML = '<div class="text-muted text-sm">No incidents reported on this shift.</div>';
      return;
    }

    reports.forEach(r => {
      const el = document.createElement('div');
      el.className = 'incident-report-item';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
          <strong style="color:#f87171;">⚠️ ${r.type}</strong>
          <span class="text-muted text-xs">${r.time}</span>
        </div>
        <p style="font-size:0.85rem; color:#cbd5e1; margin-bottom:0.25rem;">${r.details}</p>
        <div style="font-size:0.75rem; color:var(--text-dim);">Bus: ${r.bus} | Status: <span class="badge badge-warning" style="font-size:0.6rem;">${r.status}</span></div>
      `;
      reportsList.appendChild(el);
    });
  };

  // Issue Form Submit
  if (issueForm) {
    issueForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('driver-issue-type').value;
      const details = document.getElementById('driver-issue-details').value.trim();

      const newReport = {
        id: `DR-${Date.now().toString().slice(-3)}`,
        bus: 'TN-38-N-1025',
        type,
        details,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Active'
      };

      const reports = BusTrackData.getDriverReports();
      reports.unshift(newReport);
      BusTrackData.saveDriverReports(reports);

      UI.closeModal('driver-issue-modal');
      UI.showToast(`🚨 Incident Reported: ${type} sent to Admin Command.`, 'danger');
      document.getElementById('driver-issue-details').value = '';
      renderReports();
    });
  }

  updateStateUI();
  renderReports();
});
