/**
 * BusTrack AI - Transport Minister Command Center Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // STRICT ROLE PROTECTION: Only Minister (and Admin) can view
  AuthManager.enforceRoleProtection(['minister', 'admin']);

  const canvas = document.getElementById('regional-map-canvas');
  const regionOverlay = document.getElementById('region-detail-overlay');
  const regionNameEl = document.getElementById('region-name');
  const regionBusesEl = document.getElementById('region-buses');
  const regionDemandEl = document.getElementById('region-demand');
  const regionDelayEl = document.getElementById('region-delay');
  const regionRatingEl = document.getElementById('region-rating');

  const printReportBtn = document.getElementById('print-minister-report-btn');
  const saveC29Btn = document.getElementById('save-c29-data-btn');

  // Regional Hub Nodes
  const REGIONS = [
    { id: 'A', name: 'Region A: Coimbatore Metro Hub', x: 0.28, y: 0.65, buses: 320, demand: 'High (8,900 / hr)', delay: '+3.8m', rating: '4.4★', color: '#06b6d4' },
    { id: 'B', name: 'Region B: Chennai Capital Corridor', x: 0.75, y: 0.25, buses: 480, demand: 'Very High (14,200 / hr)', delay: '+5.4m', rating: '4.2★', color: '#8b5cf6' },
    { id: 'C', name: 'Region C: Madurai Cultural Gateway', x: 0.45, y: 0.82, buses: 240, demand: 'Moderate (5,600 / hr)', delay: '+2.9m', rating: '4.5★', color: '#10b981' },
    { id: 'D', name: 'Region D: Bengaluru Inter-State Link', x: 0.35, y: 0.28, buses: 210, demand: 'High (6,500 / hr)', delay: '+4.1m', rating: '4.6★', color: '#f59e0b' }
  ];

  let selectedRegion = REGIONS[0];
  let pulseTimer = 0;

  // 1. Regional Map Canvas
  if (canvas) {
    const ctx = canvas.getContext('2d');

    const resizeMap = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resizeMap);
    resizeMap();

    const drawMap = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 45) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 45) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Draw State Inter-Connect Corridor Lines
      ctx.lineWidth = 2;
      for (let i = 0; i < REGIONS.length; i++) {
        for (let j = i + 1; j < REGIONS.length; j++) {
          const r1 = REGIONS[i];
          const r2 = REGIONS[j];
          ctx.beginPath();
          ctx.moveTo(r1.x * w, r1.y * h);
          ctx.lineTo(r2.x * w, r2.y * h);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw Regional Glowing Nodes
      pulseTimer += 0.04;
      REGIONS.forEach(reg => {
        const rx = reg.x * w;
        const ry = reg.y * h;
        const isSel = reg.id === selectedRegion.id;

        // Outer glow
        const pulse = 16 + Math.sin(pulseTimer) * 6;
        ctx.beginPath();
        ctx.arc(rx, ry, isSel ? pulse + 4 : 14, 0, Math.PI * 2);
        ctx.fillStyle = reg.color.replace(')', ', 0.2)').replace('rgb', 'rgba').replace('#', 'rgba(');
        ctx.fill();

        // Node Circle
        ctx.beginPath();
        ctx.arc(rx, ry, isSel ? 10 : 7, 0, Math.PI * 2);
        ctx.fillStyle = reg.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(reg.name.split(':')[0], rx, ry - 16);
      });

      requestAnimationFrame(drawMap);
    };

    drawMap();

    // Click to Select Region
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / rect.width;
      const clickY = (e.clientY - rect.top) / rect.height;

      REGIONS.forEach(reg => {
        const dx = reg.x - clickX;
        const dy = reg.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.1) {
          selectedRegion = reg;
          updateRegionOverlay();
          UI.showToast(`Selected ${reg.name}`, 'info', 1500);
        }
      });
    });
  }

  const updateRegionOverlay = () => {
    if (regionNameEl) regionNameEl.textContent = selectedRegion.name;
    if (regionBusesEl) regionBusesEl.textContent = `${selectedRegion.buses} Units`;
    if (regionDemandEl) regionDemandEl.textContent = selectedRegion.demand;
    if (regionDelayEl) regionDelayEl.textContent = selectedRegion.delay;
    if (regionRatingEl) regionRatingEl.textContent = selectedRegion.rating;
  };

  // 2. State-Level AI Charts
  const initMinisterCharts = () => {
    // Chart 1: State Passenger Flow (Area)
    new BusTrackChart('chart-minister-flow', {
      type: 'area',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Daily Commuters (Thousands)',
          data: [32.4, 34.1, 35.8, 36.2, 41.5, 46.8, 39.2],
          color: '#8b5cf6'
        }]
      }
    });

    // Chart 2: Govt vs Private Fleet Usage (Bar)
    new BusTrackChart('chart-minister-fleet-split', {
      type: 'bar',
      data: {
        labels: ['City Link', 'Express', 'Intercity', 'AC Sleeper', 'Rural Feeder'],
        datasets: [
          { label: 'Government', data: [85, 78, 62, 35, 95], color: '#10b981' },
          { label: 'Private', data: [15, 22, 38, 65, 5], color: '#8b5cf6' }
        ]
      }
    });

    // Chart 3: Booking & Route Intelligence (Bar)
    new BusTrackChart('chart-minister-routes', {
      type: 'bar',
      data: {
        labels: ['CBE-CHE', 'CBE-MDU', 'CBE-BLR', 'CHE-MDU', 'CBE-SLM'],
        datasets: [{
          label: 'Daily Bookings',
          data: [420, 290, 380, 510, 190],
          color: '#06b6d4'
        }]
      }
    });

    // Chart 4: Public Satisfaction by Factor (Donut)
    new BusTrackChart('chart-minister-satisfaction', {
      type: 'donut',
      data: {
        labels: ['Punctuality', 'Affordability', 'Comfort', 'Safety'],
        datasets: [{
          label: 'Satisfaction',
          data: [38, 32, 18, 12],
          colors: ['#38bdf8', '#34d399', '#fbbf24', '#f472b6']
        }]
      }
    });
  };

  // 3. C29 Field Observation Inputs (Academic integrity)
  const initC29Inputs = () => {
    const c29Wait = document.getElementById('c29-waiting-time');
    const c29Count = document.getElementById('c29-passenger-count');
    const c29Freq = document.getElementById('c29-frequency');

    // Load from localStorage if present
    if (c29Wait) c29Wait.value = localStorage.getItem('c29_wait') || '';
    if (c29Count) c29Count.value = localStorage.getItem('c29_count') || '';
    if (c29Freq) c29Freq.value = localStorage.getItem('c29_freq') || '';

    if (saveC29Btn) {
      saveC29Btn.addEventListener('click', () => {
        if (c29Wait) localStorage.setItem('c29_wait', c29Wait.value);
        if (c29Count) localStorage.setItem('c29_count', c29Count.value);
        if (c29Freq) localStorage.setItem('c29_freq', c29Freq.value);
        UI.showToast('✅ C29 Field Observation Data saved to local storage.', 'success');
      });
    }
  };

  // Report Actions
  const openReportModalBtn = document.getElementById('open-minister-report-btn');
  if (openReportModalBtn) {
    openReportModalBtn.addEventListener('click', () => {
      UI.openModal('minister-report-modal');
    });
  }

  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  updateRegionOverlay();
  initC29Inputs();
  setTimeout(initMinisterCharts, 100);
});
