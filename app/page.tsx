'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Star,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Download,
  Code,
  Eye,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Heart,
  Plus,
  Minus,
  Trash2,
  FileCode,
  Folder,
  Layers,
  Palette,
  ExternalLink,
  Copy,
  Info,
  Calendar,
  Cake,
  Wheat,
  Coffee,
  Truck
} from 'lucide-react';
import JSZip from 'jszip';

// Bakery Products Dataset for Interactive Preview
interface BakeryProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage: string;
  gallery: string[];
  badge?: string;
  dietary: string[];
  description: string;
  ingredients: string;
  allergens: string;
  storage: string;
  variants: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    available: boolean;
  }[];
}

const BAKERY_PRODUCTS: BakeryProduct[] = [
  {
    id: 'sourdough-country',
    title: 'Heritage Country Sourdough Loaf',
    category: 'Artisan Breads',
    price: 950,
    compareAtPrice: 1100,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Daily Signature',
    dietary: ['100% Organic', 'Vegan', 'Wild Levain'],
    description: '36-hour slow cold fermentation using organic stoneground rye and hard red wheat. Deeply caramelized blistered crust with an airy, custard-like crumb and subtle lactic tang.',
    ingredients: 'Organic Stoneground Wheat Flour, Water, Organic Rye Flour, Wild Sourdough Culture (Levain), Guérande Sea Salt.',
    allergens: 'Contains Wheat (Gluten). Baked in a facility that handles nuts and dairy.',
    storage: 'Store uncut loaf cut-side down on a wooden board for up to 4 days, or freeze sliced in airtight bag.',
    variants: [
      { id: 'sd-whole', title: 'Whole Boule (850g)', price: 950, compareAtPrice: 1100, available: true },
      { id: 'sd-sliced', title: 'Sliced Boule (850g)', price: 950, available: true },
      { id: 'sd-double', title: 'Twin Hearth Loaves (2x)', price: 1800, compareAtPrice: 2200, available: true }
    ]
  },
  {
    id: 'normandy-croissant',
    title: 'Normandy Butter Croissant Box',
    category: 'Viennoiserie',
    price: 1850,
    rating: 5.0,
    reviewsCount: 218,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Bestseller',
    dietary: ['AOP Normandy Butter', 'Fresh Baked'],
    description: 'Laminated with 84% butterfat French Normandy butter over 72 hours, resulting in 27 crispy, honeycomb layers of melt-in-your-mouth perfection.',
    ingredients: 'French T55 Wheat Flour, AOP Isigny Butter, Whole Milk, Cane Sugar, Fresh Yeast, Guérande Salt, Egg Wash.',
    allergens: 'Contains Wheat, Dairy, Eggs.',
    storage: 'Best enjoyed morning of delivery. Warm in 325°F oven for 3 minutes to restore crispness.',
    variants: [
      { id: 'cr-4box', title: 'Box of 4 Croissants', price: 1850, available: true },
      { id: 'cr-6box', title: 'Box of 6 Croissants', price: 2600, compareAtPrice: 2800, available: true },
      { id: 'cr-12box', title: 'Baker’s Dozen (13x)', price: 4800, compareAtPrice: 5500, available: true }
    ]
  },
  {
    id: 'opera-cake',
    title: 'Gourmet Grand Cru Chocolate Opéra Cake',
    category: 'Patisserie & Cakes',
    price: 4800,
    compareAtPrice: 5200,
    rating: 4.9,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Chef Creation',
    dietary: ['Valrhona 70%', 'Ethiopian Espresso'],
    description: 'Six delicate layers of almond joconde sponge soaked in rich espresso syrup, layered with dark Valrhona chocolate ganache and French espresso buttercream.',
    ingredients: 'Almond Flour, Valrhona Guanaja 70% Dark Chocolate, Organic Eggs, French Butter, Single-Origin Espresso, Gold Leaf.',
    allergens: 'Contains Tree Nuts (Almonds), Eggs, Dairy, Soy Lecithin.',
    storage: 'Keep chilled. Temper at room temperature 20 minutes before serving.',
    variants: [
      { id: 'op-6inch', title: '6-Inch (Serves 6–8)', price: 4800, compareAtPrice: 5200, available: true },
      { id: 'op-8inch', title: '8-Inch (Serves 10–12)', price: 6800, available: true },
      { id: 'op-10inch', title: '10-Inch Celebration (Serves 16+)', price: 9200, available: true }
    ]
  },
  {
    id: 'pain-au-chocolat',
    title: 'Artisan Pain au Chocolat (Valrhona Batons)',
    category: 'Viennoiserie',
    price: 2100,
    rating: 4.8,
    reviewsCount: 164,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Popular',
    dietary: ['Valrhona Dark Batons'],
    description: 'Buttery flaky pastry folded around dual batons of bittersweet 66% French dark chocolate.',
    ingredients: 'Flour, Normandy Butter, Milk, Sugar, Valrhona Baking Batons, Yeast, Sea Salt.',
    allergens: 'Contains Wheat, Dairy, Eggs, Soy.',
    storage: 'Best consumed within 24 hours of delivery.',
    variants: [
      { id: 'pac-4box', title: 'Box of 4 Batons', price: 2100, available: true },
      { id: 'pac-8box', title: 'Box of 8 Batons', price: 3900, available: true }
    ]
  },
  {
    id: 'parisian-macaron-box',
    title: 'Parisian Macaron Discovery Box (12 Flavors)',
    category: 'Petit Fours & Macarons',
    price: 3400,
    rating: 5.0,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Gift Ready',
    dietary: ['Gluten-Free Flour Base'],
    description: 'Crisp almond meringue shells with chewy centers, filled with salted caramel, Tahitian vanilla bean, Sicilian pistachio, and raspberry coulis.',
    ingredients: 'California Almond Flour, Pure Cane Sugar, Egg Whites, White Chocolate, Cream, Fruit Purees, Pistachio Paste.',
    allergens: 'Contains Tree Nuts (Almonds, Pistachios), Eggs, Dairy.',
    storage: 'Store refrigerated for up to 7 days.',
    variants: [
      { id: 'mac-12box', title: '12-Piece Assortment Box', price: 3400, available: true },
      { id: 'mac-24box', title: '24-Piece Luxe Gift Tower', price: 6200, compareAtPrice: 6800, available: true }
    ]
  },
  {
    id: 'vanilla-berry-cake',
    title: 'Tahitian Vanilla & Summer Berry Chiffon',
    category: 'Patisserie & Cakes',
    price: 5400,
    rating: 4.9,
    reviewsCount: 73,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80'
    ],
    badge: 'Summer Seasonal',
    dietary: ['Organic Berries', 'Tahitian Vanilla'],
    description: 'Light-as-cloud chiffon sponge layered with organic raspberry-blackberry reduction, mascarpone cream, and fresh edible blooms.',
    ingredients: 'Pastry Flour, Organic Cane Sugar, Pasture Eggs, Tahitian Vanilla Bean, Fresh Raspberries, Mascarpone.',
    allergens: 'Contains Wheat, Eggs, Dairy.',
    storage: 'Keep refrigerated until 30 minutes before cutting.',
    variants: [
      { id: 'vb-6inch', title: '6-Inch (Serves 6–8)', price: 5400, available: true },
      { id: 'vb-8inch', title: '8-Inch (Serves 10–12)', price: 7600, available: true }
    ]
  }
];

interface CartItem {
  id: string;
  variantId: string;
  product: BakeryProduct;
  variantTitle: string;
  price: number;
  quantity: number;
}

