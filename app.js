/**
 * ============================================================================
 * TIENDAS YOLO® — CATÁLOGO PÚBLICO & TIENDA ONLINE (app.js)
 * Insumos profesionales para uñas y manicuristas | Maracaibo, Venezuela
 * Funcionalidades: PWA, Bottom Nav, Modo Editor en Vivo, Pagos Autenticados,
 * Mini Notas de Entrega Digitales, Club Manicurista y Cotizaciones Formales.
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'TIENDAS_YOLO_DATA_V1';
  const PROFILE_STORAGE_KEY = 'TY_CLIENT_PROFILE_V1';
  const EDITS_STORAGE_KEY = 'TY_LANDING_EDITS_V1';
  const ADMIN_PIN_DEFAULT = '2026';

  // Resuelve rutas de imagen para soportar raíz o subcarpeta assets/
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
      categoria: "Esmaltes",
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
      categoria: "Esmaltes",
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
      categoria: "Esmaltes",
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
      nombre: "Spider Gel Elástico (Blanco / Negro)",
      categoria: "Geles y Acrílicos",
      descripcion: "Gel elástico de alta densidad para trazos geométricos, líneas ultrafinas y nail art.",
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
      categoria: "Geles y Acrílicos",
      descripcion: "Gel de construcción de alta consistencia para esculpido con moldes, tips y capping.",
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
      nombre: "Kit Principiante Manicurista Pro (Lámpara + 3 Esmaltes + Base + Top + Lima)",
      categoria: "Kits",
      descripcion: "Set completo para iniciarse en manicure semipermanente profesional. Incluye todo lo esencial.",
      precioUSD: 22.00,
      costoUSD: 12.50,
      stockActual: 15,
      stockMinimo: 3,
      unidad: "Kit",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-007",
      sku: "TY-PIN-01",
      nombre: "Pincel Kolinsky #8 para Acrílico con Mango Strass",
      categoria: "Pinceles y Herramientas",
      descripcion: "Cerdas 100% pelo natural Kolinsky para control milimétrico de la perla acrílica.",
      precioUSD: 7.50,
      costoUSD: 3.80,
      stockActual: 30,
      stockMinimo: 6,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-008",
      sku: "TY-LAMP-01",
      nombre: "Lámpara LED UV Sun X5 Plus 54W Sensor Smart",
      categoria: "Lámparas y Equipos",
      descripcion: "Secado ultra rápido en 10s con 36 perlas LED de luz blanca inofensiva para los ojos.",
      precioUSD: 14.00,
      costoUSD: 8.00,
      stockActual: 18,
      stockMinimo: 4,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-009",
      sku: "TY-TIP-01",
      nombre: "Tips Soft Gel Almendra / Stiletto (500 unds)",
      categoria: "Geles y Acrílicos",
      descripcion: "Cápsulas preformadas flexibles de cobertura completa para extensiones ultra resistentes.",
      precioUSD: 5.00,
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
      descripcion: "Colocación rápida sin pegamento en segundos, efecto volumen natural y reutilizables.",
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

  const DEFAULT_SHEETS_URL = "https://script.google.com/macros/s/AKfycby7q4Lyy_RF3qFjW2jdzKVqKQHODW2tMTBEBbG4EcFXosdrzE_iOCxeodVWYis0_-1QCQ/exec";

  const DEFAULT_CONFIG = {
    sheetsApiUrl: DEFAULT_SHEETS_URL,
    rateBCV: 883.40,
    rateLastUpdated: new Date().toISOString(),
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
    clientProfile: null,
    activeCategory: 'all',
    searchQuery: '',
    sortCriteria: 'featured',
    cardQuantities: {},
    isEditMode: false,
    deferredPwaPrompt: null,
    currentPaymentOrder: null
  };

  // ============================================================================
  // CARGA Y PERSISTENCIA DE DATOS
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
        // Garantizar que la URL de sheets esté siempre presente
        if (!state.config.sheetsApiUrl || !state.config.sheetsApiUrl.includes('script.google.com')) {
          state.config.sheetsApiUrl = DEFAULT_SHEETS_URL;
        }
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

    // Cargar perfil de clienta frecuente
    try {
      const prof = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (prof) state.clientProfile = JSON.parse(prof);
    } catch (e) {}

    updateRateDisplay();
    updateClientStatusBadge();
    loadEditsFromStorage();
    fetchLiveBcvRate();
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

  // Consulta en tiempo real de la tasa oficial del BCV
  async function fetchLiveBcvRate() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const liveRate = Number(data.promedio);
        if (liveRate > 0) {
          state.config.rateBCV = liveRate;
          state.config.rateLastUpdated = new Date().toISOString();
          saveData();
          updateRateDisplay(true);
          renderProducts();
          updateCartUI();
          console.log("💵 Tasa BCV Oficial actualizada en vivo:", liveRate);
        }
      }
    } catch (err) {
      console.warn("Tasa BCV obtenida de caché local:", err.message);
      updateRateDisplay(false);
    }
  }

  function updateRateDisplay(isLive = false) {
    const rate = Number(state.config.rateBCV || 883.40);
    const rateEl = document.getElementById('top-rate-display');
    if (rateEl) {
      rateEl.innerHTML = `${isLive ? '🟢' : '💵'} Bs. ${rate.toFixed(2)} / $ ${isLive ? '<span style="font-size:0.7em; opacity:0.85;">(En Vivo BCV)</span>' : ''}`;
    }
  }

  // Generador de códigos de producto (SKU) automáticos, únicos e irrepetibles
  function generateUniqueProductSKU(category, currentProducts = state.products) {
    const prefixes = {
      'Esmaltes': 'ESM',
      'Geles y Acrílicos': 'GEL',
      'Pinceles y Herramientas': 'PIN',
      'Lámparas y Equipos': 'LAM',
      'Kits': 'KIT',
      'Líquidos y Preparación': 'LIQ',
      'Pestañas y Belleza': 'PES',
      'Decoración': 'DEC'
    };
    const prefix = prefixes[category] || 'YOLO';
    
    const existingNums = (currentProducts || [])
      .map(p => {
        const s = (p.sku || p.id || '').toUpperCase();
        if (s.startsWith(prefix + '-')) {
          const n = parseInt(s.replace(prefix + '-', ''), 10);
          return isNaN(n) ? null : n;
        }
        return null;
      })
      .filter(n => n !== null);

    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
    let nextNum = maxNum + 1;
    let generatedSKU = `${prefix}-${String(nextNum).padStart(3, '0')}`;

    while ((currentProducts || []).some(p => 
      (p.sku && p.sku.toUpperCase() === generatedSKU) || 
      (p.id && p.id.toUpperCase() === generatedSKU)
    )) {
      nextNum++;
      generatedSKU = `${prefix}-${String(nextNum).padStart(3, '0')}`;
    }

    return generatedSKU;
  }

  function updateClientStatusBadge() {
    const badge = document.getElementById('header-user-status');
    const autofillBtn = document.getElementById('btn-cart-autofill');
    if (!badge) return;

    if (state.clientProfile && state.clientProfile.name) {
      const firstName = state.clientProfile.name.split(' ')[0];
      badge.textContent = `👋 ${firstName}`;
      if (autofillBtn) autofillBtn.style.display = 'inline-block';
    } else {
      badge.textContent = 'Mi Cuenta';
      if (autofillBtn) autofillBtn.style.display = 'none';
    }
  }

  // ============================================================================
  // REGISTRO DE SERVICE WORKER & PWA INSTALL PROMPT
  // ============================================================================
  function initPwaSupport() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('🌸 PWA Service Worker activo:', reg.scope))
          .catch(err => console.warn('PWA SW registro opcional:', err));
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredPwaPrompt = e;
      const installBtn = document.getElementById('btn-install-pwa');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('🌸 Tiendas Yolo instalada con éxito como PWA');
      state.deferredPwaPrompt = null;
      const installBtn = document.getElementById('btn-install-pwa');
      if (installBtn) installBtn.style.display = 'none';
      showToast("¡Tiendas Yolo® instalada en tu teléfono!", "success");
    });
  }

  function handlePwaInstallClick() {
    if (state.deferredPwaPrompt) {
      state.deferredPwaPrompt.prompt();
      state.deferredPwaPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó instalar la app');
        }
        state.deferredPwaPrompt = null;
      });
    } else {
      // Abrir modal explicativo para iPhone o navegadores estándar
      const modal = document.getElementById('modal-pwa-install-guide');
      if (modal) modal.style.display = 'flex';
    }
  }

  // ============================================================================
  // RENDERIZADO DE CATEGORÍAS & PRODUCTOS
  // ============================================================================
  function getCategories() {
    const cats = new Set();
    state.products.forEach(p => {
      if (p.activo !== 'NO' && p.categoria) cats.add(p.categoria);
    });
    return Array.from(cats);
  }

  function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const categories = getCategories();
    const allCount = state.products.filter(p => p.activo !== 'NO').length;

    let html = `
      <button class="category-chip ${state.activeCategory === 'all' ? 'active' : ''}" data-category="all">
        💅 Todos los Insumos <span class="chip-count">${allCount}</span>
      </button>
    `;

    categories.forEach(cat => {
      const count = state.products.filter(p => p.activo !== 'NO' && p.categoria === cat).length;
      const icon = getCategoryIcon(cat);
      html += `
        <button class="category-chip ${state.activeCategory === cat ? 'active' : ''}" data-category="${cat}">
          ${icon} ${cat} <span class="chip-count">${count}</span>
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.category;
        renderCategories();
        renderProducts();
      });
    });
  }

  function getCategoryIcon(cat) {
    const map = {
      'Esmaltes': '✨',
      'Geles y Acrílicos': '💎',
      'Pinceles y Herramientas': '🖌️',
      'Lámparas y Equipos': '⚡',
      'Kits': '🎁',
      'Líquidos y Preparación': '🌸',
      'Pestañas y Belleza': '👁️',
      'Decoración': '🔮'
    };
    return map[cat] || '💅';
  }

  function getFilteredProducts() {
    let prods = state.products.filter(p => p.activo !== 'NO');

    if (state.activeCategory !== 'all') {
      prods = prods.filter(p => p.categoria === state.activeCategory);
    }

    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      prods = prods.filter(p =>
        (p.nombre && p.nombre.toLowerCase().includes(q)) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
        (p.categoria && p.categoria.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    if (state.sortCriteria === 'price-asc') {
      prods.sort((a, b) => Number(a.precioUSD) - Number(b.precioUSD));
    } else if (state.sortCriteria === 'price-desc') {
      prods.sort((a, b) => Number(b.precioUSD) - Number(a.precioUSD));
    } else if (state.sortCriteria === 'name-asc') {
      prods.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    } else if (state.sortCriteria === 'stock-desc') {
      prods.sort((a, b) => Number(b.stockActual || 0) - Number(a.stockActual || 0));
    } else {
      prods.sort((a, b) => (b.destacado === 'SI' ? 1 : 0) - (a.destacado === 'SI' ? 1 : 0));
    }

    return prods;
  }

  function renderProducts() {
    const grid = document.getElementById('products-grid-container');
    const countEl = document.getElementById('catalog-products-count');
    if (!grid) return;

    const prods = getFilteredProducts();

    if (countEl) {
      countEl.textContent = `${prods.length} insumos disponibles`;
    }

    if (prods.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1 / -1; padding: 40px; text-align: center;">
          <span style="font-size: 3rem;">🔍</span>
          <h4 style="font-family: var(--font-serif); margin-top: 10px; color: var(--ty-primary);">No encontramos insumos</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Prueba buscando otra palabra clave o selecciona otra categoría.</p>
          <button class="btn-secondary" style="margin-top: 14px;" id="btn-reset-filters">Ver todos los productos</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.activeCategory = 'all';
          state.searchQuery = '';
          const sInput = document.getElementById('global-search-input');
          if (sInput) sInput.value = '';
          renderCategories();
          renderProducts();
        });
      }
      return;
    }

    const rate = Number(state.config.rateBCV || 395.50);

    grid.innerHTML = prods.map(p => {
      const priceUSD = Number(p.precioUSD || 0);
      const priceBs = priceUSD * rate;
      const isFeatured = p.destacado === 'SI';
      const imgSrc = resolveImgPath(p.imagenURL || 'logo-yolo.png');
      const qty = state.cardQuantities[p.id] || 1;

      return `
        <article class="product-card" data-product-id="${p.id}">
          
          <!-- OVERLAY DE MODO EDICIÓN DUEÑA -->
          <div class="card-edit-overlay">
            <button type="button" class="btn-edit-card-action" onclick="window.YoloApp.openEditProduct('${p.id}')" title="Editar Producto">✏️</button>
            <button type="button" class="btn-edit-card-action" onclick="window.YoloApp.quickChangePhoto('${p.id}')" title="Cambiar Foto">🖼️</button>
            <button type="button" class="btn-edit-card-action" onclick="window.YoloApp.deleteProduct('${p.id}')" title="Eliminar Producto">🗑️</button>
          </div>

          <div class="product-image-container">
            ${isFeatured ? '<span class="badge-tag featured">⭐ Destacado</span>' : ''}
            <img src="${imgSrc}" alt="${p.nombre}" class="product-img" loading="lazy" onerror="this.onerror=null; this.src='assets/logo-yolo.png'">
          </div>

          <div class="product-details">
            <span class="product-category">${p.categoria || 'Insumo'}</span>
            <h4 class="product-title" title="${p.nombre}">${p.nombre}</h4>
            <p class="product-desc">${p.descripcion || ''}</p>

            <div class="product-price-row">
              <span class="price-usd">$${priceUSD.toFixed(2)}</span>
              <span class="price-bs">Bs. ${priceBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div class="product-card-actions-wrapper">
              <div class="card-qty-stepper">
                <button type="button" class="btn-stepper" onclick="window.YoloApp.adjustCardQty('${p.id}', -1)">-</button>
                <span class="stepper-val" id="stepper-val-${p.id}">${qty}</span>
                <button type="button" class="btn-stepper" onclick="window.YoloApp.adjustCardQty('${p.id}', 1)">+</button>
              </div>

              <button class="btn-add-cart-primary" onclick="window.YoloApp.addToCart('${p.id}')">
                <span>🛒 Agregar</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // ============================================================================
  // GESTIÓN DEL CARRITO DE COMPRAS
  // ============================================================================
  function adjustCardQty(prodId, delta) {
    const current = state.cardQuantities[prodId] || 1;
    const next = Math.max(1, current + delta);
    state.cardQuantities[prodId] = next;
    const el = document.getElementById(`stepper-val-${prodId}`);
    if (el) el.textContent = next;
  }

  function addToCart(prodId) {
    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return;

    const qtyToAdd = state.cardQuantities[prodId] || 1;
    const existing = state.cart.find(item => item.id === prodId);

    if (existing) {
      existing.quantity += qtyToAdd;
    } else {
      state.cart.push({
        id: prod.id,
        nombre: prod.nombre,
        categoria: prod.categoria,
        precioUSD: Number(prod.precioUSD || 0),
        imagenURL: prod.imagenURL || 'logo-yolo.png',
        quantity: qtyToAdd
      });
    }

    state.cardQuantities[prodId] = 1;
    const el = document.getElementById(`stepper-val-${prodId}`);
    if (el) el.textContent = 1;

    saveData();
    updateCartUI();
    showToast(`🌸 ¡${qtyToAdd}x ${prod.nombre.substring(0, 24)}... agregado!`, "success");
  }

  function updateCartUI() {
    const counter = document.getElementById('cart-counter');
    const mCounter = document.getElementById('m-cart-badge');
    const headerTotal = document.getElementById('cart-total-header');
    const list = document.getElementById('cart-items-list');

    const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.precioUSD * item.quantity), 0);
    const rate = Number(state.config.rateBCV || 395.50);

    const isFreeDelivery = subtotalUSD >= Number(state.config.deliveryFreeMinUSD || 15.00);
    const deliveryUSD = (subtotalUSD > 0 && !isFreeDelivery) ? Number(state.config.deliveryFlatFeeUSD || 2.00) : 0;
    const totalUSD = subtotalUSD + deliveryUSD;
    const totalBs = totalUSD * rate;

    if (counter) counter.textContent = totalQty;
    if (mCounter) mCounter.textContent = totalQty;
    if (headerTotal) headerTotal.textContent = `$${subtotalUSD.toFixed(2)}`;

    // Actualizar barra de delivery gratis
    const fillEl = document.getElementById('delivery-progress-fill');
    const statusEl = document.getElementById('delivery-progress-status');
    const textEl = document.getElementById('delivery-progress-text');
    const minUSD = Number(state.config.deliveryFreeMinUSD || 15.00);

    if (fillEl && statusEl && textEl) {
      const pct = Math.min(100, (subtotalUSD / minUSD) * 100);
      fillEl.style.width = `${pct}%`;
      statusEl.textContent = `$${subtotalUSD.toFixed(2)} / $${minUSD.toFixed(2)}`;

      if (isFreeDelivery) {
        textEl.textContent = "🎉 ¡Felicidades! Tienes Delivery GRATIS en Maracaibo 🚚";
        fillEl.style.background = "#10b981";
      } else {
        const diff = (minUSD - subtotalUSD).toFixed(2);
        textEl.textContent = `🚚 Agrega $${diff} más para Delivery GRATIS en Maracaibo`;
        fillEl.style.background = "linear-gradient(90deg, #d47a94, #701a49)";
      }
    }

    // Actualizar totales en el drawer
    const sSub = document.getElementById('cart-summary-subtotal');
    const sDel = document.getElementById('cart-summary-delivery');
    const sTotUSD = document.getElementById('cart-summary-total-usd');
    const sTotBs = document.getElementById('cart-summary-total-bs');

    if (sSub) sSub.textContent = `$${subtotalUSD.toFixed(2)}`;
    if (sDel) {
      sDel.textContent = isFreeDelivery ? "¡GRATIS!" : `$${deliveryUSD.toFixed(2)}`;
      sDel.className = isFreeDelivery ? "free-delivery font-bold" : "font-bold";
    }
    if (sTotUSD) sTotUSD.textContent = `$${totalUSD.toFixed(2)}`;
    if (sTotBs) sTotBs.textContent = `Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Renderizar lista en el drawer
    if (list) {
      if (state.cart.length === 0) {
        list.innerHTML = `
          <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
            <span style="font-size:2.5rem;">🛍️</span>
            <p style="margin-top:8px; font-weight:600;">Tu pedido está vacío</p>
            <p style="font-size:0.8rem;">Selecciona insumos del catálogo para comenzar.</p>
          </div>
        `;
      } else {
        list.innerHTML = state.cart.map((item, idx) => {
          const itemTotalUSD = item.precioUSD * item.quantity;
          const imgSrc = resolveImgPath(item.imagenURL || 'logo-yolo.png');
          return `
            <div class="cart-item-row">
              <img src="${imgSrc}" alt="${item.nombre}" class="cart-item-thumb" onerror="this.onerror=null; this.src='assets/logo-yolo.png'">
              <div class="cart-item-info">
                <strong class="cart-item-name">${item.nombre}</strong>
                <span class="cart-item-price">$${item.precioUSD.toFixed(2)} c/u</span>
                <span class="cart-item-subtotal">Total: $${itemTotalUSD.toFixed(2)}</span>
              </div>
              <div class="cart-item-actions">
                <div class="card-qty-stepper compact">
                  <button type="button" class="btn-stepper" onclick="window.YoloApp.updateCartItemQty(${idx}, -1)">-</button>
                  <span class="stepper-val">${item.quantity}</span>
                  <button type="button" class="btn-stepper" onclick="window.YoloApp.updateCartItemQty(${idx}, 1)">+</button>
                </div>
                <button type="button" class="btn-remove-item" onclick="window.YoloApp.removeCartItem(${idx})" title="Eliminar">🗑️</button>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  function updateCartItemQty(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveData();
    updateCartUI();
  }

  function removeCartItem(index) {
    if (!state.cart[index]) return;
    state.cart.splice(index, 1);
    saveData();
    updateCartUI();
  }

  function clearCart() {
    if (state.cart.length === 0) return;
    if (confirm("¿Deseas vaciar todos los insumos de tu pedido?")) {
      state.cart = [];
      saveData();
      updateCartUI();
    }
  }

  // ============================================================================
  // MÓDULO DE PAGO Y AUTENTICACIÓN BANCARIA EN LA APP
  // ============================================================================
  function openPaymentModalFromCart() {
    if (state.cart.length === 0) {
      alert("Tu carrito está vacío. Agrega insumos antes de pagar.");
      return;
    }

    const clientName = document.getElementById('cart-client-name').value.trim();
    const clientPhone = document.getElementById('cart-client-phone').value.trim();
    const clientAddress = document.getElementById('cart-delivery-address').value.trim();

    if (!clientName || !clientPhone) {
      alert("Por favor completa tu Nombre y Teléfono WhatsApp en los datos de entrega.");
      return;
    }

    const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.precioUSD * item.quantity), 0);
    const isFree = subtotalUSD >= Number(state.config.deliveryFreeMinUSD || 15.00);
    const deliveryUSD = isFree ? 0 : Number(state.config.deliveryFlatFeeUSD || 2.00);
    const totalUSD = subtotalUSD + deliveryUSD;
    const rate = Number(state.config.rateBCV || 395.50);
    const totalBs = totalUSD * rate;

    state.currentPaymentOrder = {
      clientName: clientName,
      clientPhone: clientPhone,
      clientSalon: document.getElementById('cart-client-salon').value.trim() || 'Estudio Particular',
      clientAddress: clientAddress || 'Maracaibo',
      deliveryType: document.getElementById('cart-delivery-type').value,
      notes: document.getElementById('cart-notes').value.trim(),
      items: JSON.parse(JSON.stringify(state.cart)),
      subtotalUSD: subtotalUSD,
      deliveryUSD: deliveryUSD,
      totalUSD: totalUSD,
      rateBCV: rate,
      totalBs: totalBs
    };

    // Actualizar modal de pagos
    document.getElementById('pay-modal-usd').textContent = `$${totalUSD.toFixed(2)}`;
    document.getElementById('pay-modal-bs').textContent = `Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('pay-modal-rate-note').textContent = `Tasa: Bs. ${rate.toFixed(2)} / $`;
    document.getElementById('copy-pm-bs').textContent = `Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Cerrar carrito y abrir modal de pago
    document.getElementById('cart-drawer-modal').style.display = 'none';
    document.getElementById('modal-payment-auth').style.display = 'flex';
  }

  function handlePaymentAuthSubmit(e) {
    e.preventDefault();
    if (!state.currentPaymentOrder) {
      alert("No hay una orden activa.");
      return;
    }

    const method = document.getElementById('pay-input-method').value;
    const bank = document.getElementById('pay-input-bank').value.trim();
    const ref = document.getElementById('pay-input-ref').value.trim();
    const amountStr = document.getElementById('pay-input-amount').value.trim();
    const holder = document.getElementById('pay-input-holder').value.trim();

    // Validación algorítmica de referencia bancaria
    if (method !== 'Efectivo $' && (!ref || ref.length < 4 || /^(0+|1234+|9999+)$/.test(ref))) {
      alert("❌ Por favor ingresa un número de referencia bancaria válido (mínimo 4 dígitos del comprobante).");
      return;
    }

    // Generar código de autenticación y nota de entrega
    const authCode = `AUTH-YOLO-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `NE-2026-${String(Date.now()).slice(-4)}`;
    const nowStr = new Date().toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' });

    const completedOrder = Object.assign({}, state.currentPaymentOrder, {
      id: orderId,
      authCode: authCode,
      date: nowStr,
      paymentMethod: method,
      paymentBank: bank,
      paymentRef: ref,
      paymentHolder: holder,
      status: 'AUTENTICADO_PAGADO'
    });

    state.orders.unshift(completedOrder);

    // Si tiene perfil de clienta, registrar en su historial
    if (state.clientProfile) {
      state.clientProfile.ordersCount = (state.clientProfile.ordersCount || 0) + 1;
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.clientProfile));
    }

    state.cart = [];
    saveData();
    updateCartUI();

    // Sincronizar en segundo plano con Google Sheets permanente
    syncOrderToSheets(completedOrder);

    // Cerrar modal de pago y abrir Mini Nota de Entrega
    document.getElementById('modal-payment-auth').style.display = 'none';
    renderDeliveryNote(completedOrder);
    showToast("✅ ¡Pago autenticado y registrado con éxito!", "success");
  }

  // Sincronizador de pedidos con Google Sheets
  function syncOrderToSheets(order) {
    const url = state.config.sheetsApiUrl || DEFAULT_SHEETS_URL;
    if (!url) return;
    const payload = {
      action: "save_order",
      data: {
        id: order.id,
        fecha: order.date,
        cliente: order.clientName,
        telefono: order.clientPhone,
        instagram: (state.clientProfile && state.clientProfile.instagram) || "",
        direccion: order.clientAddress,
        tipoEntrega: order.deliveryType,
        metodoPago: `${order.paymentMethod} (${order.paymentBank || ''})`,
        referenciaPago: order.paymentRef || order.authCode,
        items: (order.items || []).map(i => `${i.quantity}x ${i.nombre} ($${i.precioUSD})`).join('; '),
        subtotalUSD: order.subtotalUSD,
        tasaBs: state.config.rateBCV,
        totalUSD: order.totalUSD,
        totalBs: order.totalBs,
        estado: "Confirmado",
        notas: `Autenticado: ${order.authCode}`
      }
    };
    try {
      fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      }).catch(err => console.warn("Sync Sheets error:", err));
    } catch (e) {}
  }

  // Sincronizador de cotizaciones con Google Sheets
  function syncQuoteToSheets(quote) {
    const url = state.config.sheetsApiUrl || DEFAULT_SHEETS_URL;
    if (!url) return;
    const payload = {
      action: "save_quote",
      data: {
        id: quote.id,
        fecha: quote.date,
        validezDias: 7,
        cliente: quote.clientName,
        telefono: quote.clientPhone,
        salonAcademia: quote.clientSalon,
        items: (quote.items || []).map(i => `${i.quantity}x ${i.nombre} ($${i.precioUSD})`).join('; '),
        subtotalUSD: quote.subtotalUSD,
        totalUSD: quote.subtotalUSD,
        totalBs: quote.totalBs,
        estado: "Emitida",
        notas: "Cotización formal generada desde la App Tiendas Yolo"
      }
    };
    try {
      fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      }).catch(err => console.warn("Sync Quote Sheets error:", err));
    } catch (e) {}
  }

  // ============================================================================
  // GENERADOR DE COTIZACIÓN FORMAL (PRESUPUESTO PARA SALONES/ACADEMIAS)
  // ============================================================================
  function generateFormalQuote() {
    // Cerrar el drawer del carrito si estuviera abierto
    const cartModal = document.getElementById('cart-drawer-modal');
    if (cartModal) cartModal.style.display = 'none';

    let items = state.cart;
    if (!items || items.length === 0) {
      // Si el carrito está vacío, cotizar kits o insumos principales de muestra
      items = state.products.slice(0, 4).map(p => ({
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        precioUSD: Number(p.precioUSD),
        quantity: 1
      }));
      showToast("📄 Cotización generada con insumos principales del catálogo", "info");
    }

    const subtotalUSD = items.reduce((sum, item) => sum + (Number(item.precioUSD) * item.quantity), 0);
    const rate = Number(state.config.rateBCV || 883.40);
    const subtotalBs = subtotalUSD * rate;
    const isFree = subtotalUSD >= Number(state.config.deliveryFreeMinUSD || 15.00);

    const cNameEl = document.getElementById('cart-client-name');
    const cPhoneEl = document.getElementById('cart-client-phone');
    const cSalonEl = document.getElementById('cart-client-salon');
    const cAddrEl = document.getElementById('cart-delivery-address');

    const clientName = (state.clientProfile && state.clientProfile.name) || (cNameEl ? cNameEl.value.trim() : '') || 'Manicurista / Salón Solicitante';
    const clientPhone = (state.clientProfile && state.clientProfile.phone) || (cPhoneEl ? cPhoneEl.value.trim() : '') || '0426-5604070';
    const clientSalon = (state.clientProfile && state.clientProfile.salon) || (cSalonEl ? cSalonEl.value.trim() : '') || 'Estudio de Belleza';
    const clientAddress = (state.clientProfile && state.clientProfile.address) || (cAddrEl ? cAddrEl.value.trim() : '') || 'Maracaibo, Zulia';

    const quoteId = `COT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString('es-VE');

    document.getElementById('print-quote-id').textContent = quoteId;
    document.getElementById('print-quote-date').textContent = today;
    document.getElementById('print-quote-rate').textContent = `Bs. ${rate.toFixed(2)} / $`;
    document.getElementById('print-client-name').textContent = clientName;
    document.getElementById('print-client-phone').textContent = clientPhone;
    document.getElementById('print-client-salon').textContent = clientSalon;
    document.getElementById('print-client-address').textContent = clientAddress;

    const tbody = document.getElementById('print-quote-items-body');
    tbody.innerHTML = items.map(item => {
      const itemTotUSD = Number(item.precioUSD) * item.quantity;
      const itemTotBs = itemTotUSD * rate;
      return `
        <tr>
          <td>${item.quantity}</td>
          <td><strong>${item.nombre}</strong></td>
          <td>$${Number(item.precioUSD).toFixed(2)}</td>
          <td><strong>$${itemTotUSD.toFixed(2)}</strong></td>
          <td>Bs. ${itemTotBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('print-quote-subtotal-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-subtotal-bs').textContent = `Bs. ${subtotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('print-quote-delivery-status').textContent = isFree ? "¡DELIVERY GRATIS EN MARACAIBO!" : "$2.00 Delivery / Despacho";
    document.getElementById('print-quote-grand-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-grand-bs').textContent = `Bs. ${subtotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const quoteObj = {
      id: quoteId,
      date: today,
      clientName,
      clientPhone,
      clientSalon,
      clientAddress,
      items,
      subtotalUSD,
      totalBs: subtotalBs,
      createdAt: new Date().toISOString()
    };
    state.quotes.unshift(quoteObj);
    saveData();
    syncQuoteToSheets(quoteObj);

    // Botón para proceder al pago directo desde la cotización
    const payBtn = document.getElementById('btn-quote-proceed-to-pay');
    if (payBtn) {
      payBtn.onclick = () => {
        document.getElementById('modal-quote-viewer').style.display = 'none';
        if (state.cart.length === 0) {
          state.cart = JSON.parse(JSON.stringify(items));
          saveData();
          updateCartUI();
        }
        openPaymentModalFromCart();
      };
    }

    const modal = document.getElementById('modal-quote-viewer');
    if (modal) modal.style.display = 'flex';
  }

  // ============================================================================
  // CLUB MANICURISTA YOLO (CLIENTE FRECUENTE & CUENTA)
  // ============================================================================
  function openClientAccountModal() {
    const modal = document.getElementById('modal-client-account');
    const formView = document.getElementById('account-view-form');
    const profView = document.getElementById('account-view-profile');
    if (!modal) return;

    if (state.clientProfile && state.clientProfile.name) {
      formView.style.display = 'none';
      profView.style.display = 'block';

      document.getElementById('prof-display-name').textContent = state.clientProfile.name;
      document.getElementById('prof-display-salon').textContent = `Salón: ${state.clientProfile.salon || 'Particular'} • ${state.clientProfile.instagram || ''}`;
      document.getElementById('prof-display-phone').textContent = `WhatsApp: ${state.clientProfile.phone}`;
      document.getElementById('prof-display-address').textContent = `Dirección: ${state.clientProfile.address}`;

      // Historial de órdenes de esta clienta
      const historyList = document.getElementById('account-orders-history-list');
      const myOrders = state.orders.filter(o => o.clientPhone === state.clientProfile.phone || o.clientName === state.clientProfile.name);

      if (myOrders.length === 0) {
        historyList.innerHTML = `<p style="color:var(--text-muted); font-size:0.8rem;">Aún no tienes notas de entrega registradas.</p>`;
      } else {
        historyList.innerHTML = myOrders.map(o => `
          <div class="order-history-card">
            <div class="history-card-info">
              <strong>${o.id} • $${o.totalUSD.toFixed(2)}</strong>
              <span>${o.date} • ${o.paymentMethod}</span>
            </div>
            <button class="btn-history-view" onclick="window.YoloApp.viewPastTicket('${o.id}')">Ver Ticket</button>
          </div>
        `).join('');
      }
    } else {
      formView.style.display = 'block';
      profView.style.display = 'none';
    }

    modal.style.display = 'flex';
  }

  function handleProfileSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('acc-input-name').value.trim();
    const phone = document.getElementById('acc-input-phone').value.trim();
    const doc = document.getElementById('acc-input-doc').value.trim();
    const salon = document.getElementById('acc-input-salon').value.trim();
    const instagram = document.getElementById('acc-input-instagram').value.trim();
    const address = document.getElementById('acc-input-address').value.trim();

    state.clientProfile = {
      name, phone, doc, salon, instagram, address,
      level: '🌟 Manicurista VIP Yolo',
      ordersCount: (state.clientProfile && state.clientProfile.ordersCount) || 0
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.clientProfile));
    updateClientStatusBadge();
    openClientAccountModal();
    showToast("🌸 ¡Bienvenida al Club Manicurista Tiendas Yolo!", "success");
  }

  function handleAutofillCart() {
    if (!state.clientProfile) return;
    document.getElementById('cart-client-name').value = state.clientProfile.name || '';
    document.getElementById('cart-client-phone').value = state.clientProfile.phone || '';
    document.getElementById('cart-client-salon').value = state.clientProfile.salon || '';
    document.getElementById('cart-client-delivery-address') && (document.getElementById('cart-client-delivery-address').value = state.clientProfile.address || '');
    document.getElementById('cart-delivery-address').value = state.clientProfile.address || '';
    showToast("✨ Datos autocompletados desde tu perfil", "success");
  }

  // ============================================================================
  // MODO EDITOR EN VIVO (WYSIWYG & GESTOR DE PRODUCTOS/FOTOS)
  // ============================================================================
  function toggleLiveEditMode() {
    state.isEditMode = !state.isEditMode;
    const body = document.body;
    const textEl = document.getElementById('editor-btn-text');
    const toggleBtn = document.getElementById('btn-toggle-editor');

    if (state.isEditMode) {
      body.classList.add('editor-mode-active');
      if (toggleBtn) toggleBtn.classList.add('active');
      if (textEl) textEl.textContent = 'Edición: ON';
      document.querySelectorAll('[data-editable="true"]').forEach(el => {
        el.contentEditable = "true";
      });
      renderProducts();
      showToast("✏️ Modo Edición: ON. Haz clic en cualquier texto o producto para editar.", "success");
    } else {
      body.classList.remove('editor-mode-active');
      if (toggleBtn) toggleBtn.classList.remove('active');
      if (textEl) textEl.textContent = 'Edición: OFF';
      document.querySelectorAll('[data-editable="true"]').forEach(el => {
        el.contentEditable = "false";
      });
      renderProducts();
      showToast("👁️ Modo Edición: OFF. Vista cliente activada.", "info");
    }
  }

  function saveEditsToStorage() {
    const edits = {};
    document.querySelectorAll('[data-editable="true"]').forEach(el => {
      if (el.id) edits[el.id] = el.innerHTML;
    });
    localStorage.setItem(EDITS_STORAGE_KEY, JSON.stringify(edits));
    saveData();
    showToast("💾 ¡Todos los textos, fotos y productos fueron guardados!", "success");
  }

  function loadEditsFromStorage() {
    try {
      const saved = localStorage.getItem(EDITS_STORAGE_KEY);
      if (saved) {
        const edits = JSON.parse(saved);
        for (let id in edits) {
          const el = document.getElementById(id);
          if (el) el.innerHTML = edits[id];
        }
      }
    } catch (e) {}
  }

  function openEditProduct(prodId) {
    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return;

    document.getElementById('pe-input-id').value = prod.id;
    document.getElementById('pe-input-name').value = prod.nombre;
    document.getElementById('pe-input-cat').value = prod.categoria || 'Esmaltes';
    document.getElementById('pe-input-sku').value = prod.sku || '';
    document.getElementById('pe-input-price').value = prod.precioUSD;
    document.getElementById('pe-input-cost').value = prod.costoUSD || '';
    document.getElementById('pe-input-stock').value = prod.stockActual || 0;
    document.getElementById('pe-input-desc').value = prod.descripcion || '';
    document.getElementById('pe-input-img').value = prod.imagenURL || 'logo-yolo.png';
    document.getElementById('pe-img-preview').src = resolveImgPath(prod.imagenURL || 'logo-yolo.png');

    document.getElementById('prod-editor-modal-title').textContent = "✏️ Editar Producto";
    document.getElementById('btn-pe-delete-prod').style.display = 'inline-block';
    document.getElementById('modal-product-editor').style.display = 'flex';
  }

  function openNewProduct() {
    document.getElementById('pe-input-id').value = '';
    document.getElementById('pe-input-name').value = '';
    document.getElementById('pe-input-cat').value = 'Esmaltes';
    const autoSku = generateUniqueProductSKU('Esmaltes', state.products);
    document.getElementById('pe-input-sku').value = autoSku;
    document.getElementById('pe-input-price').value = '3.50';
    document.getElementById('pe-input-cost').value = '1.80';
    document.getElementById('pe-input-stock').value = '20';
    document.getElementById('pe-input-desc').value = '';
    document.getElementById('pe-input-img').value = 'logo-yolo.png';
    document.getElementById('pe-img-preview').src = 'logo-yolo.png';

    document.getElementById('prod-editor-modal-title').textContent = "➕ Añadir Nuevo Insumo (Código Automático)";
    document.getElementById('btn-pe-delete-prod').style.display = 'none';
    document.getElementById('modal-product-editor').style.display = 'flex';
  }

  function quickChangePhoto(prodId) {
    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return;
    const newImg = prompt(`🖼️ Ingresa el nombre del archivo o enlace de la imagen para "${prod.nombre}":`, prod.imagenURL || 'logo-yolo.png');
    if (newImg && newImg.trim() !== '') {
      prod.imagenURL = newImg.trim();
      saveData();
      renderProducts();
      showToast("🖼️ Imagen actualizada correctamente", "success");
    }
  }

  function deleteProduct(prodId) {
    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return;
    if (confirm(`¿Estás segura de eliminar "${prod.nombre}" del catálogo?`)) {
      state.products = state.products.filter(p => p.id !== prodId);
      saveData();
      renderCategories();
      renderProducts();
      showToast("🗑️ Insumo eliminado del catálogo", "info");
    }
  }

  function handleProductEditorSave(e) {
    e.preventDefault();
    const id = document.getElementById('pe-input-id').value;
    const name = document.getElementById('pe-input-name').value.trim();
    const cat = document.getElementById('pe-input-cat').value;
    const sku = document.getElementById('pe-input-sku').value.trim() || generateUniqueProductSKU(cat, state.products);
    const price = parseFloat(document.getElementById('pe-input-price').value);
    const cost = parseFloat(document.getElementById('pe-input-cost').value || '0');
    const stock = parseInt(document.getElementById('pe-input-stock').value || '0');
    const desc = document.getElementById('pe-input-desc').value.trim();
    const img = document.getElementById('pe-input-img').value.trim() || 'logo-yolo.png';

    if (id) {
      // Editar existente
      const prod = state.products.find(p => p.id === id);
      if (prod) {
        prod.nombre = name;
        prod.categoria = cat;
        prod.sku = sku;
        prod.precioUSD = price;
        prod.costoUSD = cost;
        prod.stockActual = stock;
        prod.descripcion = desc;
        prod.imagenURL = img;
      }
    } else {
      // Crear nuevo con código único e irrepetible
      const newId = `TY-${sku}`;
      state.products.unshift({
        id: newId,
        sku: sku,
        nombre: name,
        categoria: cat,
        descripcion: desc,
        precioUSD: price,
        costoUSD: cost,
        stockActual: stock,
        stockMinimo: 5,
        unidad: "Unidad",
        destacado: "SI",
        activo: "SI",
        imagenURL: img
      });
    }

    saveData();
    renderCategories();
    renderProducts();
    document.getElementById('modal-product-editor').style.display = 'none';
    showToast(`💾 Insumo guardado con código único: ${sku}`, "success");
  }

  // ============================================================================
  // ATAJOS SEPARADOS: MODO EDICIÓN vs APP INTERNA (FINANZAS)
  // ============================================================================
  function initAdminSecurityAndShortcuts() {
    const ADMIN_PIN = String(state.config.adminPin || "2026");
    const editorBar = document.getElementById('editor-control-bar');
    const footerAdminBox = document.getElementById('footer-admin-box');
    const urlParams = new URLSearchParams(window.location.search);
    const hasAdminParam = urlParams.get('admin') === ADMIN_PIN || window.location.hash === '#admin';
    const hasEditorParam = urlParams.get('editor') === '1' || window.location.hash === '#editor';
    const hasSessionAuth = sessionStorage.getItem('TY_ADMIN_AUTH') === 'true';

    function unlockAdminFeatures() {
      sessionStorage.setItem('TY_ADMIN_AUTH', 'true');
      document.body.classList.add('admin-authorized');
      if (editorBar) editorBar.style.display = 'flex';
      if (footerAdminBox) footerAdminBox.style.display = 'block';
    }

    if (hasAdminParam || hasEditorParam || hasSessionAuth) {
      unlockAdminFeatures();
      if (hasEditorParam) {
        setTimeout(() => { if (!state.isEditMode) toggleLiveEditMode(); }, 300);
      }
    }

    // A. Atajo directo para ACTIVAR MODO EDICIÓN EN PANTALLA:
    function triggerLiveEditor() {
      if (state.isEditMode) {
        toggleLiveEditMode();
        return;
      }
      if (sessionStorage.getItem('TY_ADMIN_AUTH') === 'true') {
        unlockAdminFeatures();
        toggleLiveEditMode();
        return;
      }
      const pin = prompt("✏️ MODO EDICIÓN EN VIVO\nIngrese el PIN de seguridad (dueña):");
      if (pin === ADMIN_PIN) {
        unlockAdminFeatures();
        toggleLiveEditMode();
      } else if (pin !== null) {
        alert("❌ PIN de seguridad incorrecto.");
      }
    }

    // B. Atajo directo para ENTRAR A LA APP INTERNA (admin.html - Finanzas):
    function triggerAdminApp() {
      if (sessionStorage.getItem('TY_ADMIN_AUTH') === 'true') {
        window.location.href = 'admin.html';
        return;
      }
      const pin = prompt("💼 APP INTERNA & FINANZAS\nIngrese el PIN de seguridad:");
      if (pin === ADMIN_PIN) {
        sessionStorage.setItem('TY_ADMIN_AUTH', 'true');
        window.location.href = 'admin.html';
      } else if (pin !== null) {
        alert("❌ PIN de seguridad incorrecto.");
      }
    }

    window._TY_triggerLiveEditor = triggerLiveEditor;
    window._TY_triggerAdminApp = triggerAdminApp;

    // 1. Atajos de teclado independientes:
    window.addEventListener('keydown', (e) => {
      // Ctrl + Shift + E -> Activa Modo Edición en Vivo
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        triggerLiveEditor();
      }
      // Ctrl + Shift + A o Ctrl + Shift + I -> Va directo a la App Interna (admin.html)
      if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        triggerAdminApp();
      }
    });

    // 2. Toques en móviles:
    // Triple toque en el Logo -> Activa Modo Edición
    const logoTrigger = document.getElementById('brand-logo-trigger');
    if (logoTrigger) {
      let tapCount = 0;
      let tapTimer = null;
      logoTrigger.addEventListener('click', (e) => {
        tapCount++;
        if (tapCount === 1) {
          tapTimer = setTimeout(() => { tapCount = 0; }, 600);
        } else if (tapCount >= 3) {
          e.preventDefault();
          clearTimeout(tapTimer);
          tapCount = 0;
          triggerLiveEditor();
        }
      });
    }

    // Doble toque en el Copyright del Footer -> Va directo a la App Interna
    const footerTrigger = document.getElementById('footer-copyright-trigger');
    if (footerTrigger) {
      let fTapCount = 0;
      let fTapTimer = null;
      footerTrigger.addEventListener('click', (e) => {
        fTapCount++;
        if (fTapCount === 1) {
          fTapTimer = setTimeout(() => { fTapCount = 0; }, 500);
        } else if (fTapCount >= 2) {
          e.preventDefault();
          clearTimeout(fTapTimer);
          fTapCount = 0;
          triggerAdminApp();
        }
      });
    }
  }

  // ============================================================================
  // NOTIFICACIONES TOAST
  // ============================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ============================================================================
  // EVENT LISTENERS & VINCULACIÓN DE BOTONES
  // ============================================================================
  function setupEventListeners() {
    // 1. Carrito Drawer Abrir/Cerrar
    const openCartBtn = document.getElementById('btn-open-cart');
    const closeCartBtn = document.getElementById('btn-close-cart');
    const cartModal = document.getElementById('cart-drawer-modal');

    if (openCartBtn && cartModal) {
      openCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        updateCartUI();
      });
    }

    if (closeCartBtn && cartModal) {
      closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
    }

    // 2. Bottom Nav (Móviles)
    const mHome = document.getElementById('btn-m-home');
    const mCat = document.getElementById('btn-m-catalog');
    const mCart = document.getElementById('btn-m-cart');
    const mQuote = document.getElementById('btn-m-quote');
    const mAcc = document.getElementById('btn-m-account');

    if (mHome) {
      mHome.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveMNav(mHome);
      });
    }
    if (mCat) {
      mCat.addEventListener('click', () => {
        const sec = document.getElementById('catalog-section-title');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        setActiveMNav(mCat);
      });
    }
    if (mCart) {
      mCart.addEventListener('click', () => {
        if (cartModal) cartModal.style.display = 'flex';
        updateCartUI();
      });
    }
    if (mQuote) {
      mQuote.addEventListener('click', () => {
        generateFormalQuote();
        setActiveMNav(mQuote);
      });
    }
    if (mAcc) {
      mAcc.addEventListener('click', () => {
        openClientAccountModal();
        setActiveMNav(mAcc);
      });
    }

    function setActiveMNav(activeBtn) {
      document.querySelectorAll('.m-nav-item').forEach(b => b.classList.remove('active'));
      activeBtn.classList.add('active');
    }

    // 3. PWA Install & Account Header
    const pwaBtn = document.getElementById('btn-install-pwa');
    if (pwaBtn) pwaBtn.addEventListener('click', handlePwaInstallClick);

    const accBtn = document.getElementById('btn-open-account');
    if (accBtn) accBtn.addEventListener('click', openClientAccountModal);

    const autofillBtn = document.getElementById('btn-cart-autofill');
    if (autofillBtn) autofillBtn.addEventListener('click', handleAutofillCart);

    // 4. Modo Oscuro
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

    // 5. Búsqueda y Ordenamiento
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

    // 6. Botones Hero y Carrito
    const heroKits = document.getElementById('btn-hero-explore-kits');
    if (heroKits) {
      heroKits.addEventListener('click', () => {
        state.activeCategory = 'Kits';
        renderCategories();
        renderProducts();
        const sec = document.getElementById('catalog-section-title');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const heroQuote = document.getElementById('btn-hero-quote-generator');
    if (heroQuote) heroQuote.addEventListener('click', generateFormalQuote);

    const cartQuote = document.getElementById('btn-cart-download-quote');
    if (cartQuote) cartQuote.addEventListener('click', generateFormalQuote);

    const cartClear = document.getElementById('btn-cart-clear');
    if (cartClear) cartClear.addEventListener('click', clearCart);

    // 7. Proceder al Pago & Autenticación
    const proceedPayBtn = document.getElementById('btn-cart-proceed-payment');
    if (proceedPayBtn) proceedPayBtn.addEventListener('click', openPaymentModalFromCart);

    const formAuthPay = document.getElementById('form-auth-payment');
    if (formAuthPay) formAuthPay.addEventListener('submit', handlePaymentAuthSubmit);

    // Copiar datos de Pago Móvil y Zelle
    const copyPmBtn = document.getElementById('btn-copy-pm');
    if (copyPmBtn) {
      copyPmBtn.addEventListener('click', () => {
        const text = `Pago Móvil Banesco (0134)\nTeléfono: 0426-5604070\nCédula: V-28123456\nMonto: ${document.getElementById('copy-pm-bs').textContent}`;
        navigator.clipboard.writeText(text).then(() => {
          showToast("📋 ¡Datos de Pago Móvil copiados!", "success");
        });
      });
    }

    const copyZelleBtn = document.getElementById('btn-copy-zelle');
    if (copyZelleBtn) {
      copyZelleBtn.addEventListener('click', () => {
        navigator.clipboard.writeText("tiendasyolo.pagos@gmail.com").then(() => {
          showToast("📋 Correo Zelle copiado: tiendasyolo.pagos@gmail.com", "success");
        });
      });
    }

    // 8. Enviar pedido regular a WhatsApp
    const sendWaBtn = document.getElementById('btn-cart-send-whatsapp');
    if (sendWaBtn) {
      sendWaBtn.addEventListener('click', () => {
        if (state.cart.length === 0) {
          alert("Tu carrito está vacío.");
          return;
        }
        const name = document.getElementById('cart-client-name').value.trim() || 'Cliente';
        const phone = document.getElementById('cart-client-phone').value.trim() || '';
        const salon = document.getElementById('cart-client-salon').value.trim() || '';
        const delType = document.getElementById('cart-delivery-type').value;
        const address = document.getElementById('cart-delivery-address').value.trim() || 'Maracaibo';
        const method = document.getElementById('cart-payment-method').value;
        const notes = document.getElementById('cart-notes').value.trim();

        const subtotal = state.cart.reduce((s, i) => s + (i.precioUSD * i.quantity), 0);
        const rate = Number(state.config.rateBCV || 395.50);
        const isFree = subtotal >= Number(state.config.deliveryFreeMinUSD || 15.00);
        const deliveryFee = isFree ? 0 : Number(state.config.deliveryFlatFeeUSD || 2.00);
        const grandTotal = subtotal + deliveryFee;
        const grandTotalBs = grandTotal * rate;

        const text = 
`💅 *TIENDAS YOLO® — NUEVO PEDIDO DE INSUMOS* 💅
━━━━━━━━━━━━━━━━━━━━
👤 *Manicurista:* ${name}
📞 *Teléfono:* ${phone}
${salon ? `💅 *Salón:* ${salon}\n` : ''}📍 *Entrega:* ${address} (${delType})
💳 *Método de Pago:* ${method}
━━━━━━━━━━━━━━━━━━━━
📦 *INSUMOS SOLICITADOS:*
${state.cart.map(i => `• ${i.quantity}x ${i.nombre} ($${(i.precioUSD * i.quantity).toFixed(2)})`).join('\n')}
━━━━━━━━━━━━━━━━━━━━
💵 *Subtotal:* $${subtotal.toFixed(2)}
🚚 *Delivery Maracaibo:* ${isFree ? '¡GRATIS!' : `$${deliveryFee.toFixed(2)}`}
💎 *TOTAL A PAGAR:* $${grandTotal.toFixed(2)} (Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
${notes ? `📝 *Detalles:* ${notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
✨ _“Yo lo compro, Yo lo merezco”_`;

        window.open(`https://wa.me/584265604070?text=${encodeURIComponent(text)}`, '_blank');
      });
    }

    // 9. Impresión & Envío de Cotización Formal
    const printQuoteBtn = document.getElementById('btn-print-quote');
    if (printQuoteBtn) printQuoteBtn.addEventListener('click', () => window.print());

    const quoteWaBtn = document.getElementById('btn-quote-send-wa');
    if (quoteWaBtn) {
      quoteWaBtn.addEventListener('click', () => {
        const id = document.getElementById('print-quote-id').textContent;
        const client = document.getElementById('print-client-name').textContent;
        const total = document.getElementById('print-quote-grand-usd').textContent;
        const totalBs = document.getElementById('print-quote-grand-bs').textContent;
        const text = `💅 *TIENDAS YOLO® — COTIZACIÓN FORMAL*\n📄 *ID:* ${id}\n👤 *Para:* ${client}\n💎 *TOTAL:* ${total} (${totalBs})\n_Validez: 7 días continuos. Delivery gratis desde $15 en Maracaibo._`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      });
    }

    // 10. Impresión de Mini Nota de Entrega
    const printTicketBtn = document.getElementById('btn-print-delivery-note');
    if (printTicketBtn) printTicketBtn.addEventListener('click', () => window.print());

    // 11. Formulario Perfil Clienta Frecuente
    const formAccount = document.getElementById('form-account-profile');
    if (formAccount) formAccount.addEventListener('submit', handleProfileSubmit);

    const btnEditProf = document.getElementById('btn-edit-profile');
    if (btnEditProf) {
      btnEditProf.addEventListener('click', () => {
        document.getElementById('account-view-form').style.display = 'block';
        document.getElementById('account-view-profile').style.display = 'none';
        if (state.clientProfile) {
          document.getElementById('acc-input-name').value = state.clientProfile.name || '';
          document.getElementById('acc-input-phone').value = state.clientProfile.phone || '';
          document.getElementById('acc-input-doc').value = state.clientProfile.doc || '';
          document.getElementById('acc-input-salon').value = state.clientProfile.salon || '';
          document.getElementById('acc-input-instagram').value = state.clientProfile.instagram || '';
          document.getElementById('acc-input-address').value = state.clientProfile.address || '';
        }
      });
    }

    const btnLogout = document.getElementById('btn-logout-account');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (confirm("¿Cerrar sesión de tu perfil en este dispositivo?")) {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
          state.clientProfile = null;
          updateClientStatusBadge();
          openClientAccountModal();
          showToast("Sesión cerrada.", "info");
        }
      });
    }

    // 12. Modo Editor: Toolbar y Guardar Cambios
    const toggleEditorBtn = document.getElementById('btn-toggle-editor');
    if (toggleEditorBtn) toggleEditorBtn.addEventListener('click', toggleLiveEditMode);

    const btnAddProd = document.getElementById('btn-editor-add-product');
    if (btnAddProd) btnAddProd.addEventListener('click', openNewProduct);

    const btnSaveAll = document.getElementById('btn-editor-save-all');
    if (btnSaveAll) btnSaveAll.addEventListener('click', saveEditsToStorage);

    const btnExitEditor = document.getElementById('btn-editor-exit');
    if (btnExitEditor) {
      btnExitEditor.addEventListener('click', () => {
        if (state.isEditMode) toggleLiveEditMode();
        document.getElementById('editor-control-bar').style.display = 'none';
      });
    }

    const formProdEditor = document.getElementById('form-product-editor');
    if (formProdEditor) formProdEditor.addEventListener('submit', handleProductEditorSave);

    const peImgInput = document.getElementById('pe-input-img');
    if (peImgInput) {
      peImgInput.addEventListener('input', (e) => {
        const preview = document.getElementById('pe-img-preview');
        if (preview) preview.src = resolveImgPath(e.target.value.trim() || 'logo-yolo.png');
      });
    }

    const peDeleteBtn = document.getElementById('btn-pe-delete-prod');
    if (peDeleteBtn) {
      peDeleteBtn.addEventListener('click', () => {
        const id = document.getElementById('pe-input-id').value;
        if (id) {
          deleteProduct(id);
          document.getElementById('modal-product-editor').style.display = 'none';
        }
      });
    }

    const peCatSelect = document.getElementById('pe-input-cat');
    if (peCatSelect) {
      peCatSelect.addEventListener('change', (e) => {
        const id = document.getElementById('pe-input-id').value;
        if (!id) {
          document.getElementById('pe-input-sku').value = generateUniqueProductSKU(e.target.value);
        }
      });
    }

    const helpBtn = document.getElementById('btn-open-help');
    if (helpBtn) helpBtn.addEventListener('click', openLearningGuideModal);

    const helpBannerBtn = document.getElementById('btn-help-guide-banner');
    if (helpBannerBtn) helpBannerBtn.addEventListener('click', openLearningGuideModal);

    // Modo Oscuro / Claro
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const isDark = document.body.classList.contains('theme-dark');
        localStorage.setItem('TY_THEME', isDark ? 'dark' : 'light');
        showToast(isDark ? "🌙 Modo Oscuro Activado" : "☀️ Modo Claro Activado", "info");
      });
    }

    if (localStorage.getItem('TY_THEME') === 'dark') {
      document.body.classList.add('theme-dark');
    }

    // 13. Tasa del Día interactiva (BCV en vivo)
    const rateTicker = document.getElementById('rate-ticker-box');
    if (rateTicker) {
      rateTicker.addEventListener('click', () => {
        fetchLiveBcvRate();
        showToast("🔄 Consultando tasa oficial del BCV en tiempo real...", "info");
      });
    }

    // 14. Modales: Cerrar al hacer clic en [data-close-modal]
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = document.getElementById(btn.dataset.closeModal);
        if (m) m.style.display = 'none';
      });
    });

    // 15. Iniciar Atajos y Seguridad
    initAdminSecurityAndShortcuts();
  }

  function openLearningGuideModal() {
    const modal = document.getElementById('modal-learning-guide');
    if (modal) modal.style.display = 'flex';
  }

  // ============================================================================
  // EXPOSICIÓN GLOBAL PARA BOTONES EN EL DOM
  // ============================================================================
  window.YoloApp = {
    adjustCardQty,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    openEditProduct,
    quickChangePhoto,
    deleteProduct,
    toggleLiveEditMode,
    openNewProduct,
    saveEditsToStorage,
    openLearningGuideModal,
    triggerLiveEditor: () => {
      if (typeof window._TY_triggerLiveEditor === 'function') {
        window._TY_triggerLiveEditor();
      }
    },
    triggerAdminApp: () => {
      if (typeof window._TY_triggerAdminApp === 'function') {
        window._TY_triggerAdminApp();
      }
    },
    viewPastTicket: function(orderId) {
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        document.getElementById('modal-client-account').style.display = 'none';
        renderDeliveryNote(order);
      }
    }
  };

  // ============================================================================
  // ARRANQUE DE LA APLICACIÓN
  // ============================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderCategories();
    renderProducts();
    updateCartUI();
    setupEventListeners();
    initPwaSupport();
    console.log("🌸 Tiendas Yolo® Tienda PWA Iniciada con Éxito.");
  });

})();
