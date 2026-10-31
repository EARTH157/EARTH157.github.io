// Robot switcher in the hero. Shows a rendered poster immediately; the live three.js
// scene (a separate chunk) loads when the hero is visible on desktop, or on request on touch devices.
import type { RobotScene, ScreenPoint } from './robot-scene';

const SVG_NS = 'http://www.w3.org/2000/svg';

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

  // One leader line + anchor dot per callout slot, reused across robots
  const lines = [0, 1, 2].map(() => {
    const line = document.createElementNS(SVG_NS, 'line');
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('r', '3.5');
    leaders.append(line, dot);
    return { line, dot };
  });

  function activeCallouts() {
    return calloutSets.find((c) => !c.hidden);
  }

  function anchorsFor(i: number): number[][] {
    const set = calloutSets.find((c) => c.dataset.callouts === tabs[i].dataset.robot);
    return [...(set?.querySelectorAll<HTMLElement>('[data-anchor]') ?? [])].map((li) => JSON.parse(li.dataset.anchor!));
  }

  // Leader starts at the side of each label that faces the robot, level with its title
  function labelPoints() {
    const stageBox = stage.getBoundingClientRect();
    return [...(activeCallouts()?.querySelectorAll<HTMLElement>('.callout') ?? [])].map((label) => {
      const box = label.getBoundingClientRect();
      const facesLeft = !label.classList.contains('callout-1');
      return { x: (facesLeft ? box.left - 8 : box.right + 8) - stageBox.left, y: box.top + 8 - stageBox.top };
    });
  }

  function drawLeaders(points: ScreenPoint[]) {
    const starts = labelPoints();
    lines.forEach(({ line, dot }, i) => {
      const from = starts[i];
      const to = points[i];
      const show = Boolean(from && to);
      line.style.display = dot.style.display = show ? '' : 'none';
      if (!show) return;
      line.setAttribute('x1', String(from.x));
      line.setAttribute('y1', String(from.y));
      line.setAttribute('x2', String(to.x));
      line.setAttribute('y2', String(to.y));
      dot.setAttribute('cx', String(to.x));
      dot.setAttribute('cy', String(to.y));
      // Points turned away from the camera fade so the line doesn't point at the back of the robot
      line.classList.toggle('is-behind', !to.front);
      dot.classList.toggle('is-behind', !to.front);
    });
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
    status.textContent = on3d ? (touch ? 'Swipe sideways to rotate' : 'Drag to rotate') : '';
  }

  function select(next: number) {
    index = (next + tabs.length) % tabs.length;
    const tab = tabs[index];
    const id = tab.dataset.robot;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
    posters.forEach((p) => (p.hidden = p.dataset.poster !== id));
    calloutSets.forEach((c) => (c.hidden = c.dataset.callouts !== id));
    fig.textContent = String(index + 1).padStart(2, '0');
    name.textContent = tab.dataset.name ?? '';
    meta.textContent = tab.dataset.meta ?? '';
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
      scene.onFrame(drawLeaders);
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
  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) =>
    b.addEventListener('click', () => select(index + Number(b.dataset.step))),
  );

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
