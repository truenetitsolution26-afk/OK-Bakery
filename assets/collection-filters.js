/**
 * MAISON DÉLICES - COLLECTION FILTERS & FACETS JAVASCRIPT
 * Intercepts form inputs and renders asynchronously without full page reload
 */

class CollectionFilters {
  constructor() {
    this.form = document.getElementById('CollectionFiltersForm');
    this.init();
  }

  init() {
    if (!this.form) return;

    // Listen to form input changes (checkboxes, price inputs, sort selection)
    this.form.addEventListener('change', () => this.handleFilterChange());

    // Drawer toggle handlers
    const toggleBtns = document.querySelectorAll('[data-toggle-filters]');
    const drawer = document.getElementById('FilterDrawer');
    const overlay = document.getElementById('FilterDrawerOverlay');

    if (drawer && overlay) {
      const toggle = () => {
        const isOpen = drawer.classList.contains('translate-x-0');
        if (isOpen) {
          drawer.classList.remove('translate-x-0');
          drawer.classList.add('translate-x-full');
          overlay.classList.remove('opacity-100', 'pointer-events-auto');
          overlay.classList.add('opacity-0', 'pointer-events-none');
          document.body.style.overflow = '';
        } else {
          drawer.classList.remove('translate-x-full');
          drawer.classList.add('translate-x-0');
          overlay.classList.remove('opacity-0', 'pointer-events-none');
          overlay.classList.add('opacity-100', 'pointer-events-auto');
          document.body.style.overflow = 'hidden';
        }
      };

      toggleBtns.forEach((btn) => btn.addEventListener('click', toggle));
      overlay.addEventListener('click', toggle);
    }
  }

  async handleFilterChange() {
    const formData = new FormData(this.form);
    const params = new URLSearchParams(formData);
    const targetUrl = `${window.location.pathname}?${params.toString()}`;

    const container = document.getElementById('ProductGridContainer');
    if (container) {
      container.style.opacity = '0.5';
      container.style.pointerEvents = 'none';
    }

    try {
      const res = await fetch(targetUrl);
      if (res.ok) {
        const html = await res.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        const newGrid = newDoc.getElementById('ProductGridContainer');
        const newForm = newDoc.getElementById('CollectionFiltersForm');
        const newCount = newDoc.getElementById('ProductCount');
        const newCountMobile = newDoc.getElementById('ProductCountMobile');

        if (container && newGrid) {
          container.innerHTML = newGrid.innerHTML;
        }
        if (this.form && newForm) {
          this.form.innerHTML = newForm.innerHTML;
        }
        if (newCount) {
          const currentCount = document.getElementById('ProductCount');
          if (currentCount) currentCount.textContent = newCount.textContent;
        }
        if (newCountMobile) {
          const currentMobileCount = document.getElementById('ProductCountMobile');
          if (currentMobileCount) currentMobileCount.textContent = newCountMobile.textContent;
        }

        window.history.pushState({}, '', targetUrl);
      }
    } catch (e) {
      console.error('Filter fetch error:', e);
      window.location.href = targetUrl;
    } finally {
      if (container) {
        container.style.opacity = '1';
        container.style.pointerEvents = '';
      }
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CollectionFilters());
} else {
  new CollectionFilters();
}
