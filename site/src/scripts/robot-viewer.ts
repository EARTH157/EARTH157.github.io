// Robot switcher in the hero. Shows a rendered poster immediately; the live three.js
// scene (a separate chunk) loads when the hero is visible on desktop, or on request on touch devices.
// Callout labels float next to the point they describe, both on the poster and in 3D.
import type { RobotScene, ScreenPoint } from './robot-scene';

const SVG_NS = 'http://www.w3.org/2000/svg';
const EDGE_PAD = 6;
const SMOOTHING = 0.22;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function initRobotViewer(root: HTMLElement) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('.robot-tab')];
  const posters = [...root.querySelectorAll<HTMLElement>('[data-poster]')];
  const calloutSets = [...root.querySelectorAll<HTMLElement>('[data-callouts]')];
  const stage = root.querySelector<HTMLElement>('.robot-stage')!;
  const canvasHost = root.querySelector<HTMLElement>('.robot-canvas')!;
  const leaders = root.querySelector<SVGSVGElement>('.leaders')!;
  const status = root.querySelector<HTMLElement>('.robot-status')!;
  const toggle3d = root.querySelector<HTMLButtonElement>('.robot-3d-btn')!;
  const fig = root.querySelector<HTMLElement>('[data-fig]')!;
  const name = root.querySelector<HTMLElement>('[data-caption-name]')!;
  const meta = root.querySelector<HTMLElement>('[data-caption-meta]')!;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = !matchMedia('(hover: hover) and (pointer: fine)').matches;

  let index = 0;
  let scene: RobotScene | null = null;
  let starting = false;
  let showing3d = false;
  let placed: Box[] | null = null;
  let sizes: { w: number; h: number }[] | null = null;

  // One leader line + anchor dot per callout, reused across robots
  const lines = [0, 1, 2].map(() => {
    const line = document.createElementNS(SVG_NS, 'line');
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('r', '3.5');
    leaders.append(line, dot);
    return { line, dot };
  });

  const activeSet = () => calloutSets[index];
  const labels = () => [...activeSet().querySelectorAll<HTMLElement>('.callout')];

  function anchorsFor(i: number): number[][] {
    return [...calloutSets[i].querySelectorAll<HTMLElement>('[data-anchor]')].map((li) => JSON.parse(li.dataset.anchor!));
  }

  // Where each anchor sits on the rendered poster, as fractions of the stage
  function posterPoints(): { points: ScreenPoint[]; centre: ScreenPoint } | null {
    const set = activeSet();
    if (!set.dataset.posterCentre) return null;
    const { clientWidth: w, clientHeight: h } = stage;
    const [cx, cy] = JSON.parse(set.dataset.posterCentre);
    const points = labels().map((label) => {
      const [fx, fy] = JSON.parse(label.dataset.posterAnchor!);
      return { x: fx * w, y: fy * h };
    });
    return { points, centre: { x: cx * w, y: cy * h } };
  }

  function measure() {
    sizes = labels().map((label) => ({ w: label.offsetWidth, h: label.offsetHeight }));
  }

  // Each label goes out from its anchor, away from the robot's centre, then labels are
  // nudged apart and kept inside the stage.
  function targetBoxes(points: ScreenPoint[], centre: ScreenPoint, shown: boolean[]): Box[] {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const gap = W < 440 ? 20 : 34;
    const boxes = points.map((p, i) => {
      const { w, h } = sizes![i];
      let dx = p.x - centre.x;
      let dy = p.y - centre.y;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const ax = p.x + dx * gap;
      const ay = p.y + dy * gap;
      return { x: dx >= 0 ? ax : ax - w, y: ay - h / 2 + (dy * h) / 2, w, h };
    });
    const clamp = (b: Box) => {
      b.x = Math.min(Math.max(b.x, EDGE_PAD), W - b.w - EDGE_PAD);
      b.y = Math.min(Math.max(b.y, EDGE_PAD), H - b.h - EDGE_PAD);
    };
    boxes.forEach(clamp);
    for (let pass = 0; pass < 6; pass++) {
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          if (!shown[i] || !shown[j]) continue;
          const a = boxes[i];
          const b = boxes[j];
          const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) + 6;
          const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) + 6;
          if (overlapX <= 0 || overlapY <= 0) continue;
          const [first, second] = a.y <= b.y ? [a, b] : [b, a];
          first.y -= overlapY / 2;
          second.y += overlapY / 2;
          clamp(first);
          clamp(second);
        }
      }
    }
    return boxes;
  }

  function layout(points: ScreenPoint[], centre: ScreenPoint, smooth: boolean) {
    if (!sizes || sizes.length !== points.length) measure();
    // A point zoomed out of the stage takes its label and leader with it
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const shown = points.map((p) => p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H);
    const targets = targetBoxes(points, centre, shown);
    placed = targets.map((t, i) => {
      const prev = placed?.[i];
      if (!smooth || !prev) return t;
      return { ...t, x: prev.x + (t.x - prev.x) * SMOOTHING, y: prev.y + (t.y - prev.y) * SMOOTHING };
    });
    root.classList.add('is-floating');
    labels().forEach((label, i) => {
      const box = placed![i];
      label.style.transform = `translate(${box.x.toFixed(1)}px, ${box.y.toFixed(1)}px)`;
      label.style.visibility = shown[i] ? '' : 'hidden';
    });
    lines.forEach(({ line, dot }, i) => {
      const p = points[i];
      const box = placed![i];
      const show = Boolean(p && box && shown[i]);
      line.style.display = dot.style.display = show ? '' : 'none';
      if (!show) return;
      // Leader runs from the anchor to the nearest point on the label's edge
      const ex = Math.min(Math.max(p.x, box.x), box.x + box.w);
      const ey = Math.min(Math.max(p.y, box.y), box.y + box.h);
      line.setAttribute('x1', p.x.toFixed(1));
      line.setAttribute('y1', p.y.toFixed(1));
      line.setAttribute('x2', ex.toFixed(1));
      line.setAttribute('y2', ey.toFixed(1));
      dot.setAttribute('cx', p.x.toFixed(1));
      dot.setAttribute('cy', p.y.toFixed(1));
    });
  }

  function layoutPoster() {
    const poster = posterPoints();
    if (poster) layout(poster.points, poster.centre, false);
  }

  function setMode(on3d: boolean) {
    showing3d = on3d;
    root.classList.toggle('is-3d', on3d);
    scene?.setActive(on3d);
    if (touch) {
      toggle3d.hidden = false;
      toggle3d.textContent = on3d ? 'Show photo' : 'View in 3D';
      toggle3d.setAttribute('aria-pressed', String(on3d));
    }
    status.textContent = on3d ? (touch ? 'Swipe sideways to rotate · pinch to zoom' : 'Drag to rotate · Ctrl + scroll to zoom') : '';
    if (!on3d) layoutPoster();
  }

  function select(next: number) {
    index = (next + tabs.length) % tabs.length;
    const tab = tabs[index];
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
    posters.forEach((p, i) => (p.hidden = i !== index));
    calloutSets.forEach((c, i) => (c.hidden = i !== index));
    fig.textContent = String(index + 1).padStart(2, '0');
    name.textContent = tab.dataset.name ?? '';
    meta.textContent = tab.dataset.meta ?? '';
    placed = null;
    sizes = null;
    layoutPoster();
    if (scene && showing3d) showModel();
  }

  async function showModel() {
    root.classList.remove('is-3d');
    status.textContent = 'Loading 3D model…';
    try {
      const shown = await scene!.show(tabs[index].dataset.model!, anchorsFor(index));
      // false: the visitor picked another robot meanwhile, and that call takes over
      if (shown) setMode(true);
    } catch (error) {
      console.error('Could not load robot model', error);
      setMode(false);
    }
  }

  async function start3D() {
    if (scene) {
      setMode(true);
      return showModel();
    }
    if (starting) return;
    starting = true;
    toggle3d.hidden = true;
    status.textContent = 'Loading 3D model…';
    try {
      const { createRobotScene } = await import('./robot-scene');
      scene = createRobotScene(canvasHost, { reduceMotion, touch });
      scene.onFrame((points, centre) => {
        if (showing3d) layout(points, centre, true);
      });
      showing3d = true;
      await showModel();
    } catch (error) {
      console.error('Could not start the 3D viewer', error);
      setMode(false);
    } finally {
      starting = false;
    }
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
  root.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.dataset.zoom === 'reset') scene?.resetView();
      else scene?.zoom(b.dataset.zoom === 'in' ? 0.75 : 1 / 0.75);
    }),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) =>
    b.addEventListener('click', () => select(index + Number(b.dataset.step))),
  );

  // Label sizes change with the stage (compact labels on small stages)
  new ResizeObserver(() => {
    sizes = null;
    placed = null;
    if (!showing3d) layoutPoster();
  }).observe(stage);
  document.fonts?.ready.then(() => {
    sizes = null;
    if (!showing3d) layoutPoster();
  });
  layoutPoster();

  if (touch) {
    toggle3d.hidden = false;
    toggle3d.addEventListener('click', () => (showing3d ? setMode(false) : start3D()));
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        start3D();
      }
    });
    observer.observe(root);
  }
}
