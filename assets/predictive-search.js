/**
 * MAISON DÉLICES - SHOPIFY PREDICTIVE SEARCH (Section Rendering API & JSON)
 */

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.resultsContainer = this.querySelector('#predictive-search-results');
    this.resetBtn = this.querySelector('.search-modal__reset');
    this.cachedResults = {};
    this.debounceTimer = null;

    this.init();
  }

  init() {
    this.input.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      const query = this.input.value.trim();

      if (this.resetBtn) {
        this.resetBtn.classList.toggle('hidden', query.length === 0);
      }

      if (!query.length) {
        this.close();
        return;
      }

      this.debounceTimer = setTimeout(() => this.fetchResults(query), 250);
    });

    this.resetBtn?.addEventListener('click', () => {
      this.input.value = '';
      this.resetBtn.classList.add('hidden');
      this.close();
    });
  }

  async fetchResults(query) {
    if (this.cachedResults[query]) {
      this.renderResults(this.cachedResults[query]);
      return;
    }

    try {
      const url = `${window.theme.routes.predictiveSearchUrl}?q=${encodeURIComponent(query)}&resources[type]=product,collection&resources[limit]=5&resources[options][unavailable_products]=hide`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Search query error');

      const data = await res.json();
      this.cachedResults[query] = data.resources.results;
      this.renderResults(data.resources.results);
    } catch (err) {
      console.error(err);
    }
  }

  renderResults(results) {
    const products = results.products || [];
    const collections = results.collections || [];

    if (!products.length && !collections.length) {
      this.resultsContainer.innerHTML = `
        <div class="py-8 text-center text-chocolate/70">
          <p class="font-medium">No freshly baked goods found matching your search.</p>
        </div>
      `;
      this.open();
      return;
    }

    let html = '<div class="space-y-4">';

    if (collections.length > 0) {
      html += `
        <div>
          <h5 class="text-xs uppercase tracking-wider text-chocolate/50 font-bold mb-2">Bakery Categories</h5>
          <div class="flex flex-wrap gap-2">
            ${collections.map(col => `
              <a href="${col.url}" class="px-3 py-1 bg-beige hover:bg-caramel hover:text-white rounded-full text-xs font-semibold text-chocolate transition-colors">
                ${col.title}
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (products.length > 0) {
      html += `
        <div>
          <h5 class="text-xs uppercase tracking-wider text-chocolate/50 font-bold mb-2">Fresh Baked Goods</h5>
          <div class="divide-y divide-warm-border/50">
            ${products.map(p => `
              <a href="${p.url}" class="predictive-search-card">
                <img src="${p.image || ''}" alt="${p.title}" class="predictive-search-card__img" width="54" height="54">
                <div>
                  <h6 class="font-serif text-sm font-semibold text-chocolate leading-tight">${p.title}</h6>
                  <span class="text-xs font-bold text-accent mt-0.5 inline-block">$${(p.price / 100).toFixed(2)}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `
      <div class="pt-2 text-center">
        <a href="${window.theme.routes.root}search?q=${encodeURIComponent(this.input.value)}" class="btn btn-secondary btn-sm w-full">
          View All Matching Bakery Treats &rarr;
        </a>
      </div>
    </div>`;

    this.resultsContainer.innerHTML = html;
    this.open();
  }

  open() {
    this.resultsContainer.classList.remove('hidden');
  }

  close() {
    this.resultsContainer.classList.add('hidden');
  }
}

customElements.define('predictive-search', PredictiveSearch);
