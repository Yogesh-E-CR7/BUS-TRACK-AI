/**
 * BusTrack AI - Live GPS Map & Telematics Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.enforceRoleProtection(['passenger', 'driver', 'admin', 'minister']);

  const canvas = document.getElementById('tracking-map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const busSelect = document.getElementById('tracking-bus-select');
  const playPauseBtn = document.getElementById('sim-play-pause-btn');
  const speedBtn = document.getElementById('sim-speed-btn');

  const hudBusNum = document.getElementById('hud-bus-number');
  const hudOperator = document.getElementById('hud-operator');
  const hudLocation = document.getElementById('hud-current-location');
  const hudDestination = document.getElementById('hud-destination');
  const hudDistance = document.getElementById('hud-distance');
  const hudSpeed = document.getElementById('hud-speed');
  const hudEta = document.getElementById('hud-eta');
  const hudStatus = document.getElementById('hud-status');
  const hudCrowd = document.getElementById('hud-crowd');
  const timelineContainer = document.getElementById('route-timeline-container');

  const allBuses = BusTrackData.getBuses();

  // Route Waypoints
  const STOPS = [
    { name: 'Gandhipuram Central', x: 0.15, y: 0.25, time: '10:30 AM' },
    { name: 'Lakshmi Mills Jn.', x: 0.38, y: 0.38, time: '10:38 AM' },
    { name: 'Nava India Hub', x: 0.58, y: 0.52, time: '10:45 AM' },
    { name: 'Peelamedu Tech Zone', x: 0.72, y: 0.68, time: '10:52 AM' },
    { name: 'Singanallur Hub', x: 0.85, y: 0.82, time: '11:00 AM' }
  ];

  let isPlaying = true;
  let simSpeed = 1; // 1x, 2x, 4x
  let progress = 0.15; // 0.0 -> 1.0
  let currentBus = allBuses[0];

  // Read bus from URL query param if present
  const urlParams = new URLSearchParams(window.location.search);
  const busParam = urlParams.get('bus');
  if (busParam) {
    const found = allBuses.find(b => b.id === busParam || b.number === busParam);
    if (found) currentBus = found;
  }

  // Populate Select dropdown
  if (busSelect) {
    busSelect.innerHTML = allBuses.map(b => `
      <option value="${b.id}" ${b.id === currentBus.id ? 'selected' : ''}>
        ${b.number} (${b.type}) — ${b.routeName}
      </option>
    `).join('');

    busSelect.addEventListener('change', (e) => {
      const selected = allBuses.find(b => b.id === e.target.value);
      if (selected) {
        currentBus = selected;
        progress = 0.1;
        updateHUD();
      }
    });
  }

  const resizeCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Get Interpolated Waypoint along path
  const getPosition = (t) => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const segCount = STOPS.length - 1;
    const segIndex = Math.min(Math.floor(t * segCount), segCount - 1);
    const segT = (t * segCount) - segIndex;

    const p0 = STOPS[segIndex];
    const p1 = STOPS[segIndex + 1];

    return {
      x: (p0.x + (p1.x - p0.x) * segT) * w,
      y: (p0.y + (p1.y - p0.y) * segT) * h,
      stopIndex: segIndex
    };
  };

  const updateHUD = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const pos = getPosition(progress);
    const currentStop = STOPS[pos.stopIndex];
    const nextStop = STOPS[Math.min(pos.stopIndex + 1, STOPS.length - 1)];

    const remainingDistance = Math.max(0.2, (currentBus.distanceKm * (1 - progress))).toFixed(1);
    const remainingEta = Math.max(1, Math.round(currentBus.etaMinutes * (1 - progress)));
    const currentSpeed = Math.round(30 + Math.sin(progress * 50) * 8);

    if (hudBusNum) hudBusNum.textContent = currentBus.number;
    if (hudOperator) hudOperator.textContent = `${currentBus.type} Bus • Route ${currentBus.routeId || '101'}`;
    if (hudLocation) hudLocation.textContent = currentStop.name;
    if (hudDestination) hudDestination.textContent = currentBus.to;
    if (hudDistance) hudDistance.textContent = `${remainingDistance} km`;
    if (hudSpeed) hudSpeed.textContent = currentSpeed;
    if (hudEta) hudEta.textContent = `${remainingEta} min`;
    if (hudStatus) hudStatus.textContent = currentBus.status;
    if (hudCrowd) hudCrowd.textContent = currentBus.crowd;

    // Render Timeline
    if (timelineContainer) {
      timelineContainer.innerHTML = STOPS.map((stop, idx) => {
        let statusClass = '';
        if (idx < pos.stopIndex) statusClass = 'passed';
        else if (idx === pos.stopIndex) statusClass = 'active';

        return `
          <div class="timeline-step ${statusClass}">
            <div class="timeline-dot"></div>
            <div>
              <div style="font-size:0.85rem; font-weight:600; color:${idx === pos.stopIndex ? '#38bdf8' : '#cbd5e1'};">
                ${stop.name}
              </div>
              <div style="font-size:0.7rem; color:var(--text-dim);">Scheduled: ${stop.time}</div>
            </div>
          </div>
        `;
      }).join('');
    }
  };

  let pulseAngle = 0;

  const renderMap = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Map Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Draw Route Road Highway Path
    ctx.beginPath();
    STOPS.forEach((stop, i) => {
      const sx = stop.x * w;
      const sy = stop.y * h;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    });
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.strokeStyle = 'rgba(37, 99, 235, 0.8)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 3. Draw Station Stops
    STOPS.forEach((stop, i) => {
      const sx = stop.x * w;
      const sy = stop.y * h;

      // Stop Outer Ring
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#07111f';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stop Center Dot
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.fill();

      // Station Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(stop.name, sx + 12, sy + 4);
    });

    // 4. Draw Animated Bus GPS Marker
    const pos = getPosition(progress);

    // Radar GPS Pulse
    pulseAngle += 0.05;
    const pulseRad = 15 + Math.sin(pulseAngle) * 8;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pulseRad, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bus Icon Badge Bubble
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚌', pos.x, pos.y + 4.5);

    // Callout Tag
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(pos.x - 45, pos.y - 38, 90, 22);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(pos.x - 45, pos.y - 38, 90, 22);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText(currentBus.number, pos.x, pos.y - 24);

    // Step Simulation
    if (isPlaying) {
      progress += 0.0008 * simSpeed;
      if (progress >= 1) progress = 0;
      updateHUD();
    }

    requestAnimationFrame(renderMap);
  };

  // Simulation Controls
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playPauseBtn.innerHTML = isPlaying ? '⏸️ Pause' : '▶️ Resume';
    });
  }

  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      if (simSpeed === 1) simSpeed = 2;
      else if (simSpeed === 2) simSpeed = 5;
      else simSpeed = 1;
      speedBtn.textContent = `⚡ ${simSpeed}x Speed`;
    });
  }

  updateHUD();
  renderMap();
});
