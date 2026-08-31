/**
 * MAISON DÉLICES - VARIANT SELECTION & PRODUCT DETAIL GALLERY
 */

class ProductDetailManager {
  constructor(container) {
    this.container = container;
    this.sectionId = container.dataset.section;
    this.productJson = JSON.parse(container.querySelector('[data-product-json]')?.textContent || '{}');
    this.variantSelectors = container.querySelectorAll('[data-variant-option]');
    this.priceElement = container.querySelector('[data-product-price]');
    this.comparePriceElement = container.querySelector('[data-compare-price]');
    this.submitBtn = container.querySelector('[data-add-to-cart-btn]');
    this.mainImage = container.querySelector('[data-main-product-image]');
    this.thumbnails = container.querySelectorAll('[data-thumbnail-trigger]');
    this.stickyBar = document.getElementById('StickyAddToCart');

    this.initVariantEvents();
    this.initGallery();
    this.initStickyAddToCart();
  }

  initVariantEvents() {
    this.variantSelectors.forEach(input => {
      input.addEventListener('change', () => this.handleOptionChange());
    });
  }

  handleOptionChange() {
    const selectedOptions = Array.from(this.variantSelectors)
      .filter(input => input.checked || input.tagName === 'SELECT')
      .map(input => input.value);

    const currentVariant = this.productJson.variants.find(variant => {
      return variant.options.every((val, index) => val === selectedOptions[index]);
    });

    this.updateProductState(currentVariant);
  }

  updateProductState(variant) {
    if (!variant) {
      if (this.submitBtn) {
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = window.theme.strings.unavailable || 'Unavailable';
      }
      return;
    }

    // Update variant ID input
    const idInput = this.container.querySelector('input[name="id"]');
    if (idInput) idInput.value = variant.id;

    // Update Price
    if (this.priceElement) {
      this.priceElement.textContent = this.formatMoney(variant.price);
    }
    if (this.comparePriceElement) {
      if (variant.compare_at_price > variant.price) {
        this.comparePriceElement.textContent = this.formatMoney(variant.compare_at_price);
        this.comparePriceElement.classList.remove('hidden');
      } else {
        this.comparePriceElement.classList.add('hidden');
      }
    }

    // Update Stock Status
    if (this.submitBtn) {
      if (variant.available) {
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = window.theme.strings.addToCart || 'Add to Bag';
      } else {
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = window.theme.strings.soldOut || 'Sold Out';
      }
    }

    // Update featured image if variant has associated image
    if (variant.featured_image && this.mainImage) {
      this.mainImage.src = variant.featured_image.src;
    }

    // Synchronize sticky Add to Cart bar on mobile
    if (this.stickyBar) {
      const stickyPrice = this.stickyBar.querySelector('[data-sticky-price]');
      const stickyBtn = this.stickyBar.querySelector('[data-sticky-btn]');
      if (stickyPrice) stickyPrice.textContent = this.formatMoney(variant.price);
      if (stickyBtn) stickyBtn.disabled = !variant.available;
    }
  }

  initGallery() {
    this.thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSrc = thumb.getAttribute('data-image-src');
        if (this.mainImage && targetSrc) {
          this.mainImage.src = targetSrc;
          this.thumbnails.forEach(t => t.classList.remove('ring-2', 'ring-accent'));
          thumb.classList.add('ring-2', 'ring-accent');
        }
      });
    });
  }

  initStickyAddToCart() {
    if (!this.stickyBar) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          this.stickyBar.classList.add('is-visible');
        } else {
          this.stickyBar.classList.remove('is-visible');
        }
      });
    }, { threshold: 0 });

    if (this.submitBtn) {
      observer.observe(this.submitBtn);
    }
  }

  formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-detail-section]').forEach(section => {
    new ProductDetailManager(section);
  });
});
