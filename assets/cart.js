/**
 * MAISON DÉLICES - CART DRAWER & AJAX API ENGINE
 */

class CartManager {
  constructor() {
    this.drawer = document.getElementById('CartDrawer');
    this.overlay = document.getElementById('CartDrawerOverlay');
    this.itemsContainer = document.getElementById('CartDrawerItems');
    this.countBadges = document.querySelectorAll('[data-cart-count]');
    this.subtotalElement = document.getElementById('CartDrawerSubtotal');
    this.shippingBarFill = document.getElementById('ShippingProgressFill');
    this.shippingBarText = document.getElementById('ShippingProgressText');

    this.initEventListeners();
  }

  initEventListeners() {
    // Open cart drawer triggers
    document.querySelectorAll('[data-cart-drawer-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close drawer buttons
    document.querySelectorAll('[data-close-cart-drawer]').forEach(btn => {
      btn.addEventListener('click', () => this.closeDrawer());
    });

    this.overlay?.addEventListener('click', () => this.closeDrawer());

    // Intercept standard Add to Cart forms across the site
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form[action*="/cart/add"]');
      if (form && !form.hasAttribute('data-no-ajax')) {
        e.preventDefault();
        this.handleAddForm(form);
      }
    });

    // Dynamic item adjustments within drawer
    this.drawer?.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-cart-remove]');
      if (removeBtn) {
        e.preventDefault();
        const lineKey = removeBtn.getAttribute('data-cart-remove');
        this.updateQuantity(lineKey, 0);
        return;
      }

      const qtyBtn = e.target.closest('[data-cart-qty-change]');
      if (qtyBtn) {
        const lineKey = qtyBtn.getAttribute('data-line-key');
        const currentQty = parseInt(qtyBtn.getAttribute('data-current-qty'), 10);
        const change = parseInt(qtyBtn.getAttribute('data-cart-qty-change'), 10);
        this.updateQuantity(lineKey, Math.max(0, currentQty + change));
      }
    });
  }

  openDrawer() {
    this.drawer?.classList.add('is-active');
    this.overlay?.classList.add('is-active');
    document.body.classList.add('overflow-hidden');
  }

  closeDrawer() {
    this.drawer?.classList.remove('is-active');
    this.overlay?.classList.remove('is-active');
    document.body.classList.remove('overflow-hidden');
  }

  async handleAddForm(form) {
    const submitBtn = form.querySelector('[type="submit"], button[name="add"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="inline-block animate-spin">↻</span> Adding...`;
    }

    try {
      const formData = new FormData(form);
      const res = await fetch(window.theme.routes.cartAddUrl + '.js', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Could not add item to cart');

      await this.refreshCart();
      this.openDrawer();
    } catch (err) {
      console.error(err);
      ThemeController.showToast('Item could not be added. Please check stock.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  }

  async updateQuantity(lineKey, quantity) {
    try {
      const res = await fetch(window.theme.routes.cartChangeUrl + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: lineKey, quantity: quantity })
      });

      if (!res.ok) throw new Error('Failed to adjust item');
      const cart = await res.json();
      this.renderCart(cart);
    } catch (err) {
      console.error(err);
    }
  }

  async refreshCart() {
    try {
      const res = await fetch(window.theme.routes.cartUrl + '.js');
      const cart = await res.json();
      this.renderCart(cart);
    } catch (err) {
      console.error(err);
    }
  }

  renderCart(cart) {
    // 1. Update global item count badges
    this.countBadges.forEach(badge => {
      badge.textContent = cart.item_count;
      badge.classList.toggle('hidden', cart.item_count === 0);
    });

    // 2. Update Subtotal
    if (this.subtotalElement) {
      this.subtotalElement.innerHTML = this.formatMoney(cart.total_price);
    }

    // 3. Free Delivery Progress Calculation
    if (this.shippingBarFill && this.shippingBarText) {
      const threshold = window.theme.settings.freeShippingThreshold || 5000;
      const remaining = threshold - cart.total_price;

      if (remaining <= 0) {
        this.shippingBarFill.style.width = '100%';
        this.shippingBarText.textContent = window.theme.strings.freeDeliveryUnlocked || 'Complimentary bakery delivery unlocked!';
      } else {
        const percent = Math.min(100, Math.max(0, (cart.total_price / threshold) * 100));
        this.shippingBarFill.style.width = `${percent}%`;
        const diffMoney = this.formatMoney(remaining);
        this.shippingBarText.innerHTML = (window.theme.strings.freeDeliveryProgress || 'Add [amount] more for free delivery').replace('[amount]', diffMoney);
      }
    }

    // 4. Render Cart Items HTML
    if (!this.itemsContainer) return;

    if (cart.items.length === 0) {
      this.itemsContainer.innerHTML = `
        <div class="py-16 text-center">
          <p class="font-serif text-2xl text-chocolate mb-2">Your bakery bag is empty</p>
          <p class="text-sm text-chocolate/70 mb-6">Discover our freshly baked sourdoughs, cakes, and treats.</p>
          <a href="${window.theme.routes.root}collections/all" class="btn btn-primary btn-sm">Explore Bakery Menu</a>
        </div>
      `;
      return;
    }

    this.itemsContainer.innerHTML = cart.items.map(item => `
      <div class="flex items-center gap-4 py-4 border-b border-warm-border/60">
        <img src="${item.featured_image ? item.featured_image.url : ''}" alt="${item.title}" class="w-18 h-18 object-cover rounded-md bg-beige" width="72" height="72">
        <div class="flex-grow">
          <h4 class="font-serif text-base text-chocolate leading-snug font-semibold">${item.product_title}</h4>
          ${item.variant_title ? `<p class="text-xs text-chocolate/60 mt-0.5">${item.variant_title}</p>` : ''}
          <div class="text-sm font-semibold text-chocolate mt-1">${this.formatMoney(item.final_line_price)}</div>
          
          <div class="flex items-center justify-between mt-2">
            <div class="quantity-selector" style="transform: scale(0.85); transform-origin: left center;">
              <button type="button" class="quantity-selector__btn" data-cart-qty-change="-1" data-line-key="${item.key}" data-current-qty="${item.quantity}">-</button>
              <span class="px-3 font-semibold text-xs text-chocolate">${item.quantity}</span>
              <button type="button" class="quantity-selector__btn" data-cart-qty-change="1" data-line-key="${item.key}" data-current-qty="${item.quantity}">+</button>
            </div>
            <button type="button" class="text-xs text-chocolate/50 hover:text-sale underline transition-colors" data-cart-remove="${item.key}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  formatMoney(cents) {
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.BakeryCart = new CartManager();
});
