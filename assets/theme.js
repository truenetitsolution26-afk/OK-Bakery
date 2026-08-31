/**
 * MAISON DÉLICES - GLOBAL THEME JAVASCRIPT ENGINE
 * Handles:
 * 1. Mobile Navigation & Drawers
 * 2. AJAX Cart API (Add, Update, Remove, Free Shipping Calculation)
 * 3. Variant Switching, Price Reflection, Sticky Add to Cart
 * 4. Image Gallery Thumbnails
 * 5. Accessible Accordions
 * 6. Predictive Search Dialog
 */

class BakeryThemeApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupCartDrawer();
    this.setupProductDetails();
    this.setupAccordions();
    this.setupPredictiveSearch();
    this.setupStickyHeader();
  }

  // 1. Mobile Menu Drawer
  setupMobileMenu() {
    const toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
    const closeBtn = document.querySelector('[data-close-mobile-menu]');
    const drawer = document.getElementById('MobileNavDrawer');
    const overlay = document.getElementById('MobileNavOverlay');

    if (!toggleBtn || !drawer || !overlay) return;

    const openMenu = () => {
      drawer.classList.remove('-translate-x-full');
      drawer.classList.add('translate-x-0');
      overlay.classList.remove('opacity-0', 'pointer-events-none');
      overlay.classList.add('opacity-100', 'pointer-events-auto');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      drawer.classList.remove('translate-x-0');
      drawer.classList.add('-translate-x-full');
      overlay.classList.remove('opacity-100', 'pointer-events-auto');
      overlay.classList.add('opacity-0', 'pointer-events-none');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
  }

  // 2. AJAX Cart Drawer Engine
  setupCartDrawer() {
    const triggers = document.querySelectorAll('[data-cart-drawer-trigger]');
    const drawer = document.getElementById('CartDrawer');
    const overlay = document.getElementById('CartDrawerOverlay');
    const closeBtns = document.querySelectorAll('[data-close-cart-drawer]');

    const openCart = () => {
      if (!drawer || !overlay) return;
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.refreshCart();
    };

    const closeCart = () => {
      if (!drawer || !overlay) return;
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    triggers.forEach((btn) => btn.addEventListener('click', openCart));
    closeBtns.forEach((btn) => btn.addEventListener('click', closeCart));
    if (overlay) overlay.addEventListener('click', closeCart);

    // Intercept form submissions for Add to Cart
    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('form[action*="/cart/add"]');
      if (!form) return;

      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Adding...</span>';
      }

      try {
        const formData = new FormData(form);
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          await this.refreshCart();
          openCart();
        } else {
          const err = await res.json();
          alert(err.description || 'Could not add item to bag.');
        }
      } catch (error) {
        console.error('Add to cart error:', error);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });

    // Delegate cart item quantity changes and removal
    document.addEventListener('click', async (e) => {
      const qtyBtn = e.target.closest('[data-cart-qty-change]');
      const removeBtn = e.target.closest('[data-cart-remove]');

      if (qtyBtn) {
        e.preventDefault();
        const lineKey = qtyBtn.dataset.lineKey;
        const change = parseInt(qtyBtn.dataset.cartQtyChange, 10);
        const currentQty = parseInt(qtyBtn.dataset.currentQty, 10);
        const newQty = Math.max(0, currentQty + change);
        await this.updateCartItem(lineKey, newQty);
      } else if (removeBtn) {
        e.preventDefault();
        const lineKey = removeBtn.dataset.cartRemove;
        await this.updateCartItem(lineKey, 0);
      }
    });
  }

  async updateCartItem(key, quantity) {
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ id: key, quantity: quantity }),
      });
      if (res.ok) {
        await this.refreshCart();
      }
    } catch (e) {
      console.error('Failed to update cart line:', e);
    }
  }

  async refreshCart() {
    try {
      const res = await fetch('/cart.js');
      if (!res.ok) return;
      const cart = await res.json();
      this.updateCartUI(cart);
    } catch (e) {
      console.error('Error fetching cart:', e);
    }
  }

  updateCartUI(cart) {
    // Update count badges
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      badge.textContent = cart.item_count;
      if (cart.item_count > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    // Update subtotal
    const subtotalEl = document.getElementById('CartDrawerSubtotal');
    if (subtotalEl) {
      subtotalEl.textContent = this.formatMoney(cart.total_price);
    }

    // Update free shipping bar
    const threshold = 5000; // $50.00 in cents
    const shippingText = document.getElementById('ShippingProgressText');
    const shippingFill = document.getElementById('ShippingProgressFill');

    if (shippingFill && shippingText) {
      const percent = Math.min(100, (cart.total_price / threshold) * 100);
      shippingFill.style.width = `${percent}%`;

      if (cart.total_price >= threshold) {
        shippingText.innerHTML = '🎉 Complimentary bakery delivery unlocked!';
      } else {
        const diff = threshold - cart.total_price;
        shippingText.innerHTML = `Add <strong>${this.formatMoney(diff)}</strong> more for free delivery`;
      }
    }

    // Update items container in drawer
    const itemsContainer = document.getElementById('CartDrawerItems');
    if (!itemsContainer) return;

    if (cart.item_count === 0) {
      itemsContainer.innerHTML = `
        <div class="py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-beige flex items-center justify-center text-chocolate/40">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <p class="font-serif text-2xl text-chocolate mb-2">Your bakery bag is empty</p>
          <p class="text-sm text-chocolate/70 mb-6">Discover our freshly baked sourdoughs, cakes, and treats.</p>
          <a href="/collections/all" class="btn btn-primary btn-sm" data-close-cart-drawer>Explore Bakery Menu</a>
        </div>
      `;
      return;
    }

    let itemsHTML = '';
    cart.items.forEach((item) => {
      itemsHTML += `
        <div class="flex items-center gap-4 py-4 border-b border-warm-border/60">
          <img src="${item.image || 'https://picsum.photos/seed/cart_item/150/150'}" alt="${item.title}" class="w-18 h-18 object-cover rounded-md bg-beige" width="72" height="72">
          <div class="flex-grow">
            <h4 class="font-serif text-base text-chocolate leading-snug font-semibold">
              <a href="${item.url}">${item.product_title}</a>
            </h4>
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
      `;
    });
    itemsContainer.innerHTML = itemsHTML;
  }

  formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  // 3. Product Page Variant & Media Handler
  setupProductDetails() {
    const productSection = document.querySelector('[data-product-detail-section]');
    if (!productSection) return;

    const productJsonEl = productSection.querySelector('[data-product-json]');
    if (!productJsonEl) return;

    let productData = null;
    try {
      productData = JSON.parse(productJsonEl.textContent);
    } catch (e) {
      return;
    }

    const radioInputs = productSection.querySelectorAll('[data-variant-option]');
    const priceEl = productSection.querySelector('[data-product-price]');
    const comparePriceEl = productSection.querySelector('[data-compare-price]');
    const hiddenVariantInput = productSection.querySelector('input[name="id"]');
    const addToCartBtn = productSection.querySelector('[data-add-to-cart-btn]');
    const mainImg = productSection.querySelector('[data-main-product-image]');

    // Thumbnails
    const thumbs = productSection.querySelectorAll('[data-thumbnail-trigger]');
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((t) => t.classList.remove('ring-2', 'ring-accent'));
        thumb.classList.add('ring-2', 'ring-accent');
        const newSrc = thumb.dataset.imageSrc;
        if (mainImg && newSrc) {
          mainImg.src = newSrc;
        }
      });
    });

    const updateVariant = () => {
      const selectedOptions = Array.from(radioInputs)
        .filter((r) => r.checked)
        .map((r) => r.value);

      const matchedVariant = productData.variants.find((variant) => {
        return variant.options.every((val, idx) => val === selectedOptions[idx]);
      });

      if (matchedVariant) {
        if (hiddenVariantInput) hiddenVariantInput.value = matchedVariant.id;
        if (priceEl) priceEl.textContent = this.formatMoney(matchedVariant.price);
        
        if (comparePriceEl) {
          if (matchedVariant.compare_at_price > matchedVariant.price) {
            comparePriceEl.textContent = this.formatMoney(matchedVariant.compare_at_price);
            comparePriceEl.classList.remove('hidden');
          } else {
            comparePriceEl.classList.add('hidden');
          }
        }

        if (addToCartBtn) {
          if (matchedVariant.available) {
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = '<span>Add to Bag</span>';
          } else {
            addToCartBtn.disabled = true;
            addToCartBtn.innerHTML = '<span>Sold Out</span>';
          }
        }

        // Sticky Mobile ATC
        const stickyPrice = document.querySelector('[data-sticky-price]');
        const stickyBtn = document.querySelector('[data-sticky-btn]');
        if (stickyPrice) stickyPrice.textContent = this.formatMoney(matchedVariant.price);
        if (stickyBtn) stickyBtn.disabled = !matchedVariant.available;
      }
    };

    radioInputs.forEach((input) => input.addEventListener('change', updateVariant));

    // Sticky ATC Scroll Trigger
    const stickyAtc = document.getElementById('StickyAddToCart');
    if (stickyAtc && addToCartBtn) {
      window.addEventListener('scroll', () => {
        const rect = addToCartBtn.getBoundingClientRect();
        if (rect.bottom < 0) {
          stickyAtc.classList.add('visible');
        } else {
          stickyAtc.classList.remove('visible');
        }
      });
    }
  }

  // 4. Accessible Accordions
  setupAccordions() {
    const accordions = document.querySelectorAll('[data-accordion-trigger]');
    accordions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('svg');

        btn.setAttribute('aria-expanded', !expanded);
        if (content) {
          content.classList.toggle('hidden', expanded);
        }
        if (icon) {
          icon.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    });
  }

  // 5. Predictive Search Modal
  setupPredictiveSearch() {
    const triggers = document.querySelectorAll('[data-search-trigger]');
    const modal = document.getElementById('SearchModalOverlay');
    const closeBtn = document.querySelector('[data-close-search-modal]');
    const input = document.querySelector('[data-predictive-search-input]');
    const resultsContainer = document.getElementById('SearchPredictiveOutput');
    const defaultsContainer = document.getElementById('SearchModalDefaults');

    if (!modal) return;

    const openSearch = () => {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100', 'pointer-events-auto');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
      document.body.style.overflow = 'hidden';
    };

    const closeSearch = () => {
      modal.classList.remove('opacity-100', 'pointer-events-auto');
      modal.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    };

    triggers.forEach((t) => t.addEventListener('click', openSearch));
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSearch();
    });

    let debounceTimer;
    if (input) {
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
          if (defaultsContainer) defaultsContainer.classList.remove('hidden');
          if (resultsContainer) {
            resultsContainer.classList.add('hidden');
            resultsContainer.innerHTML = '';
          }
          return;
        }

        debounceTimer = setTimeout(async () => {
          try {
            const res = await fetch(`/search/suggest?q=${encodeURIComponent(query)}&resources[type]=product&section_id=predictive-search`);
            if (res.ok) {
              const html = await res.text();
              if (defaultsContainer) defaultsContainer.classList.add('hidden');
              if (resultsContainer) {
                resultsContainer.classList.remove('hidden');
                resultsContainer.innerHTML = html;
              }
            }
          } catch (err) {
            console.error('Predictive search error:', err);
          }
        }, 300);
      });
    }
  }

  // 6. Sticky Header Shadow on Scroll
  setupStickyHeader() {
    const header = document.getElementById('SiteHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }
    });
  }
}

// Instantiate on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BakeryThemeApp());
} else {
  new BakeryThemeApp();
}
