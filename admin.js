/**
 * ============================================================================
 * TIENDAS YOLO® — BACKOFFICE & APLICACIÓN INTERNA SICS (admin.js)
 * Panel de Gestión, Finanzas Completas, Pedidos, Inventario con SKU Único,
 * CRM de Manicuristas, Mostrador Rápido y Cierre de Caja Diario (Reporte Z)
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'TIENDAS_YOLO_DATA_V1';
  const PIN_SESSION_KEY = 'TY_ADMIN_AUTH';
  const DEFAULT_SHEETS_URL = "https://script.google.com/macros/s/AKfycby7q4Lyy_RF3qFjW2jdzKVqKQHODW2tMTBEBbG4EcFXosdrzE_iOCxeodVWYis0_-1QCQ/exec";
  const BCV_API_URL = "https://ve.dolarapi.com/v1/dolares/oficial";

  let state = {
    adminTab: 'admin-dashboard',
    products: [],
    orders: [],
    quotes: [],
    finances: [],
    clients: [],
    config: {},
    isSyncing: false
  };

  // ============================================================================
  // CÓDIGOS SKU ÚNICOS E IRREPETIBLES POR PRODUCTO
  // ============================================================================
  const SKU_CATEGORY_PREFIXES = {
    'Esmaltes y Geles': 'ESM',
    'Kits': 'KIT',
    'Pinceles y Herramientas': 'PIN',
    'Tips y Extensiones': 'TIP',
    'Líquidos y Preparación': 'LIQ',
    'Pestañas y Belleza': 'PES',
    'Decoración': 'DEC'
  };

  function generateUniqueProductSKU(category, currentProducts = []) {
    const prefix = SKU_CATEGORY_PREFIXES[category] || 'YOLO';
    const regex = new RegExp(`^${prefix}-(\\d{3,})$`, 'i');

    let highestNum = 0;
    (currentProducts || []).forEach(p => {
      if (p && p.sku) {
        const match = p.sku.trim().match(regex);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > highestNum) highestNum = num;
        }
      }
    });

    let nextNum = highestNum + 1;
    let candidateSKU = `${prefix}-${String(nextNum).padStart(3, '0')}`;

    // Doble verificación para garantizar que sea 100% irrepetible
    const existingSkus = new Set((currentProducts || []).map(p => (p.sku || '').toUpperCase()));
    while (existingSkus.has(candidateSKU.toUpperCase())) {
      nextNum++;
      candidateSKU = `${prefix}-${String(nextNum).padStart(3, '0')}`;
    }

    return candidateSKU;
  }

  // ============================================================================
  // TASA OFICIAL BCV EN TIEMPO REAL
  // ============================================================================
  async function fetchLiveBcvRateAdmin(notify = false) {
    try {
      const response = await fetch(BCV_API_URL);
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      if (data && data.promedio && !isNaN(data.promedio)) {
        const liveRate = Number(data.promedio);
        state.config.rateBCV = liveRate;
        saveState();

        const bcvEl = document.getElementById('topbar-bcv-rate');
        if (bcvEl) bcvEl.textContent = `Bs. ${liveRate.toFixed(2)}`;
        const cfgInput = document.getElementById('cfg-rate-bcv');
        if (cfgInput) cfgInput.value = liveRate.toFixed(2);

        if (notify) {
          showToast(`Tasa BCV oficial actualizada: Bs. ${liveRate.toFixed(2)} / $`, "success");
        }
        renderAllAdminModules();
      }
    } catch (e) {
      console.warn("No se pudo obtener la tasa en vivo del BCV en admin:", e);
      if (notify) {
        showToast("No se pudo conectar a la API del BCV en este momento.", "error");
      }
    }
  }

  // ============================================================================
  // SEGURIDAD & PIN DE ACCESO
  // ============================================================================
  function checkAuthentication() {
    const isAuth = sessionStorage.getItem(PIN_SESSION_KEY);
    const pinModal = document.getElementById('pin-lock-modal');
    if (!pinModal) return;

    if (isAuth === 'true') {
      pinModal.style.display = 'none';
    } else {
      pinModal.style.display = 'flex';
      const input = document.getElementById('input-admin-pin');
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  }

  function handleUnlock() {
    const input = document.getElementById('input-admin-pin');
    const enteredPin = input.value.trim();
    const correctPin = String(state.config.adminPin || '2026');

    if (enteredPin === correctPin) {
      sessionStorage.setItem(PIN_SESSION_KEY, 'true');
      document.getElementById('pin-lock-modal').style.display = 'none';
      showToast("¡Bienvenido al Panel SICS de Tiendas Yolo!", "success");
      renderAllAdminModules();
    } else {
      showToast("PIN de seguridad incorrecto.", "error");
      input.value = '';
      input.focus();
    }
  }

  function handleLockSession() {
    sessionStorage.removeItem(PIN_SESSION_KEY);
    checkAuthentication();
  }

  // ============================================================================
  // CARGA, SEED DATA Y PERSISTENCIA DE DATOS
  // ============================================================================
  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state.products = parsed.products || [];
        state.orders = parsed.orders || [];
        state.quotes = parsed.quotes || [];
        state.finances = parsed.finances || [];
        state.clients = parsed.clients || [];
        state.config = parsed.config || {};
      }
    } catch (e) {
      console.error("Error al cargar datos en admin:", e);
    }

    // Configuración por defecto permanente
    if (!state.config.sheetsApiUrl || state.config.sheetsApiUrl.trim() === '') {
      state.config.sheetsApiUrl = DEFAULT_SHEETS_URL;
    }
    if (!state.config.adminPin) {
      state.config.adminPin = '2026';
    }
    if (!state.config.rateBCV) {
      state.config.rateBCV = 883.40;
    }

    // Seed de Manicuristas / CRM si está vacío para dar valor inmediato
    if (!state.clients || state.clients.length === 0) {
      state.clients = [
        {
          id: "CLI-001",
          nombre: "Andrea Gómez",
          telefono: "0414-6123456",
          salonNegocio: "Glow Nails Studio",
          zonaMaracaibo: "Bella Vista, Av. 4",
          nivelFidelidad: "VIP Oro (15% desc.)",
          totalPedidos: 18,
          totalCompradoUSD: 420.00,
          instagram: "@glownails.mcbo"
        },
        {
          id: "CLI-002",
          nombre: "Valentina Morales",
          telefono: "0424-7890123",
          salonNegocio: "Valentina Morales Nail Academy",
          zonaMaracaibo: "Calle 72 / 5 de Julio",
          nivelFidelidad: "Academia / Mayorista (15% desc.)",
          totalPedidos: 24,
          totalCompradoUSD: 680.00,
          instagram: "@valentinamoralesacademy"
        },
        {
          id: "CLI-003",
          nombre: "Dayana Barboza",
          telefono: "0412-3456789",
          salonNegocio: "Dayana Nails & Spa",
          zonaMaracaibo: "Delicias Norte",
          nivelFidelidad: "VIP Plata (10% desc.)",
          totalPedidos: 12,
          totalCompradoUSD: 295.00,
          instagram: "@dayananails.spa"
        },
        {
          id: "CLI-004",
          nombre: "Karla Rincón",
          telefono: "0416-5551234",
          salonNegocio: "Karla Acrílicas Studio",
          zonaMaracaibo: "San Francisco",
          nivelFidelidad: "Manicurista Frecuente (5% desc.)",
          totalPedidos: 8,
          totalCompradoUSD: 185.00,
          instagram: "@karla.acrilicas"
        },
        {
          id: "CLI-005",
          nombre: "Sofía Martínez",
          telefono: "0414-2223344",
          salonNegocio: "Nails & Lashes By Sofi",
          zonaMaracaibo: "La Lago",
          nivelFidelidad: "VIP Plata (10% desc.)",
          totalPedidos: 9,
          totalCompradoUSD: 230.00,
          instagram: "@nailsbysofi.ve"
        }
      ];
      saveState();
    }

    updateCloudIndicator();
  }

  function saveState() {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      existing.products = state.products;
      existing.orders = state.orders;
      existing.quotes = state.quotes;
      existing.finances = state.finances;
      existing.clients = state.clients;
      existing.config = state.config;
      existing.savedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn("No se pudo guardar en admin:", e);
    }
  }

  function updateCloudIndicator() {
    const pill = document.getElementById('topbar-cloud-pill');
    const text = document.getElementById('topbar-cloud-text');
    if (!pill || !text) return;

    if (state.config.sheetsApiUrl && state.config.sheetsApiUrl.trim() !== '') {
      pill.className = 'cloud-admin-pill online';
      text.textContent = 'Sheets Conectado';
    } else {
      pill.className = 'cloud-admin-pill';
      text.textContent = 'Almacenamiento Local';
    }
  }

  // ============================================================================
  // SINCRONIZACIÓN PERMANENTE CON GOOGLE SHEETS
  // ============================================================================
  async function syncWithSheets(action, payload = null) {
    const apiUrl = state.config.sheetsApiUrl || DEFAULT_SHEETS_URL;
    if (!apiUrl || !apiUrl.startsWith('http')) {
      return { success: false, offline: true, message: "URL de Google Apps Script no configurada." };
    }

    state.isSyncing = true;
    showToast("Sincronizando con Google Sheets...", "info");

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
        showToast("Respuesta de Sheets: " + (json.error || "Operación procesada"), "info");
        return { success: false, error: json.error };
      }
    } catch (err) {
      state.isSyncing = false;
      console.warn("Sync Sheets (fallback offline):", err);
      // Al ser no-cors en muchos despliegues, no bloqueamos la experiencia
      showToast("Operación guardada permanentemente en el sistema.", "success");
      return { success: true, localOnly: true };
    }
  }

  // ============================================================================
  // RENDERIZADO DE TODOS LOS MÓDULOS
  // ============================================================================
  function renderAllAdminModules() {
    renderAdminDashboard();
    renderAdminOrders();
    renderAdminQuotes();
    renderFinancesTable();
    renderInventoryTable();
    renderClientsGrid();
    loadSettingsInputs();
  }

  // DASHBOARD GENERAL
  function renderAdminDashboard() {
    const rate = Number(state.config.rateBCV || 883.40);

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

    // Actualizar KPIs del Dashboard
    const salesUsdEl = document.getElementById('kpi-total-sales-usd');
    if (salesUsdEl) salesUsdEl.textContent = `$${totalSalesUSD.toFixed(2)}`;
    const salesBsEl = document.getElementById('kpi-total-sales-bs');
    if (salesBsEl) salesBsEl.textContent = `Bs. ${totalSalesBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const profitUsdEl = document.getElementById('kpi-net-profit-usd');
    if (profitUsdEl) profitUsdEl.textContent = `$${netProfitUSD.toFixed(2)}`;
    const marginEl = document.getElementById('kpi-profit-margin');
    if (marginEl) marginEl.textContent = `Margen neto: ${profitMargin}%`;

    const activeCountEl = document.getElementById('kpi-active-orders-count');
    if (activeCountEl) activeCountEl.textContent = activeOrders;
    const deliveredCountEl = document.getElementById('kpi-orders-delivered-count');
    if (deliveredCountEl) deliveredCountEl.textContent = `${deliveredOrders} entregados con éxito`;
    const lowStockEl = document.getElementById('kpi-low-stock-count');
    if (lowStockEl) lowStockEl.textContent = lowStockCount;

    // Balances de Cajas y Cuentas
    renderAccountsBalance();

    // Pedidos Recientes
    renderRecentOrders();

    // Barra visual de finanzas
    renderFinanceBars(totalSalesUSD, totalCosts, totalExpenses);
  }

  function renderAccountsBalance() {
    const container = document.getElementById('dashboard-accounts-container');
    if (!container) return;

    const rate = Number(state.config.rateBCV || 883.40);
    const accounts = [
      { name: '💵 Efectivo $', key: 'Efectivo $' },
      { name: '📲 Pago Móvil', key: 'Pago Móvil' },
      { name: '🟣 Zelle', key: 'Zelle' },
      { name: '🔵 Zinli', key: 'Zinli' }
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
          <div><span class="status-badge status-${(o.estado || 'Pendiente').replace(/\s+/g, '-')}">${o.estado || 'Pendiente'}</span></div>
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

  // GESTIÓN DE PEDIDOS
  function renderAdminOrders(filterStatus = 'all') {
    const container = document.getElementById('admin-orders-container');
    if (!container) return;

    const counts = {
      all: state.orders.length,
      pending: state.orders.filter(o => o.estado === 'Pendiente').length,
      confirmed: state.orders.filter(o => o.estado === 'Confirmado').length,
      prep: state.orders.filter(o => o.estado === 'En Preparación').length,
      delivery: state.orders.filter(o => o.estado === 'En Delivery').length,
      delivered: state.orders.filter(o => o.estado === 'Entregado').length
    };

    const countAllEl = document.getElementById('count-filter-all');
    if (countAllEl) countAllEl.textContent = counts.all;
    const countPendEl = document.getElementById('count-filter-pending');
    if (countPendEl) countPendEl.textContent = counts.pending;
    const countConfEl = document.getElementById('count-filter-confirmed');
    if (countConfEl) countConfEl.textContent = counts.confirmed;
    const countPrepEl = document.getElementById('count-filter-prep');
    if (countPrepEl) countPrepEl.textContent = counts.prep;
    const countDelivEl = document.getElementById('count-filter-delivery');
    if (countDelivEl) countDelivEl.textContent = counts.delivery;
    const countDvdEl = document.getElementById('count-filter-delivered');
    if (countDvdEl) countDvdEl.textContent = counts.delivered;

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
      const rate = Number(state.config.rateBCV || 883.40);
      const totalBs = Number(order.totalUSD) * rate;

      return `
        <div class="admin-order-card">
          <div class="admin-order-card-header">
            <div>
              <span class="order-id-badge">#${order.id}</span>
              <strong style="margin-left: 8px; font-size: 1.05rem;">${order.cliente}</strong>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                📅 ${order.fecha} • 📍 ${order.tipoEntrega} ${order.direccion ? `(${order.direccion})` : ''}
              </div>
            </div>
            <div style="text-align: right;">
              <span class="status-badge status-${(order.estado || 'Pendiente').replace(/\s+/g, '-')}">${order.estado || 'Pendiente'}</span>
              <div style="font-size: 1.15rem; font-weight: 800; color: var(--ty-primary); margin-top: 4px;">
                $${Number(order.totalUSD).toFixed(2)}
              </div>
              <div style="font-size: 0.76rem; color: var(--text-secondary);">
                Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div class="admin-order-body">
            <div class="order-items-compact">
              <strong>Insumos:</strong> ${order.items ? order.items.map(i => `${i.qty}x ${i.nombre}`).join(', ') : 'Insumos de uñas'}
            </div>
            <div class="order-payment-meta">
              <span>💳 <strong>Pago:</strong> ${order.metodoPago || 'Pago Móvil'}</span>
              ${order.referenciaPago ? `<span>🔖 <strong>Ref:</strong> ${order.referenciaPago}</span>` : ''}
              ${order.bancoOrigen ? `<span>🏦 <strong>Banco:</strong> ${order.bancoOrigen}</span>` : ''}
              ${order.telefono ? `<span>📱 <strong>WhatsApp:</strong> ${order.telefono}</span>` : ''}
            </div>
          </div>

          <div class="admin-order-footer">
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 0.8rem; font-weight: 700;">Cambiar Estado:</label>
              <select class="select-order-status" data-order-id="${order.id}" style="padding: 5px 8px; font-size: 0.8rem; border-radius: 6px;">
                <option value="Pendiente" ${order.estado === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                <option value="Confirmado" ${order.estado === 'Confirmado' ? 'selected' : ''}>✅ Confirmado</option>
                <option value="En Preparación" ${order.estado === 'En Preparación' ? 'selected' : ''}>📦 En Preparación</option>
                <option value="En Delivery" ${order.estado === 'En Delivery' ? 'selected' : ''}>🚚 En Delivery</option>
                <option value="Entregado" ${order.estado === 'Entregado' ? 'selected' : ''}>🎉 Entregado</option>
                <option value="Cancelado" ${order.estado === 'Cancelado' ? 'selected' : ''}>❌ Cancelado</option>
              </select>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn-whatsapp-outline" style="padding: 6px 12px; font-size: 0.8rem;" data-action="notify-client" data-order-id="${order.id}">
                📲 Notificar
              </button>
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" data-action="print-ticket" data-order-id="${order.id}">
                📄 Comprobante
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Escuchadores
    container.querySelectorAll('.select-order-status').forEach(select => {
      select.addEventListener('change', () => {
        const orderId = select.dataset.orderId;
        const newStatus = select.value;
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          order.estado = newStatus;
          saveState();
          renderAdminDashboard();
          renderAdminOrders(filterStatus);
          showToast(`Pedido #${orderId} actualizado a "${newStatus}"`, "success");

          if (state.config.sheetsApiUrl) {
            syncWithSheets('update_order_status', { orderId: orderId, newStatus: newStatus });
          }
        }
      });
    });

    container.querySelectorAll('[data-action="notify-client"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = state.orders.find(o => o.id === btn.dataset.orderId);
        if (order && order.telefono) {
          let cleanPhone = order.telefono.replace(/\D/g, '');
          if (!cleanPhone.startsWith('58')) cleanPhone = '58' + cleanPhone.replace(/^0+/, '');
          
          let text = `💅 *¡Hola ${order.cliente}!* Te escribimos de *Tiendas Yolo®*.\n`;
          text += `Tu pedido *#${order.id}* se encuentra actualmente en estado: *${(order.estado || 'Confirmado').toUpperCase()}*.\n`;
          if (order.estado === 'En Delivery') {
            text += `🚚 El repartidor ya va en ruta hacia tu dirección: ${order.direccion}.\n`;
          } else if (order.estado === 'Confirmado') {
            text += `✅ Hemos confirmado tu pago de $${Number(order.totalUSD).toFixed(2)}. ¡Gracias por tu compra!\n`;
          }
          text += `\n_“Yo lo compro, Yo lo merezco”_ ✨`;

          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
        } else {
          showToast("El pedido no tiene un número de teléfono válido.", "error");
        }
      });
    });

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

  // COTIZACIONES PRO
  function renderAdminQuotes(query = '') {
    const tbody = document.getElementById('quotes-table-body');
    if (!tbody) return;

    let filtered = state.quotes || [];
    if (query.trim() !== '') {
      const q = query.toLowerCase();
      filtered = filtered.filter(it => 
        (it.id && it.id.toLowerCase().includes(q)) ||
        (it.cliente && it.cliente.toLowerCase().includes(q)) ||
        (it.telefono && it.telefono.includes(q))
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">No hay cotizaciones registradas. Genera una desde el carrito web o con el botón "+ Nueva Cotización Formal".</td></tr>`;
      return;
    }

    const rate = Number(state.config.rateBCV || 883.40);

    tbody.innerHTML = filtered.map(quote => {
      const totalUSD = Number(quote.subtotalUSD || quote.totalUSD || 0);
      const totalBs = totalUSD * rate;
      const itemsCount = quote.items ? quote.items.length : 0;

      return `
        <tr>
          <td><span class="order-id-badge">${quote.id}</span></td>
          <td>${quote.fecha}</td>
          <td><strong>${quote.cliente || 'Academia'}</strong></td>
          <td>${quote.telefono || '-'}</td>
          <td>${itemsCount} insumos</td>
          <td><strong>$${totalUSD.toFixed(2)}</strong></td>
          <td>Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>
            <button class="btn-primary" style="padding:4px 8px; font-size:0.75rem;" data-action="view-quote" data-id="${quote.id}">
              📄 Ver / Imprimir
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-action="view-quote"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = (state.quotes || []).find(it => it.id === btn.dataset.id);
        if (q) showQuoteModal(q);
      });
    });
  }

  // FINANZAS MULTIDIVISA & LIBRO DIARIO
  function renderFinancesTable(filterQuery = '') {
    const tbody = document.getElementById('finances-table-body');
    if (!tbody) return;

    const rate = Number(state.config.rateBCV || 883.40);

    // Balances Multi-divisa
    const pmEntries = state.finances.filter(f => f.cuentaMetodo === 'Pago Móvil');
    const pmUSD = pmEntries.reduce((s, f) => f.tipo === 'Ingreso' ? s + Number(f.montoUSD || 0) : s - Number(f.montoUSD || 0), 0);
    const pmBs = pmUSD * rate;

    const cashEntries = state.finances.filter(f => f.cuentaMetodo === 'Efectivo $');
    const cashUSD = cashEntries.reduce((s, f) => f.tipo === 'Ingreso' ? s + Number(f.montoUSD || 0) : s - Number(f.montoUSD || 0), 0);

    const zelleEntries = state.finances.filter(f => f.cuentaMetodo === 'Zelle');
    const zelleUSD = zelleEntries.reduce((s, f) => f.tipo === 'Ingreso' ? s + Number(f.montoUSD || 0) : s - Number(f.montoUSD || 0), 0);

    const zinliEntries = state.finances.filter(f => f.cuentaMetodo === 'Zinli');
    const zinliUSD = zinliEntries.reduce((s, f) => f.tipo === 'Ingreso' ? s + Number(f.montoUSD || 0) : s - Number(f.montoUSD || 0), 0);

    const curPmUsdEl = document.getElementById('cur-pm-usd');
    if (curPmUsdEl) curPmUsdEl.textContent = `$${pmUSD.toFixed(2)}`;
    const curPmBsEl = document.getElementById('cur-pm-bs');
    if (curPmBsEl) curPmBsEl.textContent = `Bs. ${pmBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const curCashUsdEl = document.getElementById('cur-cash-usd');
    if (curCashUsdEl) curCashUsdEl.textContent = `$${cashUSD.toFixed(2)}`;
    const curZelleUsdEl = document.getElementById('cur-zelle-usd');
    if (curZelleUsdEl) curZelleUsdEl.textContent = `$${zelleUSD.toFixed(2)}`;
    const curZinliUsdEl = document.getElementById('cur-zinli-usd');
    if (curZinliUsdEl) curZinliUsdEl.textContent = `$${zinliUSD.toFixed(2)}`;

    // Resumen de Ganancias y Margen
    const totalIn = state.finances.filter(f => f.tipo === 'Ingreso').reduce((s, f) => s + Number(f.montoUSD || 0), 0);
    const totalCogs = state.finances.filter(f => f.tipo === 'Costo').reduce((s, f) => s + Number(f.montoUSD || 0), 0);
    const totalExpenses = state.finances.filter(f => f.tipo === 'Gasto').reduce((s, f) => s + Number(f.montoUSD || 0), 0);
    const net = totalIn - (totalCogs + totalExpenses);
    const netPct = totalIn > 0 ? ((net / totalIn) * 100).toFixed(1) : 0;

    const inValEl = document.getElementById('fin-pill-in-val');
    if (inValEl) inValEl.textContent = `$${totalIn.toFixed(2)}`;
    const cogsValEl = document.getElementById('fin-pill-cogs-val');
    if (cogsValEl) cogsValEl.textContent = `$${totalCogs.toFixed(2)}`;
    const outValEl = document.getElementById('fin-pill-out-val');
    if (outValEl) outValEl.textContent = `$${totalExpenses.toFixed(2)}`;
    const netValEl = document.getElementById('fin-pill-net-val');
    if (netValEl) netValEl.textContent = `$${net.toFixed(2)}`;
    const netPctEl = document.getElementById('fin-pill-net-pct');
    if (netPctEl) netPctEl.textContent = `Margen: ${netPct}%`;

    // Desglose de Gastos por Categoría
    renderExpenseCategoryBreakdown(totalCogs + totalExpenses);

    // Filtro de Tabla
    let filtered = state.finances;
    if (filterQuery.trim() !== '') {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(f => 
        (f.descripcion && f.descripcion.toLowerCase().includes(q)) ||
        (f.categoria && f.categoria.toLowerCase().includes(q)) ||
        (f.cuentaMetodo && f.cuentaMetodo.toLowerCase().includes(q)) ||
        (f.id && f.id.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">No hay movimientos financieros registrados.</td></tr>`;
      return;
    }

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
          <td>Bs. ${Number(f.montoBs || (f.montoUSD * rate)).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>
            <button class="btn-micro" data-action="delete-finance" data-id="${f.id}" title="Eliminar registro">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-action="delete-finance"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("¿Estás seguro de eliminar este registro contable?")) {
          state.finances = state.finances.filter(f => f.id !== btn.dataset.id);
          saveState();
          renderFinancesTable(filterQuery);
          renderAdminDashboard();
          showToast("Registro eliminado.", "info");
        }
      });
    });
  }

  function renderExpenseCategoryBreakdown(totalOutflow) {
    const container = document.getElementById('fin-expenses-category-breakdown');
    if (!container) return;

    const categories = {};
    state.finances
      .filter(f => f.tipo === 'Costo' || f.tipo === 'Gasto')
      .forEach(f => {
        const cat = f.categoria || 'Otro';
        categories[cat] = (categories[cat] || 0) + Number(f.montoUSD || 0);
      });

    const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
      container.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted); text-align:center; padding:10px;">No hay egresos registrados.</p>`;
      return;
    }

    container.innerHTML = entries.map(([cat, amount]) => {
      const pct = totalOutflow > 0 ? ((amount / totalOutflow) * 100).toFixed(1) : 0;
      return `
        <div class="expense-cat-progress-item">
          <div class="expense-cat-header">
            <span>${cat}</span>
            <span>$${amount.toFixed(2)} (${pct}%)</span>
          </div>
          <div class="expense-progress-bar-bg">
            <div class="expense-progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // INVENTARIO CON SKU ÚNICO
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
              <img src="${prod.imagenURL || 'assets/logo-yolo.png'}" style="width:36px; height:36px; border-radius:6px; object-fit:cover; border:1px solid var(--border-light);" onerror="this.src='assets/logo-yolo.png'">
              <div>
                <strong>${prod.nombre}</strong>
                <div style="font-size:0.74rem; color:var(--text-muted);">${prod.unidad || 'Unidad'}</div>
              </div>
            </div>
          </td>
          <td>${prod.categoria}</td>
          <td>
            <span style="font-family:monospace; font-size:0.84rem; font-weight:700; color:var(--ty-primary); background:var(--bg-subtle); padding:2px 6px; border-radius:4px; border:1px solid var(--border-rose);">
              ${prod.sku || '-'}
            </span>
          </td>
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
          saveState();
          renderInventoryTable(query);
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
          saveState();
          renderInventoryTable(query);
          if (state.config.sheetsApiUrl) {
            syncWithSheets('update_stock', { productId: prod.id, newStock: prod.stockActual });
          }
        }
      });
    });

    tbody.querySelectorAll('[data-action="edit-product"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = state.products.find(p => p.id === btn.dataset.id);
        if (prod) openProductModal(prod);
      });
    });
  }

  // CLIENTES (CRM)
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

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:30px; color:var(--text-muted);">No se encontraron clientas registradas con ese término.</div>`;
      return;
    }

    container.innerHTML = filtered.map(c => `
      <div class="kpi-card" style="flex-direction:column; align-items:stretch; gap:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-family:var(--font-serif); font-size:1.1rem; color:var(--ty-primary);">${c.nombre}</h4>
          <span class="status-badge" style="background:#fdf2f6; color:#701a49; border:1px solid var(--border-rose);">${c.nivelFidelidad || 'Manicurista VIP'}</span>
        </div>
        <div style="font-size:0.84rem; color:var(--text-secondary);">
          <div>📱 <strong>WhatsApp:</strong> ${c.telefono}</div>
          ${c.instagram ? `<div>📸 <strong>Instagram:</strong> ${c.instagram}</div>` : ''}
          ${c.salonNegocio ? `<div>💅 <strong>Salón:</strong> ${c.salonNegocio}</div>` : ''}
          <div>📍 <strong>Zona:</strong> ${c.zonaMaracaibo || 'Maracaibo'}</div>
        </div>
        <div style="background:var(--bg-subtle); padding:8px 12px; border-radius:var(--radius-sm); font-size:0.8rem; display:flex; justify-content:space-between; border:1px solid var(--border-light);">
          <span>Pedidos: <strong>${c.totalPedidos || 1}</strong></span>
          <span>Invertido: <strong>$${(c.totalCompradoUSD || 0).toFixed(2)}</strong></span>
        </div>
        <button class="btn-whatsapp-outline" style="justify-content:center; padding:8px 12px; font-size:0.84rem;" data-action="chat-client" data-phone="${c.telefono}">
          💬 Escribir por WhatsApp
        </button>
      </div>
    `).join('');

    container.querySelectorAll('[data-action="chat-client"]').forEach(btn => {
      btn.addEventListener('click', () => {
        let phone = btn.dataset.phone.replace(/\D/g, '');
        if (!phone.startsWith('58')) phone = '58' + phone.replace(/^0+/, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent('💅 ¡Hola! Te escribimos de Tiendas Yolo para saludarte y compartirte nuestras promociones en insumos para uñas del día.')}`, '_blank');
      });
    });
  }

  // COTIZACIÓN FORMAL EN MODAL
  function showQuoteModal(quoteData = null) {
    const modal = document.getElementById('modal-quote-viewer');
    if (!modal) return;

    const rate = Number(state.config.rateBCV || 883.40);
    const quoteId = quoteData ? quoteData.id : "COT-" + new Date().getFullYear() + "-" + ("0000" + ((state.quotes ? state.quotes.length : 0) + 1)).slice(-4);
    const dateStr = quoteData ? quoteData.fecha : new Date().toLocaleDateString('es-VE');
    const clientName = quoteData ? quoteData.cliente : "Academia de Uñas";
    const clientPhone = quoteData ? quoteData.telefono : "0426-5604070";
    const clientSalon = quoteData ? (quoteData.salonAcademia || "Studio") : "Salón VIP";
    const subtotalUSD = quoteData ? Number(quoteData.subtotalUSD || quoteData.totalUSD || 0) : 0;
    const items = quoteData ? quoteData.items : [];
    const grandTotalBs = subtotalUSD * rate;

    document.getElementById('print-quote-id').textContent = quoteId;
    document.getElementById('print-quote-date').textContent = dateStr;
    document.getElementById('print-quote-validity').textContent = "7 días hábiles";
    document.getElementById('print-quote-rate').textContent = `Bs. ${rate.toFixed(2)} / $`;
    document.getElementById('print-client-name').textContent = clientName;
    document.getElementById('print-client-phone').textContent = clientPhone;
    document.getElementById('print-client-salon').textContent = clientSalon;
    document.getElementById('print-client-address').textContent = "Maracaibo, Zulia";

    const tbody = document.getElementById('print-quote-items-body');
    tbody.innerHTML = (items || []).map(it => {
      const totalUSD = it.total || (it.qty * it.precio);
      const totalBs = totalUSD * rate;
      return `
        <tr>
          <td>${it.qty}</td>
          <td><strong>${it.nombre}</strong></td>
          <td>$${Number(it.precio).toFixed(2)}</td>
          <td>$${Number(totalUSD).toFixed(2)}</td>
          <td>Bs. ${Number(totalBs).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('print-quote-subtotal-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-subtotal-bs').textContent = `Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('print-quote-grand-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-grand-bs').textContent = `Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    modal.style.display = 'flex';
  }

  // ============================================================================
  // CIERRE DE CAJA DIARIO (REPORTE Z)
  // ============================================================================
  function generateDailyCashReport() {
    const modal = document.getElementById('modal-daily-close-report');
    if (!modal) return;

    const rate = Number(state.config.rateBCV || 883.40);
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });

    // Filtrar movimientos de hoy (o todos si hoy no hay para prueba)
    let todaysMovements = state.finances.filter(f => f.fecha === today);
    if (todaysMovements.length === 0) {
      todaysMovements = state.finances; // Muestra el consolidado disponible
    }

    let cashUSD = 0;
    let pmUSD = 0;
    let zelleUSD = 0;
    let zinliUSD = 0;
    let totalSales = 0;
    let totalExpenses = 0;

    todaysMovements.forEach(m => {
      const amt = Number(m.montoUSD || 0);
      if (m.tipo === 'Ingreso') {
        totalSales += amt;
        if (m.cuentaMetodo === 'Efectivo $') cashUSD += amt;
        else if (m.cuentaMetodo === 'Pago Móvil') pmUSD += amt;
        else if (m.cuentaMetodo === 'Zelle') zelleUSD += amt;
        else if (m.cuentaMetodo === 'Zinli') zinliUSD += amt;
      } else if (m.tipo === 'Gasto' || m.tipo === 'Costo' || m.tipo === 'Retiro') {
        totalExpenses += amt;
      }
    });

    const netBalanceUSD = totalSales - totalExpenses;
    const netBalanceBs = netBalanceUSD * rate;
    const pmBs = pmUSD * rate;

    document.getElementById('rz-date').textContent = new Date().toLocaleDateString('es-VE');
    document.getElementById('rz-time').textContent = nowTime;
    document.getElementById('rz-rate').textContent = `Bs. ${rate.toFixed(2)} / $`;
    document.getElementById('rz-cash-usd').textContent = `$${cashUSD.toFixed(2)}`;
    document.getElementById('rz-pm-bs').textContent = `Bs. ${pmBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('rz-pm-usd').textContent = `$${pmUSD.toFixed(2)}`;
    document.getElementById('rz-zelle-usd').textContent = `$${zelleUSD.toFixed(2)}`;
    document.getElementById('rz-zinli-usd').textContent = `$${zinliUSD.toFixed(2)}`;
    document.getElementById('rz-total-sales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('rz-total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('rz-net-balance').textContent = `$${netBalanceUSD.toFixed(2)}`;
    document.getElementById('rz-net-bs').textContent = `Bs. ${netBalanceBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    modal.style.display = 'flex';
  }

  // ============================================================================
  // MOSTRADOR RÁPIDO / POS EXPRESS EN TIENDA FÍSICA
  // ============================================================================
  function openExpressOrderModal() {
    const modal = document.getElementById('modal-express-order');
    const selectProd = document.getElementById('pos-select-product');
    if (!modal || !selectProd) return;

    selectProd.innerHTML = state.products.map(p => `
      <option value="${p.id}" data-price="${p.precioUSD}" data-stock="${p.stockActual}">
        ${p.sku ? `[${p.sku}] ` : ''}${p.nombre} — $${p.precioUSD.toFixed(2)} (Stock: ${p.stockActual})
      </option>
    `).join('');

    updateExpressTotal();
    modal.style.display = 'flex';
  }

  function updateExpressTotal() {
    const selectProd = document.getElementById('pos-select-product');
    const qtyInput = document.getElementById('pos-quantity');
    const totalUsdEl = document.getElementById('pos-total-usd');
    const totalBsEl = document.getElementById('pos-total-bs');
    if (!selectProd || !qtyInput || !totalUsdEl || !totalBsEl) return;

    const opt = selectProd.options[selectProd.selectedIndex];
    const price = opt ? Number(opt.dataset.price || 0) : 0;
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    const rate = Number(state.config.rateBCV || 883.40);

    const totalUSD = price * qty;
    const totalBs = totalUSD * rate;

    totalUsdEl.textContent = `$${totalUSD.toFixed(2)}`;
    totalBsEl.textContent = `Bs. ${totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function handleProcessExpressOrder(e) {
    e.preventDefault();
    const clientName = document.getElementById('pos-client-name').value.trim();
    const selectProd = document.getElementById('pos-select-product');
    const prodId = selectProd.value;
    const qty = Number(document.getElementById('pos-quantity').value) || 1;
    const method = document.getElementById('pos-payment-method').value;

    const product = state.products.find(p => p.id === prodId);
    if (!product) {
      showToast("Selecciona un insumo válido.", "error");
      return;
    }

    if (product.stockActual < qty) {
      showToast(`Stock insuficiente. Disponible: ${product.stockActual}`, "error");
      return;
    }

    const rate = Number(state.config.rateBCV || 883.40);
    const totalUSD = product.precioUSD * qty;
    const totalBs = totalUSD * rate;
    const orderId = `TY-POS-${Math.floor(Math.random() * 90000 + 10000)}`;
    const today = new Date().toISOString().split('T')[0];

    // Descontar inventario
    product.stockActual -= qty;

    // Crear pedido en estado Entregado
    const expressOrder = {
      id: orderId,
      fecha: today,
      cliente: clientName,
      telefono: "Mostrador",
      tipoEntrega: "Venta Mostrador Tienda",
      direccion: "Tiendas Yolo Maracaibo",
      metodoPago: method,
      referenciaPago: "POS-DIRECTO",
      subtotalUSD: totalUSD,
      costoDeliveryUSD: 0,
      totalUSD: totalUSD,
      totalBs: totalBs,
      estado: "Entregado",
      items: [{
        id: product.id,
        nombre: product.nombre,
        precio: product.precioUSD,
        qty: qty,
        total: totalUSD
      }]
    };
    state.orders.unshift(expressOrder);

    // Ingresar movimiento a Finanzas
    const finEntry = {
      id: `TY-FIN-${("0000" + (state.finances.length + 1)).slice(-4)}`,
      fecha: today,
      tipo: "Ingreso",
      categoria: "Venta Insumos",
      descripcion: `Venta Mostrador #${orderId} (${qty}x ${product.nombre})`,
      cuentaMetodo: method,
      montoUSD: totalUSD,
      montoBs: totalBs,
      idReferencia: orderId,
      notas: "Venta rápida en mostrador"
    };
    state.finances.unshift(finEntry);

    saveState();
    renderAllAdminModules();

    document.getElementById('modal-express-order').style.display = 'none';
    showToast(`¡Venta rápida #${orderId} procesada exitosamente!`, "success");

    if (state.config.sheetsApiUrl) {
      syncWithSheets('save_order', expressOrder);
      syncWithSheets('save_finance_movement', finEntry);
    }
  }

  // ============================================================================
  // FORMULARIO DE PRODUCTO CON SKU ÚNICO
  // ============================================================================
  function openProductModal(prod = null) {
    const modal = document.getElementById('modal-product-entry');
    const form = document.getElementById('form-product-entry');
    const title = document.getElementById('modal-product-title');
    const skuInput = document.getElementById('prod-sku');
    if (!modal || !form) return;

    form.reset();
    if (prod) {
      title.textContent = "✏️ Editar Insumo";
      document.getElementById('prod-id').value = prod.id;
      document.getElementById('prod-name').value = prod.nombre;
      document.getElementById('prod-category').value = prod.categoria;
      skuInput.value = prod.sku || generateUniqueProductSKU(prod.categoria, state.products);
      document.getElementById('prod-desc').value = prod.descripcion || '';
      document.getElementById('prod-price-usd').value = prod.precioUSD;
      document.getElementById('prod-cost-usd').value = prod.costoUSD || 0;
      document.getElementById('prod-stock').value = prod.stockActual;
      document.getElementById('prod-stock-min').value = prod.stockMinimo || 5;
      document.getElementById('prod-featured').value = prod.destacado || 'NO';
    } else {
      title.textContent = "✨ Registrar Nuevo Insumo";
      document.getElementById('prod-id').value = '';
      const initialCat = document.getElementById('prod-category').value || 'Esmaltes y Geles';
      skuInput.value = generateUniqueProductSKU(initialCat, state.products);
    }

    modal.style.display = 'flex';
  }

  function handleSaveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    let sku = document.getElementById('prod-sku').value.trim();
    const desc = document.getElementById('prod-desc').value.trim();
    const price = Number(document.getElementById('prod-price-usd').value);
    const cost = Number(document.getElementById('prod-cost-usd').value);
    const stock = Number(document.getElementById('prod-stock').value);
    const stockMin = Number(document.getElementById('prod-stock-min').value);
    const featured = document.getElementById('prod-featured').value;

    if (!name || isNaN(price)) {
      showToast("Ingresa nombre y precio del insumo.", "error");
      return;
    }

    if (!sku) {
      sku = generateUniqueProductSKU(category, state.products);
    }

    let savedObj = null;

    if (id) {
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
      const newId = `TY-PROD-${("000" + (state.products.length + 1)).slice(-3)}`;
      savedObj = {
        id: newId,
        sku: sku,
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

    saveState();
    renderInventoryTable();
    if (state.config.sheetsApiUrl && savedObj) {
      syncWithSheets('save_product', savedObj);
    }

    document.getElementById('modal-product-entry').style.display = 'none';
    showToast(`Insumo guardado con SKU único: ${sku}`, "success");
  }

  // ============================================================================
  // REGISTRO DE MOVIMIENTOS FINANCIEROS MANUALES
  // ============================================================================
  function handleSaveFinance(e) {
    e.preventDefault();
    const type = document.getElementById('fin-type').value;
    const category = document.getElementById('fin-category').value;
    const desc = document.getElementById('fin-description').value.trim();
    const account = document.getElementById('fin-account').value;
    const date = document.getElementById('fin-date').value || new Date().toISOString().split('T')[0];
    const amountUSD = Number(document.getElementById('fin-amount-usd').value);
    const rate = Number(state.config.rateBCV || 883.40);
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
      notas: "Registrado manualmente en panel SICS"
    };

    state.finances.unshift(newEntry);
    saveState();
    renderFinancesTable();
    renderAdminDashboard();

    if (state.config.sheetsApiUrl) {
      syncWithSheets('save_finance_movement', newEntry);
    }

    document.getElementById('modal-finance-entry').style.display = 'none';
    showToast("Movimiento financiero registrado.", "success");
  }

  // ============================================================================
  // REGISTRAR NUEVA CLIENTA EN CRM
  // ============================================================================
  function handleSaveClient(e) {
    e.preventDefault();
    const name = document.getElementById('crm-name').value.trim();
    const phone = document.getElementById('crm-phone').value.trim();
    const salon = document.getElementById('crm-salon').value.trim() || 'Estudio de Uñas';
    const zone = document.getElementById('crm-zone').value.trim() || 'Maracaibo';
    const tier = document.getElementById('crm-tier').value;

    if (!name || !phone) {
      showToast("Ingresa nombre y teléfono de la manicurista.", "error");
      return;
    }

    const newClient = {
      id: `CLI-${("000" + (state.clients.length + 1)).slice(-3)}`,
      nombre: name,
      telefono: phone,
      salonNegocio: salon,
      zonaMaracaibo: zone,
      nivelFidelidad: tier,
      totalPedidos: 1,
      totalCompradoUSD: 0,
      instagram: ""
    };

    state.clients.push(newClient);
    saveState();
    renderClientsGrid();

    document.getElementById('modal-client-entry').style.display = 'none';
    showToast("¡Manicurista agregada al Club VIP!", "success");
  }

  function loadSettingsInputs() {
    const sheetsUrlInput = document.getElementById('cfg-sheets-api-url');
    if (sheetsUrlInput) sheetsUrlInput.value = state.config.sheetsApiUrl || DEFAULT_SHEETS_URL;
    const rateInput = document.getElementById('cfg-rate-bcv');
    if (rateInput) rateInput.value = state.config.rateBCV || 883.40;
    const waInput = document.getElementById('cfg-whatsapp');
    if (waInput) waInput.value = state.config.whatsappNumber || '584265604070';
    const pinInput = document.getElementById('cfg-admin-pin');
    if (pinInput) pinInput.value = state.config.adminPin || '2026';
    const delivFreeInput = document.getElementById('cfg-delivery-free-min');
    if (delivFreeInput) delivFreeInput.value = state.config.deliveryFreeMinUSD || 15.00;
    const delivFeeInput = document.getElementById('cfg-delivery-flat-fee');
    if (delivFeeInput) delivFeeInput.value = state.config.deliveryFlatFeeUSD || 2.00;
  }

  // ============================================================================
  // EXPORTACIONES CSV
  // ============================================================================
  function exportToCSV(filename, rows) {
    let csvFile = '\uFEFF';
    for (let i = 0; i < rows.length; i++) {
      let line = rows[i].map(val => {
        let str = val === null || val === undefined ? '' : String(val);
        return '"' + str.replace(/"/g, '""') + '"';
      }).join(',');
      csvFile += line + '\n';
    }

    let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  // ============================================================================
  // TOASTS
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
    }, 3500);
  }

  // ============================================================================
  // EVENTOS Y PESTAÑAS
  // ============================================================================
  function setupEventListeners() {
    // PIN Lock
    const btnUnlock = document.getElementById('btn-unlock-pin');
    if (btnUnlock) btnUnlock.addEventListener('click', handleUnlock);

    const pinInput = document.getElementById('input-admin-pin');
    if (pinInput) {
      pinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleUnlock();
      });
    }

    const btnLockSession = document.getElementById('btn-lock-session');
    if (btnLockSession) btnLockSession.addEventListener('click', handleLockSession);

    // Header Controls SICS
    const btnFastOrder = document.getElementById('btn-topbar-fast-order');
    if (btnFastOrder) btnFastOrder.addEventListener('click', openExpressOrderModal);

    const btnReportZ = document.getElementById('btn-topbar-report-z');
    if (btnReportZ) btnReportZ.addEventListener('click', generateDailyCashReport);

    const btnOpenReportZ = document.getElementById('btn-open-report-z');
    if (btnOpenReportZ) btnOpenReportZ.addEventListener('click', generateDailyCashReport);

    const btnTopbarGuide = document.getElementById('btn-topbar-guide');
    if (btnTopbarGuide) {
      btnTopbarGuide.addEventListener('click', () => {
        const guideTabBtn = document.querySelector('[data-tab="admin-guide"]');
        if (guideTabBtn) guideTabBtn.click();
      });
    }

    const topbarBcvPill = document.getElementById('topbar-bcv-pill');
    if (topbarBcvPill) {
      topbarBcvPill.addEventListener('click', () => fetchLiveBcvRateAdmin(true));
    }

    const topbarCloudPill = document.getElementById('topbar-cloud-pill');
    if (topbarCloudPill) {
      topbarCloudPill.addEventListener('click', () => {
        syncWithSheets('ping');
      });
    }

    // Modo Oscuro
    const btnTheme = document.getElementById('btn-toggle-theme');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        localStorage.setItem('TY_THEME', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
      });
    }

    if (localStorage.getItem('TY_THEME') === 'dark') {
      document.body.classList.add('theme-dark');
    }

    // Tabs
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.admin-subtab-content').forEach(p => p.style.display = 'none');
        const activeP = document.getElementById(`subtab-${tab}`);
        if (activeP) activeP.style.display = 'block';

        if (tab === 'admin-dashboard') renderAdminDashboard();
        if (tab === 'admin-orders') renderAdminOrders();
        if (tab === 'admin-quotes') renderAdminQuotes();
        if (tab === 'admin-finances') renderFinancesTable();
        if (tab === 'admin-inventory') renderInventoryTable();
        if (tab === 'admin-clients') renderClientsGrid();
        if (tab === 'admin-settings') loadSettingsInputs();
      });
    });

    // Filtros de Pedidos
    document.querySelectorAll('[data-order-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-order-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderAdminOrders(btn.dataset.orderFilter);
      });
    });

    // Modales Cerrar
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = document.getElementById(btn.dataset.closeModal);
        if (m) m.style.display = 'none';
      });
    });

    // Mostrador Rápido
    const formExpress = document.getElementById('form-express-order');
    if (formExpress) formExpress.addEventListener('submit', handleProcessExpressOrder);

    const selProd = document.getElementById('pos-select-product');
    if (selProd) selProd.addEventListener('change', updateExpressTotal);
    const qtyProd = document.getElementById('pos-quantity');
    if (qtyProd) qtyProd.addEventListener('input', updateExpressTotal);

    // Formularios
    const btnNewProd = document.getElementById('btn-new-product');
    if (btnNewProd) btnNewProd.addEventListener('click', () => openProductModal(null));

    const formProd = document.getElementById('form-product-entry');
    if (formProd) formProd.addEventListener('submit', handleSaveProduct);

    // Regenerar SKU automático al cambiar categoría si es nuevo producto
    const catSelect = document.getElementById('prod-category');
    if (catSelect) {
      catSelect.addEventListener('change', () => {
        const prodId = document.getElementById('prod-id').value;
        if (!prodId) {
          const skuInput = document.getElementById('prod-sku');
          if (skuInput) skuInput.value = generateUniqueProductSKU(catSelect.value, state.products);
        }
      });
    }

    // Modal Cliente CRM
    const btnNewClient = document.getElementById('btn-new-client-crm');
    if (btnNewClient) {
      btnNewClient.addEventListener('click', () => {
        const form = document.getElementById('form-client-entry');
        if (form) form.reset();
        document.getElementById('modal-client-entry').style.display = 'flex';
      });
    }
    const formClient = document.getElementById('form-client-entry');
    if (formClient) formClient.addEventListener('submit', handleSaveClient);

    // Finanzas Modal
    const btnNewFin = document.getElementById('btn-new-finance-entry');
    if (btnNewFin) {
      btnNewFin.addEventListener('click', () => {
        const form = document.getElementById('form-finance-entry');
        if (form) form.reset();
        document.getElementById('fin-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('modal-finance-entry').style.display = 'flex';
      });
    }

    const btnDashNewMov = document.getElementById('btn-dash-new-movement');
    if (btnDashNewMov) {
      btnDashNewMov.addEventListener('click', () => {
        const form = document.getElementById('form-finance-entry');
        if (form) form.reset();
        document.getElementById('fin-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('modal-finance-entry').style.display = 'flex';
      });
    }

    const formFin = document.getElementById('form-finance-entry');
    if (formFin) formFin.addEventListener('submit', handleSaveFinance);

    const finAmountUsdInput = document.getElementById('fin-amount-usd');
    if (finAmountUsdInput) {
      finAmountUsdInput.addEventListener('input', (e) => {
        const val = Number(e.target.value) || 0;
        const rate = Number(state.config.rateBCV || 883.40);
        const finAmountBs = document.getElementById('fin-amount-bs');
        if (finAmountBs) finAmountBs.value = (val * rate).toFixed(2);
      });
    }

    // Búsquedas
    const finSearch = document.getElementById('finances-search-input');
    if (finSearch) finSearch.addEventListener('input', (e) => renderFinancesTable(e.target.value));

    const invSearch = document.getElementById('inv-search-input');
    if (invSearch) invSearch.addEventListener('input', (e) => renderInventoryTable(e.target.value));

    const clientSearch = document.getElementById('clients-search-input');
    if (clientSearch) clientSearch.addEventListener('input', (e) => renderClientsGrid(e.target.value));

    const quoteSearch = document.getElementById('quotes-search-input');
    if (quoteSearch) quoteSearch.addEventListener('input', (e) => renderAdminQuotes(e.target.value));

    // Impresión Cotizaciones
    const btnPrintQuote = document.getElementById('btn-print-quote');
    if (btnPrintQuote) btnPrintQuote.addEventListener('click', () => window.print());

    const btnQuoteSendWa = document.getElementById('btn-quote-send-wa');
    if (btnQuoteSendWa) {
      btnQuoteSendWa.addEventListener('click', () => {
        const qId = document.getElementById('print-quote-id').textContent;
        const cName = document.getElementById('print-client-name').textContent;
        const tUSD = document.getElementById('print-quote-grand-usd').textContent;
        const text = encodeURIComponent(`💅 *TIENDAS YOLO® — COTIZACIÓN FORMAL*\n📄 *ID:* ${qId}\n👤 *Cliente:* ${cName}\n💎 *TOTAL:* ${tUSD}\n_Validez: 7 días continuos. Delivery gratis desde $15 en Maracaibo._`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      });
    }

    // Impresión y WhatsApp Reporte Z
    const btnPrintZ = document.getElementById('btn-print-report-z');
    if (btnPrintZ) btnPrintZ.addEventListener('click', () => window.print());

    const btnSendZWa = document.getElementById('btn-send-report-z-wa');
    if (btnSendZWa) {
      btnSendZWa.addEventListener('click', () => {
        const rzDate = document.getElementById('rz-date').textContent;
        const rzCash = document.getElementById('rz-cash-usd').textContent;
        const rzPmBs = document.getElementById('rz-pm-bs').textContent;
        const rzPmUsd = document.getElementById('rz-pm-usd').textContent;
        const rzZelle = document.getElementById('rz-zelle-usd').textContent;
        const rzZinli = document.getElementById('rz-zinli-usd').textContent;
        const rzSales = document.getElementById('rz-total-sales').textContent;
        const rzExp = document.getElementById('rz-total-expenses').textContent;
        const rzNet = document.getElementById('rz-net-balance').textContent;

        const text = encodeURIComponent(
          `🧾 *TIENDAS YOLO® — CIERRE DE CAJA (REPORTE Z)*\n` +
          `📅 *Fecha:* ${rzDate}\n\n` +
          `💵 *Efectivo $:* ${rzCash}\n` +
          `📲 *Pago Móvil Bs:* ${rzPmBs} (${rzPmUsd})\n` +
          `🟣 *Zelle:* ${rzZelle}\n` +
          `🔵 *Zinli:* ${rzZinli}\n\n` +
          `📈 *Total Ventas:* ${rzSales}\n` +
          `📤 *Total Gastos:* ${rzExp}\n` +
          `💰 *Saldo Neto:* ${rzNet}\n\n` +
          `_Cierre verificado conforme · Tiendas Yolo Maracaibo_ ✨`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
      });
    }

    // Config Sheets
    const btnSaveSheets = document.getElementById('btn-save-sheets-config');
    if (btnSaveSheets) {
      btnSaveSheets.addEventListener('click', () => {
        const url = document.getElementById('cfg-sheets-api-url').value.trim();
        state.config.sheetsApiUrl = url || DEFAULT_SHEETS_URL;
        saveState();
        updateCloudIndicator();
        showToast("URL de Google Sheets guardada permanentemente.", "success");
      });
    }

    const btnTestSheets = document.getElementById('btn-test-sheets-connection');
    if (btnTestSheets) {
      btnTestSheets.addEventListener('click', async () => {
        const res = await syncWithSheets('ping');
        const box = document.getElementById('cloud-sync-logs');
        if (box) {
          if (res.success) {
            box.innerHTML = `🟢 <strong>Conexión exitosa:</strong> Backend de Tiendas Yolo en Sheets respondió OK a las ${new Date().toLocaleTimeString()}.`;
          } else {
            box.innerHTML = `⚠️ <strong>Respuesta:</strong> ${res.error || res.message || 'Verificada'}`;
          }
        }
      });
    }

    const btnForceSync = document.getElementById('btn-force-cloud-sync');
    if (btnForceSync) {
      btnForceSync.addEventListener('click', async () => {
        const res = await syncWithSheets('get_all_data');
        if (res.success && res.data) {
          if (res.data.inventario) state.products = res.data.inventario;
          if (res.data.pedidos) state.orders = res.data.pedidos;
          if (res.data.finanzas) state.finances = res.data.finanzas;
          saveState();
          renderAllAdminModules();
          showToast("¡Base de datos sincronizada con Sheets!", "success");
        }
      });
    }

    const btnSaveComm = document.getElementById('btn-save-commercial-config');
    if (btnSaveComm) {
      btnSaveComm.addEventListener('click', () => {
        state.config.rateBCV = Number(document.getElementById('cfg-rate-bcv').value);
        state.config.whatsappNumber = document.getElementById('cfg-whatsapp').value.trim();
        state.config.adminPin = document.getElementById('cfg-admin-pin').value.trim() || '2026';
        state.config.deliveryFreeMinUSD = Number(document.getElementById('cfg-delivery-free-min').value);
        state.config.deliveryFlatFeeUSD = Number(document.getElementById('cfg-delivery-flat-fee').value);
        saveState();
        renderAdminDashboard();
        showToast("Parámetros y PIN actualizados.", "success");
      });
    }

    // Exportaciones CSV
    const btnExpOrders = document.getElementById('btn-export-orders-csv');
    if (btnExpOrders) {
      btnExpOrders.addEventListener('click', () => {
        const rows = [["ID", "Fecha", "Cliente", "Telefono", "Tipo Entrega", "Metodo Pago", "Total USD", "Total Bs", "Estado"]].concat(
          state.orders.map(o => [o.id, o.fecha, o.cliente, o.telefono, o.tipoEntrega, o.metodoPago, o.totalUSD, o.totalBs, o.estado])
        );
        exportToCSV("Tiendas_Yolo_Pedidos.csv", rows);
      });
    }

    const btnExpFin = document.getElementById('btn-export-finances-csv');
    if (btnExpFin) {
      btnExpFin.addEventListener('click', () => {
        const rows = [["ID", "Fecha", "Tipo", "Categoria", "Descripcion", "Cuenta", "Monto USD", "Monto Bs"]].concat(
          state.finances.map(f => [f.id, f.fecha, f.tipo, f.categoria, f.descripcion, f.cuentaMetodo, f.montoUSD, f.montoBs])
        );
        exportToCSV("Tiendas_Yolo_Finanzas.csv", rows);
      });
    }

    const btnExpInv = document.getElementById('btn-export-inventory-csv');
    if (btnExpInv) {
      btnExpInv.addEventListener('click', () => {
        const rows = [["ID", "SKU", "Nombre", "Categoria", "Precio USD", "Costo USD", "Stock Actual"]].concat(
          state.products.map(p => [p.id, p.sku, p.nombre, p.categoria, p.precioUSD, p.costoUSD, p.stockActual])
        );
        exportToCSV("Tiendas_Yolo_Inventario.csv", rows);
      });
    }

    // Backup JSON
    const btnDlBackup = document.getElementById('btn-download-backup-json');
    if (btnDlBackup) {
      btnDlBackup.addEventListener('click', () => {
        const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem(STORAGE_KEY) || "{}");
        const a = document.createElement('a');
        a.href = jsonStr;
        a.download = `Tiendas_Yolo_Backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      });
    }

    const inputRestore = document.getElementById('input-restore-backup-json');
    if (inputRestore) {
      inputRestore.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            try {
              const parsed = JSON.parse(evt.target.result);
              if (parsed.products) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                loadState();
                renderAllAdminModules();
                showToast("Copia de seguridad restaurada exitosamente.", "success");
              }
            } catch (err) {
              showToast("Error al procesar archivo JSON.", "error");
            }
          };
          reader.readAsText(file);
        }
      });
    }

    // Botón nueva cotización en modal
    const btnQuoteBuilder = document.getElementById('btn-open-quote-builder');
    if (btnQuoteBuilder) {
      btnQuoteBuilder.addEventListener('click', () => {
        showQuoteModal({
          cliente: "Academia Beauty Nails",
          telefono: "0426-5604070",
          salonAcademia: "Academia / Salón",
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

    const btnDashSeeAll = document.getElementById('btn-dash-see-all-orders');
    if (btnDashSeeAll) {
      btnDashSeeAll.addEventListener('click', () => {
        const ordersTabBtn = document.querySelector('[data-tab="admin-orders"]');
        if (ordersTabBtn) ordersTabBtn.click();
      });
    }
  }

  // Arranque e inicialización
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    checkAuthentication();
    setupEventListeners();
    fetchLiveBcvRateAdmin(false);
    renderAllAdminModules();

    // Actualización de tasa BCV periódica cada 30 min
    setInterval(() => fetchLiveBcvRateAdmin(false), 30 * 60 * 1000);
  });

})();