export default function BakeryThemeApp() {
  // Navigation & Active View
  const [activeTab, setActiveTab] = useState<'store' | 'code' | 'docs'>('store');
  const [currentStoreView, setCurrentStoreView] = useState<'home' | 'catalog' | 'product' | 'cake-studio' | 'cart' | 'contact'>('home');
  const [selectedProduct, setSelectedProduct] = useState<BakeryProduct>(BAKERY_PRODUCTS[0]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'item-1',
      variantId: 'sd-whole',
      product: BAKERY_PRODUCTS[0],
      variantTitle: 'Whole Boule (850g)',
      price: 950,
      quantity: 1
    },
    {
      id: 'item-2',
      variantId: 'cr-4box',
      product: BAKERY_PRODUCTS[1],
      variantTitle: 'Box of 4 Croissants',
      price: 1850,
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartNote, setCartNote] = useState<string>('Please write "Happy Birthday Camille!" on chocolate placard.');

  // Search & Filter State
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [priceSort, setPriceSort] = useState<'featured' | 'low-high' | 'high-low'>('featured');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Customizer Controls State
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(5000); // in cents
  const [announcementText, setAnnouncementText] = useState<string>(
    '🥐 Fresh morning bakes out of the oven at 7:00 AM • Complimentary local delivery on orders over $50'
  );
  const [themeMode, setThemeMode] = useState<'warm-cream' | 'terracotta' | 'dark-espresso'>('warm-cream');

  // Bespoke Cake Studio State
  const [cakeTiers, setCakeTiers] = useState<number>(2);
  const [cakeFlavor, setCakeFlavor] = useState<string>('Tahitian Vanilla & Raspberry Coulis');
  const [cakeFinish, setCakeFinish] = useState<string>('Textured Silk Buttercream & Fresh Botanicals');
  const [cakeInscription, setCakeInscription] = useState<string>('');
  const [cakeGuests, setCakeGuests] = useState<number>(35);

  // Code Explorer State
  const [selectedCodeFile, setSelectedCodeFile] = useState<string>('layout/theme.liquid');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Calculate Subtotal & Shipping
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const shippingRemaining = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingProgressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  // Add To Cart Handler
  const handleAddToCart = (product: BakeryProduct, variantIdx: number = 0, quantity: number = 1) => {
    const variant = product.variants[variantIdx] || product.variants[0];
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.variantId === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${variant.id}-${Date.now()}`,
          variantId: variant.id,
          product,
          variantTitle: variant.title,
          price: variant.price,
          quantity
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
    }
  };

  // Filtered Products for Catalog
  const filteredProducts = useMemo(() => {
    let list = [...BAKERY_PRODUCTS];
    if (selectedCategoryFilter !== 'All') {
      list = list.filter((p) => p.category === selectedCategoryFilter);
    }
    if (priceSort === 'low-high') {
      list.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-low') {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategoryFilter, priceSort]);

  // Predictive Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return BAKERY_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.dietary.some((d) => d.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Shopify File Tree Contents
  const themeFiles: Record<string, string> = {
    'layout/theme.liquid': `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ page_title }} – {{ shop.name }}</title>
    {{ 'base.css' | asset_url | stylesheet_tag }}
    {{ content_for_header }}
  </head>
  <body class="bg-cream text-chocolate font-body antialiased">
    {% sections 'header-group' %}
    <main id="MainContent">{{ content_for_layout }}</main>
    {% sections 'footer-group' %}
    {%- render 'cart-drawer' -%}
    {%- render 'search-modal' -%}
    <script src="{{ 'theme.js' | asset_url }}" defer="defer"></script>
  </body>
</html>`,
    'sections/header.liquid': `{%- comment -%} MAISON DÉLICES - STICKY ARTISAN HEADER {%- endcomment -%}
<header id="SiteHeader" class="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-warm-border">
  <div class="container flex items-center justify-between py-4">
    <!-- Brand Logo, Navigation Menu, Search Trigger & Bag Drawer Button -->
  </div>
</header>`,
    'sections/hero.liquid': `{%- comment -%} HERO BANNER WITH ARTISAN TYPOGRAPHY {%- endcomment -%}
<section class="relative min-h-[85vh] bg-chocolate text-cream flex items-center">
  <div class="container relative z-10 py-20">
    <span class="text-xs uppercase tracking-widest text-accent font-bold">{{ section.settings.subheading }}</span>
    <h1 class="font-serif text-5xl md:text-7xl font-bold">{{ section.settings.heading }}</h1>
    <p class="text-cream/80 max-w-xl mt-4">{{ section.settings.text }}</p>
  </div>
</section>`,
    'sections/main-product.liquid': `{%- comment -%} PRODUCT DETAIL SECTION WITH ACCORDIONS & STICKY ATC {%- endcomment -%}
<section class="section-spacing bg-cream" data-product-detail-section>
  <!-- Gallery Thumbnails, Radio Variant Pills, Quantity Selector, Add to Bag -->
</section>`,
    'snippets/cart-drawer.liquid': `{%- comment -%} AJAX CART DRAWER WITH REAL-TIME FREE DELIVERY TRACKER {%- endcomment -%}
<div id="CartDrawer" class="cart-drawer">
  <div class="shipping-bar">
    <span>Free delivery progress</span>
    <div class="shipping-bar__progress-fill" style="width: {{ percent }}%;"></div>
  </div>
  <div id="CartDrawerItems"><!-- Dynamic Items --></div>
</div>`,
    'snippets/product-card.liquid': `{%- comment -%} PRODUCT CARD WITH 1-CLICK QUICK ADD {%- endcomment -%}
<div class="product-card group">
  <img src="{{ product.featured_image | image_url }}" alt="{{ product.title }}">
  <button type="submit" class="product-card__quick-add">Quick Add +</button>
  <h3>{{ product.title }}</h3>
  <span>{{ product.price | money }}</span>
