/* =====================================================
   GIFsForGenZ — API Module (js/api.js)
   GIPHY Public API integration
   ===================================================== */

const API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65'; // GIPHY public beta key
const BASE_URL = '/api/giphy';
const DEFAULT_LIMIT = 24;
const RATING = 'g';

/**
 * getTrendingGIFs — fetch current trending GIFs
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<Array>}
 */
async function getTrendingGIFs(limit = 12, offset = 0) {
  try {
    const res = await fetch(`${BASE_URL}?endpoint=trending&limit=${limit}&offset=${offset}`);
    const json = await res.json();

    console.log('TRENDING RAW:', json); // debug

    return {
      gifs: json.data || [],
      total: json.pagination?.total_count || 0
    };
  } catch (err) {
    console.error('getTrendingGIFs error:', err);
    return { gifs: [], total: 0 };
  }
}

/**
 * searchGIFs — search GIPHY by query string
 * @param {string} query
 * @param {number} limit
 * @param {number} offset
 * @returns {Promise<{gifs: Array, total: number}>}
 */

async function searchGIFs(query, limit = 24, offset = 0) {
  try {
    const res = await fetch(
      `${BASE_URL}?endpoint=search&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    );

    const json = await res.json();

    return {
      gifs: json.data || [],
      total: json.pagination?.total_count || 0
    };
  } catch (err) {
    console.error('searchGIFs error:', err);
    return { gifs: [], total: 0 };
  }
}

/**
 * getGIFById — fetch a single GIF by its ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function getGIFById(id) {
  try {
    const res = await fetch(`${BASE_URL}?endpoint=${id}`);
    const json = await res.json();

    return json.data || null;
  } catch (err) {
    console.error('getGIFById error:', err);
    return null;
  }
}

/**
 * getGIFUrl — extract best preview/full URL from a GIF object
 * @param {Object} gif
 * @param {'preview'|'full'} quality
 * @returns {string}
 */
function getGIFUrl(gif, quality = 'preview') {
  if (!gif || !gif.images) return '';
  if (quality === 'full') {
    return gif.images.original?.url || gif.images.downsized_large?.url || '';
  }
  // Use fixed_width for grid previews — lighter, faster
  return gif.images.fixed_width?.url
    || gif.images.downsized?.url
    || gif.images.original?.url
    || '';
}

/**
 * getGIFTitle — clean title from GIF object
 * @param {Object} gif
 * @returns {string}
 */
function getGIFTitle(gif) {
  if (!gif) return '';
  return gif.title || gif.slug?.replace(/-/g, ' ') || 'GIF';
}
