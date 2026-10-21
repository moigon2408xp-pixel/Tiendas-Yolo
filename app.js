/**
 * ============================================================================
 * TIENDAS YOLO® — LÓGICA & CONTROLADOR INTERACTIVO (FRONTEND & SYNC)
 * Insumos para uñas y manicuristas | Maracaibo, Venezuela
 * ============================================================================
 */

(function () {
  'use strict';

  // LLAVE DE ALMACENAMIENTO LOCAL INDEPENDIENTE
  const STORAGE_KEY = 'TIENDAS_YOLO_DATA_V1';

  // ============================================================================
  // CATÁLOGO SEMILLA INICIAL (PRODUCTOS REALES DE TIENDAS YOLO)
  // ============================================================================
  const SEED_PRODUCTS = [
    {
      id: "TY-PROD-001",
      sku: "MY-CG-01",
      nombre: "Esmalte M&Y Color Gel (Colección)",
      categoria: "Esmaltes y Geles",
      descripcion: "Esmalte semipermanente de alta pigmentación, cobertura en una capa y secado UV/LED rápido.",
      precioUSD: 3.50,
      costoUSD: 1.80,
      stockActual: 48,
      stockMinimo: 10,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
    },
    {
      id: "TY-PROD-003",
      sku: "TY-TC-01",
      nombre: "Top Coat No Wipe Ultra Brillo 15ml",
      categoria: "Esmaltes y Geles",
      descripcion: "Sellador final sin capa de inhibición. Brillo espejo intacto hasta por 28 días sin amarillear.",
      precioUSD: 4.00,
      costoUSD: 2.00,
      stockActual: 40,
      stockMinimo: 10,
      unidad: "Unidad",
      destacado: "SI",
      activo: "SI",
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
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
      imagenURL: "assets/logo-yolo.png"
    }
  ];

  // PEDIDOS SEMILLA INICIALES (DEMOSTRATIVOS PARA EL SISTEMA)
  const SEED_ORDERS = [
    {
      id: "TY-PED-0001",
      fecha: "2026-10-20 10:30",
      cliente: "Mariana Albornoz",
      telefono: "0414-6123456",
      instagram: "@mariana_nails_mcbo",
      direccion: "Sector La Lago, Calle 72 con Av. 3C",
      tipoEntrega: "Delivery Maracaibo",
      metodoPago: "Pago Móvil",
      referenciaPago: "Ref #782341",
      items: [
        { id: "TY-PROD-001", nombre: "Esmalte M&Y Color Gel", qty: 2, precio: 3.50 },
        { id: "TY-PROD-002", nombre: "Base Rubber Tiendas Yolo", qty: 1, precio: 4.50 },
        { id: "TY-PROD-003", nombre: "Top Coat No Wipe", qty: 1, precio: 4.00 }
      ],
      subtotalUSD: 15.50,
      tasaBs: 395.50,
      totalUSD: 15.50,
      totalBs: 6130.25,
      estado: "En Delivery",
      notas: "Tono #03 y #14 de M&Y. Entregar antes de las 2:00 PM."
    },
    {
      id: "TY-PED-0002",
      fecha: "2026-10-20 14:15",
      cliente: "Studio Glam Nails (Valeria)",
      telefono: "0424-6987123",
      instagram: "@glamnails.maracaibo",
      direccion: "C.C. Delicias Plaza, Local 14",
      tipoEntrega: "Delivery Maracaibo",
      metodoPago: "Zelle",
      referenciaPago: "Valeria Gomez / Zelle",
      items: [
        { id: "TY-PROD-006", nombre: "Kit Completo para Principiantes", qty: 2, precio: 28.00 },
        { id: "TY-PROD-007", nombre: "Set Pinceles Liner (3 pcs)", qty: 2, precio: 5.00 }
      ],
      subtotalUSD: 66.00,
      tasaBs: 395.50,
      totalUSD: 66.00,
      totalBs: 26103.00,
      estado: "Confirmado",
      notas: "Para curso de alumnas del fin de semana."
    },
    {
      id: "TY-PED-0003",
      fecha: "2026-10-19 16:40",
      cliente: "Dayana Chirinos",
      telefono: "0412-5544332",
      instagram: "@dayanails_zulia",
      direccion: "Sector La Limpia, cerca del distribuidor",
      tipoEntrega: "Delivery Maracaibo",
      metodoPago: "Efectivo $",
      referenciaPago: "Efectivo al recibir",
      items: [
        { id: "TY-PROD-010", nombre: "Uña de Hierro", qty: 3, precio: 3.00 },
        { id: "TY-PROD-008", nombre: "Lima Profesional 100/180", qty: 2, precio: 3.50 }
      ],
      subtotalUSD: 16.00,
      tasaBs: 395.50,
      totalUSD: 16.00,
      totalBs: 6328.00,
      estado: "Entregado",
      notas: "Pagó con billete de $20, se entregó $4 de cambio."
    }
  ];

  // COTIZACIONES SEMILLA
  const SEED_QUOTES = [
    {
      id: "TY-COT-0001",
      fecha: "2026-10-21",
      validezDias: 7,
      cliente: "Academia Beauty Art Maracaibo",
      telefono: "0426-1122334",
      salonAcademia: "Academia Beauty Art",
      items: [
        { nombre: "Kit Completo para Principiantes", qty: 5, precio: 28.00, total: 140.00 },
        { nombre: "Esmalte M&Y Color Gel (Surtido)", qty: 15, precio: 3.50, total: 52.50 },
        { nombre: "Set Pinceles Liner (3 pcs)", qty: 5, precio: 5.00, total: 25.00 }
      ],
      subtotalUSD: 217.50,
      totalUSD: 217.50,
      totalBs: 86021.25,
      estado: "Vigente",
      notas: "Presupuesto para taller intensivo de manicura semipermanente."
    }
  ];

  // FINANZAS SEMILLA
  const SEED_FINANCES = [
    {
      id: "TY-FIN-0001",
      fecha: "2026-10-19",
      tipo: "Ingreso",
      categoria: "Venta Insumos",
      descripcion: "Pedido TY-PED-0003 - Dayana Chirinos",
      cuentaMetodo: "Efectivo $",
      montoUSD: 16.00,
      montoBs: 6328.00,
      idReferencia: "TY-PED-0003",
      notas: "Venta directa con delivery entregado."
    },
    {
      id: "TY-FIN-0002",
      fecha: "2026-10-20",
      tipo: "Ingreso",
      categoria: "Venta Insumos",
      descripcion: "Pedido TY-PED-0002 - Studio Glam Nails",
      cuentaMetodo: "Zelle",
      montoUSD: 66.00,
      montoBs: 26103.00,
      idReferencia: "TY-PED-0002",
      notas: "Pago confirmado vía Zelle."
    },
    {
      id: "TY-FIN-0003",
      fecha: "2026-10-20",
      tipo: "Gasto",
      categoria: "Delivery y Traslados",
      descripcion: "Pago a motorizado delivery por 3 despachos zona norte",
      cuentaMetodo: "Pago Móvil",
      montoUSD: 6.00,
      montoBs: 2373.00,
      idReferencia: "REC-DEL-01",
      notas: "Delivery garantizado gratis al cliente, absorbido por el negocio."
    },
    {
      id: "TY-FIN-0004",
      fecha: "2026-10-20",
      tipo: "Gasto",
      categoria: "Empaques y Bolsas",
      descripcion: "Paquete de 100 bolsas kraft rosas y lazos de regalo",
      cuentaMetodo: "Efectivo $",
      montoUSD: 12.00,
      montoBs: 4746.00,
      idReferencia: "FAC-EMP-22",
      notas: "Presentación de marca para pedidos de clientas."
    }
  ];

  // CLIENTES SEMILLA
  const SEED_CLIENTS = [
    {
      id: "TY-CLI-001",
      nombre: "Mariana Albornoz",
      telefono: "0414-6123456",
      instagram: "@mariana_nails_mcbo",
      salonNegocio: "Mariana Studio",
      zonaMaracaibo: "Sector La Lago",
      totalPedidos: 4,
      totalCompradoUSD: 84.50,
      ultimaCompra: "2026-10-20",
      nivelFidelidad: "Manicurista VIP",
      notas: "Le encanta la Base Rubber y colecciones de esmaltes nude."
    },
    {
      id: "TY-CLI-002",
      nombre: "Valeria Gómez",
      telefono: "0424-6987123",
      instagram: "@glamnails.maracaibo",
      salonNegocio: "Studio Glam Nails",
      zonaMaracaibo: "Delicias Norte",
      totalPedidos: 2,
      totalCompradoUSD: 110.00,
      ultimaCompra: "2026-10-20",
      nivelFidelidad: "Plata",
      notas: "Compra kits para sus cursos de capacitación."
    },
    {
      id: "TY-CLI-003",
      nombre: "Dayana Chirinos",
      telefono: "0412-5544332",
      instagram: "@dayanails_zulia",
      salonNegocio: "Independiente",
      zonaMaracaibo: "La Limpia",
      totalPedidos: 1,
      totalCompradoUSD: 16.00,
      ultimaCompra: "2026-10-19",
      nivelFidelidad: "Bronce",
      notas: "Interesada en los pinceles liner de precisión."
    }
  ];

  // CONFIGURACIÓN INICIAL
  const DEFAULT_CONFIG = {
    sheetsApiUrl: "",
    rateBCV: 395.50,
    whatsappNumber: "584265604070",
    deliveryFreeMinUSD: 15.00,
    deliveryFlatFeeUSD: 2.00,
    paymentInfo: "Banesco (0134) | CI: V-28123456 | Telf: 0426-5604070\nZelle: tiendasyolo.pagos@gmail.com\nZinli: tiendasyolo.pagos@gmail.com"
  };

  // ============================================================================
  // ESTADO GLOBAL REACTIVO DE LA APLICACIÓN
  // ============================================================================
  const state = {
    mode: 'store',             // 'store' (Catálogo Clientes) o 'admin' (Panel Interno)
    adminTab: 'admin-dashboard',
    activeCategory: 'all',
    searchQuery: '',
    sortCriteria: 'featured',
    products: [],
    cart: [],
    orders: [],
    quotes: [],
    finances: [],
    clients: [],
    config: {},
    isSyncing: false
  };

  // ============================================================================
  // CARGA Y PERSISTENCIA (LOCALSTORAGE + GOOGLE SHEETS)
  // ============================================================================
  function loadInitialState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state.products = parsed.products && parsed.products.length ? parsed.products : SEED_PRODUCTS;
        state.orders = parsed.orders && parsed.orders.length ? parsed.orders : SEED_ORDERS;
        state.quotes = parsed.quotes && parsed.quotes.length ? parsed.quotes : SEED_QUOTES;
        state.finances = parsed.finances && parsed.finances.length ? parsed.finances : SEED_FINANCES;
        state.clients = parsed.clients && parsed.clients.length ? parsed.clients : SEED_CLIENTS;
        state.config = Object.assign({}, DEFAULT_CONFIG, parsed.config || {});
        state.cart = parsed.cart || [];
      } else {
        // Carga semilla inicial
        state.products = SEED_PRODUCTS;
        state.orders = SEED_ORDERS;
        state.quotes = SEED_QUOTES;
        state.finances = SEED_FINANCES;
        state.clients = SEED_CLIENTS;
        state.config = DEFAULT_CONFIG;
        state.cart = [];
        saveStateLocal();
      }
    } catch (e) {
      console.error("Error al cargar estado local de Tiendas Yolo:", e);
      state.products = SEED_PRODUCTS;
      state.orders = SEED_ORDERS;
      state.quotes = SEED_QUOTES;
      state.finances = SEED_FINANCES;
      state.clients = SEED_CLIENTS;
      state.config = DEFAULT_CONFIG;
      state.cart = [];
    }

    updateCloudIndicator();
  }

  function saveStateLocal() {
    try {
      const dataToSave = {
        products: state.products,
        orders: state.orders,
        quotes: state.quotes,
        finances: state.finances,
        clients: state.clients,
        config: state.config,
        cart: state.cart,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  function updateCloudIndicator() {
    const el = document.getElementById('cloud-status-indicator');
    const textEl = document.getElementById('cloud-status-text');
    if (!el || !textEl) return;

    if (state.config.sheetsApiUrl && state.config.sheetsApiUrl.trim() !== '') {
      el.className = 'cloud-badge online';
      textEl.textContent = 'Sheets Conectado';
    } else {
      el.className = 'cloud-badge offline';
      textEl.textContent = 'Almacenamiento Local';
    }
  }

  // ============================================================================
  // SINCRONIZACIÓN CON GOOGLE APPS SCRIPT (SHEETS)
  // ============================================================================
  async function syncWithSheets(action, payload = null) {
    const apiUrl = state.config.sheetsApiUrl;
    if (!apiUrl || !apiUrl.startsWith('http')) {
      return { success: false, offline: true, message: "URL de Google Apps Script no configurada." };
    }

    state.isSyncing = true;
    showToast("Conectando con Google Sheets...", "info");

    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: action,
          data: payload || {}
        })
      };

      const res = await fetch(apiUrl, requestOptions);
      const json = await res.json();
      state.isSyncing = false;

      if (json.success) {
        showToast("¡Sincronizado con Google Sheets exitosamente!", "success");
        return { success: true, data: json.data };
      } else {
        showToast("Error en respuesta de Google Sheets: " + (json.error || "Desconocido"), "error");
        return { success: false, error: json.error };
      }
    } catch (err) {
      state.isSyncing = false;
      console.error("Fallo de red en sync con Google Sheets:", err);
      showToast("Sin conexión a Sheets. Los datos se guardaron localmente.", "info");
      return { success: false, networkError: true, error: err.message };
    }
  }

  // ============================================================================
  // RENDERIZADO DEL CATÁLOGO (TIENDA PÚBLICA)
  // ============================================================================
  function renderCategoriesBar() {
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

    // Escuchadores
    container.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.category;
        renderCategoriesBar();
        renderProductsCatalog();
      });
    });
  }

  function renderProductsCatalog() {
    const grid = document.getElementById('products-grid-container');
    const titleEl = document.getElementById('catalog-section-title');
    const countEl = document.getElementById('catalog-products-count');
    if (!grid) return;

    let filtered = state.products.filter(p => p.activo === 'SI');

    // Filtro por categoría
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(p => p.categoria === state.activeCategory);
      if (titleEl) titleEl.textContent = state.activeCategory;
    } else {
      if (titleEl) titleEl.textContent = "Todos los Insumos";
    }

    // Filtro por búsqueda
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
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
          <button class="btn-primary" id="btn-reset-filters">Ver Todos los Insumos</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.activeCategory = 'all';
          state.searchQuery = '';
          const searchInput = document.getElementById('global-search-input');
          if (searchInput) searchInput.value = '';
          renderCategoriesBar();
          renderProductsCatalog();
        });
      }
      return;
    }

    const rate = Number(state.config.rateBCV || 395.50);

    grid.innerHTML = filtered.map(prod => {
      const priceBs = (prod.precioUSD * rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
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
            <img src="${prod.imagenURL || 'assets/logo-yolo.png'}" alt="${prod.nombre}" class="product-img" loading="lazy" onerror="this.src='assets/logo-yolo.png'">
          </div>

          <div class="product-card-body">
            <h4 class="product-title">${prod.nombre}</h4>
            <p class="product-desc">${prod.descripcion || 'Insumo profesional de alta gama garantizado por Tiendas Yolo.'}</p>
            
            <div class="product-meta-row">
              <span class="stock-indicator ${stockClass}">
                ● ${stockTxt}
              </span>
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

            <div class="product-card-actions">
              <button class="btn-add-cart" data-action="add-cart" data-id="${prod.id}" ${prod.stockActual <= 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                <span>🛒</span>
                <span>${prod.stockActual <= 0 ? 'Agotado' : 'Agregar al Pedido'}</span>
              </button>
              <button class="btn-quick-wa" data-action="quick-wa" data-id="${prod.id}" title="Consultar por WhatsApp">
                💬
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Asignar escuchadores
    grid.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(btn.dataset.id, 1);
      });
    });

    grid.querySelectorAll('[data-action="quick-wa"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = state.products.find(p => p.id === btn.dataset.id);
        if (prod) {
          const text = encodeURIComponent(`💅 ¡Hola Tiendas Yolo! Deseo información y disponibilidad sobre: *${prod.nombre}* ($${prod.precioUSD.toFixed(2)}). ¿Tienen entrega inmediata en Maracaibo?`);
          window.open(`https://wa.me/${state.config.whatsappNumber}?text=${text}`, '_blank');
        }
      });
    });
  }

  // ============================================================================
  // CARRITO DE COMPRAS & PEDIDOS POR WHATSAPP
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
        imagenURL: prod.imagenURL || 'assets/logo-yolo.png',
        qty: quantity
      });
    }

    saveStateLocal();
    updateCartUI();
    showToast(`Añadido: ${prod.nombre}`, "success");
  }

  function updateCartItemQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    }

    saveStateLocal();
    updateCartUI();
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

    // Regla de Delivery Gratis en Maracaibo
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
          <p style="font-size: 0.8rem;">Explora el catálogo y añade los insumos que necesitas para tu mesa.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = state.cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.imagenURL || 'assets/logo-yolo.png'}" alt="${item.nombre}" class="cart-item-img" onerror="this.src='assets/logo-yolo.png'">
        <div class="cart-item-info">
          <h5 class="cart-item-title">${item.nombre}</h5>
          <span class="cart-item-price">$${item.precioUSD.toFixed(2)} c/u</span>
        </div>
        <div class="cart-qty-controls">
          <button class="btn-qty" data-action="qty-minus" data-id="${item.id}">-</button>
          <span class="cart-qty-num">${item.qty}</span>
          <button class="btn-qty" data-action="qty-plus" data-id="${item.id}">+</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('[data-action="qty-minus"]').forEach(btn => {
      btn.addEventListener('click', () => updateCartItemQty(btn.dataset.id, -1));
    });

    list.querySelectorAll('[data-action="qty-plus"]').forEach(btn => {
      btn.addEventListener('click', () => updateCartItemQty(btn.dataset.id, 1));
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

    // Generar ID de pedido
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

    // Registrar pedido en el sistema local
    const newOrderObj = {
      id: newOrderId,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 16),
      cliente: clientName,
      telefono: clientPhone,
      instagram: clientInstagram,
      direccion: address || "Maracaibo",
      tipoEntrega: deliveryLabel,
      metodoPago: paymentMethod,
      referenciaPago: "Por confirmar vía WhatsApp",
      items: state.cart.map(i => ({ id: i.id, nombre: i.nombre, qty: i.qty, precio: i.precioUSD })),
      subtotalUSD: subtotal,
      tasaBs: rate,
      totalUSD: grandTotalUSD,
      totalBs: grandTotalBs,
      estado: "Pendiente",
      notas: notes
    };

    state.orders.unshift(newOrderObj);

    // Actualizar o crear clienta en CRM
    let clientExists = state.clients.find(c => c.telefono === clientPhone);
    if (clientExists) {
      clientExists.totalPedidos = (clientExists.totalPedidos || 1) + 1;
      clientExists.totalCompradoUSD = (clientExists.totalCompradoUSD || 0) + grandTotalUSD;
      clientExists.ultimaCompra = new Date().toISOString().split('T')[0];
    } else {
      state.clients.push({
        id: `TY-CLI-${("000" + (state.clients.length + 1)).slice(-3)}`,
        nombre: clientName,
        telefono: clientPhone,
        instagram: clientInstagram || "",
        salonNegocio: "",
        zonaMaracaibo: address || "Maracaibo",
        totalPedidos: 1,
        totalCompradoUSD: grandTotalUSD,
        ultimaCompra: new Date().toISOString().split('T')[0],
        nivelFidelidad: "Bronce",
        notas: notes
      });
    }

    saveStateLocal();

    // Sincronizar en background con Sheets si está configurado
    if (state.config.sheetsApiUrl) {
      syncWithSheets('save_order', newOrderObj);
    }

    // Abrir WhatsApp oficial
    const waUrl = `https://wa.me/${state.config.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    // Cerrar carrito y vaciar
    closeCartDrawer();
    state.cart = [];
    saveStateLocal();
    updateCartUI();
    showToast(`¡Pedido #${newOrderId} generado y enviado a WhatsApp!`, "success");
  }

  // ============================================================================
  // GENERADOR DE COTIZACIÓN FORMAL (IMPRIMIBLE / PDF)
  // ============================================================================
  function showQuoteModal(quoteData = null) {
    const modal = document.getElementById('modal-quote-viewer');
    if (!modal) return;

    const rate = Number(state.config.rateBCV || 395.50);

    let items = [];
    let clientName = "Manicurista / Salón";
    let clientPhone = "";
    let clientSalon = "Estudio Profesional";
    let clientAddress = "Maracaibo, Zulia";
    let subtotalUSD = 0;
    let quoteId = "COT-" + new Date().getFullYear() + "-" + ("0000" + (state.quotes.length + 1)).slice(-4);
    let dateStr = new Date().toLocaleDateString('es-VE');

    if (quoteData) {
      items = quoteData.items || [];
      clientName = quoteData.cliente || clientName;
      clientPhone = quoteData.telefono || clientPhone;
      clientSalon = quoteData.salonAcademia || clientSalon;
      quoteId = quoteData.id || quoteId;
      dateStr = quoteData.fecha || dateStr;
      subtotalUSD = quoteData.subtotalUSD || 0;
    } else if (state.cart.length > 0) {
      // Generar a partir del carrito actual
      clientName = document.getElementById('cart-client-name').value.trim() || clientName;
      clientPhone = document.getElementById('cart-client-phone').value.trim() || clientPhone;
      clientAddress = document.getElementById('cart-delivery-address').value.trim() || clientAddress;
      items = state.cart.map(i => ({
        nombre: i.nombre,
        qty: i.qty,
        precio: i.precioUSD,
        total: i.qty * i.precioUSD
      }));
      subtotalUSD = state.cart.reduce((s, i) => s + (i.qty * i.precioUSD), 0);
    } else {
      showToast("Agrega insumos al carrito o presiona 'Nueva Cotización' en el panel.", "info");
      return;
    }

    const grandTotalBs = subtotalUSD * rate;

    // Inyectar en el documento de impresión
    document.getElementById('print-quote-id').textContent = quoteId;
    document.getElementById('print-quote-date').textContent = dateStr;
    document.getElementById('print-quote-validity').textContent = "7 días continuos";
    document.getElementById('print-quote-rate').textContent = `Bs. ${rate.toFixed(2)} / $`;
    document.getElementById('print-client-name').textContent = clientName;
    document.getElementById('print-client-phone').textContent = clientPhone || "Sin especificar";
    document.getElementById('print-client-salon').textContent = clientSalon;
    document.getElementById('print-client-address').textContent = clientAddress;

    const tbody = document.getElementById('print-quote-items-body');
    tbody.innerHTML = items.map(it => {
      const totalUSD = it.total || (it.qty * it.precio);
      const totalBs = totalUSD * rate;
      return `
        <tr>
          <td>${it.qty}</td>
          <td><strong>${it.nombre}</strong></td>
          <td>$${it.precio.toFixed(2)}</td>
          <td>$${totalUSD.toFixed(2)}</td>
          <td>Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('print-quote-subtotal-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-subtotal-bs').textContent = `Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const deliveryStatusEl = document.getElementById('print-quote-delivery-status');
    if (subtotalUSD >= Number(state.config.deliveryFreeMinUSD || 15.00)) {
      deliveryStatusEl.textContent = "¡DELIVERY GRATIS EN MARACAIBO!";
      deliveryStatusEl.style.color = "#10b981";
    } else {
      deliveryStatusEl.textContent = "Tarifa estándar Maracaibo: $2.00 (o retiro personal)";
      deliveryStatusEl.style.color = "#6e4a5d";
    }

    document.getElementById('print-quote-grand-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-grand-bs').textContent = `Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Guardar cotización en estado si es nueva
    if (!quoteData) {
      const newQuoteObj = {
        id: quoteId,
        fecha: new Date().toISOString().split('T')[0],
        validezDias: 7,
        cliente: clientName,
        telefono: clientPhone,
        salonAcademia: clientSalon,
        items: items,
        subtotalUSD: subtotalUSD,
        totalUSD: subtotalUSD,
        totalBs: grandTotalBs,
        estado: "Vigente",
        notas: "Cotización generada desde la web de Tiendas Yolo"
      };
      state.quotes.unshift(newQuoteObj);
      saveStateLocal();

      if (state.config.sheetsApiUrl) {
        syncWithSheets('save_quote', newQuoteObj);
      }
    }

    modal.style.display = 'flex';
  }

  // ============================================================================
  // PANEL ADMINISTRATIVO & FINANZAS
  // ============================================================================
  function renderAdminDashboard() {
    // 1. Métricas de Ventas y Finanzas
    const rate = Number(state.config.rateBCV || 395.50);

    const totalSalesUSD = state.orders
      .filter(o => o.estado !== 'Cancelado')
      .reduce((sum, o) => sum + Number(o.totalUSD || 0), 0);

    const totalSalesBs = totalSalesUSD * rate;

    const totalCosts = state.finances
      .filter(f => f.tipo === 'Costo')
      .reduce((sum, f) => sum + Number(f.montoUSD || 0), 0);

    const totalExpenses = state.finances
      .filter(f => f.tipo === 'Gasto')
      .reduce((sum, f) => sum + Number(f.montoUSD || 0), 0);

    const netProfitUSD = totalSalesUSD - (totalCosts + totalExpenses);
    const profitMargin = totalSalesUSD > 0 ? ((netProfitUSD / totalSalesUSD) * 100).toFixed(1) : 0;

    const activeOrders = state.orders.filter(o => o.estado !== 'Entregado' && o.estado !== 'Cancelado').length;
    const deliveredOrders = state.orders.filter(o => o.estado === 'Entregado').length;

    const lowStockCount = state.products.filter(p => p.stockActual <= (p.stockMinimo || 5)).length;

    // Actualizar elementos
    const salesUsdEl = document.getElementById('kpi-total-sales-usd');
    const salesBsEl = document.getElementById('kpi-total-sales-bs');
    const profitUsdEl = document.getElementById('kpi-net-profit-usd');
    const profitMarginEl = document.getElementById('kpi-profit-margin');
    const activeOrdersEl = document.getElementById('kpi-active-orders-count');
    const deliveredOrdersEl = document.getElementById('kpi-orders-delivered-count');
    const lowStockEl = document.getElementById('kpi-low-stock-count');

    if (salesUsdEl) salesUsdEl.textContent = `$${totalSalesUSD.toFixed(2)}`;
    if (salesBsEl) salesBsEl.textContent = `Bs. ${totalSalesBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (profitUsdEl) profitUsdEl.textContent = `$${netProfitUSD.toFixed(2)}`;
    if (profitMarginEl) profitMarginEl.textContent = `Margen neto: ${profitMargin}%`;
    if (activeOrdersEl) activeOrdersEl.textContent = activeOrders;
    if (deliveredOrdersEl) deliveredOrdersEl.textContent = `${deliveredOrders} entregados con éxito`;
    if (lowStockEl) lowStockEl.textContent = lowStockCount;

    // 2. Balances de Cajas y Cuentas
    renderAccountsBalance();

    // 3. Pedidos Recientes
    renderRecentOrders();

    // 4. Barra visual de ingresos vs egresos
    renderFinanceBars(totalSalesUSD, totalCosts, totalExpenses);
  }

  function renderAccountsBalance() {
    const container = document.getElementById('dashboard-accounts-container');
    if (!container) return;

    const rate = Number(state.config.rateBCV || 395.50);
    const accounts = [
      { name: '💵 Efectivo $', key: 'Efectivo $' },
      { name: '📲 Pago Móvil', key: 'Pago Móvil' },
      { name: '🇺🇸 Zelle', key: 'Zelle' },
      { name: '💳 Zinli', key: 'Zinli' }
    ];

    container.innerHTML = accounts.map(acc => {
      const balanceUSD = state.finances
        .filter(f => f.cuentaMetodo === acc.key)
        .reduce((sum, f) => {
          if (f.tipo === 'Ingreso') return sum + Number(f.montoUSD || 0);
          if (f.tipo === 'Gasto' || f.tipo === 'Costo' || f.tipo === 'Retiro') return sum - Number(f.montoUSD || 0);
          return sum;
        }, 0);

      const balanceBs = balanceUSD * rate;

      return `
        <div class="account-card-mini">
          <h5 class="account-name">${acc.name}</h5>
          <span class="account-bal-usd">$${balanceUSD.toFixed(2)}</span>
          <span class="account-bal-bs">Bs. ${balanceBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      `;
    }).join('');
  }

  function renderRecentOrders() {
    const container = document.getElementById('dashboard-recent-orders-container');
    if (!container) return;

    const recents = state.orders.slice(0, 4);
    if (recents.length === 0) {
      container.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 12px;">No hay pedidos registrados aún.</p>`;
      return;
    }

    container.innerHTML = recents.map(o => `
      <div class="recent-order-item">
        <div>
          <span class="recent-order-client">${o.cliente}</span>
          <span class="recent-order-meta">#${o.id} • ${o.tipoEntrega}</span>
        </div>
        <div style="text-align: right;">
          <strong style="color: var(--ty-primary);">$${Number(o.totalUSD).toFixed(2)}</strong>
          <div><span class="status-badge status-${o.estado.replace(/\s+/g, '-')}">${o.estado}</span></div>
        </div>
      </div>
    `).join('');
  }

  function renderFinanceBars(income, costs, expenses) {
    const container = document.getElementById('dashboard-finance-bars');
    if (!container) return;

    const total = Math.max(income, costs + expenses, 1);
    const inPct = Math.min(100, Math.round((income / total) * 100));
    const costPct = Math.min(100, Math.round((costs / total) * 100));
    const expPct = Math.min(100, Math.round((expenses / total) * 100));

    container.innerHTML = `
      <div class="fin-bar-item">
        <div class="fin-bar-labels">
          <span>🟢 Ingresos por Ventas de Insumos</span>
          <strong>$${income.toFixed(2)} (${inPct}%)</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill fill-in" style="width: ${inPct}%"></div>
        </div>
      </div>

      <div class="fin-bar-item">
        <div class="fin-bar-labels">
          <span>🔴 Costo de Mercancía e Insumos</span>
          <strong>$${costs.toFixed(2)} (${costPct}%)</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill fill-cost" style="width: ${costPct}%"></div>
        </div>
      </div>

      <div class="fin-bar-item">
        <div class="fin-bar-labels">
          <span>🟠 Gastos Operativos (Delivery, Empaques, Publicidad)</span>
          <strong>$${expenses.toFixed(2)} (${expPct}%)</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill fill-exp" style="width: ${expPct}%"></div>
        </div>
      </div>
    `;
  }

  // RENDERIZADO DE PEDIDOS EN EL PANEL
  function renderAdminOrders(filterStatus = 'all') {
    const container = document.getElementById('admin-orders-container');
    if (!container) return;

    // Actualizar contadores
    const counts = {
      all: state.orders.length,
      pending: state.orders.filter(o => o.estado === 'Pendiente').length,
      confirmed: state.orders.filter(o => o.estado === 'Confirmado').length,
      prep: state.orders.filter(o => o.estado === 'En Preparación').length,
      delivery: state.orders.filter(o => o.estado === 'En Delivery').length,
      delivered: state.orders.filter(o => o.estado === 'Entregado').length
    };

    document.getElementById('count-filter-all').textContent = counts.all;
    document.getElementById('count-filter-pending').textContent = counts.pending;
    document.getElementById('count-filter-confirmed').textContent = counts.confirmed;
    document.getElementById('count-filter-prep').textContent = counts.prep;
    document.getElementById('count-filter-delivery').textContent = counts.delivery;
    document.getElementById('count-filter-delivered').textContent = counts.delivered;

    const pendingHeaderBadge = document.getElementById('admin-orders-pending-count');
    if (pendingHeaderBadge) pendingHeaderBadge.textContent = counts.pending + counts.confirmed;

    let filtered = state.orders;
    if (filterStatus !== 'all') {
      filtered = state.orders.filter(o => o.estado === filterStatus);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <span style="font-size: 2.4rem;">📦</span>
          <p style="font-weight: 700; margin-top: 8px;">No hay pedidos en este estado.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(order => {
      const itemsText = Array.isArray(order.items) 
        ? order.items.map(i => `${i.qty}x ${i.nombre}`).join(' • ')
        : (typeof order.items === 'string' ? order.items : '');

      return `
        <div class="order-admin-card" data-order-id="${order.id}">
          <div class="order-top-row">
            <div>
              <span class="order-id-badge">#${order.id}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">📅 ${order.fecha}</span>
            </div>
            <div>
              <select class="select-styled select-order-status" data-order-id="${order.id}">
                <option value="Pendiente" ${order.estado === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                <option value="Confirmado" ${order.estado === 'Confirmado' ? 'selected' : ''}>✅ Confirmado</option>
                <option value="En Preparación" ${order.estado === 'En Preparación' ? 'selected' : ''}>📦 En Preparación</option>
                <option value="En Delivery" ${order.estado === 'En Delivery' ? 'selected' : ''}>🚚 En Delivery</option>
                <option value="Entregado" ${order.estado === 'Entregado' ? 'selected' : ''}>🎉 Entregado</option>
                <option value="Cancelado" ${order.estado === 'Cancelado' ? 'selected' : ''}>❌ Cancelado</option>
              </select>
            </div>
          </div>

          <div class="order-client-line">
            <span>👤 ${order.cliente}</span>
            <span style="font-size: 0.84rem; font-weight: normal; color: var(--text-secondary);">📱 ${order.telefono}</span>
            ${order.instagram ? `<span style="font-size: 0.84rem; font-weight: normal; color: var(--ty-rose-gold);">📸 ${order.instagram}</span>` : ''}
          </div>

          <div style="font-size: 0.84rem; color: var(--text-secondary);">
            📍 <strong>Entrega:</strong> ${order.tipoEntrega} — ${order.direccion || 'Maracaibo'} | 💳 <strong>Pago:</strong> ${order.metodoPago} (${order.referenciaPago || 'Sin ref'})
          </div>

          <div class="order-items-snippet">
            <strong>Insumos:</strong> ${itemsText}
            ${order.notas ? `<br><em style="color:var(--text-muted);">Notas: ${order.notas}</em>` : ''}
          </div>

          <div class="order-bottom-actions">
            <div class="order-totals-inline">
              <span class="order-usd">$${Number(order.totalUSD).toFixed(2)}</span>
              <span class="order-bs">(Bs. ${Number(order.totalBs).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
            </div>
            <div class="action-buttons">
              <button class="btn-secondary" data-action="notify-client" data-order-id="${order.id}" title="Enviar mensaje de estado por WhatsApp">
                📲 Notificar Clienta
              </button>
              <button class="btn-secondary" data-action="print-ticket" data-order-id="${order.id}" title="Generar comprobante o cotización">
                📄 Comprobante
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Escuchadores de cambio de estado
    container.querySelectorAll('.select-order-status').forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = select.dataset.orderId;
        const newStatus = select.value;
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          order.estado = newStatus;
          saveStateLocal();
          renderAdminDashboard();
          renderAdminOrders(filterStatus);
          showToast(`Pedido #${orderId} actualizado a "${newStatus}"`, "success");

          // Sync Sheets
          if (state.config.sheetsApiUrl) {
            syncWithSheets('update_order_status', { orderId: orderId, newStatus: newStatus });
          }
        }
      });
    });

    // Notificar cliente por WhatsApp
    container.querySelectorAll('[data-action="notify-client"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = state.orders.find(o => o.id === btn.dataset.orderId);
        if (order && order.telefono) {
          let cleanPhone = order.telefono.replace(/\D/g, '');
          if (!cleanPhone.startsWith('58')) cleanPhone = '58' + cleanPhone.replace(/^0+/, '');
          
          let text = `💅 *¡Hola ${order.cliente}!* Te escribimos de *Tiendas Yolo®*.\n`;
          text += `Tu pedido *#${order.id}* se encuentra actualmente en estado: *${order.estado.toUpperCase()}*.\n`;
          if (order.estado === 'En Delivery') {
            text += `🚚 El repartidor ya va en ruta hacia tu dirección: ${order.direccion}.\n`;
          } else if (order.estado === 'Confirmado') {
            text += `✅ Hemos confirmado tu pago de $${Number(order.totalUSD).toFixed(2)}. ¡Gracias por tu compra!\n`;
          }
          text += `\n_Cualquier duda estamos a tu orden. “Yo lo compro, Yo lo merezco”._`;

          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
        } else {
          showToast("El pedido no tiene un número de teléfono válido registrado.", "error");
        }
      });
    });

    // Imprimir ticket/comprobante
    container.querySelectorAll('[data-action="print-ticket"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = state.orders.find(o => o.id === btn.dataset.orderId);
        if (order) {
          showQuoteModal({
            id: order.id,
            fecha: order.fecha,
            cliente: order.cliente,
            telefono: order.telefono,
            salonAcademia: order.instagram || "Cliente Tiendas Yolo",
            items: order.items,
            subtotalUSD: order.subtotalUSD
          });
        }
      });
    });
  }

  // RENDERIZADO DE FINANZAS
  function renderFinancesTable(filterQuery = '') {
    const tbody = document.getElementById('finances-table-body');
    if (!tbody) return;

    let filtered = state.finances;
    if (filterQuery.trim() !== '') {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.descripcion.toLowerCase().includes(q) ||
        f.categoria.toLowerCase().includes(q) ||
        f.cuentaMetodo.toLowerCase().includes(q) ||
        (f.idReferencia && f.idReferencia.toLowerCase().includes(q))
      );
    }

    const totalIn = state.finances.filter(f => f.tipo === 'Ingreso').reduce((s, f) => s + Number(f.montoUSD || 0), 0);
    const totalOut = state.finances.filter(f => f.tipo === 'Costo' || f.tipo === 'Gasto').reduce((s, f) => s + Number(f.montoUSD || 0), 0);
    const net = totalIn - totalOut;

    document.getElementById('fin-pill-in-val').textContent = `$${totalIn.toFixed(2)}`;
    document.getElementById('fin-pill-out-val').textContent = `$${totalOut.toFixed(2)}`;
    document.getElementById('fin-pill-net-val').textContent = `$${net.toFixed(2)}`;

    tbody.innerHTML = filtered.map(f => {
      let typeBadge = '🟢 Ingreso';
      let typeColor = '#10b981';
      if (f.tipo === 'Costo') { typeBadge = '🔴 Costo Mercancía'; typeColor = '#ef4444'; }
      if (f.tipo === 'Gasto') { typeBadge = '🟠 Gasto Operativo'; typeColor = '#f59e0b'; }
      if (f.tipo === 'Retiro') { typeBadge = '🔵 Retiro Utilidad'; typeColor = '#3b82f6'; }

      return `
        <tr>
          <td>${f.fecha}</td>
          <td><span class="order-id-badge" style="font-size:0.75rem;">${f.id}</span></td>
          <td><strong style="color:${typeColor};">${typeBadge}</strong></td>
          <td>${f.categoria}</td>
          <td>${f.descripcion}</td>
          <td>${f.cuentaMetodo}</td>
          <td><strong style="color:${typeColor};">$${Number(f.montoUSD).toFixed(2)}</strong></td>
          <td>Bs. ${Number(f.montoBs || 0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>
            <button class="btn-micro" data-action="delete-finance" data-id="${f.id}" title="Eliminar registro">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-action="delete-finance"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("¿Estás seguro de eliminar este registro financiero?")) {
          state.finances = state.finances.filter(f => f.id !== btn.dataset.id);
          saveStateLocal();
          renderFinancesTable(filterQuery);
          renderAdminDashboard();
          showToast("Movimiento eliminado.", "info");
        }
      });
    });
  }

  // RENDERIZADO DE INVENTARIO
  function renderInventoryTable(query = '') {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    let filtered = state.products;
    if (query.trim() !== '') {
      const q = query.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    tbody.innerHTML = filtered.map(prod => {
      const marginUSD = prod.precioUSD - (prod.costoUSD || 0);
      const marginPct = prod.precioUSD > 0 ? ((marginUSD / prod.precioUSD) * 100).toFixed(0) : 0;
      
      let stockColor = '#10b981';
      let stockLabel = 'Normal';
      if (prod.stockActual <= 0) {
        stockColor = '#ef4444';
        stockLabel = 'Agotado';
      } else if (prod.stockActual <= (prod.stockMinimo || 5)) {
        stockColor = '#f59e0b';
        stockLabel = 'Stock Bajo';
      }

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <img src="${prod.imagenURL || 'assets/logo-yolo.png'}" style="width:36px; height:36px; border-radius:4px; object-fit:cover;" onerror="this.src='assets/logo-yolo.png'">
              <div>
                <strong>${prod.nombre}</strong>
                <div style="font-size:0.74rem; color:var(--text-muted);">${prod.unidad || 'Unidad'}</div>
              </div>
            </div>
          </td>
          <td>${prod.categoria}</td>
          <td><span style="font-family:monospace; font-size:0.8rem;">${prod.sku || '-'}</span></td>
          <td><strong>$${prod.precioUSD.toFixed(2)}</strong></td>
          <td>$${(prod.costoUSD || 0).toFixed(2)}</td>
          <td><strong style="color:#10b981;">+$${marginUSD.toFixed(2)} (${marginPct}%)</strong></td>
          <td>
            <div style="display:flex; align-items:center; gap:6px;">
              <button class="btn-micro" data-action="stock-dec" data-id="${prod.id}">-</button>
              <strong style="font-size:1.05rem;">${prod.stockActual}</strong>
              <button class="btn-micro" data-action="stock-inc" data-id="${prod.id}">+</button>
            </div>
          </td>
          <td><span style="font-weight:700; color:${stockColor};">● ${stockLabel}</span></td>
          <td>
            <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" data-action="edit-product" data-id="${prod.id}">✏️ Editar</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-action="stock-inc"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = state.products.find(p => p.id === btn.dataset.id);
        if (prod) {
          prod.stockActual += 1;
          saveStateLocal();
          renderInventoryTable(query);
          renderProductsCatalog();
          if (state.config.sheetsApiUrl) {
            syncWithSheets('update_stock', { productId: prod.id, newStock: prod.stockActual });
          }
        }
      });
    });

    tbody.querySelectorAll('[data-action="stock-dec"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = state.products.find(p => p.id === btn.dataset.id);
        if (prod && prod.stockActual > 0) {
          prod.stockActual -= 1;
          saveStateLocal();
          renderInventoryTable(query);
          renderProductsCatalog();
          if (state.config.sheetsApiUrl) {
            syncWithSheets('update_stock', { productId: prod.id, newStock: prod.stockActual });
          }
        }
      });
    });

    tbody.querySelectorAll('[data-action="edit-product"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = state.products.find(p => p.id === btn.dataset.id);
        if (prod) {
          openProductModal(prod);
        }
      });
    });
  }

  // RENDERIZADO DE CLIENTES (CRM)
  function renderClientsGrid(query = '') {
    const container = document.getElementById('admin-clients-container');
    if (!container) return;

    let filtered = state.clients;
    if (query.trim() !== '') {
      const q = query.toLowerCase();
      filtered = filtered.filter(c => 
        c.nombre.toLowerCase().includes(q) ||
        (c.salonNegocio && c.salonNegocio.toLowerCase().includes(q)) ||
        (c.telefono && c.telefono.includes(q)) ||
        (c.zonaMaracaibo && c.zonaMaracaibo.toLowerCase().includes(q))
      );
    }

    container.innerHTML = filtered.map(c => `
      <div class="kpi-card" style="flex-direction:column; align-items:stretch; gap:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-family:var(--font-serif); font-size:1.1rem; color:var(--ty-primary);">${c.nombre}</h4>
          <span class="status-badge" style="background:#fdf2f6; color:#701a49;">${c.nivelFidelidad || 'Manicurista'}</span>
        </div>
        <div style="font-size:0.84rem; color:var(--text-secondary);">
          <div>📱 <strong>WhatsApp:</strong> ${c.telefono}</div>
          ${c.instagram ? `<div>📸 <strong>Instagram:</strong> ${c.instagram}</div>` : ''}
          ${c.salonNegocio ? `<div>💅 <strong>Salón:</strong> ${c.salonNegocio}</div>` : ''}
          <div>📍 <strong>Zona:</strong> ${c.zonaMaracaibo || 'Maracaibo'}</div>
        </div>
        <div style="background:var(--bg-subtle); padding:8px; border-radius:var(--radius-sm); font-size:0.8rem; display:flex; justify-content:space-between;">
          <span>Pedidos: <strong>${c.totalPedidos || 1}</strong></span>
          <span>Invertido: <strong>$${(c.totalCompradoUSD || 0).toFixed(2)}</strong></span>
        </div>
        <button class="btn-whatsapp-outline" style="justify-content:center; padding:6px 12px; font-size:0.8rem;" data-action="chat-client" data-phone="${c.telefono}">
          💬 Escribir por WhatsApp
        </button>
      </div>
    `).join('');

    container.querySelectorAll('[data-action="chat-client"]').forEach(btn => {
      btn.addEventListener('click', () => {
        let phone = btn.dataset.phone.replace(/\D/g, '');
        if (!phone.startsWith('58')) phone = '58' + phone.replace(/^0+/, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent('💅 ¡Hola! Te contactamos de Tiendas Yolo para ver cómo te ha ido con tus insumos.')}`, '_blank');
      });
    });
  }

  // ============================================================================
  // GESTIÓN DE MODALES Y ACCIONES CRUD
  // ============================================================================
  function openProductModal(prod = null) {
    const modal = document.getElementById('modal-product-entry');
    const form = document.getElementById('form-product-entry');
    const title = document.getElementById('modal-product-title');
    if (!modal || !form) return;

    form.reset();
    if (prod) {
      title.textContent = "✏️ Editar Insumo";
      document.getElementById('prod-id').value = prod.id;
      document.getElementById('prod-name').value = prod.nombre;
      document.getElementById('prod-category').value = prod.categoria;
      document.getElementById('prod-sku').value = prod.sku || '';
      document.getElementById('prod-desc').value = prod.descripcion || '';
      document.getElementById('prod-price-usd').value = prod.precioUSD;
      document.getElementById('prod-cost-usd').value = prod.costoUSD || 0;
      document.getElementById('prod-stock').value = prod.stockActual;
      document.getElementById('prod-stock-min').value = prod.stockMinimo || 5;
      document.getElementById('prod-featured').value = prod.destacado || 'NO';
    } else {
      title.textContent = "✨ Registrar Nuevo Insumo";
      document.getElementById('prod-id').value = '';
    }

    modal.style.display = 'flex';
  }

  function handleSaveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const sku = document.getElementById('prod-sku').value.trim();
    const desc = document.getElementById('prod-desc').value.trim();
    const price = Number(document.getElementById('prod-price-usd').value);
    const cost = Number(document.getElementById('prod-cost-usd').value);
    const stock = Number(document.getElementById('prod-stock').value);
    const stockMin = Number(document.getElementById('prod-stock-min').value);
    const featured = document.getElementById('prod-featured').value;

    if (!name || isNaN(price)) {
      showToast("Ingresa al menos el nombre y precio del insumo.", "error");
      return;
    }

    let savedObj = null;

    if (id) {
      // Edición
      const existing = state.products.find(p => p.id === id);
      if (existing) {
        existing.nombre = name;
        existing.categoria = category;
        existing.sku = sku;
        existing.descripcion = desc;
        existing.precioUSD = price;
        existing.costoUSD = cost;
        existing.stockActual = stock;
        existing.stockMinimo = stockMin;
        existing.destacado = featured;
        savedObj = existing;
      }
    } else {
      // Nuevo
      const newId = `TY-PROD-${("000" + (state.products.length + 1)).slice(-3)}`;
      savedObj = {
        id: newId,
        sku: sku || `TY-${Math.floor(Math.random() * 9000 + 1000)}`,
        nombre: name,
        categoria: category,
        descripcion: desc,
        precioUSD: price,
        costoUSD: cost,
        stockActual: stock,
        stockMinimo: stockMin,
        unidad: "Unidad",
        destacado: featured,
        activo: "SI",
        imagenURL: "assets/logo-yolo.png"
      };
      state.products.push(savedObj);
    }

    saveStateLocal();
    renderInventoryTable();
    renderCategoriesBar();
    renderProductsCatalog();

    if (state.config.sheetsApiUrl && savedObj) {
      syncWithSheets('save_product', savedObj);
    }

    document.getElementById('modal-product-entry').style.display = 'none';
    showToast("Insumo guardado correctamente.", "success");
  }

  function handleSaveFinance(e) {
    e.preventDefault();
    const type = document.getElementById('fin-type').value;
    const category = document.getElementById('fin-category').value;
    const desc = document.getElementById('fin-description').value.trim();
    const account = document.getElementById('fin-account').value;
    const date = document.getElementById('fin-date').value || new Date().toISOString().split('T')[0];
    const amountUSD = Number(document.getElementById('fin-amount-usd').value);
    const rate = Number(state.config.rateBCV || 395.50);
    const amountBs = Number(document.getElementById('fin-amount-bs').value) || (amountUSD * rate);
    const ref = document.getElementById('fin-ref').value.trim();

    if (!desc || isNaN(amountUSD) || amountUSD <= 0) {
      showToast("Ingresa una descripción y monto válido.", "error");
      return;
    }

    const newFinId = `TY-FIN-${("0000" + (state.finances.length + 1)).slice(-4)}`;
    const newEntry = {
      id: newFinId,
      fecha: date,
      tipo: type,
      categoria: category,
      descripcion: desc,
      cuentaMetodo: account,
      montoUSD: amountUSD,
      montoBs: amountBs,
      idReferencia: ref,
      notas: "Registrado manualmente desde el panel"
    };

    state.finances.unshift(newEntry);
    saveStateLocal();
    renderFinancesTable();
    renderAdminDashboard();

    if (state.config.sheetsApiUrl) {
      syncWithSheets('save_finance_movement', newEntry);
    }

    document.getElementById('modal-finance-entry').style.display = 'none';
    showToast("Movimiento financiero registrado.", "success");
  }

  // ============================================================================
  // EXPORTACIONES A CSV / EXCEL
  // ============================================================================
  function exportToCSV(filename, rows) {
    let processRow = function (row) {
      let finalVal = '';
      for (let j = 0; j < row.length; j++) {
        let innerValue = row[j] === null || row[j] === undefined ? '' : row[j].toString();
        let result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0)
          result = '"' + result + '"';
        if (j > 0)
          finalVal += ',';
        finalVal += result;
      }
      return finalVal + '\n';
    };

    let csvFile = '\uFEFF'; // UTF-8 BOM
    for (let i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    if (link.download !== undefined) {
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // ============================================================================
  // SISTEMA DE TOAST DE NOTIFICACIONES
  // ============================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // ============================================================================
  // CONTROLADORES DE INTERFAZ & EVENTOS
  // ============================================================================
  function openCartDrawer() {
    const modal = document.getElementById('cart-drawer-modal');
    if (modal) modal.style.display = 'flex';
  }

  function closeCartDrawer() {
    const modal = document.getElementById('cart-drawer-modal');
    if (modal) modal.style.display = 'none';
  }

  function switchMode(newMode) {
    state.mode = newMode;
    const viewStore = document.getElementById('view-storefront');
    const viewAdmin = document.getElementById('view-backoffice');
    const btnStore = document.getElementById('btn-nav-store');
    const btnAdmin = document.getElementById('btn-nav-admin');
    const searchHeader = document.getElementById('header-search-wrapper');

    if (newMode === 'store') {
      viewStore.style.display = 'block';
      viewAdmin.style.display = 'none';
      btnStore.classList.add('active');
      btnAdmin.classList.remove('active');
      if (searchHeader) searchHeader.style.display = 'flex';
      renderProductsCatalog();
    } else {
      viewStore.style.display = 'none';
      viewAdmin.style.display = 'block';
      btnStore.classList.remove('active');
      btnAdmin.classList.add('active');
      if (searchHeader) searchHeader.style.display = 'none';
      switchAdminTab(state.adminTab);
    }
  }

  function switchAdminTab(tabId) {
    state.adminTab = tabId;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.admin-subtab-content').forEach(panel => {
      panel.style.display = 'none';
    });

    const activePanel = document.getElementById(`subtab-${tabId}`);
    if (activePanel) activePanel.style.display = 'block';

    switch (tabId) {
      case 'admin-dashboard':
        renderAdminDashboard();
        break;
      case 'admin-orders':
        renderAdminOrders();
        break;
      case 'admin-quotes':
        // quotes
        break;
      case 'admin-finances':
        renderFinancesTable();
        break;
      case 'admin-inventory':
        renderInventoryTable();
        break;
      case 'admin-clients':
        renderClientsGrid();
        break;
      case 'admin-settings':
        loadSettingsInputs();
        break;
    }
  }

  function loadSettingsInputs() {
    document.getElementById('cfg-sheets-api-url').value = state.config.sheetsApiUrl || '';
    document.getElementById('cfg-rate-bcv').value = state.config.rateBCV || 395.50;
    document.getElementById('cfg-whatsapp').value = state.config.whatsappNumber || '584265604070';
    document.getElementById('cfg-delivery-free-min').value = state.config.deliveryFreeMinUSD || 15.00;
    document.getElementById('cfg-delivery-flat-fee').value = state.config.deliveryFlatFeeUSD || 2.00;
    document.getElementById('cfg-payment-info').value = state.config.paymentInfo || '';
  }

  // ============================================================================
  // INICIALIZACIÓN GLOBAL
  // ============================================================================
  function setupEventListeners() {
    // 1. Selector de modo (Tienda vs Admin)
    document.getElementById('btn-nav-store').addEventListener('click', () => switchMode('store'));
    document.getElementById('btn-nav-admin').addEventListener('click', () => switchMode('admin'));
    document.getElementById('btn-go-home').addEventListener('click', () => switchMode('store'));

    // 2. Carrito
    document.getElementById('btn-open-cart').addEventListener('click', openCartDrawer);
    document.getElementById('btn-close-cart').addEventListener('click', closeCartDrawer);
    document.getElementById('btn-cart-clear').addEventListener('click', () => {
      if (confirm("¿Vaciar todo el pedido actual?")) {
        state.cart = [];
        saveStateLocal();
        updateCartUI();
      }
    });

    document.getElementById('btn-cart-send-whatsapp').addEventListener('click', handleSendWhatsAppOrder);
    document.getElementById('btn-cart-download-quote').addEventListener('click', () => {
      closeCartDrawer();
      showQuoteModal();
    });

    // 3. Tema claro/oscuro
    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      const isDark = document.body.classList.contains('theme-dark');
      localStorage.setItem('TY_THEME', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('TY_THEME') === 'dark') {
      document.body.classList.add('theme-dark');
    }

    // 4. Búsqueda y Ordenamiento
    const searchInput = document.getElementById('global-search-input');
    const clearSearch = document.getElementById('btn-clear-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (clearSearch) clearSearch.style.display = state.searchQuery ? 'block' : 'none';
        renderProductsCatalog();
      });
    }

    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        state.searchQuery = '';
        clearSearch.style.display = 'none';
        renderProductsCatalog();
      });
    }

    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortCriteria = e.target.value;
        renderProductsCatalog();
      });
    }

    // 5. Botones Hero
    const heroKitsBtn = document.getElementById('btn-hero-explore-kits');
    if (heroKitsBtn) {
      heroKitsBtn.addEventListener('click', () => {
        state.activeCategory = 'Kits';
        renderCategoriesBar();
        renderProductsCatalog();
        document.getElementById('catalog-section-title').scrollIntoView({ behavior: 'smooth' });
      });
    }

    // 6. Editar Tasa Rápida
    document.getElementById('btn-quick-edit-rate').addEventListener('click', () => {
      const current = state.config.rateBCV || 395.50;
      const newVal = prompt("Ingresa la nueva tasa del día (Bs / USD):", current);
      if (newVal && !isNaN(newVal) && Number(newVal) > 0) {
        state.config.rateBCV = Number(newVal);
        saveStateLocal();
        document.getElementById('top-rate-display').textContent = `Bs. ${Number(newVal).toFixed(2)} / $`;
        renderProductsCatalog();
        updateCartUI();
        showToast(`Tasa del día actualizada a Bs. ${Number(newVal).toFixed(2)}`, "success");
        if (state.config.sheetsApiUrl) {
          syncWithSheets('update_config', { key: 'TASA_BCV', value: newVal });
        }
      }
    });

    // 7. Sub-tabs del Admin
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab));
    });

    // 8. Filtros de pedidos en Admin
    document.querySelectorAll('[data-order-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-order-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAdminOrders(btn.dataset.orderFilter);
      });
    });

    // 9. Modales Cerrar
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.closeModal;
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
      });
    });

    // 10. Formularios CRUD
    document.getElementById('btn-new-product').addEventListener('click', () => openProductModal(null));
    document.getElementById('form-product-entry').addEventListener('submit', handleSaveProduct);

    document.getElementById('btn-new-finance-entry').addEventListener('click', () => {
      document.getElementById('form-finance-entry').reset();
      document.getElementById('fin-date').value = new Date().toISOString().split('T')[0];
      document.getElementById('modal-finance-entry').style.display = 'flex';
    });
    document.getElementById('btn-dash-new-movement').addEventListener('click', () => {
      document.getElementById('form-finance-entry').reset();
      document.getElementById('fin-date').value = new Date().toISOString().split('T')[0];
      document.getElementById('modal-finance-entry').style.display = 'flex';
    });
    document.getElementById('form-finance-entry').addEventListener('submit', handleSaveFinance);

    // Auto-cálculo de Bs en formulario de finanzas
    document.getElementById('fin-amount-usd').addEventListener('input', (e) => {
      const val = Number(e.target.value) || 0;
      const rate = Number(state.config.rateBCV || 395.50);
      document.getElementById('fin-amount-bs').value = (val * rate).toFixed(2);
    });

    // 11. Búsquedas en Admin
    const finSearch = document.getElementById('finances-search-input');
    if (finSearch) {
      finSearch.addEventListener('input', (e) => renderFinancesTable(e.target.value));
    }

    const invSearch = document.getElementById('inv-search-input');
    if (invSearch) {
      invSearch.addEventListener('input', (e) => renderInventoryTable(e.target.value));
    }

    const cliSearch = document.getElementById('clients-search-input');
    if (cliSearch) {
      cliSearch.addEventListener('input', (e) => renderClientsGrid(e.target.value));
    }

    // 12. Imprimir Cotización
    document.getElementById('btn-print-quote').addEventListener('click', () => window.print());
    document.getElementById('btn-quote-send-wa').addEventListener('click', () => {
      const quoteId = document.getElementById('print-quote-id').textContent;
      const clientName = document.getElementById('print-client-name').textContent;
      const totalUSD = document.getElementById('print-quote-grand-usd').textContent;
      const totalBs = document.getElementById('print-quote-grand-bs').textContent;
      const text = encodeURIComponent(`💅 *TIENDAS YOLO® — COTIZACIÓN FORMAL*\n📄 *ID:* ${quoteId}\n👤 *Para:* ${clientName}\n💎 *TOTAL:* ${totalUSD} (${totalBs})\n_Validez: 7 días continuos. Delivery gratis desde $15 en Maracaibo._`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });

    // 13. Guardar Configuraciones
    document.getElementById('btn-save-sheets-config').addEventListener('click', () => {
      const url = document.getElementById('cfg-sheets-api-url').value.trim();
      state.config.sheetsApiUrl = url;
      saveStateLocal();
      updateCloudIndicator();
      showToast("URL de Google Sheets guardada correctamente.", "success");
    });

    document.getElementById('btn-test-sheets-connection').addEventListener('click', async () => {
      const res = await syncWithSheets('ping');
      const logBox = document.getElementById('cloud-sync-logs');
      if (res.success) {
        logBox.innerHTML = `🟢 <strong>Conexión exitosa:</strong> Backend de Tiendas Yolo respondió OK a las ${new Date().toLocaleTimeString()}.`;
      } else {
        logBox.innerHTML = `⚠️ <strong>Fallo de prueba:</strong> ${res.error || res.message}`;
      }
    });

    document.getElementById('btn-force-cloud-sync').addEventListener('click', async () => {
      const res = await syncWithSheets('get_all_data');
      if (res.success && res.data) {
        if (res.data.inventario && res.data.inventario.length) state.products = res.data.inventario;
        if (res.data.pedidos && res.data.pedidos.length) state.orders = res.data.pedidos;
        if (res.data.finanzas && res.data.finanzas.length) state.finances = res.data.finanzas;
        saveStateLocal();
        renderProductsCatalog();
        renderAdminDashboard();
        showToast("¡Base de datos sincronizada desde la nube!", "success");
      }
    });

    document.getElementById('btn-save-commercial-config').addEventListener('click', () => {
      state.config.rateBCV = Number(document.getElementById('cfg-rate-bcv').value);
      state.config.whatsappNumber = document.getElementById('cfg-whatsapp').value.trim();
      state.config.deliveryFreeMinUSD = Number(document.getElementById('cfg-delivery-free-min').value);
      state.config.deliveryFlatFeeUSD = Number(document.getElementById('cfg-delivery-flat-fee').value);
      state.config.paymentInfo = document.getElementById('cfg-payment-info').value;
      saveStateLocal();
      document.getElementById('top-rate-display').textContent = `Bs. ${state.config.rateBCV.toFixed(2)} / $`;
      renderProductsCatalog();
      updateCartUI();
      showToast("Parámetros comerciales actualizados.", "success");
    });

    // 14. Exportaciones CSV
    document.getElementById('btn-export-orders-csv').addEventListener('click', () => {
      const headers = ["ID", "Fecha", "Cliente", "Telefono", "Tipo Entrega", "Metodo Pago", "Total USD", "Total Bs", "Estado", "Notas"];
      const rows = [headers].concat(state.orders.map(o => [
        o.id, o.fecha, o.cliente, o.telefono, o.tipoEntrega, o.metodoPago, o.totalUSD, o.totalBs, o.estado, o.notas
      ]));
      exportToCSV("Tiendas_Yolo_Pedidos.csv", rows);
    });

    document.getElementById('btn-export-finances-csv').addEventListener('click', () => {
      const headers = ["ID", "Fecha", "Tipo", "Categoria", "Descripcion", "Cuenta", "Monto USD", "Monto Bs", "Referencia"];
      const rows = [headers].concat(state.finances.map(f => [
        f.id, f.fecha, f.tipo, f.categoria, f.descripcion, f.cuentaMetodo, f.montoUSD, f.montoBs, f.idReferencia
      ]));
      exportToCSV("Tiendas_Yolo_Finanzas.csv", rows);
    });

    document.getElementById('btn-export-inventory-csv').addEventListener('click', () => {
      const headers = ["ID", "SKU", "Nombre", "Categoria", "Precio USD", "Costo USD", "Stock Actual", "Stock Minimo", "Unidad"];
      const rows = [headers].concat(state.products.map(p => [
        p.id, p.sku, p.nombre, p.categoria, p.precioUSD, p.costoUSD, p.stockActual, p.stockMinimo, p.unidad
      ]));
      exportToCSV("Tiendas_Yolo_Inventario.csv", rows);
    });

    // 15. Backup JSON
    document.getElementById('btn-download-backup-json').addEventListener('click', () => {
      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem(STORAGE_KEY) || "{}");
      const a = document.createElement('a');
      a.href = jsonStr;
      a.download = `Tiendas_Yolo_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    });

    document.getElementById('input-restore-backup-json').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          try {
            const parsed = JSON.parse(evt.target.result);
            if (parsed.products && parsed.orders) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
              loadInitialState();
              renderCategoriesBar();
              renderProductsCatalog();
              renderAdminDashboard();
              showToast("Copia de seguridad restaurada con éxito.", "success");
            } else {
              showToast("El archivo JSON no tiene la estructura de Tiendas Yolo.", "error");
            }
          } catch (err) {
            showToast("Error al procesar el archivo JSON.", "error");
          }
        };
        reader.readAsText(file);
      }
    });

    // Modal de nueva cotización desde panel
    const btnNewQuote = document.getElementById('btn-open-quote-builder');
    if (btnNewQuote) {
      btnNewQuote.addEventListener('click', () => {
        showQuoteModal({
          cliente: "Academia / Manicurista",
          telefono: "0426-0000000",
          salonAcademia: "Studio Profesional",
          items: state.products.slice(0, 3).map(p => ({
            nombre: p.nombre,
            qty: 2,
            precio: p.precioUSD,
            total: p.precioUSD * 2
          })),
          subtotalUSD: state.products.slice(0, 3).reduce((s, p) => s + (p.precioUSD * 2), 0)
        });
      });
    }
  }

  // ============================================================================
  // ARRANQUE DE LA APLICACIÓN
  // ============================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadInitialState();
    renderCategoriesBar();
    renderProductsCatalog();
    updateCartUI();
    setupEventListeners();

    // Actualizar indicador de tasa en el topbar
    const rateEl = document.getElementById('top-rate-display');
    if (rateEl) {
      rateEl.textContent = `Bs. ${Number(state.config.rateBCV || 395.50).toFixed(2)} / $`;
    }

    console.log("🌸 Tiendas Yolo® Ecosystem iniciado exitosamente.");
  });

})();
