/* =====================================================
   GIFsForGenZ — Main JS (js/main.js)
   Homepage logic: trending, categories, hero search
   ===================================================== */

/* ── Shared Utilities ─────────────────────────────── */

/**
 * Debounce function
 */
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Top loading bar
 */
function startLoading() {
  const el = document.querySelector('.top-loader');
  if (el) el.style.width = '60%';
}

function stopLoading() {
  const el = document.querySelector('.top-loader');
  if (!el) return;

  el.style.width = '100%';
  setTimeout(() => {
    el.style.width = '0%';
  }, 300);
}

/**
 * Render skeleton placeholders in a grid container
 */
function renderSkeletons(container, count = 12) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'skeleton';
    container.appendChild(el);
  }
}

/**
 * Build a GIF card element
 */
function createGIFCard(gif) {
  const card = document.createElement('div');
  card.className = 'gif-card';

  const img = document.createElement('img');
  img.src = getGIFUrl(gif, 'preview');
  img.alt = getGIFTitle(gif);
  img.loading = 'lazy';

  const btn = document.createElement('button');
  btn.className = 'btn-icon';
  btn.innerText = '📋';

  // Position button
  btn.style.position = 'absolute';
  btn.style.top = '8px';
  btn.style.right = '8px';
  btn.style.zIndex = '2';

  const fullUrl = getGIFUrl(gif, 'full');

  // 🔥 Copy instantly
  btn.onclick = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast('Copied! Share it 💀', '🔥');
    } catch {
      showToast('Copy failed', '⚠️');
    }
  };

  card.appendChild(img);
  card.appendChild(btn);

  // 🔥 CLICK FEEDBACK (feels premium)
  card.onclick = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast('Copied + Opening... 💀', '🔥');
    } catch {
      showToast('Opening GIF...', '👀');
    }

    setTimeout(() => {
      window.location.href = `gif.html?id=${gif.id}`;
    }, 150);
  };

  card.addEventListener('contextmenu', async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast('Copied instantly ⚡', '📋');
    } catch {
      showToast('Copy failed', '⚠️');
    }
  });

  card.addEventListener('dblclick', async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast('Double tap copied 💀', '🔥');
    } catch {
      showToast('Copy failed', '⚠️');
    }
  });

  return card;
}

/**
 * Show a toast notification
 */
function showToast(msg, emoji = '✅') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${emoji}</span> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}

/**
 * Scroll-to-top button
 */
function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Nav Search Redirect ──────────────────────────── */
function initNavSearch() {
  const input = document.querySelector('.nav-search-input');
  if (!input) return;

  function goSearch() {
    const q = input.value.trim();
    if (q) {
      window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    }
  }

  // Enter key
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') goSearch();
  });

  // Debounced typing (auto search)
  const debouncedSearch = debounce((value) => {
    if (value.length > 2) {
      window.location.href = `search.html?q=${encodeURIComponent(value)}`;
    }
  }, 500);

  input.addEventListener('input', e => {
    debouncedSearch(e.target.value);
  });

  // Blur (optional UX)
  input.addEventListener('blur', goSearch);
}

/* ── Homepage Specific ────────────────────────────── */
async function initHomepage() {
  const heroInput = document.getElementById('heroSearch');
  const heroBtn = document.getElementById('heroSearchBtn');

  function doHeroSearch() {
    const q = heroInput?.value.trim();
    if (q) {
      window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    }
  }

  // ✅ BUTTON CLICK
  if (heroBtn) {
    heroBtn.addEventListener('click', doHeroSearch);
  }

  // ✅ ENTER KEY
  if (heroInput) {
    heroInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doHeroSearch();
    });
  }

  // 🔥 DEBUG (optional)
  console.log('Hero search initialized');

  // Trending GIFs
  const trendingGrid = document.getElementById('trendingGrid');
  if (trendingGrid) {
    renderSkeletons(trendingGrid, 12);

    startLoading();
    const { gifs } = await getTrendingGIFs(12);
    stopLoading();

    trendingGrid.innerHTML = '';

    if (gifs.length) {
      gifs.forEach(gif => trendingGrid.appendChild(createGIFCard(gif)));
    } else {
      trendingGrid.innerHTML = `
        <div class="empty-state">
          <div class="big-emoji">😵</div>
          <h3>Couldn't load GIFs</h3>
          <p>Check your internet connection</p>
        </div>`;
    }
  }
}

/* ── Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-fade');
  initNavSearch();
  initScrollTop();

  // Only run homepage logic on index.html
  if (document.getElementById('heroSearch') !== null) {
    initHomepage();
  }
});