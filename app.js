/**
 * ============================================================================
 * TIENDAS YOLO® — CATÁLOGO PÚBLICO & TIENDA ONLINE (app.js)
 * Insumos profesionales para uñas y manicuristas | Maracaibo, Venezuela
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'TIENDAS_YOLO_DATA_V1';
  const ADMIN_PIN_DEFAULT = '2026';

  // Detección de ruta de imagen (raíz o assets/)
  function resolveImgPath(filename) {
    if (!filename) return 'logo-yolo.png';
    if (filename.startsWith('http') || filename.startsWith('data:')) return filename;
    return filename.replace(/^assets\//, '');
  }

  // CATÁLOGO SEMILLA INICIAL
  const SEED_PRODUCTS = [
    {
      id: "TY-PROD-001",
      sku: "MY-CG-01",
      nombre: "Esmalte M&Y Color Gel (Colección)",
      categoria: "Esmaltes y Geles",
      descripcion: "Esmalte semipermanente de alta pigmentación, secado UV/LED rápido y brillo duradero.",
      precioUSD: 3.50,
      costoUSD: 1.80,
      stockActual: 48,
      stockMinimo: 10,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-002",
      sku: "TY-BR-01",
      nombre: "Base Rubber Tiendas Yolo 15ml",
      categoria: "Esmaltes y Geles",
      descripcion: "Base autonivelante de alta viscosidad para nivelación de uña natural y refuerzo contra quiebres.",
      precioUSD: 4.50,
      costoUSD: 2.20,
      stockActual: 35,
      stockMinimo: 8,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-003",
      sku: "TY-TC-01",
      nombre: "Top Coat No Wipe Ultra Brillo 15ml",
      categoria: "Esmaltes y Geles",
      descripcion: "Sellador final sin capa de inhibición. Acabado cristal intacto hasta por 28 días.",
      precioUSD: 4.00,
      costoUSD: 2.00,
      stockActual: 40,
      stockMinimo: 10,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-004",
      sku: "TY-SG-01",
      nombre: "Spider Gel Elástico (Blanco / Negro / Dorado)",
      categoria: "Esmaltes y Geles",
      descripcion: "Gel elástico de alta densidad para trazos geométricos, líneas ultrafinas y nail art creativo.",
      precioUSD: 3.00,
      costoUSD: 1.40,
      stockActual: 25,
      stockMinimo: 5,
      unidad: "Unidad",
      destacado: "NO",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-005",
      sku: "TY-UVG-01",
      nombre: "UV Gel Constructor Blanco / Clear 30g",
      categoria: "Esmaltes y Geles",
      descripcion: "Gel de construcción de alta consistencia para esculpido con moldes, tips y capping sobre uña natural.",
      precioUSD: 5.50,
      costoUSD: 2.80,
      stockActual: 20,
      stockMinimo: 5,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-006",
      sku: "TY-KIT-01",
      nombre: "Kit Completo para Principiantes Tiendas Yolo",
      categoria: "Kits",
      descripcion: "Incluye Lámpara Sun Mini UV/LED, 3 Esmaltes semipermanentes, Base Rubber, Top Coat, Lima 100/180, Preparador y Pincel.",
      precioUSD: 28.00,
      costoUSD: 16.50,
      stockActual: 12,
      stockMinimo: 3,
      unidad: "Kit",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-007",
      sku: "TY-PIN-01",
      nombre: "Set de Pinceles Liner de Precisión (3 pcs)",
      categoria: "Pinceles y Herramientas",
      descripcion: "Pelos sintéticos ultrafinos (7mm, 9mm, 11mm) ideales para manicura rusa, francesa y líneas de alta definición.",
      precioUSD: 5.00,
      costoUSD: 2.30,
      stockActual: 30,
      stockMinimo: 8,
      unidad: "Set",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-008",
      sku: "TY-LIM-01",
      nombre: "Lima Profesional 100/180 (Pack x 5 unidades)",
      categoria: "Pinceles y Herramientas",
      descripcion: "Grano abrasivo duradero para rebajar y dar forma a uñas acrílicas, gel y preparación de uña natural.",
      precioUSD: 3.50,
      costoUSD: 1.50,
      stockActual: 60,
      stockMinimo: 15,
      unidad: "Pack",
      destacado: "NO",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-009",
      sku: "TY-TIPS-01",
      nombre: "Cápsulas Dual System Curva C (Caja x 100)",
      categoria: "Tips y Extensiones",
      descripcion: "Moldes reutilizables con guías milimétricas para técnica exprés con polygel y acrigel.",
      precioUSD: 4.50,
      costoUSD: 2.10,
      stockActual: 28,
      stockMinimo: 6,
      unidad: "Caja",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-010",
      sku: "TY-LIQ-01",
      nombre: "Uña de Hierro / Endurecedor Nutritivo 15ml",
      categoria: "Líquidos y Preparación",
      descripcion: "Tratamiento intensivo con calcio y queratina para recuperar uñas maltratadas o escamadas.",
      precioUSD: 3.00,
      costoUSD: 1.30,
      stockActual: 45,
      stockMinimo: 10,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-011",
      sku: "TY-PEST-01",
      nombre: "Pestañas Magnéticas + Delineador y Aplicador",
      categoria: "Pestañas y Belleza",
      descripcion: "Colocación rápida sin pegamento en segundos, efecto volumen natural y reutilizables hasta 35 usos.",
      precioUSD: 6.50,
      costoUSD: 3.20,
      stockActual: 22,
      stockMinimo: 5,
      unidad: "Kit",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-012",
      sku: "TY-DEC-01",
      nombre: "Piedra Volcánica & Cristales de Cristal Aurora",
      categoria: "Decoración",
      descripcion: "Surtido de piedras facetadas con brillo multicolor para pedrería en uñas y encapsulados.",
      precioUSD: 2.50,
      costoUSD: 1.00,
      stockActual: 50,
      stockMinimo: 10,
      unidad: "Cajita",
      destacado: "NO",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    }
  ];

  const DEFAULT_CONFIG = {
    sheetsApiUrl: "",
    rateBCV: 395.50,
    whatsappNumber: "584265604070",
    deliveryFreeMinUSD: 15.00,
    deliveryFlatFeeUSD: 2.00,
    adminPin: "2026",
    paymentInfo: "Banesco (0134) | CI: V-28123456 | Telf: 0426-5604070\nZelle: tiendasyolo.pagos@gmail.com\nZinli: tiendasyolo.pagos@gmail.com"
  };

  const state = {
    products: [],
    cart: [],
    orders: [],
    quotes: [],
    config: Object.assign({}, DEFAULT_CONFIG),
    activeCategory: 'all',
    searchQuery: '',
    sortCriteria: 'featured',
    cardQuantities: {} // Almacena la cantidad seleccionada en cada tarjeta antes de agregar
  };

  // ============================================================================
  // CARGA DE DATOS DESDE LOCALSTORAGE O SEMILLA
  // ============================================================================
  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state.products = (parsed.products && parsed.products.length > 0) ? parsed.products : SEED_PRODUCTS;
        state.orders = parsed.orders || [];
        state.quotes = parsed.quotes || [];
        state.config = Object.assign({}, DEFAULT_CONFIG, parsed.config || {});
        state.cart = parsed.cart || [];
      } else {
        state.products = SEED_PRODUCTS;
        state.config = Object.assign({}, DEFAULT_CONFIG);
        state.cart = [];
        saveData();
      }
    } catch (e) {
      console.error("Error al cargar datos:", e);
      state.products = SEED_PRODUCTS;
      state.config = Object.assign({}, DEFAULT_CONFIG);
      state.cart = [];
    }

    updateRateDisplay();
  }

  function saveData() {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      existing.products = state.products;
      existing.orders = state.orders;
      existing.quotes = state.quotes;
      existing.config = state.config;
      existing.cart = state.cart;
      existing.savedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  function updateRateDisplay() {
    const rate = Number(state.config.rateBCV || 395.50);
    const rateEl = document.getElementById('top-rate-display');
    if (rateEl) {
      rateEl.textContent = `Bs. ${rate.toFixed(2)} / $`;
    }
  }

  // ============================================================================
  // RENDERIZADO DE CATEGORÍAS
  // ============================================================================
  function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const categories = [
      { id: 'all', label: 'Todos los Insumos', icon: '✨' },
      { id: 'Esmaltes y Geles', label: 'Esmaltes & Geles', icon: '💅' },
      { id: 'Kits', label: 'Kits Principiantes', icon: '📦' },
      { id: 'Pinceles y Herramientas', label: 'Pinceles & Limas', icon: '🖌️' },
      { id: 'Tips y Extensiones', label: 'Tips & Dual System', icon: '📐' },
      { id: 'Líquidos y Preparación', label: 'Líquidos & Uña Hierro', icon: '🧪' },
      { id: 'Pestañas y Belleza', label: 'Pestañas Magnéticas', icon: '👁️' },
      { id: 'Decoración', label: 'Decoración & Cristales', icon: '💎' }
    ];

    container.innerHTML = categories.map(cat => {
      const count = cat.id === 'all' 
        ? state.products.filter(p => p.activo === 'SI').length
        : state.products.filter(p => p.activo === 'SI' && p.categoria === cat.id).length;

      const isActive = state.activeCategory === cat.id ? 'active' : '';

      return `
        <button class="category-chip ${isActive}" data-category="${cat.id}">
          <span>${cat.icon}</span>
          <span>${cat.label}</span>
          <span class="chip-count">${count}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.category;
        renderCategories();
        renderProducts();
      });
    });
  }

  // ============================================================================
  // RENDERIZADO DEL CATÁLOGO DE PRODUCTOS (CON SELECTOR DE CANTIDAD DIRECTO)
  // ============================================================================
  function renderProducts() {
    const grid = document.getElementById('products-grid-container');
    const titleEl = document.getElementById('catalog-section-title');
    const countEl = document.getElementById('catalog-products-count');
    if (!grid) return;

    let filtered = state.products.filter(p => p.activo === 'SI');

    // Categoría
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(p => p.categoria === state.activeCategory);
      if (titleEl) titleEl.textContent = state.activeCategory;
    } else {
      if (titleEl) titleEl.textContent = "Todos los Insumos";
    }

    // Búsqueda
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      );
    }

    // Ordenamiento
    switch (state.sortCriteria) {
      case 'price-asc':
        filtered.sort((a, b) => a.precioUSD - b.precioUSD);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.precioUSD - a.precioUSD);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'stock-desc':
        filtered.sort((a, b) => b.stockActual - a.stockActual);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.destacado === 'SI' ? 1 : 0) - (a.destacado === 'SI' ? 1 : 0));
        break;
    }

    if (countEl) {
      countEl.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'} disponible${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <span style="font-size: 3rem; display: block; margin-bottom: 12px;">💅</span>
          <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 8px;">No encontramos insumos con ese criterio</h3>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">Intenta con otra palabra clave o explora todas las categorías.</p>
          <button class="btn-primary" id="btn-reset-search">Ver Todos los Insumos</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-search');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.activeCategory = 'all';
          state.searchQuery = '';
          const s = document.getElementById('global-search-input');
          if (s) s.value = '';
          renderCategories();
          renderProducts();
        });
      }
      return;
    }

    const rate = Number(state.config.rateBCV || 395.50);

    grid.innerHTML = filtered.map(prod => {
      const priceBs = (prod.precioUSD * rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const currentQty = state.cardQuantities[prod.id] || 1;
      const imgSrc = resolveImgPath(prod.imagenURL);

      let stockClass = 'in-stock';
      let stockTxt = `Disponible (${prod.stockActual} ${prod.unidad || 'uds'})`;
      if (prod.stockActual <= 0) {
        stockClass = 'out-of-stock';
        stockTxt = 'Agotado';
      } else if (prod.stockActual <= (prod.stockMinimo || 5)) {
        stockClass = 'low-stock';
        stockTxt = `¡Últimas ${prod.stockActual} unidades!`;
      }

      return `
        <article class="product-card" data-product-id="${prod.id}">
          <div class="product-image-container">
            <div class="product-badges-top">
              ${prod.destacado === 'SI' ? '<span class="badge-featured">⭐ Estrella</span>' : ''}
              <span class="badge-category">${prod.categoria}</span>
            </div>
            <img src="${imgSrc}" alt="${prod.nombre}" class="product-img" loading="lazy" onerror="this.onerror=null; this.src='assets/logo-yolo.png'">
          </div>

          <div class="product-card-body">
            <h4 class="product-title">${prod.nombre}</h4>
            <p class="product-desc">${prod.descripcion || 'Insumo profesional de alta calidad garantizado por Tiendas Yolo.'}</p>
            
            <div class="product-meta-row">
              <span class="stock-indicator ${stockClass}">● ${stockTxt}</span>
              <span style="font-size: 0.74rem; color: var(--text-muted);">${prod.sku || ''}</span>
            </div>

            <div class="product-pricing-box">
              <div>
                <span class="price-usd">$${prod.precioUSD.toFixed(2)}</span>
              </div>
              <div class="price-bs">
                Bs. ${priceBs}
              </div>
            </div>

            <!-- SELECTOR DE CANTIDAD EN LA TARJETA -->
            <div class="product-card-actions-wrapper">
              <div class="card-qty-stepper">
                <button class="btn-stepper" data-stepper="minus" data-id="${prod.id}" ${prod.stockActual <= 0 ? 'disabled' : ''}>-</button>
                <span class="stepper-val" id="qty-display-${prod.id}">${currentQty}</span>
                <button class="btn-stepper" data-stepper="plus" data-id="${prod.id}" ${prod.stockActual <= 0 ? 'disabled' : ''}>+</button>
              </div>

              <div class="product-card-actions" style="flex:1;">
                <button class="btn-add-cart" data-action="add-cart" data-id="${prod.id}" ${prod.stockActual <= 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                  <span>🛒</span>
                  <span>${prod.stockActual <= 0 ? 'Agotado' : 'Agregar'}</span>
                </button>
                <button class="btn-quick-wa" data-action="quick-wa" data-id="${prod.id}" title="Consultar por WhatsApp">
                  💬
                </button>
              </div>
            </div>

          </div>
        </article>
      `;
    }).join('');

    // Escuchadores de Stepper de cantidad (+/-)
    grid.querySelectorAll('[data-stepper="plus"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const prod = state.products.find(p => p.id === id);
        const maxStock = prod ? prod.stockActual : 99;
        const current = state.cardQuantities[id] || 1;
        if (current < maxStock) {
          state.cardQuantities[id] = current + 1;
          const display = document.getElementById(`qty-display-${id}`);
          if (display) display.textContent = state.cardQuantities[id];
        }
      });
    });

    grid.querySelectorAll('[data-stepper="minus"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const current = state.cardQuantities[id] || 1;
        if (current > 1) {
          state.cardQuantities[id] = current - 1;
          const display = document.getElementById(`qty-display-${id}`);
          if (display) display.textContent = state.cardQuantities[id];
        }
      });
    });

    // Agregar al carrito con la cantidad seleccionada
    grid.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const qty = state.cardQuantities[id] || 1;
        addToCart(id, qty);
      });
    });

    // WhatsApp directo por producto
    grid.querySelectorAll('[data-action="quick-wa"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = state.products.find(p => p.id === btn.dataset.id);
        if (prod) {
          const qty = state.cardQuantities[prod.id] || 1;
          const text = encodeURIComponent(`💅 ¡Hola Tiendas Yolo! Deseo información y disponibilidad de *${qty}x ${prod.nombre}* ($${(prod.precioUSD * qty).toFixed(2)}). ¿Tienen entrega inmediata en Maracaibo?`);
          window.open(`https://wa.me/${state.config.whatsappNumber}?text=${text}`, '_blank');
        }
      });
    });
  }

  // ============================================================================
  // CARRITO DE COMPRAS & MODAL CHECKOUT
  // ============================================================================
  function addToCart(productId, quantity = 1) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += quantity;
    } else {
      state.cart.push({
        id: prod.id,
        nombre: prod.nombre,
        precioUSD: prod.precioUSD,
        imagenURL: resolveImgPath(prod.imagenURL),
        qty: quantity
      });
    }

    saveData();
    updateCartUI();
    showToast(`Añadido (${quantity}x): ${prod.nombre}`, "success");
  }

  function updateCartItemQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    }

    saveData();
    updateCartUI();
  }

  function removeCartItem(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    saveData();
    updateCartUI();
    showToast("Insumo removido del pedido.", "info");
  }

  function updateCartUI() {
    const countBadge = document.getElementById('cart-counter');
    const headerTotal = document.getElementById('cart-total-header');
    const list = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-summary-subtotal');
    const deliveryEl = document.getElementById('cart-summary-delivery');
    const totalUsdEl = document.getElementById('cart-summary-total-usd');
    const totalBsEl = document.getElementById('cart-summary-total-bs');

    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.qty * item.precioUSD), 0);
    const rate = Number(state.config.rateBCV || 395.50);

    if (countBadge) countBadge.textContent = totalItems;
    if (headerTotal) headerTotal.textContent = `$${subtotal.toFixed(2)}`;

    const deliveryTypeSelect = document.getElementById('cart-delivery-type');
    const isMaracaibo = deliveryTypeSelect ? deliveryTypeSelect.value === 'delivery-maracaibo' : true;
    let deliveryFee = 0;

    if (isMaracaibo && subtotal > 0) {
      if (subtotal >= Number(state.config.deliveryFreeMinUSD || 15.00)) {
        deliveryFee = 0;
        if (deliveryEl) {
          deliveryEl.className = 'free-delivery';
          deliveryEl.textContent = '¡GRATIS! 🎉';
        }
      } else {
        deliveryFee = Number(state.config.deliveryFlatFeeUSD || 2.00);
        if (deliveryEl) {
          deliveryEl.className = '';
          deliveryEl.textContent = `$${deliveryFee.toFixed(2)}`;
        }
      }
    } else if (deliveryEl) {
      deliveryEl.className = '';
      deliveryEl.textContent = 'Por acordar';
    }

    const grandTotalUSD = subtotal + deliveryFee;
    const grandTotalBs = grandTotalUSD * rate;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalUsdEl) totalUsdEl.textContent = `$${grandTotalUSD.toFixed(2)}`;
    if (totalBsEl) totalBsEl.textContent = `Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (!list) return;

    if (state.cart.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 36px 12px; color: var(--text-secondary);">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">🛒</span>
          <p style="font-weight: 700; margin-bottom: 4px;">Tu pedido está vacío</p>
          <p style="font-size: 0.8rem;">Selecciona la cantidad y agrega los insumos que necesitas.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = state.cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${resolveImgPath(item.imagenURL)}" alt="${item.nombre}" class="cart-item-img" onerror="this.onerror=null; this.src='assets/logo-yolo.png'">
        <div class="cart-item-info">
          <h5 class="cart-item-title">${item.nombre}</h5>
          <span class="cart-item-price">$${item.precioUSD.toFixed(2)} c/u — Subtotal: $${(item.qty * item.precioUSD).toFixed(2)}</span>
        </div>
        <div class="cart-qty-controls">
          <button class="btn-qty" data-cart-action="minus" data-id="${item.id}">-</button>
          <span class="cart-qty-num">${item.qty}</span>
          <button class="btn-qty" data-cart-action="plus" data-id="${item.id}">+</button>
          <button class="btn-micro" data-cart-action="delete" data-id="${item.id}" title="Eliminar" style="margin-left:4px; color:#ef4444;">🗑️</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('[data-cart-action="minus"]').forEach(btn => {
      btn.addEventListener('click', () => updateCartItemQty(btn.dataset.id, -1));
    });

    list.querySelectorAll('[data-cart-action="plus"]').forEach(btn => {
      btn.addEventListener('click', () => updateCartItemQty(btn.dataset.id, 1));
    });

    list.querySelectorAll('[data-cart-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => removeCartItem(btn.dataset.id));
    });
  }

  function handleSendWhatsAppOrder() {
    if (state.cart.length === 0) {
      showToast("Agrega al menos un insumo al carrito para enviar tu pedido.", "error");
      return;
    }

    const clientName = document.getElementById('cart-client-name').value.trim();
    const clientPhone = document.getElementById('cart-client-phone').value.trim();
    const clientInstagram = document.getElementById('cart-client-instagram').value.trim();
    const deliveryType = document.getElementById('cart-delivery-type').value;
    const address = document.getElementById('cart-delivery-address').value.trim();
    const paymentMethod = document.getElementById('cart-payment-method').value;
    const notes = document.getElementById('cart-notes').value.trim();

    if (!clientName) {
      showToast("Por favor ingresa tu nombre de manicurista o cliente.", "error");
      document.getElementById('cart-client-name').focus();
      return;
    }

    if (!clientPhone) {
      showToast("Por favor ingresa tu número de WhatsApp de contacto.", "error");
      document.getElementById('cart-client-phone').focus();
      return;
    }

    const rate = Number(state.config.rateBCV || 395.50);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.qty * item.precioUSD), 0);
    let deliveryFee = 0;
    let deliveryLabel = "Delivery en Maracaibo";

    if (deliveryType === 'delivery-maracaibo') {
      deliveryLabel = "Delivery en Maracaibo";
      deliveryFee = subtotal >= Number(state.config.deliveryFreeMinUSD || 15.00) ? 0 : Number(state.config.deliveryFlatFeeUSD || 2.00);
    } else if (deliveryType === 'envio-nacional') {
      deliveryLabel = "Envío Nacional (MRW/Tealca/Zoom)";
    } else {
      deliveryLabel = "Retiro Personal";
    }

    const grandTotalUSD = subtotal + deliveryFee;
    const grandTotalBs = grandTotalUSD * rate;
    const orderNum = state.orders.length + 1;
    const pad = ("0000" + orderNum).slice(-4);
    const newOrderId = `TY-PED-${pad}`;

    // Construcción del mensaje para WhatsApp
    let msg = `💅 *¡HOLA TIENDAS YOLO! Deseo ordenar los siguientes insumos:* 💅\n\n`;
    msg += `📄 *PEDIDO:* #${newOrderId}\n`;
    msg += `👤 *Clienta/Manicurista:* ${clientName}\n`;
    msg += `📱 *Teléfono:* ${clientPhone}\n`;
    if (clientInstagram) msg += `📸 *Instagram:* ${clientInstagram}\n`;
    msg += `📍 *Modalidad:* ${deliveryLabel}\n`;
    if (address) msg += `🏠 *Dirección/Zona:* ${address}\n`;
    msg += `💳 *Método de Pago:* ${paymentMethod}\n\n`;

    msg += `📦 *DETALLE DE INSUMOS:*\n`;
    state.cart.forEach(item => {
      const lineTotal = item.qty * item.precioUSD;
      msg += `▪️ ${item.qty}x ${item.nombre} — $${lineTotal.toFixed(2)}\n`;
    });

    msg += `\n💰 *Subtotal Insumos:* $${subtotal.toFixed(2)}\n`;
    if (deliveryType === 'delivery-maracaibo') {
      msg += `🚚 *Delivery Maracaibo:* ${deliveryFee === 0 ? '¡GRATIS!' : '$' + deliveryFee.toFixed(2)}\n`;
    }
    msg += `💎 *TOTAL A PAGAR:* $${grandTotalUSD.toFixed(2)} (Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})\n`;
    msg += `💵 *Tasa referencial:* Bs. ${rate.toFixed(2)} / $\n`;

    if (notes) {
      msg += `\n📝 *Notas:* ${notes}\n`;
    }

    msg += `\n_“Yo lo compro, Yo lo merezco”_ ✨`;

    // Registrar pedido en localStorage
    state.orders.unshift({
      id: newOrderId,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      cliente: clientName,
      telefono: clientPhone,
      instagram: clientInstagram,
      direccion: address || "Maracaibo",
      tipoEntrega: deliveryLabel,
      metodoPago: paymentMethod,
      referenciaPago: "Por confirmar",
      items: state.cart.map(i => ({ id: i.id, nombre: i.nombre, qty: i.qty, precio: i.precioUSD })),
      subtotalUSD: subtotal,
      tasaBs: rate,
      totalUSD: grandTotalUSD,
      totalBs: grandTotalBs,
      estado: "Pendiente",
      notas: notes
    });

    saveData();

    // Abrir WhatsApp oficial
    const waUrl = `https://wa.me/${state.config.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    closeCartDrawer();
    state.cart = [];
    saveData();
    updateCartUI();
    showToast(`¡Pedido #${newOrderId} enviado a WhatsApp!`, "success");
  }

  // ============================================================================
  // ATAJO SECRETO DE TECLADO Y TOQUE (ADMIN BACKOFFICE SHORTCUT)
  // ============================================================================
  function initAdminShortcut() {
    // 1. Atajo de teclado: Ctrl + Shift + Y (Y por Yolo)
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === "y" || e.key.toLowerCase() === "a")) {
        e.preventDefault();
        requestAdminAccess();
      }
    });

    // 2. Atajo táctil para teléfonos: Triple clic/tap en el logotipo de Tiendas Yolo
    let tapCount = 0;
    let tapTimer = null;
    const logoEl = document.querySelector('.brand-group');
    if (logoEl) {
      logoEl.addEventListener('click', (e) => {
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { tapCount = 0; }, 600);

        if (tapCount >= 3) {
          e.preventDefault();
          tapCount = 0;
          requestAdminAccess();
        }
      });
    }
  }

  function requestAdminAccess() {
    const enteredPin = prompt("🔐 Acceso Administrativo Tiendas Yolo®\nIngresa el PIN de seguridad:");
    const correctPin = String(state.config.adminPin || ADMIN_PIN_DEFAULT);

    if (enteredPin === correctPin) {
      sessionStorage.setItem("TY_ADMIN_AUTH", "true");
      showToast("¡Acceso de Administrador verificado! Abriendo panel...", "success");
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 500);
    } else if (enteredPin !== null) {
      showToast("PIN de seguridad incorrecto.", "error");
    }
  }

  // ============================================================================
  // COTIZACIÓN FORMAL (VISOR / IMPRIMIBLE)
  // ============================================================================
  function showQuoteModal() {
    const modal = document.getElementById('modal-quote-viewer');
    if (!modal) return;

    if (state.cart.length === 0) {
      showToast("Agrega insumos al pedido para generar la cotización.", "info");
      return;
    }

    const rate = Number(state.config.rateBCV || 395.50);
    const clientName = document.getElementById('cart-client-name').value.trim() || "Manicurista / Salón";
    const clientPhone = document.getElementById('cart-client-phone').value.trim() || "-";
    const clientAddress = document.getElementById('cart-delivery-address').value.trim() || "Maracaibo, Zulia";
    const subtotalUSD = state.cart.reduce((s, i) => s + (i.qty * i.precioUSD), 0);
    const grandTotalBs = subtotalUSD * rate;
    const quoteId = "COT-" + new Date().getFullYear() + "-" + ("0000" + (state.quotes.length + 1)).slice(-4);

    document.getElementById('print-quote-id').textContent = quoteId;
    document.getElementById('print-quote-date').textContent = new Date().toLocaleDateString('es-VE');
    document.getElementById('print-quote-validity').textContent = "7 días hábiles";
    document.getElementById('print-quote-rate').textContent = `Bs. ${rate.toFixed(2)} / $`;
    document.getElementById('print-client-name').textContent = clientName;
    document.getElementById('print-client-phone').textContent = clientPhone;
    document.getElementById('print-client-salon').textContent = document.getElementById('cart-client-instagram').value || "Estudio";
    document.getElementById('print-client-address').textContent = clientAddress;

    const tbody = document.getElementById('print-quote-items-body');
    tbody.innerHTML = state.cart.map(it => {
      const lineTotal = it.qty * it.precioUSD;
      const lineBs = lineTotal * rate;
      return `
        <tr>
          <td>${it.qty}</td>
          <td><strong>${it.nombre}</strong></td>
          <td>$${it.precioUSD.toFixed(2)}</td>
          <td>$${lineTotal.toFixed(2)}</td>
          <td>Bs. ${lineBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('print-quote-subtotal-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-subtotal-bs').textContent = `Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const deliveryEl = document.getElementById('print-quote-delivery-status');
    if (subtotalUSD >= Number(state.config.deliveryFreeMinUSD || 15.00)) {
      deliveryEl.textContent = "¡DELIVERY GRATIS EN MARACAIBO!";
      deliveryEl.style.color = "#10b981";
    } else {
      deliveryEl.textContent = "Tarifa estándar Maracaibo: $2.00 (o retiro personal)";
      deliveryEl.style.color = "#6e4a5d";
    }

    document.getElementById('print-quote-grand-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-grand-bs').textContent = `Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    modal.style.display = 'flex';
  }

  // ============================================================================
  // TOASTS Y MODALES
  // ============================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    let icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function openCartDrawer() {
    const m = document.getElementById('cart-drawer-modal');
    if (m) m.style.display = 'flex';
  }

  function closeCartDrawer() {
    const m = document.getElementById('cart-drawer-modal');
    if (m) m.style.display = 'none';
  }

  // ============================================================================
  // INICIALIZACIÓN DE EVENTOS
  // ============================================================================
  function setupEventListeners() {
    // 1. Carrito
    const btnOpenCart = document.getElementById('btn-open-cart');
    if (btnOpenCart) btnOpenCart.addEventListener('click', openCartDrawer);

    const btnCloseCart = document.getElementById('btn-close-cart');
    if (btnCloseCart) btnCloseCart.addEventListener('click', closeCartDrawer);

    const btnClearCart = document.getElementById('btn-cart-clear');
    if (btnClearCart) {
      btnClearCart.addEventListener('click', () => {
        if (confirm("¿Vaciar todo el pedido actual?")) {
          state.cart = [];
          saveData();
          updateCartUI();
        }
      });
    }

    const btnSendWa = document.getElementById('btn-cart-send-whatsapp');
    if (btnSendWa) btnSendWa.addEventListener('click', handleSendWhatsAppOrder);

    const btnQuote = document.getElementById('btn-cart-download-quote');
    if (btnQuote) {
      btnQuote.addEventListener('click', () => {
        closeCartDrawer();
        showQuoteModal();
      });
    }

    // 2. Modo Oscuro
    const btnTheme = document.getElementById('btn-toggle-theme');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const isDark = document.body.classList.contains('theme-dark');
        localStorage.setItem('TY_THEME', isDark ? 'dark' : 'light');
      });
    }

    if (localStorage.getItem('TY_THEME') === 'dark') {
      document.body.classList.add('theme-dark');
    }

    // 3. Búsqueda y Ordenamiento
    const searchInput = document.getElementById('global-search-input');
    const clearSearch = document.getElementById('btn-clear-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (clearSearch) clearSearch.style.display = state.searchQuery ? 'block' : 'none';
        renderProducts();
      });
    }

    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        state.searchQuery = '';
        clearSearch.style.display = 'none';
        renderProducts();
      });
    }

    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortCriteria = e.target.value;
        renderProducts();
      });
    }

    // 4. Botón Hero Kits
    const heroKitsBtn = document.getElementById('btn-hero-explore-kits');
    if (heroKitsBtn) {
      heroKitsBtn.addEventListener('click', () => {
        state.activeCategory = 'Kits';
        renderCategories();
        renderProducts();
        const sectionTitle = document.getElementById('catalog-section-title');
        if (sectionTitle) sectionTitle.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // 5. Modales Cerrar
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = document.getElementById(btn.dataset.closeModal);
        if (m) m.style.display = 'none';
      });
    });

    // 6. Impresión Cotización
    const printBtn = document.getElementById('btn-print-quote');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    const quoteWaBtn = document.getElementById('btn-quote-send-wa');
    if (quoteWaBtn) {
      quoteWaBtn.addEventListener('click', () => {
        const quoteId = document.getElementById('print-quote-id').textContent;
        const clientName = document.getElementById('print-client-name').textContent;
        const totalUSD = document.getElementById('print-quote-grand-usd').textContent;
        const text = encodeURIComponent(`💅 *TIENDAS YOLO® — COTIZACIÓN FORMAL*\n📄 *ID:* ${quoteId}\n👤 *Para:* ${clientName}\n💎 *TOTAL:* ${totalUSD}\n_Validez: 7 días continuos. Delivery gratis desde $15 en Maracaibo._`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      });
    }

    // 7. Click en Tasa para actualización rápida interactiva
    const rateTickerBox = document.getElementById('rate-ticker-box');
    if (rateTickerBox) {
      rateTickerBox.addEventListener('click', () => {
        const currentRate = Number(state.config.rateBCV || 395.50);
        const input = prompt(`💵 Actualizar Tasa del Día (BCV / Paralelo):\nValor actual: Bs. ${currentRate.toFixed(2)} por $`, currentRate);
        if (input !== null && input.trim() !== '') {
          const val = parseFloat(input.replace(',', '.'));
          if (!isNaN(val) && val > 0) {
            state.config.rateBCV = val;
            saveData();
            updateRateDisplay();
            renderProducts();
            updateCartUI();
            alert(`✅ Tasa actualizada a Bs. ${val.toFixed(2)} por $. Todos los precios en bolívares se han recalculado automáticamente.`);
          } else {
            alert("❌ Por favor ingresa un número válido mayor a 0.");
          }
        }
      });
    }

    // 8. Atajo de administración (Ctrl + Shift + Y y Triple Tap)
    initAdminShortcut();
  }

  // ============================================================================
  // SEGURIDAD & ATAJO SECRETO DE ADMINISTRACIÓN
  // ============================================================================
  function initAdminShortcut() {
    const ADMIN_PIN = String(state.config.adminPin || "2026");
    const footerAdminBox = document.getElementById('footer-admin-box');
    const urlParams = new URLSearchParams(window.location.search);
    const hasAdminParam = urlParams.get('admin') === ADMIN_PIN || window.location.hash === '#admin';
    const hasSessionAuth = sessionStorage.getItem('TY_ADMIN_AUTH') === 'true';

    // Si ya tiene sesión o parámetro en la URL, mostrar el botón en el footer
    if (hasAdminParam || hasSessionAuth) {
      if (footerAdminBox) footerAdminBox.style.display = 'block';
    }

    // Función unificada para desbloquear
    function promptAdminUnlock() {
      const pin = prompt("🔐 Ingrese el PIN de Seguridad de Tiendas Yolo (dueña/administración):");
      if (pin === ADMIN_PIN) {
        sessionStorage.setItem('TY_ADMIN_AUTH', 'true');
        if (footerAdminBox) footerAdminBox.style.display = 'block';
        const gotoAdmin = confirm("✅ Acceso Autorizado como Administradora.\n\n¿Deseas ingresar al Panel de Gestión y Finanzas (admin.html) ahora mismo?");
        if (gotoAdmin) {
          window.location.href = 'admin.html';
        }
      } else if (pin !== null) {
        alert("❌ PIN incorrecto. Acceso restringido al personal autorizado.");
      }
    }

    // A. Atajo de teclado: Ctrl + Shift + Y o Ctrl + Shift + A
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'y' || e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        promptAdminUnlock();
      }
    });

    // B. Triple toque / triple clic en el logo para móviles y pantallas táctiles
    const logoTrigger = document.getElementById('brand-logo-trigger');
    if (logoTrigger) {
      let tapCount = 0;
      let tapTimer = null;
      logoTrigger.addEventListener('click', (e) => {
        tapCount++;
        if (tapCount === 1) {
          tapTimer = setTimeout(() => {
            tapCount = 0;
          }, 600);
        } else if (tapCount >= 3) {
          e.preventDefault();
          clearTimeout(tapTimer);
          tapCount = 0;
          promptAdminUnlock();
        }
      });
    }
  }

  // ============================================================================
  // ARRANQUE
  // ============================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderCategories();
    renderProducts();
    updateCartUI();
    setupEventListeners();
    console.log("🌸 Tiendas Yolo® Catálogo Storefront iniciado.");
  });

})();
