// Robot switcher in the hero. Shows a rendered poster immediately; the live three.js
// scene (a separate chunk) loads when the hero is visible on desktop, or on request on touch devices.
import type { RobotScene } from './robot-scene';

export function initRobotViewer(root: HTMLElement) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('.robot-tab')];
  const posters = [...root.querySelectorAll<HTMLElement>('[data-poster]')];
  const calloutSets = [...root.querySelectorAll<HTMLElement>('[data-callouts]')];
  const canvasHost = root.querySelector<HTMLElement>('.robot-canvas')!;
  const status = root.querySelector<HTMLElement>('.robot-status')!;
  const button3d = root.querySelector<HTMLButtonElement>('.robot-3d-btn')!;
  const fig = root.querySelector<HTMLElement>('[data-fig]')!;
  const name = root.querySelector<HTMLElement>('[data-name]')!;
  const meta = root.querySelector<HTMLElement>('[data-meta]')!;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const autoLoad = matchMedia('(hover: hover) and (pointer: fine)').matches;

  let index = 0;
  let scene: RobotScene | null = null;
  let starting = false;

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
    if (scene) showModel();
  }

  async function showModel() {
    const url = tabs[index].dataset.model!;
    root.classList.remove('is-3d');
    status.textContent = 'Loading 3D model…';
    try {
      await scene!.show(url);
      if (tabs[index].dataset.model === url) {
        root.classList.add('is-3d');
        status.textContent = 'Drag to rotate';
      }
    } catch (error) {
      console.error('Could not load robot model', error);
      status.textContent = '';
    }
  }

  async function start3D() {
    if (starting) return;
    starting = true;
    button3d.hidden = true;
    status.textContent = 'Loading 3D model…';
    try {
      const { createRobotScene } = await import('./robot-scene');
      scene = createRobotScene(canvasHost, { reduceMotion });
      await showModel();
    } catch (error) {
      console.error('Could not start the 3D viewer', error);
      status.textContent = '';
    }
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) =>
    b.addEventListener('click', () => select(index + Number(b.dataset.step))),
  );

  if (autoLoad) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        start3D();
      }
    });
    observer.observe(root);
  } else {
    button3d.hidden = false;
    button3d.addEventListener('click', start3D);
  }
}
