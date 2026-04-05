/* =====================================================
   GIFsForGenZ — GIF Detail JS (js/gif.js)
   Handles gif.html: display, copy, download, share
   ===================================================== */

async function initGIFDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const imgWrap = document.getElementById('gifDetailImgWrap');
  const titleEl = document.getElementById('gifDetailTitle');
  const tagsWrap = document.getElementById('gifDetailTags');
  const copyBtn = document.getElementById('gifCopyBtn');
  const downloadBtn = document.getElementById('gifDownloadBtn');
  const shareBtn = document.getElementById('gifShareBtn');
  const gifSource = document.getElementById('gifDetailSource');

  if (!id) {
    if (imgWrap) imgWrap.innerHTML = '<div class="empty-state"><div class="big-emoji">😢</div><h3>GIF not found</h3></div>';
    return;
  }

  // Skeleton
  if (imgWrap) imgWrap.innerHTML = '<div class="skeleton" style="aspect-ratio:1/1;width:100%"></div>';

  startLoading(); // 🔥 loader start
  const gif = await getGIFById(id);
  stopLoading();  // 🔥 loader stop

  if (!gif) {
    if (imgWrap) imgWrap.innerHTML = '<div class="empty-state"><div class="big-emoji">😵</div><h3>Couldn\'t load GIF</h3><p>Try again later</p></div>';
    return;
  }

  // URLs
  const fullUrl = getGIFUrl(gif, 'full');
  const previewUrl = getGIFUrl(gif, 'preview');
  const gifLink = fullUrl || previewUrl;

  const title = getGIFTitle(gif);

  document.title = `${title} — GIFsForGenZ`;

  // Image render
  if (imgWrap) {
    const img = document.createElement('img');
    img.src = gifLink;
    img.alt = title;
    img.loading = 'eager';
    imgWrap.innerHTML = '';
    imgWrap.appendChild(img);
  }

  if (titleEl) titleEl.textContent = title;
  if (gifSource) gifSource.textContent = gif.source_tld || 'GIPHY';

  // Tags
  if (tagsWrap && gif.tags && gif.tags.length) {
    tagsWrap.innerHTML = '';
    gif.tags.slice(0, 12).forEach(tag => {
      const a = document.createElement('a');
      a.href = `search.html?q=${encodeURIComponent(tag)}`;
      a.className = 'tag';
      a.textContent = `#${tag}`;
      tagsWrap.appendChild(a);
    });
  } else if (tagsWrap) {
    const words = title.split(' ').filter(w => w.length > 2).slice(0, 6);
    words.forEach(word => {
      const a = document.createElement('a');
      a.href = `search.html?q=${encodeURIComponent(word)}`;
      a.className = 'tag';
      a.textContent = `#${word.toLowerCase()}`;
      tagsWrap.appendChild(a);
    });
  }

  // Copy
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(gifLink);
      showToast('GIF link copied!', '🔗');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = gifLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('GIF link copied!', '🔗');
    }
  });

  // Download
  downloadBtn?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = gifLink;
    a.download = `${id}.gif`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
    showToast('Downloading GIF...', '⬇️');
  });

  // 🔥 VIRAL WhatsApp Share (random messages)
  shareBtn?.addEventListener('click', () => {
    const messages = [
      "Bro this is literally you 💀👇",
      "Why is this so accurate 😭👇",
      "This reminded me of you 😂👇",
      "Caught in 4K bro 💀👇"
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const message = `${randomMsg}\n${gifLink}`;

    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank', 'noopener');
  });

  // Related GIFs
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid && title) {
    const query = title.split(' ').slice(0, 2).join(' ');
    renderSkeletons(relatedGrid, 8);

    const { gifs } = await searchGIFs(query, 8, 0);
    relatedGrid.innerHTML = '';

    gifs
      .filter(g => g.id !== id)
      .slice(0, 8)
      .forEach(g => relatedGrid.appendChild(createGIFCard(g)));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-fade');
  initNavSearch();
  initScrollTop();
  initGIFDetail();
});