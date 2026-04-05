/* =====================================================
   GIFsForGenZ — Search JS (js/search.js)
   Handles search.html: query, grid, load more
   ===================================================== */

const BATCH = 24;
let currentQuery = '';
let currentOffset = 0;
let totalResults = 0;
let isLoading = false;

async function initSearch() {
  const params = new URLSearchParams(window.location.search);
  currentQuery = params.get('q') || '';

  // ✅ SAVE RECENT SEARCH (correct place)
  if (currentQuery) {
    localStorage.setItem('recentSearch', currentQuery);
  }

  // Populate inputs
  const heroInput = document.getElementById('searchPageInput');
  const navInput = document.querySelector('.nav-search-input');
  if (heroInput) heroInput.value = currentQuery;
  if (navInput) navInput.value = currentQuery;

  // Update page meta
  const querySpan = document.getElementById('searchQueryDisplay');
  if (querySpan) querySpan.textContent = currentQuery || 'Trending';

  const titleEl = document.getElementById('searchResultsTitle');
  if (titleEl) titleEl.textContent = currentQuery
    ? `Results for "${currentQuery}"`
    : 'Trending GIFs';

  // Load data
  if (!currentQuery) {
    await loadTrending();
  } else {
    await loadResults(true);
  }

  // ✅ SHOW RECENT SEARCH UI
  const recent = localStorage.getItem('recentSearch');
  const box = document.getElementById('recentSearchBox');

  if (recent && box) {
    box.innerHTML = `
      <p style="margin-top:10px;color:#777;font-size:0.85rem">
        🔁 Recent:
        <a href="search.html?q=${encodeURIComponent(recent)}"
           style="color:#a855f7;font-weight:600;text-decoration:none">
          ${recent}
        </a>
      </p>
    `;
  }

  // Search input handler
  const searchBtn = document.getElementById('searchPageBtn');
  function doSearch() {
    const val = heroInput?.value.trim();
    if (val && val !== currentQuery) {
      window.location.href = `search.html?q=${encodeURIComponent(val)}`;
    }
  }

  searchBtn?.addEventListener('click', doSearch);
  heroInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });

  // Load More
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn?.addEventListener('click', async () => {
    if (isLoading) return;
    if (currentQuery) await loadResults(false);
    else await loadTrending(false);
  });
}

async function loadResults(fresh = false) {
  if (fresh) currentOffset = 0;
  isLoading = true;

  const grid = document.getElementById('searchGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const countEl = document.getElementById('resultCount');

  if (fresh) renderSkeletons(grid, BATCH);
  else if (loadMoreBtn) loadMoreBtn.textContent = 'Loading...';

  startLoading();
  const { gifs, total } = await searchGIFs(currentQuery, BATCH, currentOffset);
  stopLoading();

  totalResults = total;

  if (fresh) grid.innerHTML = '';
  gifs.forEach(gif => grid.appendChild(createGIFCard(gif)));

  if (countEl) countEl.textContent = `${total.toLocaleString()} GIFs found`;

  currentOffset += gifs.length;

  if (!gifs.length && fresh) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="big-emoji">�</div>
        <h3>Nothing here bro...</h3>
        <p>Try something less cursed 😭</p>
        <a href="search.html?q=funny" class="btn btn-primary" style="margin-top:12px">
          Show Funny GIFs
        </a>
      </div>
    `;
  }

  if (loadMoreBtn) {
    const hasMore = currentOffset < totalResults && gifs.length === BATCH;
    loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
    loadMoreBtn.textContent = 'Load More';
  }

  isLoading = false;
}

async function loadTrending(fresh = true) {
  isLoading = true;

  const grid = document.getElementById('searchGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const countEl = document.getElementById('resultCount');

  if (fresh) renderSkeletons(grid, BATCH);
  else if (loadMoreBtn) loadMoreBtn.textContent = 'Loading...';

  startLoading();
  const { gifs, total } = await getTrendingGIFs(BATCH, currentOffset);
  stopLoading();

  totalResults = total;

  if (fresh) grid.innerHTML = '';
  gifs.forEach(gif => grid.appendChild(createGIFCard(gif)));

  if (countEl) countEl.textContent = 'Trending right now';

  currentOffset += gifs.length;

  if (loadMoreBtn) {
    loadMoreBtn.style.display = gifs.length === BATCH ? 'inline-flex' : 'none';
    loadMoreBtn.textContent = 'Load More';
  }

  isLoading = false;
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-fade');
  initNavSearch();
  initScrollTop();
  initSearch();
});