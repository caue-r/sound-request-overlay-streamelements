const DEFAULTS = { channel: '', theme: 'classic', position: 'bottom-left', accent: '#8b5cf6', width: '460', label: 'Tocando agora',
                   showFor: '0', requester: true, next: true, progress: true };
const $ = (id) => document.getElementById(id);
const base = new URL('overlay.html', location.href).href;

let state = { ...DEFAULTS };
try { Object.assign(state, JSON.parse(localStorage.getItem('np-config') || '{}')); } catch {}

// ---- sincroniza estado -> controles ----
function paint() {
  for (const k of ['channel', 'width', 'label', 'showFor']) $(k).value = state[k];
  for (const k of ['requester', 'next', 'progress']) $(k).checked = state[k];
  document.querySelectorAll('.theme').forEach((b) =>
    b.setAttribute('aria-pressed', b.dataset.theme === state.theme));
  document.querySelectorAll('.corners button').forEach((b) =>
    b.setAttribute('aria-pressed', b.dataset.pos === state.position));
  let preset = false;
  document.querySelectorAll('.swatch[data-color]').forEach((b) => {
    const on = b.dataset.color === state.accent; preset ||= on;
    b.setAttribute('aria-pressed', on);
  });
  const custom = document.querySelector('.swatch.custom');
  custom.setAttribute('aria-pressed', !preset);
  $('customColor').value = state.accent;
}

// ---- controles -> estado ----
for (const k of ['channel', 'width', 'label', 'showFor'])
  $(k).addEventListener('input', (e) => { state[k] = e.target.value; update(); });
for (const k of ['requester', 'next', 'progress'])
  $(k).addEventListener('change', (e) => { state[k] = e.target.checked; update(); });
document.querySelectorAll('.theme').forEach((b) =>
  b.addEventListener('click', () => { state.theme = b.dataset.theme; paint(); update(); }));
document.querySelectorAll('.corners button').forEach((b) =>
  b.addEventListener('click', () => { state.position = b.dataset.pos; paint(); update(); }));
document.querySelectorAll('.swatch[data-color]').forEach((b) =>
  b.addEventListener('click', () => { state.accent = b.dataset.color; paint(); update(); }));
$('customColor').addEventListener('input', (e) => { state.accent = e.target.value; paint(); update(); });

function buildParams() {
  const p = new URLSearchParams();
  p.set('channel', state.channel.trim());
  if (state.theme !== DEFAULTS.theme) p.set('theme', state.theme);
  if (state.position !== DEFAULTS.position) p.set('position', state.position);
  if (state.accent !== DEFAULTS.accent) p.set('accent', state.accent.slice(1));
  if (state.width && state.width !== DEFAULTS.width) p.set('width', state.width);
  if (state.label !== DEFAULTS.label) p.set('label', state.label);
  if (Number(state.showFor) > 0) p.set('showFor', state.showFor);
  for (const k of ['requester', 'next', 'progress']) if (!state[k]) p.set(k, '0');
  return p;
}

let previewTimer;
function update() {
  try { localStorage.setItem('np-config', JSON.stringify(state)); } catch {}
  const p = buildParams();
  const hasChannel = !!state.channel.trim();
  $('url').textContent = `${base}?${p}`;
  $('copy').disabled = !hasChannel;
  $('hint').textContent = hasChannel ? '' : 'Digite o canal para gerar a URL.';

  // com canal: prévia ao vivo do canal; sem canal: música de exemplo
  const channel = state.channel.trim();
  $('stageLabel').classList.toggle('live', hasChannel);
  $('stageText').textContent = hasChannel ? `Ao vivo · ${channel}` : 'Prévia · música de exemplo';
  fitPreview();

  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    const pv = new URLSearchParams(p);
    if (!hasChannel) pv.set('demo', '1');
    $('preview').src = `${base}?${pv}`;
  }, 600);
}

// mostra o card em tamanho real; só reduz se o palco for mais estreito que o card
function fitPreview() {
  const stage = $('stage'), frame = $('preview');
  // o tema "capa" é vertical: precisa de um palco mais alto e é mais estreito
  const cover = state.theme === 'cover';
  stage.style.height = cover ? '380px' : '';
  const width = Number(state.width) || 460;
  const needed = (cover ? Math.min(width, 320) : width) + 40;
  const scale = Math.min(1, stage.clientWidth / needed);
  frame.style.width = stage.clientWidth / scale + 'px';
  frame.style.height = stage.clientHeight / scale + 'px';
  frame.style.transform = `scale(${scale})`;
}
new ResizeObserver(fitPreview).observe($('stage'));

$('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('url').textContent); } catch { return; }
  $('copy').textContent = 'Copiado';
  setTimeout(() => $('copy').textContent = 'Copiar', 1400);
});

paint();
update();
