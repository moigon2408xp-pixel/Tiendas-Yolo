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

  const STORAGE_KEY = 'TIENDAS_YOLO_DATA_V2';
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
      sku: "YOLO-001",
      nombre: "Cat Eye MY (Colección Ojo de Gato)",
      categoria: "Esmaltes Semipermanentes",
      descripcion: "Esmalte semipermanente efecto ojo de gato magnético multidimensional. Alta densidad y brillo cristalino.",
      precioUSD: 16.00,
      costoUSD: 9.50,
      stockActual: 30,
      stockMinimo: 5,
      unidad: "Colección",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png",
      colores: [
        { nombre: "01 Galaxia Rose", hex: "#e05297" },
        { nombre: "02 Silver Star", hex: "#d1d5db" },
        { nombre: "03 Deep Purple", hex: "#6b21a8" },
        { nombre: "04 Golden Sun", hex: "#eab308" },
        { nombre: "05 Emerald Green", hex: "#059669" }
      ]
    },
    {
      id: "TY-PROD-002",
      sku: "YOLO-002",
      nombre: "Jelly Gel MY (Esmaltes Translúcidos)",
      categoria: "Esmaltes Semipermanentes",
      descripcion: "Colección de esmaltes translúcidos efecto gelatina / vidrio coreano. Cobertura uniforme y brillo espejo.",
      precioUSD: 10.00,
      costoUSD: 5.50,
      stockActual: 25,
      stockMinimo: 5,
      unidad: "Colección",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png",
      colores: [
        { nombre: "Jelly Cherry", hex: "#dc2626" },
        { nombre: "Peach Pink", hex: "#fb7185" },
        { nombre: "Berry Purple", hex: "#a855f7" },
        { nombre: "Nude Caramel", hex: "#d97706" }
      ]
    },
    {
      id: "TY-PROD-003",
      sku: "YOLO-003",
      nombre: "Colección Amatista x6 Geles",
      categoria: "Esmaltes Semipermanentes",
      descripcion: "Set de 6 tonos violetas y púrpuras semipermanentes ultra pigmentados para manicure de salón.",
      precioUSD: 12.00,
      costoUSD: 6.80,
      stockActual: 20,
      stockMinimo: 4,
      unidad: "Set x6",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-004",
      sku: "YOLO-004",
      nombre: "Finish Gel MY 15ml (Top Coat Extremo)",
      categoria: "Esmaltes Semipermanentes",
      descripcion: "Sellador final no wipe de alto impacto. No amarillea y mantiene el brillo impecable por más de 25 días.",
      precioUSD: 3.00,
      costoUSD: 1.50,
      stockActual: 60,
      stockMinimo: 15,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-005",
      sku: "YOLO-005",
      nombre: "Top Coat Matte MY 15ml",
      categoria: "Esmaltes Semipermanentes",
      descripcion: "Sellador mate efecto terciopelo sedoso para acabados modernos y elegantes.",
      precioUSD: 3.00,
      costoUSD: 1.50,
      stockActual: 40,
      stockMinimo: 10,
      unidad: "Unidad",
      destacado: "NO",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-006",
      sku: "YOLO-006",
      nombre: "Protein Bond KR (Deshidratador y Primer)",
      categoria: "Preparadores",
      descripcion: "Fórmula niveladora libre de ácido con keratina. Máxima adherencia sin dañar la uña natural.",
      precioUSD: 2.00,
      costoUSD: 1.00,
      stockActual: 50,
      stockMinimo: 12,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-007",
      sku: "YOLO-007",
      nombre: "Uñas Postizas Decoradas con Piedras",
      categoria: "Uñas Postizas Decoradas",
      descripcion: "Set de uñas press-on listas para aplicar con cristalería incrustada y acabados de lujo.",
      precioUSD: 1.50,
      costoUSD: 0.70,
      stockActual: 35,
      stockMinimo: 8,
      unidad: "Set",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-008",
      sku: "YOLO-008",
      nombre: "Set de Pinceles para Gel UV & Polygel",
      categoria: "Pinceles",
      descripcion: "Pinceles de corte plano y lengua de gato para aplicación precisa de sistemas artificiales.",
      precioUSD: 2.00,
      costoUSD: 0.90,
      stockActual: 45,
      stockMinimo: 10,
      unidad: "Set",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-009",
      sku: "YOLO-009",
      nombre: "Punteros Dotting Tools Nail Art (x5)",
      categoria: "Herramientas",
      descripcion: "5 herramientas de doble punta con esferas metálicas para mandalas, puntos y flores.",
      precioUSD: 2.00,
      costoUSD: 0.85,
      stockActual: 30,
      stockMinimo: 6,
      unidad: "Set x5",
      destacado: "NO",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-010",
      sku: "YOLO-010",
      nombre: "Pinceles Liner Ultrafinos Nail Art (x3)",
      categoria: "Pinceles",
      descripcion: "Set de 3 liners de precisión (7mm, 9mm, 11mm) para líneas francesas y trazos finos.",
      precioUSD: 2.00,
      costoUSD: 0.90,
      stockActual: 40,
      stockMinimo: 8,
      unidad: "Set x3",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-011",
      sku: "YOLO-011",
      nombre: "Pestañas Corridas Efecto 3D/5D",
      categoria: "Otros",
      descripcion: "Pestañas postizas en tira con banda flexible y efecto volumen ruso natural.",
      precioUSD: 2.00,
      costoUSD: 0.80,
      stockActual: 50,
      stockMinimo: 10,
      unidad: "Par",
      destacado: "NO",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-012",
      sku: "YOLO-012",
      nombre: "Aceite de Cutícula Nutritivo MY",
      categoria: "Preparadores",
      descripcion: "Aceite aromático con gotero y vitaminas para sellar y nutrir la piel post manicura.",
      precioUSD: 1.50,
      costoUSD: 0.70,
      stockActual: 45,
      stockMinimo: 10,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-013",
      sku: "YOLO-013",
      nombre: "Lima Sponge Pulidora 100/180",
      categoria: "Limas",
      descripcion: "Bloque amortiguado de grano fino para abrir canales de adherencia y suavizar bordes.",
      precioUSD: 1.00,
      costoUSD: 0.45,
      stockActual: 100,
      stockMinimo: 20,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-014",
      sku: "YOLO-014",
      nombre: "Lima Profesional Zebra 80/80",
      categoria: "Limas",
      descripcion: "Lima de grano extra fuerte para rebajar acrílico, polygel y dar forma a puntas estructurales.",
      precioUSD: 0.50,
      costoUSD: 0.22,
      stockActual: 120,
      stockMinimo: 25,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-015",
      sku: "YOLO-015",
      nombre: "Tips Softgel x240 Preformados",
      categoria: "Tips Uñas Jelly/softgel",
      descripcion: "Caja de 240 cápsulas de gel flexibles (coffin, almendra o stiletto) de cobertura completa.",
      precioUSD: 7.00,
      costoUSD: 3.90,
      stockActual: 30,
      stockMinimo: 6,
      unidad: "Caja x240",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-016",
      sku: "YOLO-016",
      nombre: "UV Builder Gel MY 30g Constructor",
      categoria: "Geles",
      descripcion: "Gel constructor autonivelante de alta viscosidad para esculpido con moldes y tips.",
      precioUSD: 2.50,
      costoUSD: 1.20,
      stockActual: 35,
      stockMinimo: 8,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-017",
      sku: "YOLO-017",
      nombre: "Rubber Base Nude & Shimmer MY 15ml",
      categoria: "Esmaltes Semipermanentes",
      descripcion: "Base niveladora con color para fortalecer uñas débiles y dar estructura tipo kapping.",
      precioUSD: 2.00,
      costoUSD: 0.95,
      stockActual: 50,
      stockMinimo: 12,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png",
      colores: [
        { nombre: "Cover Nude", hex: "#e2b39c" },
        { nombre: "Milky White", hex: "#f3f4f6" },
        { nombre: "Soft Pink", hex: "#fbcfe8" },
        { nombre: "Shimmer Rose", hex: "#f472b6" }
      ]
    },
    {
      id: "TY-PROD-018",
      sku: "YOLO-018",
      nombre: "Spider Gel Elástico para Nail Art",
      categoria: "Decoraciones",
      descripcion: "Gel elástico de máxima densidad para trazos geométricos perfectos y telaraña.",
      precioUSD: 2.00,
      costoUSD: 0.90,
      stockActual: 30,
      stockMinimo: 6,
      unidad: "Unidad",
      destacado: "NO",
      activo: "SI",
      imagenURL: "logo-yolo.png",
      colores: [
        { nombre: "Negro Intenso", hex: "#111827" },
        { nombre: "Blanco Puro", hex: "#ffffff" },
        { nombre: "Oro Metálico", hex: "#ca8a04" },
        { nombre: "Plata Brillo", hex: "#9ca3af" }
      ]
    },
    {
      id: "TY-PROD-019",
      sku: "YOLO-019",
      nombre: "Polvo Aurora Efecto Espejo Unicornio",
      categoria: "Decoraciones",
      descripcion: "Pigmento micronizado con aplicador de esponja para efecto tornasol / espejo sobre gel.",
      precioUSD: 2.50,
      costoUSD: 1.10,
      stockActual: 25,
      stockMinimo: 5,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-020",
      sku: "YOLO-020",
      nombre: "Drill Torno Profesional 45.000 RPM",
      categoria: "Herramientas",
      descripcion: "Pulidor eléctrico profesional recargable para retiro express y manicura rusa. Ultra silencioso.",
      precioUSD: 43.00,
      costoUSD: 26.00,
      stockActual: 10,
      stockMinimo: 2,
      unidad: "Equipo",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-021",
      sku: "YOLO-021",
      nombre: "Mini Lámpara Jelly Flash Curing LED",
      categoria: "Herramientas",
      descripcion: "Lámpara de mano tipo linterna para precurado y fijación instantánea de tips softgel.",
      precioUSD: 8.00,
      costoUSD: 4.50,
      stockActual: 18,
      stockMinimo: 4,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    },
    {
      id: "TY-PROD-022",
      sku: "YOLO-022",
      nombre: "Lámpara UV/LED Sun 168W Secado Rápido",
      categoria: "Herramientas",
      descripcion: "Cabina profesional de 168W con temporizador inteligente y base desmontable para pedicura.",
      precioUSD: 18.00,
      costoUSD: 10.50,
      stockActual: 12,
      stockMinimo: 3,
      unidad: "Equipo",
      destacado: "SI",
      activo: "SI",
      imagenURL: "logo-yolo.png"
    }
  ];

  const DEFAULT_SHEETS_URL = "https://script.google.com/macros/s/AKfycby7q4Lyy_RF3qFjW2jdzKVqKQHODW2tMTBEBbG4EcFXosdrzE_iOCxeodVWYis0_-1QCQ/exec";

  const DEFAULT_CONFIG = {
    sheetsApiUrl: DEFAULT_SHEETS_URL,
    rateBCV: 887.30,
    rateLastUpdated: new Date().toISOString(),
    whatsappNumber: "584146553430",
    deliveryFreeMinUSD: null,
    deliveryFlatFeeUSD: 2.50,
    adminPin: "2026",
    paymentInfo: "Banesco (0134) | CI: V-28123456 | Telf: 0414-6553430\nBinance Pay ID: 829140291 (USDT)"
  };

  // Coordenadas oficiales de Tiendas Yolo Maracaibo (Urb. El Trébol / Circunvalación 2 Sur)
  const STORE_LOCATION = {
    name: "Tiendas Yolo® Maracaibo (Urb. El Trébol / C-2 Sur)",
    lat: 10.60542008723256,
    lng: -71.6592591041028
  };

  // Fórmula de Haversine para cálculo de distancia en línea recta precisa
  function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) * 10) / 10; // Redondeado a 1 decimal
  }

  // Extractor inteligente de coordenadas (lat, lng directas o enlaces de Google Maps)
  function parseCoordinatesString(str) {
    if (!str || typeof str !== 'string') return null;
    const trimmed = str.trim();
    // 1. Coordenadas directas: "10.6427, -71.6125" o "10.6427 -71.6125"
    const directMatch = trimmed.match(/(-?\d{1,2}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/);
    if (directMatch) {
      return { lat: parseFloat(directMatch[1]), lng: parseFloat(directMatch[2]) };
    }
    // 2. URL de Google Maps: maps.google.com/?q=... o @lat,lng
    const urlMatch = trimmed.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/) ||
                     trimmed.match(/q=(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
    if (urlMatch) {
      return { lat: parseFloat(urlMatch[1]), lng: parseFloat(urlMatch[2]) };
    }
    return null;
  }

  // Tarificador de Delivery por kilometraje oficial: $0.50/km (Desde coordenadas de origen)
  function getDeliveryFeeByKm(km) {
    if (km === null || km === undefined || isNaN(km)) {
      return 1.50; // Tarifa referencial estimada
    }
    // 0.50$ por kilometro de recorrido desde el punto de origen
    const calculated = Math.round(km * 0.50 * 100) / 100;
    return Math.max(1.00, calculated);
  }

  const state = {
    products: [],
    cart: [],
    orders: [],
    quotes: [],
    config: Object.assign({}, DEFAULT_CONFIG),
    clientProfile: null,
    activeCategory: 'all',
    activeColorFilter: 'all',
    searchQuery: '',
    sortCriteria: 'featured',
    cardQuantities: {},
    selectedColors: {},
    isEditMode: false,
    deferredPwaPrompt: null,
    currentPaymentOrder: null,
    deliveryDistanceKm: null,
    deliveryCoords: null
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
    } catch (e) { }

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
    const rate = Number(state.config.rateBCV || 887.30);
    const rateEl = document.getElementById('top-rate-display');
    if (rateEl) {
      rateEl.innerHTML = `${isLive ? '🟢' : '💵'} Bs. ${rate.toFixed(2)} / $ ${isLive ? '<span style="font-size:0.7em; opacity:0.85;">(En Vivo BCV)</span>' : ''}`;
    }
  }

  // Generador de códigos de producto (SKU) automáticos, únicos e irrepetibles
  function generateUniqueProductSKU(category, currentProducts = state.products) {
    const prefixes = {
      'Esmaltes Semipermanentes': 'ESM',
      'Preparadores': 'PREP',
      'Press ON': 'PON',
      'Pinceles': 'PIN',
      'Limas': 'LIM',
      'Tips Uñas Jelly y Softgel': 'TIP',
      'Tips Uñas Jelly/softgel': 'TIP',
      'Geles': 'GEL',
      'Decoraciones': 'DEC',
      'Herramientas': 'HER',
      'Otros': 'YOLO',
      'Esmaltes': 'ESM',
      'Kits': 'KIT'
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
      'Esmaltes Semipermanentes': '💅',
      'Preparadores': '💧',
      'Uñas Postizas Decoradas': '✨',
      'Pinceles': '🖌️',
      'Otros': '🎀',
      'Limas': '🪄',
      'Tips Uñas Jelly/softgel': '💎',
      'Geles': '🧪',
      'Decoraciones': '🌟',
      'Herramientas': '⚙️',
      'Esmaltes': '💅',
      'Geles y Acrílicos': '💎',
      'Pinceles y Herramientas': '🖌️',
      'Lámparas y Equipos': '💡',
      'Kits': '🎁'
    };
    return map[cat] || '💅';
  }

  // Paleta de filtros de tono inspirada en InsuShop
  const FILTER_COLOR_PALETTE = [
    { id: 'all', name: 'Todos los Tonos', hex: null },
    { id: 'cherry', name: 'Rojo / Cherry', hex: '#dc2626' },
    { id: 'pink', name: 'Rosa / Rose Gold', hex: '#fb7185' },
    { id: 'nude', name: 'Nude / Beige', hex: '#d97706' },
    { id: 'purple', name: 'Púrpura / Amatista', hex: '#a855f7' },
    { id: 'gold', name: 'Dorado / Gold', hex: '#eab308' },
    { id: 'silver', name: 'Plata / Silver / 808080', hex: '#808080' },
    { id: 'black', name: 'Negro Intenso', hex: '#1e293b' },
    { id: 'white', name: 'Blanco Puro', hex: '#ffffff' }
  ];

  function renderColorFilterBar() {
    const container = document.getElementById('color-filter-container');
    if (!container) return;

    let html = `
      <button type="button" class="btn-filter-color-all ${state.activeColorFilter === 'all' ? 'active' : ''}" data-color="all">
        Todos
      </button>
    `;

    FILTER_COLOR_PALETTE.forEach(c => {
      if (c.id === 'all') return;
      const isActive = state.activeColorFilter === c.id;
      html += `
        <button type="button" 
                class="btn-filter-color-dot ${isActive ? 'active' : ''}" 
                style="background-color: ${c.hex};" 
                data-color="${c.id}" 
                title="${c.name}">
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeColorFilter = btn.dataset.color;
        renderColorFilterBar();
        renderProducts();
      });
    });
  }

  function getFilteredProducts() {
    let prods = state.products.filter(p => p.activo !== 'NO');

    if (state.activeCategory !== 'all') {
      prods = prods.filter(p => p.categoria === state.activeCategory);
    }

    if (state.activeColorFilter && state.activeColorFilter !== 'all') {
      const cFilter = state.activeColorFilter.toLowerCase();
      prods = prods.filter(p => {
        if (p.colores && Array.isArray(p.colores)) {
          const matched = p.colores.some(c => {
            const h = (c.hex || '').toLowerCase();
            const n = (c.nombre || '').toLowerCase();
            if (cFilter === 'cherry' && (n.includes('cherry') || n.includes('rojo') || h.includes('dc2626') || h.includes('ef4444'))) return true;
            if (cFilter === 'pink' && (n.includes('pink') || n.includes('rose') || n.includes('rosa') || h.includes('fb7185') || h.includes('e05297'))) return true;
            if (cFilter === 'nude' && (n.includes('nude') || n.includes('caramel') || n.includes('beige') || h.includes('d97706') || h.includes('e2b29f'))) return true;
            if (cFilter === 'purple' && (n.includes('purple') || n.includes('amatista') || n.includes('violet') || h.includes('a855f7') || h.includes('6b21a8'))) return true;
            if (cFilter === 'gold' && (n.includes('gold') || n.includes('dorad') || h.includes('eab308') || h.includes('ffd54f'))) return true;
            if (cFilter === 'silver' && (n.includes('silver') || n.includes('plata') || n.includes('star') || h.includes('d1d5db') || h.includes('94a3b8') || h.includes('808080'))) return true;
            if (cFilter === 'black' && (n.includes('black') || n.includes('negro') || h.includes('000000') || h.includes('1e293b') || h.includes('1e1b1e'))) return true;
            if (cFilter === 'white' && (n.includes('white') || n.includes('blanco') || h.includes('ffffff'))) return true;
            return h.includes(cFilter) || n.includes(cFilter);
          });
          if (matched) return true;
        }
        const text = `${p.nombre || ''} ${p.descripcion || ''}`.toLowerCase();
        if (cFilter === 'cherry' && (text.includes('cherry') || text.includes('rojo'))) return true;
        if (cFilter === 'pink' && (text.includes('rosa') || text.includes('pink') || text.includes('rose'))) return true;
        if (cFilter === 'nude' && (text.includes('nude') || text.includes('caramel'))) return true;
        if (cFilter === 'purple' && (text.includes('amatista') || text.includes('purple') || text.includes('violeta'))) return true;
        if (cFilter === 'gold' && (text.includes('gold') || text.includes('dorado'))) return true;
        if (cFilter === 'silver' && (text.includes('silver') || text.includes('plata') || text.includes('808080'))) return true;
        return false;
      });
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
      const selectedColorIdx = state.selectedColors[p.id] || 0;
      const selectedColor = (p.colores && p.colores[selectedColorIdx]) ? p.colores[selectedColorIdx] : null;
      const effectiveImg = (selectedColor && selectedColor.imagenURL) || p.imagenURL || 'logo-yolo.png';
      const imgSrc = resolveImgPath(effectiveImg);
      const qty = state.cardQuantities[p.id] || 1;
      const isOutOfStock = Number(p.stockActual || 0) <= 0;

      return `
        <article class="product-card ${isOutOfStock ? 'card-out-of-stock' : ''}" data-product-id="${p.id}">
          
          <!-- OVERLAY DE MODO EDICIÓN DUEÑA -->
          <div class="card-edit-overlay">
            <button type="button" class="btn-edit-card-action" onclick="window.YoloApp.openEditProduct('${p.id}')" title="Editar Producto">✏️</button>
            <button type="button" class="btn-edit-card-action" onclick="window.YoloApp.quickChangePhoto('${p.id}')" title="Cambiar Foto">🖼️</button>
            <button type="button" class="btn-edit-card-action" onclick="window.YoloApp.deleteProduct('${p.id}')" title="Eliminar Producto">🗑️</button>
          </div>

          <div class="product-image-container">
            ${isFeatured ? '<span class="badge-tag featured">⭐ Destacado</span>' : ''}
            ${isOutOfStock ? '<span class="badge-tag" style="background:#ef4444; color:#fff; top:8px; left:8px;">🔴 Agotado</span>' : ''}
            <img src="${imgSrc}" alt="${p.nombre}" class="product-img" loading="lazy" onerror="this.onerror=null; this.src='assets/logo-yolo.png'">
          </div>

          <div class="product-details">
            <span class="product-category">${p.categoria || 'Insumo'}</span>
            <h4 class="product-title" title="${p.nombre}">${p.nombre}</h4>
            <p class="product-desc">${p.descripcion || ''}</p>
            ${(p.colores && p.colores.length > 0) ? `
              <div class="product-swatches-row">
                <span class="swatch-label">Tono: <strong>${(p.colores[state.selectedColors[p.id] || 0] || p.colores[0]).nombre}</strong></span>
                <div class="swatches-dots">
                  ${p.colores.map((c, idx) => `
                    <button type="button" class="swatch-dot ${(state.selectedColors[p.id] || 0) === idx ? 'active' : ''}" 
                            style="background-color: ${c.hex};" 
                            title="${c.nombre}" 
                            onclick="window.YoloApp.selectProductColor('${p.id}', ${idx}, event)">
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="product-price-row">
              <span class="price-usd">$${priceUSD.toFixed(2)}</span>
              <span class="price-bs">Bs. ${priceBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div class="product-card-actions-wrapper">
              <div class="card-qty-stepper">
                <button type="button" class="btn-stepper" ${isOutOfStock ? 'disabled' : ''} onclick="window.YoloApp.adjustCardQty('${p.id}', -1)">-</button>
                <span class="stepper-val" id="stepper-val-${p.id}">${qty}</span>
                <button type="button" class="btn-stepper" ${isOutOfStock ? 'disabled' : ''} onclick="window.YoloApp.adjustCardQty('${p.id}', 1)">+</button>
              </div>

              ${isOutOfStock ? `
                <button class="btn-add-cart-primary" disabled style="opacity:0.55; cursor:not-allowed; background:#64748b;">
                  <span>Agotado</span>
                </button>
              ` : `
                <button class="btn-add-cart-primary" onclick="window.YoloApp.addToCart('${p.id}')">
                  <span>🛒 Agregar</span>
                </button>
              `}
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

    const available = Number(prod.stockActual || 0);
    if (available <= 0) {
      showToast(`⚠️ Este insumo se encuentra actualmente agotado en inventario.`, "warning");
      return;
    }

    const qtyToAdd = state.cardQuantities[prodId] || 1;
    const existing = state.cart.find(item => item.id === prodId);
    const inCart = existing ? existing.quantity : 0;

    if (inCart + qtyToAdd > available) {
      const remaining = available - inCart;
      if (remaining <= 0) {
        showToast(`⚠️ Ya tienes en tu pedido todo el stock disponible (${available} unidades).`, "warning");
        return;
      }
      const selectedColorIdx = state.selectedColors[prod.id] || 0;
      const selectedColor = (prod.colores && prod.colores[selectedColorIdx]) ? prod.colores[selectedColorIdx] : null;
      const itemImg = (selectedColor && selectedColor.imagenURL) || prod.imagenURL || 'logo-yolo.png';
      const itemName = selectedColor ? `${prod.nombre} (${selectedColor.nombre})` : prod.nombre;

      if (existing) {
        existing.quantity = available;
      } else {
        state.cart.push({
          id: prod.id,
          nombre: itemName,
          categoria: prod.categoria,
          precioUSD: Number(prod.precioUSD || 0),
          imagenURL: itemImg,
          quantity: remaining
        });
      }
      showToast(`⚠️ Solo disponemos de ${available} unidades en inventario. Se ajustaron ${remaining} a tu pedido.`, "info");
    } else {
      const selectedColorIdx = state.selectedColors[prod.id] || 0;
      const selectedColor = (prod.colores && prod.colores[selectedColorIdx]) ? prod.colores[selectedColorIdx] : null;
      const itemImg = (selectedColor && selectedColor.imagenURL) || prod.imagenURL || 'logo-yolo.png';
      const itemName = selectedColor ? `${prod.nombre} (${selectedColor.nombre})` : prod.nombre;

      if (existing) {
        existing.quantity += qtyToAdd;
      } else {
        state.cart.push({
          id: prod.id,
          nombre: itemName,
          categoria: prod.categoria,
          precioUSD: Number(prod.precioUSD || 0),
          imagenURL: itemImg,
          quantity: qtyToAdd
        });
      }
      showToast(`🌸 ¡${qtyToAdd}x ${itemName.substring(0, 24)}... agregado!`, "success");
    }

    state.cardQuantities[prodId] = 1;
    const el = document.getElementById(`stepper-val-${prodId}`);
    if (el) el.textContent = 1;

    saveData();
    updateCartUI();
  }

  function updateCartUI() {
    const counter = document.getElementById('cart-counter');
    const mCounter = document.getElementById('m-cart-badge');
    const headerTotal = document.getElementById('cart-total-header');
    const list = document.getElementById('cart-items-list');

    const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.precioUSD * item.quantity), 0);
    const rate = Number(state.config.rateBCV || 887.30);

    const delTypeSelect = document.getElementById('cart-delivery-type');
    const delType = delTypeSelect ? delTypeSelect.value : 'delivery-maracaibo';

    let deliveryUSD = 0;
    if (subtotalUSD > 0) {
      if (delType === 'retiro-personal' || delType === 'envio-nacional') {
        deliveryUSD = 0;
      } else {
        deliveryUSD = getDeliveryFeeByKm(state.deliveryDistanceKm);
      }
    }

    const totalUSD = subtotalUSD + deliveryUSD;
    const totalBs = totalUSD * rate;

    if (counter) counter.textContent = totalQty;
    if (mCounter) mCounter.textContent = totalQty;
    if (headerTotal) headerTotal.textContent = `$${subtotalUSD.toFixed(2)}`;

    // Actualizar totales en el drawer
    const sSub = document.getElementById('cart-summary-subtotal');
    const sDel = document.getElementById('cart-summary-delivery');
    const sTotUSD = document.getElementById('cart-summary-total-usd');
    const sTotBs = document.getElementById('cart-summary-total-bs');

    if (sSub) sSub.textContent = `$${subtotalUSD.toFixed(2)}`;
    if (sDel) {
      if (delType === 'retiro-personal') {
        sDel.textContent = "Retiro Personal (Sin Costo)";
        sDel.className = "free-delivery font-bold";
      } else if (delType === 'envio-nacional') {
        sDel.textContent = "Cobro a Destino (MRW / Tealca / Zoom)";
        sDel.className = "font-bold";
      } else {
        sDel.textContent = `$${deliveryUSD.toFixed(2)}${state.deliveryDistanceKm ? ` (${state.deliveryDistanceKm} km)` : ''}`;
        sDel.className = "font-bold";
      }
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

    // Verificación estricta de stock disponible para evitar sobreventa concurrente
    loadData();
    for (const item of state.cart) {
      const prod = state.products.find(p => p.id === item.id);
      const available = prod ? Number(prod.stockActual || 0) : 0;
      if (!prod || available < item.quantity) {
        alert(`⚠️ El insumo "${item.nombre}" se ha agotado o supera el stock disponible (${available} unidades en inventario). Por favor ajusta tu carrito.`);
        showToast(`⚠️ Stock insuficiente para "${item.nombre}" (${available} disponibles)`, "error");
        updateCartUI();
        return;
      }
    }

    const clientName = document.getElementById('cart-client-name').value.trim();
    const clientPhone = document.getElementById('cart-client-phone').value.trim();
    const clientAddress = document.getElementById('cart-delivery-address').value.trim();

    if (!clientName || !clientPhone) {
      alert("Por favor completa tu Nombre y Teléfono WhatsApp en los datos de entrega.");
      return;
    }

    const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.precioUSD * item.quantity), 0);
    const delType = document.getElementById('cart-delivery-type').value;
    
    let deliveryUSD = 0;
    if (delType === 'retiro-personal' || delType === 'envio-nacional') {
      deliveryUSD = 0;
    } else {
      deliveryUSD = getDeliveryFeeByKm(state.deliveryDistanceKm);
    }

    const totalUSD = subtotalUSD + deliveryUSD;
    const rate = Number(state.config.rateBCV || 887.30);
    const totalBs = totalUSD * rate;
    const coordsVal = document.getElementById('cart-delivery-coords') ? document.getElementById('cart-delivery-coords').value.trim() : '';

    state.currentPaymentOrder = {
      clientName: clientName,
      clientPhone: clientPhone,
      clientSalon: document.getElementById('cart-client-salon').value.trim() || 'Estudio Particular',
      clientAddress: clientAddress || 'Maracaibo',
      deliveryType: delType,
      deliveryKm: state.deliveryDistanceKm,
      deliveryCoords: coordsVal,
      notes: document.getElementById('cart-notes').value.trim(),
      items: JSON.parse(JSON.stringify(state.cart)),
      subtotalUSD: subtotalUSD,
      deliveryUSD: deliveryUSD,
      totalUSD: totalUSD,
      rateBCV: rate,
      totalBs: totalBs
    };

    // Actualizar modal de pagos con totales dinámicos
    document.getElementById('pay-modal-usd').textContent = `$${totalUSD.toFixed(2)}`;
    document.getElementById('pay-modal-bs').textContent = `Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('pay-modal-rate-note').textContent = `Tasa: Bs. ${rate.toFixed(2)} / $`;
    const copyPmBs = document.getElementById('copy-pm-bs');
    if (copyPmBs) copyPmBs.textContent = `Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Cargar cuentas bancarias personalizadas por el administrador
    try {
      const pmSettings = JSON.parse(localStorage.getItem('ty_payment_settings') || '{}');
      const pmPhoneEl = document.getElementById('copy-pm-phone');
      const pmIdEl = document.getElementById('copy-pm-id');
      const binanceIdEl = document.getElementById('copy-binance-id');
      if (pmPhoneEl && pmSettings.pmPhone) pmPhoneEl.textContent = pmSettings.pmPhone;
      if (pmIdEl && pmSettings.pmId) pmIdEl.textContent = pmSettings.pmId;
      if (binanceIdEl && pmSettings.binanceId) binanceIdEl.textContent = pmSettings.binanceId;
    } catch(e) {}

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

    // Doble verificación al momento exacto de procesar el pago para evitar sobreventa
    loadData();
    for (const item of (state.currentPaymentOrder.items || [])) {
      const prod = state.products.find(p => p.id === item.id);
      const available = prod ? Number(prod.stockActual || 0) : 0;
      if (!prod || available < item.quantity) {
        alert(`⚠️ Lo sentimos, el insumo "${item.nombre}" fue adquirido hace un momento y solo quedan ${available} unidades disponibles. Por favor ajusta tu pedido.`);
        showToast(`⚠️ Stock agotado o insuficiente para "${item.nombre}"`, "error");
        document.getElementById('modal-payment-auth').style.display = 'none';
        document.getElementById('cart-drawer-modal').style.display = 'flex';
        updateCartUI();
        return;
      }
    }

    const method = document.getElementById('pay-input-method').value;
    const bank = document.getElementById('pay-input-bank').value.trim();
    const ref = document.getElementById('pay-input-ref').value.trim();
    const holder = document.getElementById('pay-input-holder').value.trim();

    // Validación algorítmica de referencia bancaria o hash
    if (method !== 'Efectivo $' && (!ref || ref.length < 4 || /^(0+|1234+|9999+)$/.test(ref))) {
      alert("❌ Por favor ingresa un número de referencia válido (mínimo 4 dígitos del comprobante o Pay ID).");
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

    // Descontar inventario de insumos vendidos
    if (completedOrder.items && Array.isArray(completedOrder.items)) {
      completedOrder.items.forEach(it => {
        const p = state.products.find(prod => prod.id === it.id);
        if (p) {
          p.stockActual = Math.max(0, (p.stockActual || 0) - it.quantity);
        }
      });
      renderProducts();
    }

    state.cart = [];
    saveData();
    updateCartUI();

    // Sincronizar en segundo plano con Google Sheets permanente
    syncOrderToSheets(completedOrder);

    // Cerrar modal de pago y abrir Mini Nota de Entrega boutique
    document.getElementById('modal-payment-auth').style.display = 'none';
    renderDeliveryNote(completedOrder);
    showToast("✅ ¡Pago autenticado y registrado con éxito!", "success");
  }

  // ============================================================================
  // MINI NOTA DE ENTREGA DIGITAL (TICKET CLIENTE BOUTIQUE GLAMOUR)
  // ============================================================================
  function renderDeliveryNote(order) {
    if (!order) return;
    const rate = Number(order.rateBCV || state.config.rateBCV || 887.30);
    const totalBs = Number(order.totalBs || (order.totalUSD * rate));

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setTxt('ticket-id', order.id || '#NE-2026-0001');
    setTxt('ticket-date', order.date || new Date().toLocaleString('es-VE'));
    setTxt('ticket-auth-code', order.authCode || 'AUTH-YOLO-000000');
    
    let delTypeDesc = order.deliveryType || 'Delivery Maracaibo';
    if (delTypeDesc === 'delivery-maracaibo') delTypeDesc = '🛵 Delivery a Domicilio (Maracaibo)';
    if (delTypeDesc === 'retiro-personal') delTypeDesc = '🛍️ Retiro en Tienda Física';
    if (delTypeDesc === 'envio-nacional') delTypeDesc = '📦 Envío Nacional (MRW/Tealca/Zoom)';
    setTxt('ticket-delivery-type', delTypeDesc);

    setTxt('ticket-client-name', order.clientName || 'Cliente');
    setTxt('ticket-client-phone', order.clientPhone || '-');
    setTxt('ticket-client-salon', order.clientSalon || 'Particular');

    let addrText = order.clientAddress || 'Maracaibo, Zulia';
    if (order.deliveryKm) {
      addrText += ` • [GPS: ${order.deliveryKm} km desde Tiendas Yolo]`;
    }
    setTxt('ticket-client-address', addrText);

    // Tabla de items
    const tbody = document.getElementById('ticket-items-tbody');
    if (tbody) {
      tbody.innerHTML = (order.items || []).map(item => {
        const itemTot = Number(item.precioUSD) * item.quantity;
        return `
          <tr>
            <td>${item.quantity}</td>
            <td><strong>${item.nombre}</strong></td>
            <td>$${Number(item.precioUSD).toFixed(2)}</td>
            <td><strong>$${itemTot.toFixed(2)}</strong></td>
          </tr>
        `;
      }).join('');
    }

    setTxt('ticket-subtotal-usd', `$${Number(order.subtotalUSD || 0).toFixed(2)}`);

    const delEl = document.getElementById('ticket-delivery-usd');
    if (delEl) {
      if (order.deliveryType === 'retiro-personal') {
        delEl.textContent = "Retiro Personal (Sin Costo)";
        delEl.className = "font-bold";
      } else if (order.deliveryType === 'envio-nacional') {
        delEl.textContent = "Cobro a Destino (Nacional)";
        delEl.className = "font-bold";
      } else {
        delEl.textContent = `$${Number(order.deliveryUSD || 0).toFixed(2)}${order.deliveryKm ? ` (${order.deliveryKm} km)` : ''}`;
        delEl.className = "font-bold";
      }
    }

    setTxt('ticket-total-usd', `$${Number(order.totalUSD || 0).toFixed(2)}`);
    setTxt('ticket-total-bs', `(Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`);

    setTxt('ticket-pay-method', order.paymentMethod || 'Pago Móvil');
    setTxt('ticket-pay-bank', order.paymentBank || 'Banesco');
    setTxt('ticket-pay-ref', order.paymentRef || order.authCode || '-');
    setTxt('ticket-pay-holder', order.paymentHolder || order.clientName || '-');

    // Botón Imprimir Ticket (imprime limpiamente solo el ticket boutique)
    const printBtn = document.getElementById('btn-print-delivery-note');
    if (printBtn) {
      printBtn.onclick = () => {
        document.body.classList.add('printing-delivery-note');
        window.print();
        setTimeout(() => document.body.classList.remove('printing-delivery-note'), 600);
      };
    }

    // Botón Enviar a WhatsApp Despacho
    const waBtn = document.getElementById('btn-wa-delivery-note');
    if (waBtn) {
      waBtn.onclick = () => {
        const delText = order.deliveryType === 'retiro-personal' 
          ? 'Retiro Personal (Sin Costo)' 
          : (order.deliveryType === 'envio-nacional' 
            ? 'Envío Nacional (Cobro a Destino)' 
            : `$${Number(order.deliveryUSD || 0).toFixed(2)}${order.deliveryKm ? ` (${order.deliveryKm} km)` : ''}`);

        const text =
          `🧾 *TIENDAS YOLO® — NOTA DE ENTREGA REGISTRADA*\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `🔖 *Nota:* ${order.id}\n` +
          `🔐 *Código Autenticación:* ${order.authCode}\n` +
          `📅 *Fecha:* ${order.date}\n` +
          `👤 *Manicurista:* ${order.clientName}\n` +
          `📱 *Teléfono:* ${order.clientPhone}\n` +
          `📍 *Dirección:* ${addrText}\n` +
          `${order.deliveryCoords ? `🗺️ *GPS:* https://maps.google.com/?q=${order.deliveryCoords.replace(/\s+/g, '')}\n` : ''}` +
          `💳 *Pago:* ${order.paymentMethod} (Ref: ${order.paymentRef || 'S/R'})\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 *Insumos:*\n${(order.items || []).map(i => `• ${i.quantity}x ${i.nombre} ($${(i.precioUSD * i.quantity).toFixed(2)})`).join('\n')}\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `🚚 *Delivery:* ${delText}\n` +
          `💎 *TOTAL PAGADO:* $${Number(order.totalUSD).toFixed(2)} (Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `✨ _“Yo lo compro, Yo lo merezco”_`;

        window.open(`https://wa.me/584146553430?text=${encodeURIComponent(text)}`, '_blank');
      };
    }

    const modal = document.getElementById('modal-delivery-note');
    if (modal) modal.style.display = 'flex';
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
    } catch (e) { }
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
    } catch (e) { }
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
      showToast("🛍️ Tu pedido está vacío. Agrega al carrito los insumos que deseas cotizar antes de generar el presupuesto.", "info");
      const grid = document.getElementById('products-grid-container');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const subtotalUSD = items.reduce((sum, item) => sum + (Number(item.precioUSD) * item.quantity), 0);
    const rate = Number(state.config.rateBCV || 887.30);
    const subtotalBs = subtotalUSD * rate;
    const deliveryUSD = state.deliveryDistanceKm ? getDeliveryFeeByKm(state.deliveryDistanceKm) : 2.50;
    const grandUSD = subtotalUSD + deliveryUSD;
    const grandBs = grandUSD * rate;

    const cNameEl = document.getElementById('cart-client-name');
    const cPhoneEl = document.getElementById('cart-client-phone');
    const cSalonEl = document.getElementById('cart-client-salon');
    const cAddrEl = document.getElementById('cart-delivery-address');

    const clientName = (state.clientProfile && state.clientProfile.name) || (cNameEl ? cNameEl.value.trim() : '') || 'Manicurista / Salón Solicitante';
    const clientPhone = (state.clientProfile && state.clientProfile.phone) || (cPhoneEl ? cPhoneEl.value.trim() : '') || '0414-6553430';
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
    document.getElementById('print-quote-delivery-status').textContent = `$${deliveryUSD.toFixed(2)} (${state.deliveryDistanceKm || 'Est.'} km - Cobro por recorrido)`;
    document.getElementById('print-quote-grand-usd').textContent = `$${grandUSD.toFixed(2)}`;
    document.getElementById('print-quote-grand-bs').textContent = `Bs. ${grandBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const quoteObj = {
      id: quoteId,
      date: today,
      fecha: today,
      clientName,
      cliente: clientName,
      clientPhone,
      telefono: clientPhone,
      clientSalon,
      salon: clientSalon,
      clientAddress,
      direccion: clientAddress,
      items,
      subtotalUSD,
      deliveryUSD,
      totalUSD: grandUSD,
      totalBs: grandBs,
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

      const profGps = document.getElementById('prof-display-gps');
      if (profGps) {
        if (state.clientProfile.gpsCoords) {
          profGps.textContent = `📍 GPS Guardado: ${state.clientProfile.gpsCoords}`;
          profGps.style.display = 'block';
        } else {
          profGps.textContent = '📍 GPS Guardado: Sin fijar';
        }
      }

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
      if (state.clientProfile) {
        if (document.getElementById('acc-input-name')) document.getElementById('acc-input-name').value = state.clientProfile.name || '';
        if (document.getElementById('acc-input-phone')) document.getElementById('acc-input-phone').value = state.clientProfile.phone || '';
        if (document.getElementById('acc-input-doc')) document.getElementById('acc-input-doc').value = state.clientProfile.doc || '';
        if (document.getElementById('acc-input-salon')) document.getElementById('acc-input-salon').value = state.clientProfile.salon || '';
        if (document.getElementById('acc-input-instagram')) document.getElementById('acc-input-instagram').value = state.clientProfile.instagram || '';
        if (document.getElementById('acc-input-address')) document.getElementById('acc-input-address').value = state.clientProfile.address || '';
        if (document.getElementById('acc-input-gps')) document.getElementById('acc-input-gps').value = state.clientProfile.gpsCoords || '';
        const statusGps = document.getElementById('acc-gps-status');
        if (statusGps) statusGps.textContent = state.clientProfile.gpsCoords ? "✅ Fijado" : "Sin fijar";
      }
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
    const gpsCoords = document.getElementById('acc-input-gps') ? document.getElementById('acc-input-gps').value.trim() : '';

    state.clientProfile = {
      name, phone, doc, salon, instagram, address, gpsCoords,
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
    if (document.getElementById('cart-client-delivery-address')) {
      document.getElementById('cart-client-delivery-address').value = state.clientProfile.address || '';
    }
    document.getElementById('cart-delivery-address').value = state.clientProfile.address || '';
    if (state.clientProfile.gpsCoords) {
      const coordsInput = document.getElementById('cart-delivery-coords');
      if (coordsInput) {
        coordsInput.value = state.clientProfile.gpsCoords;
        if (typeof updateDeliveryDistanceCalc === 'function') {
          updateDeliveryDistanceCalc();
        }
      }
    }
    showToast("✨ Datos y GPS autocompletados desde tu perfil", "success");
  }

  // ============================================================================
  // MODO EDITOR EN VIVO (WYSIWYG & GESTOR DE PRODUCTOS/FOTOS)
  // ============================================================================
  // Lista de selectores editables en modo edición
  const EDITABLE_SELECTORS = [
    '[data-editable="true"]',
    '.hero-headline',
    '.hero-description',
    '.quote-text',
    '.quote-author',
    '.catalog-section-title',
    '.footer-title',
    '.footer-desc',
    '.social-hub-btn .hub-title',
    '.social-hub-btn .hub-sub',
    '.product-title',
    '.product-desc',
    '.price-usd'
  ].join(', ');

  function toggleLiveEditMode() {
    state.isEditMode = !state.isEditMode;
    const body = document.body;
    const textEl = document.getElementById('editor-btn-text');
    const toggleBtn = document.getElementById('btn-toggle-editor');

    if (state.isEditMode) {
      body.classList.add('editor-mode-active');
      if (toggleBtn) toggleBtn.classList.add('active');
      if (textEl) textEl.textContent = 'Edición: ON';
      
      document.querySelectorAll(EDITABLE_SELECTORS).forEach((el, index) => {
        el.contentEditable = "true";
        if (!el.id && !el.closest('.product-card')) {
          el.id = `ty-auto-edit-${index}`;
        }
        el.setAttribute('data-editable', 'true');
      });

      renderProducts();
      showToast("✏️ Modo Edición: ON. Haz clic en cualquier texto o producto para editar o eliminar.", "success");
    } else {
      body.classList.remove('editor-mode-active');
      if (toggleBtn) toggleBtn.classList.remove('active');
      if (textEl) textEl.textContent = 'Edición: OFF';

      document.querySelectorAll(EDITABLE_SELECTORS).forEach(el => {
        el.contentEditable = "false";
      });

      renderProducts();
      showToast("👁️ Modo Edición: OFF. Vista cliente activada.", "info");
    }
  }

  function saveEditsToStorage() {
    const edits = {};
    document.querySelectorAll('[data-editable="true"]').forEach(el => {
      if (el.id && !el.closest('.product-card')) {
        edits[el.id] = el.innerHTML;
      }
    });

    // Guardar cambios directos de productos editados en vivo en tarjetas
    document.querySelectorAll('.product-card').forEach(card => {
      const prodId = card.dataset.productId;
      const prod = state.products.find(p => p.id === prodId);
      if (prod) {
        const titleEl = card.querySelector('.product-title');
        const descEl = card.querySelector('.product-desc');
        const priceEl = card.querySelector('.price-usd');
        if (titleEl && titleEl.textContent.trim()) {
          prod.nombre = titleEl.textContent.trim();
        }
        if (descEl) {
          prod.descripcion = descEl.textContent.trim();
        }
        if (priceEl) {
          const parsed = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed) && parsed > 0) {
            prod.precioUSD = parsed;
          }
        }
      }
    });

    localStorage.setItem(EDITS_STORAGE_KEY, JSON.stringify(edits));
    saveData();
    renderCategories();
    renderProducts();
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
    } catch (e) { }
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

  function compressAndReadImage(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round(height * (MAX_DIM / width));
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round(width * (MAX_DIM / height));
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        callback(dataUrl);
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }

  function quickChangePhoto(prodId) {
    const prod = state.products.find(p => p.id === prodId);
    if (!prod) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        compressAndReadImage(file, (dataUrl) => {
          prod.imagenURL = dataUrl;
          saveData();
          renderProducts();
          showToast(`📸 ¡Foto de "${prod.nombre}" actualizada con éxito!`, "success");
          if (fileInput.parentNode) document.body.removeChild(fileInput);
        });
      } else {
        if (fileInput.parentNode) document.body.removeChild(fileInput);
      }
    };
    fileInput.click();
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
        if (state.isEditMode) {
          e.preventDefault();
        }
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

    // Limpiar notificaciones previas para evitar apilamiento molesto
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
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
        const isDark = document.body.classList.toggle('theme-dark');
        document.documentElement.classList.toggle('theme-dark', isDark);
        localStorage.setItem('TY_THEME', isDark ? 'dark' : 'light');
        showToast(isDark ? "🌙 Modo Oscuro Activado" : "☀️ Modo Claro Activado", "info");
      });
    }
    if (localStorage.getItem('TY_THEME') === 'dark') {
      document.body.classList.add('theme-dark');
      document.documentElement.classList.add('theme-dark');
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

    // Copiar datos de Pago Móvil y Binance Pay
    const copyPmBtn = document.getElementById('btn-copy-pm');
    if (copyPmBtn) {
      copyPmBtn.addEventListener('click', () => {
        const text = `Pago Móvil Banesco (0134)\nTeléfono: 0414-6553430\nCédula: V-28123456\nMonto: ${document.getElementById('copy-pm-bs').textContent}`;
        navigator.clipboard.writeText(text).then(() => {
          showToast("📋 ¡Datos de Pago Móvil copiados!", "success");
        });
      });
    }

    const copyBinanceBtn = document.getElementById('btn-copy-binance');
    if (copyBinanceBtn) {
      copyBinanceBtn.addEventListener('click', () => {
        navigator.clipboard.writeText("829140291").then(() => {
          showToast("🟡 Pay ID de Binance copiado: 829140291 (USDT)", "success");
        });
      });
    }

    // 8. Widget Delivery por Coordenadas / GPS (Estilo Yummy)
    const btnDetectGps = document.getElementById('btn-detect-gps');
    const inputCoords = document.getElementById('cart-delivery-coords');
    const badgeGpsText = document.getElementById('delivery-calc-text');
    const delTypeSelect = document.getElementById('cart-delivery-type');

    function updateDeliveryDistanceCalc() {
      const delType = delTypeSelect ? delTypeSelect.value : 'delivery-maracaibo';
      const gpsBox = document.getElementById('cart-gps-box');
      if (gpsBox) {
        gpsBox.style.display = (delType === 'delivery-maracaibo') ? 'block' : 'none';
      }

      if (delType !== 'delivery-maracaibo') {
        state.deliveryDistanceKm = null;
        updateCartUI();
        return;
      }

      const val = inputCoords ? inputCoords.value.trim() : '';
      const coords = parseCoordinatesString(val);
      const subtotalUSD = state.cart.reduce((s, i) => s + (i.precioUSD * i.quantity), 0);

      if (coords) {
        state.deliveryCoords = `${coords.lat}, ${coords.lng}`;
        const km = calculateDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, coords.lat, coords.lng);
        const fee = getDeliveryFeeByKm(km);
        const rate = Number(state.config.rateBCV || 887.30);
        const feeBs = fee * rate;

        if (badgeGpsText) {
          badgeGpsText.innerHTML = `🛵 <strong>${km} km</strong> desde Urb. El Trébol — Delivery: <strong>$${fee.toFixed(2)}</strong> (Bs. ${feeBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
        }
      } else {
        state.deliveryDistanceKm = null;
        if (badgeGpsText) {
          badgeGpsText.innerHTML = `📍 Ingresa coordenadas o presiona "Usar mi ubicación actual"`;
        }
      }
      updateCartUI();
    }

    if (delTypeSelect) {
      delTypeSelect.addEventListener('change', updateDeliveryDistanceCalc);
    }

    if (inputCoords) {
      inputCoords.addEventListener('input', updateDeliveryDistanceCalc);
    }

    if (btnDetectGps) {
      btnDetectGps.addEventListener('click', () => {
        if (!navigator.geolocation) {
          alert("Tu navegador no soporta geolocalización. Puedes pegar tus coordenadas o link de Maps.");
          return;
        }
        if (badgeGpsText) badgeGpsText.innerHTML = "📡 Conectando con satélite GPS...";
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            if (inputCoords) inputCoords.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            updateDeliveryDistanceCalc();
            showToast(`📍 Ubicación GPS detectada (${state.deliveryDistanceKm} km)`, "success");
          },
          (err) => {
            console.warn("GPS error:", err);
            if (badgeGpsText) badgeGpsText.innerHTML = "⚠️ No pudimos obtener GPS satelital. Pega tu link de Google Maps.";
            showToast("Pega tu enlace de Google Maps o coordenadas.", "info");
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      });
    }

    // 9. Enviar pedido regular a WhatsApp
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
        const coords = document.getElementById('cart-delivery-coords') ? document.getElementById('cart-delivery-coords').value.trim() : '';

        const subtotal = state.cart.reduce((s, i) => s + (i.precioUSD * i.quantity), 0);
        const rate = Number(state.config.rateBCV || 887.30);
        
        let deliveryFee = 0;
        let deliveryLabel = '';
        if (delType === 'retiro-personal') {
          deliveryFee = 0;
          deliveryLabel = 'Retiro Personal (Sin Costo)';
        } else if (delType === 'envio-nacional') {
          deliveryFee = 0;
          deliveryLabel = 'Envío Nacional (Cobro en Destino MRW/Tealca/Zoom)';
        } else {
          deliveryFee = getDeliveryFeeByKm(state.deliveryDistanceKm);
          deliveryLabel = `$${deliveryFee.toFixed(2)} ($0.50/km desde Urb. El Trébol)`;
        }

        const grandTotal = subtotal + deliveryFee;
        const grandTotalBs = grandTotal * rate;

        const text =
          `💅 *TIENDAS YOLO® — NUEVO PEDIDO DE INSUMOS* 💅
━━━━━━━━━━━━━━━━━━━━
👤 *Manicurista:* ${name}
📞 *Teléfono:* ${phone}
${salon ? `💅 *Salón:* ${salon}\n` : ''}📍 *Entrega:* ${address} (${delType})
${state.deliveryDistanceKm ? `🛵 *Distancia GPS:* ${state.deliveryDistanceKm} km desde Urb. El Trébol\n` : ''}${coords ? `🗺️ *Ubicación Maps:* https://maps.google.com/?q=${coords.replace(/\s+/g, '')}\n` : ''}💳 *Método de Pago:* ${method}
━━━━━━━━━━━━━━━━━━━━
📦 *INSUMOS SOLICITADOS:*
${state.cart.map(i => `• ${i.quantity}x ${i.nombre} ($${(i.precioUSD * i.quantity).toFixed(2)})`).join('\n')}
━━━━━━━━━━━━━━━━━━━━
💵 *Subtotal:* $${subtotal.toFixed(2)}
🚚 *Delivery:* ${deliveryLabel}
💎 *TOTAL A PAGAR:* $${grandTotal.toFixed(2)} (Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
${notes ? `📝 *Detalles:* ${notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
✨ _“Yo lo compro, Yo lo merezco”_`;

        window.open(`https://wa.me/584146553430?text=${encodeURIComponent(text)}`, '_blank');
      });
    }

    // 10. Impresión & Envío de Cotización Formal
    const printQuoteBtn = document.getElementById('btn-print-quote');
    if (printQuoteBtn) printQuoteBtn.addEventListener('click', () => window.print());

    const quoteWaBtn = document.getElementById('btn-quote-send-wa');
    if (quoteWaBtn) {
      quoteWaBtn.addEventListener('click', () => {
        const id = document.getElementById('print-quote-id').textContent;
        const client = document.getElementById('print-client-name').textContent;
        const total = document.getElementById('print-quote-grand-usd').textContent;
        const totalBs = document.getElementById('print-quote-grand-bs').textContent;
        const text = `💅 *TIENDAS YOLO® — COTIZACIÓN FORMAL*\n📄 *ID:* ${id}\n👤 *Para:* ${client}\n💎 *TOTAL:* ${total} (${totalBs})\n_Validez: 7 días continuos. Delivery en Maracaibo calculado por kilometraje GPS ($0.50/km desde Urb. El Trébol)._`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      });
    }

    // 11. Impresión de Mini Nota de Entrega (Aislada en 1 sola página térmica)
    const printTicketBtn = document.getElementById('btn-print-delivery-note');
    if (printTicketBtn) {
      printTicketBtn.addEventListener('click', () => {
        document.body.classList.add('printing-delivery-note');
        window.print();
        setTimeout(() => document.body.classList.remove('printing-delivery-note'), 600);
      });
    }

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
          if (document.getElementById('acc-input-gps')) {
            document.getElementById('acc-input-gps').value = state.clientProfile.gpsCoords || '';
          }
          const statusGps = document.getElementById('acc-gps-status');
          if (statusGps) statusGps.textContent = state.clientProfile.gpsCoords ? "✅ Fijado" : "Sin fijar";
        }
      });
    }

    const btnAccDetectGps = document.getElementById('btn-acc-detect-gps');
    if (btnAccDetectGps) {
      btnAccDetectGps.addEventListener('click', () => {
        if (!navigator.geolocation) {
          showToast("Tu navegador no soporta geolocalización directa.", "warning");
          return;
        }
        btnAccDetectGps.textContent = "📡 Localizando...";
        navigator.geolocation.getCurrentPosition(
          pos => {
            const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
            const inputGps = document.getElementById('acc-input-gps');
            if (inputGps) inputGps.value = coords;
            const statusGps = document.getElementById('acc-gps-status');
            if (statusGps) statusGps.textContent = "✅ Fijado";
            btnAccDetectGps.textContent = "📡 Fijar GPS Actual";
            showToast("📍 Ubicación GPS guardada con éxito", "success");
          },
          err => {
            btnAccDetectGps.textContent = "📡 Fijar GPS Actual";
            showToast("No se pudo obtener GPS automáticamente. Puedes pegar tus coordenadas o link de Maps.", "warning");
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
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

    const peFileInput = document.getElementById('pe-file-upload-input');
    if (peFileInput) {
      peFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          compressAndReadImage(file, (dataUrl) => {
            const inputImg = document.getElementById('pe-input-img');
            const previewImg = document.getElementById('pe-img-preview');
            if (inputImg) inputImg.value = dataUrl;
            if (previewImg) previewImg.src = dataUrl;
            showToast("📸 Foto cargada y optimizada", "info");
          });
        }
      });
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

    // =========================================================================
    // 15. CALCULADORA DE DELIVERY GPS & BOTONES DE COTIZACIÓN
    // =========================================================================
    const btnHeroGps = document.getElementById('btn-hero-calc-gps');
    if (btnHeroGps) btnHeroGps.addEventListener('click', openGpsCalculatorModal);

    const btnHubGps = document.getElementById('btn-open-gps-delivery-hub');
    if (btnHubGps) btnHubGps.addEventListener('click', openGpsCalculatorModal);

    const btnTriggerGps = document.getElementById('btn-trigger-gps-detect');
    if (btnTriggerGps) btnTriggerGps.addEventListener('click', detectUserDeviceGps);

    const selectZone = document.getElementById('select-maracaibo-zone');
    if (selectZone) {
      selectZone.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        if (opt && opt.value) {
          const parts = opt.value.split(',');
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);
          const km = parseFloat(opt.dataset.km || calculateDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng));
          state.deliveryCoords = `${lat}, ${lng}`;
          updateGpsCalculationDisplay(km, opt.dataset.name || opt.text);
        }
      });
    }

    const inputCustomGps = document.getElementById('input-custom-gps-link');
    if (inputCustomGps) {
      inputCustomGps.addEventListener('input', (e) => {
        const parsed = parseCoordinatesString(e.target.value);
        if (parsed) {
          const km = calculateDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, parsed.lat, parsed.lng);
          state.deliveryCoords = `${parsed.lat}, ${parsed.lng}`;
          updateGpsCalculationDisplay(km, `Coordenadas: ${parsed.lat.toFixed(4)}, ${parsed.lng.toFixed(4)}`);
        }
      });
    }

    const btnApplyGps = document.getElementById('btn-apply-gps-to-cart');
    if (btnApplyGps) btnApplyGps.addEventListener('click', applyGpsLocationToCart);

    // Botones de Cotización Formal
    const btnHeroQuote = document.getElementById('btn-hero-quote-generator');
    if (btnHeroQuote) btnHeroQuote.addEventListener('click', generateFormalQuote);

    const btnHeroKits = document.getElementById('btn-hero-explore-kits');
    if (btnHeroKits) {
      btnHeroKits.addEventListener('click', () => {
        state.activeCategory = 'Kits';
        renderCategories();
        renderProducts();
        const grid = document.getElementById('products-grid-container');
        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Copiar datos de pago con un clic
    const btnCopyPm = document.getElementById('btn-copy-pm');
    if (btnCopyPm) {
      btnCopyPm.addEventListener('click', () => {
        const phone = document.getElementById('copy-pm-phone') ? document.getElementById('copy-pm-phone').textContent : '04146553430';
        const id = document.getElementById('copy-pm-id') ? document.getElementById('copy-pm-id').textContent : 'V-28123456';
        const bs = document.getElementById('copy-pm-bs') ? document.getElementById('copy-pm-bs').textContent : '';
        const copyText = `Pago Móvil Tiendas Yolo:\nBanco: Banesco (0134)\nTeléfono: ${phone}\nCédula: ${id}\nMonto: ${bs}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(copyText).then(() => {
            showToast("📋 ¡Datos de Pago Móvil copiados!", "success");
          });
        }
      });
    }

    const btnCopyBinance = document.getElementById('btn-copy-binance');
    if (btnCopyBinance) {
      btnCopyBinance.addEventListener('click', () => {
        const binanceId = document.getElementById('copy-binance-id') ? document.getElementById('copy-binance-id').textContent : '829140291';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(binanceId).then(() => {
            showToast("📋 ¡Binance Pay ID copiado!", "success");
          });
        }
      });
    }

    // 16. InsuShop Nav Tabs (Catálogo / Sobre Nosotros)
    const tabCatalog = document.getElementById('tab-nav-catalog');
    const tabAbout = document.getElementById('tab-nav-about');
    const aboutSection = document.getElementById('section-sobre-nosotros');
    const catalogHeader = document.querySelector('.catalog-header-row');

    if (tabCatalog) {
      tabCatalog.addEventListener('click', () => {
        if (tabAbout) tabAbout.classList.remove('active');
        tabCatalog.classList.add('active');
        if (catalogHeader) {
          catalogHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    if (tabAbout) {
      tabAbout.addEventListener('click', () => {
        if (tabCatalog) tabCatalog.classList.remove('active');
        tabAbout.classList.add('active');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // 17. Acordeón de Preguntas Frecuentes (FAQ InsuShop Style)
    document.querySelectorAll('.faq-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.faq-accordion-item');
        if (item) {
          const isOpen = item.classList.contains('open');
          document.querySelectorAll('.faq-accordion-item').forEach(it => it.classList.remove('open'));
          if (!isOpen) {
            item.classList.add('open');
          }
        }
      });
    });

    // 18. Iniciar Atajos y Seguridad
    initAdminSecurityAndShortcuts();
  }

  function openLearningGuideModal() {
    const modal = document.getElementById('modal-learning-guide');
    if (modal) modal.style.display = 'flex';
  }

  // ============================================================================
  // CALCULADORA DE DELIVERY GPS MARACAIBO (MODAL INTERACTIVO)
  // ============================================================================
  function openGpsCalculatorModal() {
    const modal = document.getElementById('modal-gps-calculator');
    if (!modal) return;

    if (state.deliveryDistanceKm) {
      updateGpsCalculationDisplay(state.deliveryDistanceKm, state.deliveryCoords ? `Coordenadas: ${state.deliveryCoords}` : 'Ubicación seleccionada');
    } else {
      updateGpsCalculationDisplay(2.5, '5 de Julio / Cecilio Acosta');
    }

    modal.style.display = 'flex';
  }

  function updateGpsCalculationDisplay(km, zoneName = 'Ubicación seleccionada') {
    state.deliveryDistanceKm = parseFloat(km.toFixed(1));
    const feeUSD = getDeliveryFeeByKm(km);
    const rate = Number(state.config.rateBCV || 887.30);
    const feeBs = feeUSD * rate;

    const lblZone = document.getElementById('gps-zone-label');
    const lblFree = document.getElementById('gps-free-badge');
    const lblDist = document.getElementById('gps-dist-km');
    const lblCostUSD = document.getElementById('gps-cost-usd');
    const lblCostBs = document.getElementById('gps-cost-bs');
    const lblTime = document.getElementById('gps-time-estimate');

    if (lblZone) lblZone.textContent = `📍 Ubicación: ${zoneName}`;
    if (lblDist) lblDist.textContent = `${km.toFixed(1)} km`;

    if (lblCostUSD) {
      lblCostUSD.textContent = `$${feeUSD.toFixed(2)}`;
      lblCostUSD.style.color = "var(--ty-primary)";
    }
    if (lblCostBs) {
      lblCostBs.textContent = `Bs. ${feeBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (lblFree) {
      lblFree.textContent = "Tarifa oficial: $0.50/km desde Urb. El Trébol (Mín. $1.00)";
      lblFree.style.color = "var(--text-muted)";
    }
    if (lblTime) {
      const minMin = Math.round(15 + (km * 2.5));
      const maxMin = Math.round(minMin + 15);
      lblTime.textContent = `⏱️ Tiempo estimado de entrega: ${minMin} - ${maxMin} min`;
    }
  }

  function detectUserDeviceGps() {
    const btn = document.getElementById('btn-trigger-gps-detect');
    if (!navigator.geolocation) {
      showToast("Tu navegador no soporta GPS directo. Por favor selecciona tu zona en el menú.", "error");
      return;
    }

    if (btn) {
      btn.innerHTML = "🛰️ Buscando satélites GPS...";
      btn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        state.deliveryCoords = `${userLat.toFixed(5)}, ${userLng.toFixed(5)}`;
        const km = calculateDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, userLat, userLng);
        updateGpsCalculationDisplay(km, "Mi Ubicación GPS Actual");

        const customInput = document.getElementById('input-custom-gps-link');
        if (customInput) customInput.value = `${userLat.toFixed(5)}, ${userLng.toFixed(5)}`;

        if (btn) {
          btn.innerHTML = "✅ Ubicación GPS Detectada";
          btn.disabled = false;
        }
        showToast(`📍 GPS detectado: ${km.toFixed(1)} km desde Tiendas Yolo`, "success");
      },
      (err) => {
        if (btn) {
          btn.innerHTML = "🛰️ Detectar mi Ubicación GPS Actual";
          btn.disabled = false;
        }
        console.warn("GPS error:", err.message);
        showToast("No se pudo obtener GPS satelital. Selecciona tu zona en el menú desplegable.", "info");
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  }

  function applyGpsLocationToCart() {
    if (!state.deliveryDistanceKm) {
      state.deliveryDistanceKm = 2.5;
    }
    const zoneSelect = document.getElementById('select-maracaibo-zone');
    let zoneTitle = 'Maracaibo';
    if (zoneSelect && zoneSelect.selectedOptions[0] && zoneSelect.value) {
      zoneTitle = zoneSelect.selectedOptions[0].dataset.name || zoneSelect.selectedOptions[0].text;
    }
    const dirInput = document.getElementById('cart-delivery-address');
    if (dirInput) {
      dirInput.value = `${zoneTitle} (GPS: ${state.deliveryDistanceKm} km)`;
    }
    const coordsInput = document.getElementById('cart-delivery-coords');
    if (coordsInput && state.deliveryCoords) {
      coordsInput.value = state.deliveryCoords;
    }

    updateCartUI();
    const modal = document.getElementById('modal-gps-calculator');
    if (modal) modal.style.display = 'none';
    showToast(`✅ Ubicación (${state.deliveryDistanceKm} km) aplicada al pedido.`, "success");
  }

  // Cargar personalización de banners y anuncios oficiales desde el Administrador
  function loadBannerSettings() {
    try {
      const bSettings = JSON.parse(localStorage.getItem('ty_banner_settings') || '{}');
      if (bSettings.heroTitle) {
        const el = document.getElementById('txt-hero-title');
        if (el) el.textContent = bSettings.heroTitle;
      }
      if (bSettings.heroDesc) {
        const el = document.getElementById('txt-hero-desc');
        if (el) el.textContent = bSettings.heroDesc;
      }
      if (bSettings.heroQuote) {
        const el = document.getElementById('txt-hero-quote');
        if (el) el.textContent = bSettings.heroQuote;
      }
      if (bSettings.topAnnouncement) {
        const el = document.getElementById('top-delivery-badge');
        if (el) el.textContent = bSettings.topAnnouncement;
      }
    } catch(e) {}
  }

  // Verificador de forzado de actualización y limpieza de caché PWA
  function checkForForcedCacheUpdate() {
    const forcedVer = localStorage.getItem('ty_system_version');
    const localVer = sessionStorage.getItem('ty_system_version_loaded');
    if (forcedVer && localVer && forcedVer !== localVer) {
      sessionStorage.setItem('ty_system_version_loaded', forcedVer);
      if ('caches' in window) {
        caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => {
          window.location.reload(true);
        });
      }
    } else if (forcedVer) {
      sessionStorage.setItem('ty_system_version_loaded', forcedVer);
    }
  }

  // ============================================================================
  // EXPOSICIÓN GLOBAL PARA BOTONES EN EL DOM
  // ============================================================================
  window.YoloApp = {
    selectProductColor: function(prodId, colorIdx, e) {
      if (e) e.stopPropagation();
      state.selectedColors[prodId] = colorIdx;
      renderProducts();
    },
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
    openGpsCalculatorModal,
    generateFormalQuote,
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
    viewPastTicket: function (orderId) {
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
    renderColorFilterBar();
    renderProducts();
    updateCartUI();
    setupEventListeners();
    loadBannerSettings();
    loadEditsFromStorage();
    checkForForcedCacheUpdate();
    initPwaSupport();
    console.log("🌸 Tiendas Yolo® Tienda PWA Iniciada con Éxito.");
  });

})();
