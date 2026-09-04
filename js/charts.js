/**
 * BusTrack AI - Native HTML5 Canvas Chart Engine
 * Zero external libraries. High-performance, responsive, retina-sharp, dark-theme charts.
 */

class BusTrackChart {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.options = Object.assign({
      type: 'line', // 'line', 'bar', 'donut', 'area'
      data: { labels: [], datasets: [] },
      colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#f87171'],
      showGrid: true,
      showLegend: true,
      animate: true,
      padding: { top: 20, right: 20, bottom: 40, left: 45 }
    }, options);

    this.init();
  }

  init() {
    this.setupRetina();
    window.addEventListener('resize', () => {
      this.setupRetina();
      this.render();
    });
    this.render();
  }

  setupRetina() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || this.canvas.width || 400;
    this.height = rect.height || this.canvas.height || 250;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  updateData(newData) {
    this.options.data = newData;
    this.render();
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const { ctx, width, height, options } = this;
    ctx.clearRect(0, 0, width, height);

    if (options.type === 'donut') {
      this.renderDonut();
    } else if (options.type === 'bar') {
      this.renderBar();
    } else {
      this.renderLine();
    }
  }

  renderLine() {
    const { ctx, width, height, options } = this;
    const { labels, datasets } = options.data;
    if (!datasets || datasets.length === 0) return;

    const pad = options.padding;
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    // Calculate max value
    let maxVal = 0;
    datasets.forEach(ds => {
      ds.data.forEach(val => { if (val > maxVal) maxVal = val; });
    });
    maxVal = Math.ceil(maxVal * 1.15) || 10;

    // Draw Grid Lines & Y-Axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';

    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const y = pad.top + (plotH / ySteps) * i;
      const val = Math.round(maxVal - (maxVal / ySteps) * i);
      
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();

      ctx.fillText(val, pad.left - 8, y + 3);
    }

    // Draw X-Axis Labels
    ctx.textAlign = 'center';
    const xStep = plotW / (labels.length - 1 || 1);
    labels.forEach((lbl, idx) => {
      const x = pad.left + xStep * idx;
      ctx.fillText(lbl, x, height - pad.bottom + 18);
    });

    // Draw Datasets
    datasets.forEach((ds, dsIdx) => {
      const color = ds.color || options.colors[dsIdx % options.colors.length];
      const points = ds.data.map((val, idx) => ({
        x: pad.left + xStep * idx,
        y: pad.top + plotH - (val / maxVal) * plotH
      }));

      // Draw Area if needed
      if (options.type === 'area' || ds.fill) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, pad.top + plotH);
        points.forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.lineTo(points[points.length - 1].x, pad.top + plotH);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
        grad.addColorStop(0, color.replace(')', ', 0.35)').replace('rgb', 'rgba').replace('#', 'rgba('));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ds.gradient || 'rgba(56, 189, 248, 0.15)';
        ctx.fill();
      }

      // Draw Curve / Line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else {
          const prev = points[idx - 1];
          const cx = (prev.x + pt.x) / 2;
          ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
        }
      });
      ctx.stroke();

      // Draw Data Dots
      points.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#07111f';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });
  }

  renderBar() {
    const { ctx, width, height, options } = this;
    const { labels, datasets } = options.data;
    if (!datasets || datasets.length === 0) return;

    const pad = options.padding;
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    let maxVal = 0;
    datasets.forEach(ds => {
      ds.data.forEach(val => { if (val > maxVal) maxVal = val; });
    });
    maxVal = Math.ceil(maxVal * 1.15) || 10;

    // Y Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';

    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const y = pad.top + (plotH / ySteps) * i;
      const val = Math.round(maxVal - (maxVal / ySteps) * i);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(val, pad.left - 8, y + 3);
    }

    // Bars
    const groupW = plotW / labels.length;
    const barW = Math.min((groupW * 0.7) / datasets.length, 28);

    labels.forEach((lbl, gIdx) => {
      const groupX = pad.left + groupW * gIdx;
      
      // X Label
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(lbl, groupX + groupW / 2, height - pad.bottom + 18);

      datasets.forEach((ds, dsIdx) => {
        const val = ds.data[gIdx] || 0;
        const barH = (val / maxVal) * plotH;
        const x = groupX + (groupW - barW * datasets.length) / 2 + dsIdx * barW;
        const y = pad.top + plotH - barH;
        const color = ds.colors ? ds.colors[gIdx] : (ds.color || options.colors[dsIdx % options.colors.length]);

        // Rounded top bar
        ctx.fillStyle = color;
        ctx.beginPath();
        const r = 4;
        ctx.moveTo(x, y + barH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, y + barH);
        ctx.closePath();
        ctx.fill();
      });
    });
  }

  renderDonut() {
    const { ctx, width, height, options } = this;
    const { labels, datasets } = options.data;
    if (!datasets || datasets.length === 0) return;

    const ds = datasets[0];
    const total = ds.data.reduce((a, b) => a + b, 0) || 1;
    const cx = width / 2;
    const cy = height / 2 - 10;
    const radius = Math.min(width, height) * 0.36;
    const innerRadius = radius * 0.65;

    let startAngle = -Math.PI / 2;

    ds.data.forEach((val, idx) => {
      const sliceAngle = (val / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      const color = ds.colors ? ds.colors[idx] : options.colors[idx % options.colors.length];

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#07111f';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Center info
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(total.toLocaleString(), cx, cy + 5);
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(ds.label || 'Total', cx, cy + 20);
  }
}

window.BusTrackChart = BusTrackChart;