</div>`,
    'config/settings_schema.json': `[
  { "name": "Brand Colors & Atmosphere", "settings": [...] },
  { "name": "Bakery Logistics & Thresholds", "settings": [...] }
]`,
    'templates/index.json': `{
  "sections": {
    "announcement-bar": { "type": "announcement-bar" },
    "hero": { "type": "hero" },
    "category-grid": { "type": "category-grid" },
    "featured-collection": { "type": "featured-collection" },
    "custom-cake": { "type": "custom-cake" },
    "why-choose-us": { "type": "why-choose-us" },
    "testimonials": { "type": "testimonials" }
  },
  "order": ["announcement-bar", "hero", "category-grid", "featured-collection", "custom-cake", "why-choose-us", "testimonials"]
}`
  };

  // 1-Click Shopify Theme ZIP Exporter
  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Layout
      zip.file('layout/theme.liquid', themeFiles['layout/theme.liquid']);

      // Config
      zip.file('config/settings_schema.json', themeFiles['config/settings_schema.json']);
      zip.file('config/settings_data.json', JSON.stringify({
        current: {
          color_chocolate: '#2C1A11',
          color_cream: '#FAF7F2',
          free_shipping_threshold: freeShippingThreshold,
          enable_cart_notes: true
        }
      }, null, 2));

      // Locales
      zip.file('locales/en.default.json', JSON.stringify({
        general: { cart: 'Bakery Bag', search: 'Search fresh treats...' },
        products: { product: { add_to_cart: 'Add to Bag', sold_out: 'Sold Out' } }
      }, null, 2));

      // Templates
      zip.file('templates/index.json', themeFiles['templates/index.json']);
      zip.file('templates/product.json', JSON.stringify({ sections: { main: { type: 'main-product' } }, order: ['main'] }, null, 2));
      zip.file('templates/collection.json', JSON.stringify({ sections: { main: { type: 'main-collection' } }, order: ['main'] }, null, 2));
      zip.file('templates/cart.json', JSON.stringify({ sections: { main: { type: 'main-cart' } }, order: ['main'] }, null, 2));

      // Sections
      zip.file('sections/announcement-bar.liquid', `{%- comment -%} Announcement Bar {%- endcomment -%}\n<div class="bg-chocolate text-cream py-2 text-center text-xs">${announcementText}</div>`);
      zip.file('sections/header.liquid', themeFiles['sections/header.liquid']);
      zip.file('sections/hero.liquid', themeFiles['sections/hero.liquid']);
      zip.file('sections/main-product.liquid', themeFiles['sections/main-product.liquid']);
      zip.file('sections/featured-collection.liquid', `{%- comment -%} Featured Collection {%- endcomment -%}`);
      zip.file('sections/category-grid.liquid', `{%- comment -%} Category Grid {%- endcomment -%}`);
      zip.file('sections/custom-cake.liquid', `{%- comment -%} Custom Cake Studio {%- endcomment -%}`);
      zip.file('sections/why-choose-us.liquid', `{%- comment -%} Why Choose Us {%- endcomment -%}`);
      zip.file('sections/testimonials.liquid', `{%- comment -%} Testimonials {%- endcomment -%}`);
      zip.file('sections/footer.liquid', `{%- comment -%} Global Footer {%- endcomment -%}`);

      // Snippets
      zip.file('snippets/cart-drawer.liquid', themeFiles['snippets/cart-drawer.liquid']);
      zip.file('snippets/product-card.liquid', themeFiles['snippets/product-card.liquid']);
      zip.file('snippets/search-modal.liquid', `{%- comment -%} Search Modal {%- endcomment -%}`);
      zip.file('snippets/icon.liquid', `{%- comment -%} Icon Helper {%- endcomment -%}`);
      zip.file('snippets/facets.liquid', `{%- comment -%} Facet Filters {%- endcomment -%}`);

      // Assets
      zip.file('assets/base.css', `/* Maison Délices Theme Base CSS */\n:root { --color-chocolate: #2C1A11; --color-cream: #FAF7F2; --color-caramel: #C68B59; }`);
      zip.file('assets/theme.js', `/* Maison Délices Theme JavaScript */\nconsole.log('Maison Délices loaded');`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'maison-delices-shopify-theme.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className={`min-h-screen bg-[#FAF7F2] text-[#2C1A11] flex flex-col font-sans selection:bg-[#C68B59] selection:text-white`}>
      
      {/* Top Workspace Bar */}
      <nav aria-label="Theme workspace controls" className="bg-[#2C1A11] text-[#FAF7F2] border-b border-[#3D2518] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C68B59] animate-pulse"></span>
            <span className="font-serif font-bold text-sm tracking-wide text-white">Maison Délices</span>
            <span className="px-2 py-0.5 rounded bg-[#C68B59]/30 text-[#C68B59] font-mono text-[10px] font-bold uppercase tracking-wider">
              Shopify OS 2.0
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-[#1E110A] p-0.5 rounded-lg border border-[#3D2518]">
            <button
              onClick={() => setActiveTab('store')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'store' ? 'bg-[#C68B59] text-white shadow-sm' : 'text-[#FAF7F2]/70 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Live Storefront
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'code' ? 'bg-[#C68B59] text-white shadow-sm' : 'text-[#FAF7F2]/70 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Liquid Files ({Object.keys(themeFiles).length})
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'docs' ? 'bg-[#C68B59] text-white shadow-sm' : 'text-[#FAF7F2]/70 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Architecture & Specs
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#FAF7F2]/70">
            <Clock className="w-3.5 h-3.5 text-[#C68B59]" />
            <span>Ovens: <strong>3:00 AM Daily Bake</strong></span>
          </div>

          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-lg bg-[#C68B59] hover:bg-[#B37946] text-white font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Generate and download standard Shopify Online Store 2.0 .zip theme archive"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Packaging ZIP...' : 'Download Theme (.zip)'}</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-grow flex flex-col">
        
        {/* ========================================================================= */}
        {/* TAB 1: LIVE STOREFRONT SIMULATOR & PREVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'store' && (
          <div className="flex-grow flex flex-col">
            
            {/* Storefront Announcement Bar */}
            <div className="bg-[#2C1A11] text-[#FAF7F2] py-2 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2">
              <span>{announcementText}</span>
              <button
                onClick={() => {
                  const newText = prompt('Customize announcement bar text:', announcementText);
                  if (newText) setAnnouncementText(newText);
                }}
                className="opacity-40 hover:opacity-100 transition-opacity text-[10px] underline ml-2"
                title="Edit Announcement Text"
              >
                (Edit)
              </button>
            </div>

            {/* Storefront Navigation Header */}
            <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADFCF] transition-all">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                
                {/* Mobile Menu & Brand */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-[#2C1A11] hover:bg-[#F3EDE2] rounded-lg"
                    aria-label="Toggle Navigation"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>

                  <div
                    onClick={() => setCurrentStoreView('home')}
                    className="cursor-pointer group flex flex-col"
                  >
                    <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C1A11] group-hover:text-[#C68B59] transition-colors">
                      Maison Délices
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C68B59] font-bold -mt-1 font-mono">
                      Boulangerie & Pâtisserie
                    </span>
                  </div>
                </div>

                {/* Desktop Nav Links */}
                <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#2C1A11]">
                  <button
                    onClick={() => setCurrentStoreView('home')}
                    className={`hover:text-[#C68B59] transition-colors pb-1 border-b-2 ${
                      currentStoreView === 'home' ? 'border-[#C68B59] text-[#C68B59]' : 'border-transparent'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('All');
                      setCurrentStoreView('catalog');
                    }}
                    className={`hover:text-[#C68B59] transition-colors pb-1 border-b-2 ${
                      currentStoreView === 'catalog' ? 'border-[#C68B59] text-[#C68B59]' : 'border-transparent'
                    }`}
                  >
                    Bakery Menu
                  </button>
                  <button
                    onClick={() => setCurrentStoreView('cake-studio')}
                    className={`hover:text-[#C68B59] transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                      currentStoreView === 'cake-studio' ? 'border-[#C68B59] text-[#C68B59]' : 'border-transparent'
                    }`}
                  >
                    <Cake className="w-4 h-4 text-[#C68B59]" />
                    Custom Cake Studio
                  </button>
                  <button
                    onClick={() => setCurrentStoreView('contact')}
                    className={`hover:text-[#C68B59] transition-colors pb-1 border-b-2 ${
                      currentStoreView === 'contact' ? 'border-[#C68B59] text-[#C68B59]' : 'border-transparent'
                    }`}
                  >
                    Hours & Story
                  </button>
                </nav>

                {/* Right Action Icons (Search & Bag) */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-[#2C1A11] hover:text-[#C68B59] hover:bg-[#F3EDE2] rounded-full transition-colors flex items-center gap-2"
                    aria-label="Search treats"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden md:inline text-xs font-semibold text-[#2C1A11]/70">Search</span>
                  </button>

                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="p-2 px-3.5 rounded-full bg-[#2C1A11] text-white hover:bg-[#C68B59] transition-all flex items-center gap-2.5 shadow-md relative"
                    aria-label="View shopping bag"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C68B59]" />
                    <span className="text-xs font-bold font-mono">Bag ({cartItemCount})</span>
                  </button>
                </div>

              </div>

              {/* Mobile Drawer Navigation */}
              {mobileMenuOpen && (
                <div className="lg:hidden bg-[#FAF7F2] border-b border-[#EADFCF] px-4 py-4 space-y-3">
                  <button
                    onClick={() => {
                      setCurrentStoreView('home');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left font-semibold text-sm py-1.5"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('All');
                      setCurrentStoreView('catalog');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left font-semibold text-sm py-1.5"
                  >
                    All Fresh Breads & Treats
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStoreView('cake-studio');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left font-semibold text-sm py-1.5 text-[#C68B59]"
                  >
                    🎂 Custom Cake Consultation
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStoreView('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left font-semibold text-sm py-1.5"
                  >
                    Bakery Hours & Location
                  </button>
                </div>
              )}
            </header>

            {/* VIEW 1: HOME PAGE */}
            {currentStoreView === 'home' && (
              <main>
                
                {/* Hero Section */}
                <section className="relative min-h-[75vh] sm:min-h-[82vh] bg-[#2C1A11] text-[#FAF7F2] flex items-center overflow-hidden">
                  <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                    <img
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop&q=80"
                      alt="Artisan bakery oven"
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2C1A11] via-[#2C1A11]/85 to-transparent z-0"></div>

                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
                    <div className="max-w-2xl space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C68B59]/20 border border-[#C68B59]/40 text-[#C68B59] text-xs font-bold tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        Fresh Batch Out Every Morning
                      </div>

                      <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
                        Slow-Fermented Sourdough & French Pâtisserie
                      </h1>

                      <p className="text-sm sm:text-base text-[#FAF7F2]/80 leading-relaxed font-light">
                        Handcrafted daily in Brooklyn with wild levain, 100% stoneground organic grains, and Normandy butter. Morning bakes ready for pickup and express local delivery.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setSelectedCategoryFilter('All');
                            setCurrentStoreView('catalog');
                          }}
                          className="px-6 py-3.5 rounded-xl bg-[#C68B59] hover:bg-[#B37946] text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                        >
                          <span>Explore Fresh Menu</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setCurrentStoreView('cake-studio')}
                          className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-sm border border-white/20 transition-all"
                        >
                          Custom Cake Studio
                        </button>
                      </div>

                      {/* Trust Highlights */}
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#FAF7F2]/15 text-xs text-[#FAF7F2]/75">
                        <div className="flex items-center gap-2">
                          <Wheat className="w-4 h-4 text-[#C68B59]" />
                          <span>36-Hr Levain</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#C68B59]" />
                          <span>100% Organic Flours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#C68B59]" />
                          <span>Same-Day Courier</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>

                {/* Category Grid Section */}
                <section className="py-16 sm:py-20 bg-[#FAF7F2]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-xl mx-auto mb-12">
                      <span className="text-xs uppercase tracking-widest font-bold text-[#C68B59] block mb-2">
                        Artisan Specialties
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1A11]">
                        Explore the Bakery Counter
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        {
                          title: 'Artisan Sourdough',
                          subtitle: 'Wild levain & ancient grains',
                          image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
                          cat: 'Artisan Breads'
                        },
                        {
                          title: 'French Viennoiserie',
                          subtitle: '84% Normandy butter lamination',
                          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
                          cat: 'Viennoiserie'
                        },
                        {
                          title: 'Signature Cakes',
                          subtitle: 'Multi-layer wedding & birthday',
                          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
                          cat: 'Patisserie & Cakes'
                        },
                        {
                          title: 'Petit Fours & Macarons',
                          subtitle: 'Bite-sized afternoon confections',
                          image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&auto=format&fit=crop&q=80',
                          cat: 'Petit Fours & Macarons'
                        }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedCategoryFilter(item.cat);
                            setCurrentStoreView('catalog');
                          }}
                          className="group cursor-pointer bg-[#F3EDE2] rounded-2xl overflow-hidden border border-[#EADFCF] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="h-48 overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A11]/70 via-transparent to-transparent"></div>
                            <span className="absolute bottom-3 left-3 text-xs font-bold text-white uppercase tracking-wider">
                              {item.cat}
                            </span>
                          </div>
                          <div className="p-5">
                            <h3 className="font-serif text-lg font-bold text-[#2C1A11] group-hover:text-[#C68B59] transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#2C1A11]/70 mt-1">{item.subtitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </section>

                {/* Daily Best Sellers */}
                <section className="py-16 sm:py-20 bg-[#F3EDE2]/60 border-y border-[#EADFCF]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest font-bold text-[#C68B59] block mb-1">
                          Fresh Out Of The Oven
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1A11]">
                          Daily Bestsellers
                        </h2>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategoryFilter('All');
                          setCurrentStoreView('catalog');
                        }}
                        className="text-xs font-bold text-[#C68B59] hover:underline flex items-center gap-1"
                      >
                        <span>View All Fresh Bakes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {BAKERY_PRODUCTS.slice(0, 6).map((product) => (
                        <div
                          key={product.id}
                          className="bg-[#FAF7F2] rounded-2xl border border-[#EADFCF] overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
                        >
                          <div
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedVariantIndex(0);
                              setActiveGalleryIndex(0);
                              setCurrentStoreView('product');
                            }}
                            className="h-64 overflow-hidden relative cursor-pointer"
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.badge && (
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#2C1A11] text-white text-[11px] font-bold uppercase tracking-wider">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          <div className="p-5 flex-grow flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1 text-[#C68B59] text-xs font-bold mb-1">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>{product.rating}</span>
                                <span className="text-[#2C1A11]/40 font-normal">({product.reviewsCount})</span>
                              </div>

                              <h3
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setSelectedVariantIndex(0);
                                  setActiveGalleryIndex(0);
                                  setCurrentStoreView('product');
                                }}
                                className="font-serif text-lg font-bold text-[#2C1A11] hover:text-[#C68B59] cursor-pointer transition-colors leading-snug"
                              >
                                {product.title}
                              </h3>

                              <p className="text-xs text-[#2C1A11]/70 mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-[#EADFCF] mt-4 flex items-center justify-between">
                              <div>
                                <span className="font-serif text-lg font-bold text-[#2C1A11]">
                                  {formatPrice(product.price)}
                                </span>
                                {product.compareAtPrice && (
                                  <span className="text-xs text-[#2C1A11]/40 line-through ml-2 font-mono">
                                    {formatPrice(product.compareAtPrice)}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleAddToCart(product, 0, 1)}
                                className="px-3.5 py-2 rounded-lg bg-[#2C1A11] hover:bg-[#C68B59] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Bag</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </section>

                {/* Custom Cake Studio Showcase */}
                <section className="py-20 bg-[#2C1A11] text-[#FAF7F2] relative overflow-hidden">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      
                      <div className="lg:col-span-6 space-y-6">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#C68B59] block">
                          Haute Pâtisserie Studio
                        </span>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                          Bespoke Celebration & Wedding Cakes
                        </h2>
                        <p className="text-sm text-[#FAF7F2]/80 leading-relaxed font-light">
                          From minimalist Swiss meringue buttercream tiers to dramatic botanical floral sculptures, our pastry artists handcraft centerpiece cakes tailored to your wedding or celebration palette.
                        </p>

                        <div className="space-y-3 pt-2 text-xs text-[#FAF7F2]/80">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#C68B59]" />
                            <span>Complimentary tasting box for wedding bookings</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#C68B59]" />
                            <span>Dietary adaptations: Gluten-Free, Vegan, Dairy-Free options</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#C68B59]" />
                            <span>White-glove refrigerated delivery & venue setup</span>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            onClick={() => setCurrentStoreView('cake-studio')}
                            className="px-6 py-3.5 rounded-xl bg-[#C68B59] hover:bg-[#B37946] text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                          >
                            <Cake className="w-4 h-4" />
                            <span>Launch Bespoke Cake Builder</span>
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-6">
                        <div className="relative rounded-3xl overflow-hidden border-2 border-[#C68B59]/30 shadow-2xl">
                          <img
                            src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=1000&auto=format&fit=crop&q=80"
                            alt="Custom tiered cake"
                            className="w-full h-[420px] object-cover"
                          />
                          <div className="absolute bottom-4 left-4 right-4 bg-[#2C1A11]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-serif font-bold text-sm block text-white">Botanical Berry 3-Tier</span>
                              <span className="text-[#FAF7F2]/60">Tahitian Vanilla & Blackberry Coulis</span>
                            </div>
                            <span className="font-mono font-bold text-[#C68B59] text-base">$320.00</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>

                {/* Why Choose Us: 4 Artisan Pillars */}
                <section className="py-20 bg-[#FAF7F2]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-xl mx-auto mb-16">
                      <span className="text-xs uppercase tracking-widest font-bold text-[#C68B59] block mb-2">
                        The French Standard
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1A11]">
                        Pure Craftsmanship in Every Crumb
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                        {
                          icon: Wheat,
                          title: 'Stoneground Grains',
                          desc: '100% certified organic heirloom wheat and rye flours milled locally.'
                        },
                        {
                          icon: Clock,
                          title: '36-Hour Fermentation',
                          desc: 'Slow natural levain fermentation promotes digestibility and deep complex flavor.'
                        },
                        {
                          icon: Sparkles,
                          title: 'Normandy 84% Butter',
                          desc: 'Pure high-fat French butter creates impossibly crisp, golden lamination.'
                        },
                        {
                          icon: Truck,
                          title: 'Morning Courier Delivery',
                          desc: 'Bags packed directly off the oven peel and delivered fresh to your door.'
                        }
                      ].map((pillar, idx) => (
                        <div key={idx} className="bg-[#F3EDE2] p-6 rounded-2xl border border-[#EADFCF] space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-[#C68B59]/20 flex items-center justify-center text-[#C68B59]">
                            <pillar.icon className="w-5 h-5" />
                          </div>
                          <h3 className="font-serif text-lg font-bold text-[#2C1A11]">{pillar.title}</h3>
                          <p className="text-xs text-[#2C1A11]/75 leading-relaxed font-light">{pillar.desc}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                </section>

              </main>
            )}

            {/* VIEW 2: CATALOG / MENU */}
            {currentStoreView === 'catalog' && (
              <main className="py-12 bg-[#FAF7F2] flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  {/* Catalog Header */}
                  <div className="border-b border-[#EADFCF] pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold text-[#C68B59] block mb-1">
                        Freshly Baked Every Morning
                      </span>
                      <h1 className="font-serif text-4xl font-bold text-[#2C1A11]">
                        Bakery & Pâtisserie Menu
                      </h1>
                      <p className="text-xs sm:text-sm text-[#2C1A11]/70 mt-1">
                        Showing {filteredProducts.length} handcrafted baked goods.
                      </p>
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#2C1A11]/60">Sort By:</span>
                      <select
                        value={priceSort}
                        onChange={(e) => setPriceSort(e.target.value as any)}
                        className="bg-[#F3EDE2] border border-[#EADFCF] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#2C1A11] focus:outline-none focus:border-[#C68B59]"
                      >
                        <option value="featured">Baker’s Featured</option>
                        <option value="low-high">Price: Low to High</option>
                        <option value="high-low">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Filter Sidebar */}
                    <div className="lg:col-span-3 bg-[#F3EDE2] p-6 rounded-2xl border border-[#EADFCF] space-y-6">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#2C1A11] mb-3">Categories</h3>
                        <div className="space-y-1.5">
                          {['All', 'Artisan Breads', 'Viennoiserie', 'Patisserie & Cakes', 'Petit Fours & Macarons'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategoryFilter(cat)}
                              className={`w-full text-left text-xs px-3 py-2 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                                selectedCategoryFilter === cat
                                  ? 'bg-[#2C1A11] text-white shadow-sm'
                                  : 'text-[#2C1A11]/80 hover:bg-[#FAF7F2]'
                              }`}
                            >
                              <span>{cat}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#EADFCF] pt-4">
                        <h3 className="font-serif text-base font-bold text-[#2C1A11] mb-2">Dietary Standards</h3>
                        <div className="space-y-2 text-xs text-[#2C1A11]/80">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded text-[#C68B59] focus:ring-[#C68B59]" />
                            <span>100% Organic Flours</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded text-[#C68B59] focus:ring-[#C68B59]" />
                            <span>Naturally Leavened (Levain)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded text-[#C68B59] focus:ring-[#C68B59]" />
                            <span>Gluten-Friendly Options</span>
                          </label>
                        </div>
                      </div>

                      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADFCF] text-xs space-y-1">
                        <span className="font-bold text-[#C68B59] block">🚚 Free Delivery Alert</span>
                        <p className="text-[#2C1A11]/70">Add $50 or more of treats to unlock free delivery.</p>
                      </div>
                    </div>

                    {/* Right Product Grid */}
                    <div className="lg:col-span-9">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-[#FAF7F2] rounded-2xl border border-[#EADFCF] overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
                          >
                            <div
                              onClick={() => {
                                setSelectedProduct(product);
                                setSelectedVariantIndex(0);
                                setActiveGalleryIndex(0);
                                setCurrentStoreView('product');
                              }}
                              className="h-56 overflow-hidden relative cursor-pointer"
                            >
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {product.badge && (
                                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#2C1A11] text-white text-[10px] font-bold uppercase tracking-wider">
                                  {product.badge}
                                </span>
                              )}
                            </div>

                            <div className="p-4 flex-grow flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#C68B59] tracking-wider block mb-1">
                                  {product.category}
                                </span>
                                <h3
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setSelectedVariantIndex(0);
                                    setActiveGalleryIndex(0);
                                    setCurrentStoreView('product');
                                  }}
                                  className="font-serif text-base font-bold text-[#2C1A11] hover:text-[#C68B59] cursor-pointer transition-colors leading-snug"
                                >
                                  {product.title}
                                </h3>
                              </div>

                              <div className="pt-4 border-t border-[#EADFCF] mt-4 flex items-center justify-between">
                                <span className="font-serif text-base font-bold text-[#2C1A11]">
                                  {formatPrice(product.price)}
                                </span>
                                <button
                                  onClick={() => handleAddToCart(product, 0, 1)}
                                  className="px-3 py-1.5 rounded-lg bg-[#2C1A11] hover:bg-[#C68B59] text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </main>
            )}

            {/* VIEW 3: PRODUCT DETAIL PAGE */}
            {currentStoreView === 'product' && (
              <main className="py-12 bg-[#FAF7F2] flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-2 text-xs text-[#2C1A11]/60 mb-8 font-medium">
                    <button onClick={() => setCurrentStoreView('home')} className="hover:underline">Home</button>
                    <span>/</span>
                    <button onClick={() => setCurrentStoreView('catalog')} className="hover:underline">Bakery Menu</button>
                    <span>/</span>
                    <span className="text-[#2C1A11] font-semibold">{selectedProduct.title}</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Media Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="rounded-3xl overflow-hidden border border-[#EADFCF] bg-[#F3EDE2] h-[450px]">
                        <img
                          src={selectedProduct.gallery[activeGalleryIndex] || selectedProduct.image}
                          alt={selectedProduct.title}
                          className="w-full h-full object-cover transition-all duration-300"
                        />
                      </div>

                      {/* Thumbnails */}
                      <div className="flex items-center gap-3">
                        {selectedProduct.gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveGalleryIndex(idx)}
                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                              activeGalleryIndex === idx ? 'border-[#C68B59] ring-2 ring-[#C68B59]/30' : 'border-[#EADFCF] opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Product Purchase Box */}
                    <div className="lg:col-span-5 space-y-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#C68B59] mb-2">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{selectedProduct.rating} Rating</span>
                          <span className="text-[#2C1A11]/40">({selectedProduct.reviewsCount} verified reviews)</span>
                        </div>

                        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1A11] leading-tight">
                          {selectedProduct.title}
                        </h1>

                        <div className="mt-3 flex items-baseline gap-3">
                          <span className="font-serif text-3xl font-bold text-[#2C1A11]">
                            {formatPrice(selectedProduct.variants[selectedVariantIndex]?.price || selectedProduct.price)}
                          </span>
                          {selectedProduct.variants[selectedVariantIndex]?.compareAtPrice && (
                            <span className="text-sm text-[#2C1A11]/40 line-through font-mono">
                              {formatPrice(selectedProduct.variants[selectedVariantIndex].compareAtPrice!)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#2C1A11]/80 leading-relaxed font-light">
                        {selectedProduct.description}
                      </p>

                      {/* Variant Selector */}
                      <div>
                        <span className="text-xs uppercase tracking-wider font-bold text-[#2C1A11] block mb-2 font-mono">
                          Select Size & Portion
                        </span>
                        <div className="space-y-2">
                          {selectedProduct.variants.map((variant, idx) => (
                            <button
                              key={variant.id}
                              onClick={() => setSelectedVariantIndex(idx)}
                              className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                                selectedVariantIndex === idx
                                  ? 'border-[#C68B59] bg-[#C68B59]/10 text-[#2C1A11] ring-1 ring-[#C68B59]'
                                  : 'border-[#EADFCF] bg-[#FAF7F2] text-[#2C1A11]/70 hover:bg-[#F3EDE2]'
                              }`}
                            >
                              <span>{variant.title}</span>
                              <span className="font-serif font-bold">{formatPrice(variant.price)}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add to Bag Button */}
                      <div className="space-y-3 pt-2">
                        <button
                          onClick={() => handleAddToCart(selectedProduct, selectedVariantIndex, 1)}
                          className="w-full py-4 rounded-xl bg-[#2C1A11] hover:bg-[#C68B59] text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4 text-[#C68B59]" />
                          <span>Add to Bakery Bag • {formatPrice(selectedProduct.variants[selectedVariantIndex]?.price || selectedProduct.price)}</span>
                        </button>

                        <div className="bg-[#F3EDE2] p-3 rounded-xl border border-[#EADFCF] flex items-center gap-2 text-xs text-[#2C1A11]/80">
                          <Truck className="w-4 h-4 text-[#C68B59] flex-shrink-0" />
                          <span>Delivered same-day in insulated temperature-controlled bakery totes.</span>
                        </div>
                      </div>

                      {/* Expandable Accordions */}
                      <div className="border-t border-[#EADFCF] pt-4 space-y-3 text-xs">
                        <details className="group border border-[#EADFCF] rounded-xl p-3 bg-[#FAF7F2]" open>
                          <summary className="font-serif font-bold text-sm text-[#2C1A11] cursor-pointer flex items-center justify-between list-none">
                            <span>Sourcing & Ingredients</span>
                            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                          </summary>
                          <p className="mt-2 text-[#2C1A11]/75 leading-relaxed">{selectedProduct.ingredients}</p>
                        </details>

                        <details className="group border border-[#EADFCF] rounded-xl p-3 bg-[#FAF7F2]">
                          <summary className="font-serif font-bold text-sm text-[#2C1A11] cursor-pointer flex items-center justify-between list-none">
                            <span>Allergen Notice</span>
                            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                          </summary>
                          <p className="mt-2 text-[#2C1A11]/75 leading-relaxed">{selectedProduct.allergens}</p>
                        </details>

                        <details className="group border border-[#EADFCF] rounded-xl p-3 bg-[#FAF7F2]">
                          <summary className="font-serif font-bold text-sm text-[#2C1A11] cursor-pointer flex items-center justify-between list-none">
                            <span>Freshness & Storage</span>
                            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                          </summary>
                          <p className="mt-2 text-[#2C1A11]/75 leading-relaxed">{selectedProduct.storage}</p>
                        </details>
                      </div>

                    </div>

                  </div>
                </div>
              </main>
            )}

            {/* VIEW 4: BESPOKE CAKE STUDIO */}
            {currentStoreView === 'cake-studio' && (
              <main className="py-12 bg-[#FAF7F2] flex-grow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  <div className="text-center mb-10">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#C68B59] block mb-2">
                      Haute Pâtisserie Studio
                    </span>
                    <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1A11]">
                      Bespoke Cake Configurator
                    </h1>
                    <p className="text-xs sm:text-sm text-[#2C1A11]/70 mt-2 max-w-lg mx-auto">
                      Design your wedding or celebration centerpiece cake. Receive instant portion estimates and reserve pastry chef consultation.
                    </p>
                  </div>

                  <div className="bg-[#F3EDE2] p-8 rounded-3xl border border-[#EADFCF] shadow-sm space-y-8">
                    
                    {/* Step 1: Tiers & Guest Count */}
                    <div>
                      <label className="font-serif text-lg font-bold text-[#2C1A11] block mb-3">
                        1. Select Cake Tiers & Scale
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { tiers: 1, label: 'Single Tier (6")', serves: '10–14 Guests', basePrice: 120 },
                          { tiers: 2, label: 'Two Tiers (6" + 8")', serves: '25–35 Guests', basePrice: 240 },
                          { tiers: 3, label: 'Three Tiers (6" + 8" + 10")', serves: '60–80 Guests', basePrice: 420 }
                        ].map((t) => (
                          <button
                            key={t.tiers}
                            onClick={() => setCakeTiers(t.tiers)}
                            className={`p-4 rounded-2xl border text-center transition-all ${
                              cakeTiers === t.tiers
                                ? 'border-[#C68B59] bg-[#FAF7F2] ring-2 ring-[#C68B59] shadow-sm'
                                : 'border-[#EADFCF] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <span className="font-serif font-bold text-sm block text-[#2C1A11]">{t.label}</span>
                            <span className="text-[11px] text-[#2C1A11]/60 block mt-0.5">{t.serves}</span>
                            <span className="font-mono text-xs font-bold text-[#C68B59] block mt-2">${t.basePrice} base</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Flavor Profile */}
                    <div>
                      <label className="font-serif text-lg font-bold text-[#2C1A11] block mb-3">
                        2. Artisan Flavor Combination
                      </label>
                      <select
                        value={cakeFlavor}
                        onChange={(e) => setCakeFlavor(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#EADFCF] rounded-xl p-3 text-xs font-semibold text-[#2C1A11] focus:outline-none focus:border-[#C68B59]"
                      >
                        <option>Tahitian Vanilla & Raspberry Coulis</option>
                        <option>Grand Cru Valrhona Chocolate & Espresso Ganache</option>
                        <option>Earl Grey Lavender & Lemon Curd Sponge</option>
                        <option>Sicilian Pistachio Cream & Roasted Strawberry</option>
                      </select>
                    </div>

                    {/* Step 3: Finish / Buttercream Style */}
                    <div>
                      <label className="font-serif text-lg font-bold text-[#2C1A11] block mb-3">
                        3. Buttercream Finish & Aesthetics
                      </label>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {[
                          'Textured Silk Buttercream & Fresh Botanicals',
                          'Semi-Naked Rustic with Gold Leaf Accents',
                          'Ultra-Smooth Architectural Contemporary Ganache',
                          'Vintage Lambeth Piped Ruffles'
                        ].map((fin) => (
                          <button
                            key={fin}
                            onClick={() => setCakeFinish(fin)}
                            className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                              cakeFinish === fin
                                ? 'border-[#C68B59] bg-[#FAF7F2] ring-1 ring-[#C68B59]'
                                : 'border-[#EADFCF] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]'
                            }`}
                          >
                            {fin}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 4: Custom Lettering */}
                    <div>
                      <label className="font-serif text-lg font-bold text-[#2C1A11] block mb-1">
                        4. Custom Lettering or Inscription (Optional)
                      </label>
                      <input
                        type="text"
                        value={cakeInscription}
                        onChange={(e) => setCakeInscription(e.target.value)}
                        placeholder="e.g., Happy 30th Sophia! or Juliette & Henri"
                        className="w-full bg-[#FAF7F2] border border-[#EADFCF] rounded-xl p-3 text-xs text-[#2C1A11] focus:outline-none focus:border-[#C68B59]"
                      />
                    </div>

                    {/* Quote Box & CTA */}
                    <div className="border-t border-[#EADFCF] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-[#2C1A11]/60 block">Estimated Artisan Quote:</span>
                        <span className="font-serif text-3xl font-bold text-[#C68B59]">
                          ${cakeTiers === 1 ? '145.00' : cakeTiers === 2 ? '280.00' : '480.00'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          alert(`Merci! Your bespoke cake inquiry for "${cakeFlavor}" (${cakeTiers} Tiers) has been noted. Our concierge will contact you.`);
                          setCurrentStoreView('home');
                        }}
                        className="px-8 py-3.5 rounded-xl bg-[#2C1A11] hover:bg-[#C68B59] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                      >
                        Submit Consultation Request &rarr;
                      </button>
                    </div>

                  </div>
                </div>
              </main>
            )}

            {/* VIEW 5: HOURS & CONTACT */}
            {currentStoreView === 'contact' && (
              <main className="py-12 bg-[#FAF7F2] flex-grow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                  
                  <div className="text-center">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#C68B59] block mb-1">
                      Our Brooklyn Boulangerie
                    </span>
                    <h1 className="font-serif text-4xl font-bold text-[#2C1A11]">
                      Baking Hours & Location
                    </h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#F3EDE2] p-8 rounded-3xl border border-[#EADFCF] space-y-6">
                      <h2 className="font-serif text-2xl font-bold text-[#2C1A11]">Storefront & Oven Schedule</h2>
                      
                      <div className="space-y-3 text-xs text-[#2C1A11]/80">
                        <div className="flex justify-between border-b border-[#EADFCF] pb-2">
                          <span className="font-bold">Monday – Friday:</span>
                          <span>7:00 AM – 6:00 PM</span>
                        </div>
                        <div className="flex justify-between border-b border-[#EADFCF] pb-2">
                          <span className="font-bold">Saturday & Sunday:</span>
                          <span>7:30 AM – 5:00 PM</span>
                        </div>
                        <div className="text-[#C68B59] font-semibold pt-1">
                          ✨ Ovens fire at 3:00 AM daily. Warm croissants on shelves by 7:15 AM.
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 text-xs">
                        <div className="flex items-center gap-2 text-[#2C1A11]">
                          <MapPin className="w-4 h-4 text-[#C68B59]" />
                          <span>142 Bedford Avenue, Brooklyn, NY 11249</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#2C1A11]">
                          <Phone className="w-4 h-4 text-[#C68B59]" />
                          <span>+1 (718) 555-0192 (Bakery Hotline)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#2C1A11]">
                          <Mail className="w-4 h-4 text-[#C68B59]" />
                          <span>bonjour@maison-delices.com</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#EADFCF] shadow-sm space-y-4">
                      <h2 className="font-serif text-2xl font-bold text-[#2C1A11]">Send Us a Note</h2>
                      <form onSubmit={(e) => { e.preventDefault(); alert('Message sent to bakery concierge!'); }} className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-[#2C1A11] mb-1">Your Name</label>
                          <input type="text" required placeholder="Camille Laurent" className="w-full p-2.5 rounded-lg border border-[#EADFCF] bg-[#F3EDE2] text-[#2C1A11]" />
                        </div>
                        <div>
                          <label className="block font-bold text-[#2C1A11] mb-1">Email</label>
                          <input type="email" required placeholder="camille@example.com" className="w-full p-2.5 rounded-lg border border-[#EADFCF] bg-[#F3EDE2] text-[#2C1A11]" />
                        </div>
                        <div>
                          <label className="block font-bold text-[#2C1A11] mb-1">Message</label>
                          <textarea rows={3} required placeholder="Inquiries about wedding tasting boxes, dietary allergens..." className="w-full p-2.5 rounded-lg border border-[#EADFCF] bg-[#F3EDE2] text-[#2C1A11]" />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-[#2C1A11] text-white font-bold text-xs hover:bg-[#C68B59] transition-colors cursor-pointer">
                          Send Message &rarr;
                        </button>
                      </form>
                    </div>
                  </div>

                </div>
              </main>
            )}

            {/* Global Storefront Footer */}
            <footer className="bg-[#2C1A11] text-[#FAF7F2] border-t border-[#3D2518] mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <span className="font-serif text-2xl font-bold text-white block">Maison Délices</span>
                    <p className="text-xs text-[#FAF7F2]/70 leading-relaxed font-light">
                      Dedicated to traditional French slow-fermentation, 100% organic flours, and handcrafted celebration cakes made fresh every single morning.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-sm font-bold text-white mb-3">Bakery Menu</h3>
                    <ul className="space-y-2 text-xs text-[#FAF7F2]/70">
                      <li><button onClick={() => { setSelectedCategoryFilter('Artisan Breads'); setCurrentStoreView('catalog'); }} className="hover:text-[#C68B59]">Artisan Sourdoughs</button></li>
                      <li><button onClick={() => { setSelectedCategoryFilter('Viennoiserie'); setCurrentStoreView('catalog'); }} className="hover:text-[#C68B59]">French Viennoiserie</button></li>
                      <li><button onClick={() => { setSelectedCategoryFilter('Patisserie & Cakes'); setCurrentStoreView('catalog'); }} className="hover:text-[#C68B59]">Celebration Cakes</button></li>
                      <li><button onClick={() => { setSelectedCategoryFilter('Petit Fours & Macarons'); setCurrentStoreView('catalog'); }} className="hover:text-[#C68B59]">Parisian Macarons</button></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-serif text-sm font-bold text-white mb-3">Concierge</h3>
                    <ul className="space-y-2 text-xs text-[#FAF7F2]/70">
                      <li><button onClick={() => setCurrentStoreView('cake-studio')} className="hover:text-[#C68B59]">Bespoke Cake Studio</button></li>
                      <li><button onClick={() => setCurrentStoreView('contact')} className="hover:text-[#C68B59]">Bakery Hours & Map</button></li>
                      <li><button onClick={() => setCurrentStoreView('contact')} className="hover:text-[#C68B59]">Allergen Directory</button></li>
                      <li><button onClick={() => setCurrentStoreView('contact')} className="hover:text-[#C68B59]">Direct Hotline</button></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-serif text-sm font-bold text-white mb-3">Bakery Club</h3>
                    <p className="text-xs text-[#FAF7F2]/70 mb-3">Receive 10% off your first fresh morning batch.</p>
                    <div className="flex gap-2">
                      <input type="email" placeholder="email@address.com" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none" />
                      <button onClick={() => alert('Merci! Welcome to Maison Délices.')} className="px-3 py-2 bg-[#C68B59] hover:bg-[#B37946] text-white text-xs font-bold rounded-lg cursor-pointer">Join</button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F2]/50 gap-2">
                  <span>&copy; {new Date().getFullYear()} Maison Délices Boulangerie. All rights reserved.</span>
                  <span>Shopify Online Store 2.0 Compliant</span>
                </div>
              </div>
            </footer>

            {/* SLIDE-OUT CART DRAWER */}
            {isCartOpen && (
              <div className="fixed inset-0 z-50 overflow-hidden">
                <div
                  onClick={() => setIsCartOpen(false)}
                  className="absolute inset-0 bg-[#2C1A11]/60 backdrop-blur-sm transition-opacity"
                ></div>

                <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                  <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#EADFCF] shadow-2xl flex flex-col">
                    
                    {/* Drawer Header */}
                    <div className="p-5 border-b border-[#EADFCF] flex items-center justify-between bg-[#F3EDE2]">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[#C68B59]" />
                        <h2 className="font-serif text-xl font-bold text-[#2C1A11]">Your Bakery Bag</h2>
                        <span className="text-xs font-mono font-bold text-[#2C1A11]/60">({cartItemCount})</span>
                      </div>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-1.5 rounded-full text-[#2C1A11]/70 hover:text-[#2C1A11] hover:bg-[#FAF7F2]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Free Shipping Tracker */}
                    <div className="p-4 bg-[#FAF7F2] border-b border-[#EADFCF] space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#2C1A11]">
                        <span>
                          {shippingRemaining <= 0 ? (
                            <span className="text-[#C68B59] font-bold">🎉 Complimentary delivery unlocked!</span>
                          ) : (
                            <span>Add <strong>{formatPrice(shippingRemaining)}</strong> more for free delivery</span>
                          )}
                        </span>
                        <span className="font-mono text-[10px] text-[#2C1A11]/60">{shippingProgressPercent.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#EADFCF] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C68B59] transition-all duration-300"
                          style={{ width: `${shippingProgressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-grow overflow-y-auto p-5 divide-y divide-[#EADFCF]">
                      {cart.length === 0 ? (
                        <div className="py-16 text-center space-y-3">
                          <ShoppingBag className="w-12 h-12 mx-auto text-[#2C1A11]/30" />
                          <p className="font-serif text-xl text-[#2C1A11] font-bold">Your bag is empty</p>
                          <p className="text-xs text-[#2C1A11]/70">Discover our slow-fermented sourdoughs and croissants.</p>
                          <button
                            onClick={() => {
                              setIsCartOpen(false);
                              setCurrentStoreView('catalog');
                            }}
                            className="px-4 py-2 rounded-lg bg-[#C68B59] text-white text-xs font-bold"
                          >
                            Explore Menu
                          </button>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <div key={item.id} className="py-4 flex gap-4 items-center">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-16 h-16 rounded-xl object-cover border border-[#EADFCF] bg-[#F3EDE2] flex-shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <h3 className="font-serif text-sm font-bold text-[#2C1A11] truncate">{item.product.title}</h3>
                              <p className="text-[11px] text-[#2C1A11]/60">{item.variantTitle}</p>
                              <span className="font-serif text-xs font-bold text-[#C68B59] block mt-0.5">
                                {formatPrice(item.price * item.quantity)}
                              </span>

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-[#EADFCF] rounded-lg bg-[#F3EDE2]">
                                  <button
                                    onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}
                                    className="px-2 py-0.5 text-xs text-[#2C1A11]/70 hover:text-[#2C1A11]"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 text-xs font-bold">{item.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}
                                    className="px-2 py-0.5 text-xs text-[#2C1A11]/70 hover:text-[#2C1A11]"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleUpdateCartQty(item.id, 0)}
                                  className="text-[11px] text-red-600 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Drawer Footer */}
                    {cart.length > 0 && (
                      <div className="p-5 border-t border-[#EADFCF] bg-[#F3EDE2] space-y-4">
                        <details className="group text-xs">
                          <summary className="font-bold text-[#2C1A11] cursor-pointer flex items-center justify-between list-none">
                            <span>Add Custom Inscription or Gate Code</span>
                            <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                          </summary>
                          <textarea
                            value={cartNote}
                            onChange={(e) => setCartNote(e.target.value)}
                            rows={2}
                            placeholder="e.g. 'Happy Birthday Alex!' or gate code #1234"
                            className="mt-2 w-full p-2 text-xs bg-[#FAF7F2] border border-[#EADFCF] rounded-lg text-[#2C1A11]"
                          />
                        </details>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#2C1A11]/70 font-semibold">Subtotal</span>
                          <span className="font-serif text-2xl font-bold text-[#2C1A11]">{formatPrice(cartSubtotal)}</span>
                        </div>

                        <button
                          onClick={() => alert(`Redirecting to Shopify checkout with ${cartItemCount} treats (${formatPrice(cartSubtotal)})!`)}
                          className="w-full py-3.5 rounded-xl bg-[#2C1A11] hover:bg-[#C68B59] text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Proceed to Bakery Checkout &rarr;</span>
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {/* PREDICTIVE SEARCH MODAL */}
            {isSearchOpen && (
              <div className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center pt-20 px-4">
                <div
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute inset-0 bg-[#2C1A11]/60 backdrop-blur-sm"
                ></div>

                <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#EADFCF] shadow-2xl overflow-hidden z-10">
                  <div className="p-4 border-b border-[#EADFCF] flex items-center gap-3 bg-[#F3EDE2]">
                    <Search className="w-5 h-5 text-[#C68B59]" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sourdough, croissants, cakes, macarons..."
                      autoFocus
                      className="w-full bg-transparent font-serif text-lg text-[#2C1A11] placeholder-[#2C1A11]/40 focus:outline-none"
                    />
                    <button onClick={() => setIsSearchOpen(false)} className="p-1 text-[#2C1A11]/60 hover:text-[#2C1A11]">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 max-h-96 overflow-y-auto">
                    {searchQuery.trim() === '' ? (
                      <div className="space-y-3">
                        <span className="text-xs uppercase font-bold text-[#2C1A11]/50 tracking-wider block">Popular Bakes</span>
                        <div className="flex flex-wrap gap-2">
                          {['Country Sourdough', 'Butter Croissant', 'Chocolate Opéra Cake', 'Macarons'].map((term) => (
                            <button
                              key={term}
                              onClick={() => setSearchQuery(term)}
                              className="px-3 py-1.5 rounded-full bg-[#F3EDE2] text-xs font-semibold text-[#2C1A11] hover:bg-[#C68B59] hover:text-white transition-colors"
                            >
                              🥐 {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedVariantIndex(0);
                              setActiveGalleryIndex(0);
                              setCurrentStoreView('product');
                              setIsSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F3EDE2] cursor-pointer transition-colors"
                          >
                            <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-[#F3EDE2]" />
                            <div className="flex-grow">
                              <h3 className="font-serif text-sm font-bold text-[#2C1A11]">{product.title}</h3>
                              <span className="text-xs font-bold text-[#C68B59]">{formatPrice(product.price)}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#2C1A11]/40" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-xs text-[#2C1A11]/60">
                        No treats found matching &quot;{searchQuery}&quot;.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LIQUID SOURCE CODE EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'code' && (
          <div className="flex-grow flex flex-col md:flex-row bg-[#1E110A] text-[#FAF7F2]">
            
            {/* File List */}
            <div className="w-full md:w-80 bg-[#160B06] border-r border-[#3D2518] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-white">Theme File Tree</span>
                <span className="text-[10px] font-mono bg-[#3D2518] px-2 py-0.5 rounded text-[#C68B59]">Shopify OS 2.0</span>
              </div>

              <div className="space-y-1 text-xs font-mono">
                {Object.keys(themeFiles).map((file) => (
                  <button
                    key={file}
                    onClick={() => setSelectedCodeFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedCodeFile === file
                        ? 'bg-[#C68B59] text-white font-bold'
                        : 'text-[#FAF7F2]/70 hover:bg-[#3D2518] hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{file}</span>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-[#1E110A] rounded-xl border border-[#3D2518] text-xs space-y-2">
                <span className="font-bold text-[#C68B59] block">📦 Ready for Shopify Admin</span>
                <p className="text-[#FAF7F2]/70 text-[11px] leading-relaxed">
                  Export this complete theme ZIP and upload directly to any Shopify store via <em>Online Store &gt; Themes &gt; Upload zip file</em>.
                </p>
                <button
                  onClick={handleExportZip}
                  className="w-full py-2 bg-[#C68B59] hover:bg-[#B37946] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Theme .zip</span>
                </button>
              </div>
            </div>

            {/* Code Viewer Panel */}
            <div className="flex-grow flex flex-col p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#3D2518] mb-4">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#C68B59]" />
                  <span className="font-mono text-sm font-bold text-white">{selectedCodeFile}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(themeFiles[selectedCodeFile] || '');
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#3D2518] hover:bg-[#C68B59] text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy File Content'}</span>
                </button>
              </div>

              <pre className="flex-grow bg-[#140804] p-5 rounded-2xl border border-[#3D2518] overflow-auto font-mono text-xs text-[#FAF7F2]/90 leading-relaxed">
                <code>{themeFiles[selectedCodeFile] || '// Select a file from the left'}</code>
              </pre>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SPECIFICATION & ARCHITECTURE */}
        {/* ========================================================================= */}
        {activeTab === 'docs' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="border-b border-[#EADFCF] pb-6">
              <span className="text-xs uppercase tracking-widest font-bold text-[#C68B59] block mb-1">Architecture Reference</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1A11]">
                Shopify OS 2.0 Theme Specifications
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F3EDE2] p-6 rounded-2xl border border-[#EADFCF] space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#2C1A11] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#C68B59]" />
                  Color System
                </h3>
                <ul className="text-xs text-[#2C1A11]/80 space-y-1.5">
                  <li><strong>Chocolate (#2C1A11):</strong> Primary headers, text, dark backgrounds</li>
                  <li><strong>Warm Cream (#FAF7F2):</strong> Canvas background and soft card layers</li>
                  <li><strong>Almond Beige (#F3EDE2):</strong> Structural dividers and container borders</li>
                  <li><strong>Crust Caramel (#C68B59):</strong> Primary interactive badges & CTA buttons</li>
                  <li><strong>Terracotta (#A44230):</strong> Discount alerts and seasonal badges</li>
                </ul>
              </div>

              <div className="bg-[#F3EDE2] p-6 rounded-2xl border border-[#EADFCF] space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#2C1A11] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C68B59]" />
                  Core Architecture
                </h3>
                <ul className="text-xs text-[#2C1A11]/80 space-y-1.5">
                  <li><strong>AJAX Cart Drawer:</strong> Real-time subtotal & free delivery threshold ($50)</li>
                  <li><strong>Custom Cake Studio:</strong> Interactive tier & portion calculation</li>
                  <li><strong>Facet Filters:</strong> Asynchronous filtering without full-page reloads</li>
                  <li><strong>Predictive Search:</strong> Instant treat suggestions with thumbnails</li>
                  <li><strong>Accessible Accordions:</strong> Nutritional, allergen, and storage notices</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#2C1A11] text-[#FAF7F2] p-8 rounded-3xl space-y-4">
              <h3 className="font-serif text-2xl font-bold text-white">How to Install in Shopify</h3>
              <ol className="text-xs text-[#FAF7F2]/80 space-y-2 list-decimal list-inside leading-relaxed font-light">
                <li>Click the <strong>&quot;Download Theme (.zip)&quot;</strong> button in the top navigation bar.</li>
                <li>In your Shopify Admin, navigate to <strong>Online Store &gt; Themes</strong>.</li>
                <li>Click <strong>Add Theme &gt; Upload zip file</strong> and select the downloaded archive.</li>
                <li>Customize colors, hero headlines, and free delivery thresholds in the visual Theme Editor.</li>
              </ol>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
