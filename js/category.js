/* =====================================================
   GIFsForGenZ — Category JS (js/category.js)
   Handles category.html: category selection + GIF grid
   ===================================================== */

const CATEGORIES = [
  { id: 'relatable', label: 'Relatable', emoji: '💀', query: 'relatable meme' },
  { id: 'angry',     label: 'Angry',     emoji: '😤', query: 'angry reaction' },
  { id: 'sigma',     label: 'Sigma',     emoji: '🗿', query: 'sigma grindset' },
  { id: 'cringe',    label: 'Cringe',    emoji: '😬', query: 'cringe awkward' },
  { id: 'study',     label: 'Study',     emoji: '📚', query: 'studying stressed' },
  { id: 'gaming',    label: 'Gaming',    emoji: '🎮', query: 'gaming reaction' },
  { id: 'vibes',     label: 'Vibes',     emoji: '✨', query: 'good vibes aesthetic' },
  { id: 'wholesome', label: 'Wholesome', emoji: '🥺', query: 'wholesome cute' },
];

let currentCat = null;
let catOffset = 0;
let catTotal = 0;
let catLoading = false;

function buildCategoryCards() {
  const grid = document.getElementById('categoryCardGrid');
  if (!grid) return;
  grid.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const a = document.createElement('a');
    a.href = `category.html?cat=${cat.id}`;
    a.className = 'cat-card';
    a.dataset.cat = cat.id;
    a.innerHTML = `
      <div class="cat-card-emoji">${cat.emoji}</div>
      <div class="cat-card-name">${cat.label}</div>
      <div class="cat-card-count">Browse GIFs →</div>
    `;
    grid.appendChild(a);
  });
}

async function loadCategoryGIFs(fresh = true) {
  if (!currentCat || catLoading) return;
  catLoading = true;

  const grid = document.getElementById('catGifGrid');
  const loadMoreBtn = document.getElementById('catLoadMore');

  if (fresh) { catOffset = 0; renderSkeletons(grid, 24); }
  else if (loadMoreBtn) loadMoreBtn.textContent = 'Loading...';

  const { gifs, total } = await searchGIFs(currentCat.query, 24, catOffset);
  catTotal = total;

  if (fresh) grid.innerHTML = '';
  gifs.forEach(gif => grid.appendChild(createGIFCard(gif)));

  if (!gifs.length && fresh) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="big-emoji">${currentCat.emoji}</div>
      <h3>No GIFs found</h3>
      <p>Try another category!</p>
    </div>`;
  }

  catOffset += gifs.length;
  if (loadMoreBtn) {
    const hasMore = catOffset < catTotal && gifs.length === 24;
    loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
    loadMoreBtn.textContent = 'Load More';
  }

  catLoading = false;
}

function highlightActiveChip(id) {
  document.querySelectorAll('.cat-chip-nav').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.catId === id);
  });
}

function buildCategoryChips() {
  const row = document.getElementById('catChipsRow');
  if (!row) return;
  row.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-chip cat-chip-nav';
    btn.dataset.catId = cat.id;
    btn.innerHTML = `<span class="cat-emoji">${cat.emoji}</span><span class="cat-label">${cat.label}</span>`;
    btn.addEventListener('click', () => {
      currentCat = cat;
      highlightActiveChip(cat.id);
      // Update URL without reload
      const url = new URL(window.location.href);
      url.searchParams.set('cat', cat.id);
      history.replaceState({}, '', url);
      // Update section title
      const titleEl = document.getElementById('catSectionTitle');
      if (titleEl) titleEl.textContent = `${cat.emoji} ${cat.label} GIFs`;
      loadCategoryGIFs(true);
    });
    row.appendChild(btn);
  });
}

async function initCategory() {
  buildCategoryCards();
  buildCategoryChips();

  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');

  const gifSection = document.getElementById('catGifSection');

  if (catParam) {
    currentCat = CATEGORIES.find(c => c.id === catParam) || CATEGORIES[0];
    highlightActiveChip(currentCat.id);
    const titleEl = document.getElementById('catSectionTitle');
    if (titleEl) titleEl.textContent = `${currentCat.emoji} ${currentCat.label} GIFs`;
    if (gifSection) gifSection.style.display = 'block';
    await loadCategoryGIFs(true);
  } else {
    if (gifSection) gifSection.style.display = 'none';
  }

  const loadMoreBtn = document.getElementById('catLoadMore');
  loadMoreBtn?.addEventListener('click', () => loadCategoryGIFs(false));
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-fade');
  initNavSearch();
  initScrollTop();
  initCategory();
});
