/**
 * ============================================================================
 * TIENDAS YOLO® — BACKOFFICE & APLICACIÓN INTERNA (admin.js)
 * Panel de Gestión, Finanzas Completas, Pedidos, Inventario y CRM
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'TIENDAS_YOLO_DATA_V1';
  const PIN_SESSION_KEY = 'TY_ADMIN_AUTH';

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
      showToast("¡Bienvenido al Panel de Tiendas Yolo!", "success");
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
  // CARGA Y PERSISTENCIA DE DATOS
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
  // SINCRONIZACIÓN CON GOOGLE SHEETS
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
        showToast("Error en respuesta de Sheets: " + (json.error || "Desconocido"), "error");
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
  // RENDERIZADO DE MÓDULOS ADMINISTRATIVOS
  // ============================================================================
  function renderAllAdminModules() {
    renderAdminDashboard();
    renderAdminOrders();
    renderFinancesTable();
    renderInventoryTable();
    renderClientsGrid();
    loadSettingsInputs();
  }

  function renderAdminDashboard() {
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

    // Actualizar KPIs
    document.getElementById('kpi-total-sales-usd').textContent = `$${totalSalesUSD.toFixed(2)}`;
    document.getElementById('kpi-total-sales-bs').textContent = `Bs. ${totalSalesBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('kpi-net-profit-usd').textContent = `$${netProfitUSD.toFixed(2)}`;
    document.getElementById('kpi-profit-margin').textContent = `Margen neto: ${profitMargin}%`;
    document.getElementById('kpi-active-orders-count').textContent = activeOrders;
    document.getElementById('kpi-orders-delivered-count').textContent = `${deliveredOrders} entregados con éxito`;
    document.getElementById('kpi-low-stock-count').textContent = lowStockCount;

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
              <button class="btn-secondary" data-action="notify-client" data-order-id="${order.id}">
                📲 Notificar Clienta
              </button>
              <button class="btn-secondary" data-action="print-ticket" data-order-id="${order.id}">
                📄 Comprobante
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Escuchadores
    container.querySelectorAll('.select-order-status').forEach(select => {
      select.addEventListener('change', (e) => {
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
          text += `Tu pedido *#${order.id}* se encuentra actualmente en estado: *${order.estado.toUpperCase()}*.\n`;
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

  // FINANZAS
  function renderFinancesTable(filterQuery = '') {
    const tbody = document.getElementById('finances-table-body');
    if (!tbody) return;

    let filtered = state.finances;
    if (filterQuery.trim() !== '') {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.descripcion.toLowerCase().includes(q) ||
        f.categoria.toLowerCase().includes(q) ||
        f.cuentaMetodo.toLowerCase().includes(q)
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
            <button class="btn-micro" data-action="delete-finance" data-id="${f.id}">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-action="delete-finance"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm("¿Eliminar este registro financiero?")) {
          state.finances = state.finances.filter(f => f.id !== btn.dataset.id);
          saveState();
          renderFinancesTable(filterQuery);
          renderAdminDashboard();
          showToast("Registro eliminado.", "info");
        }
      });
    });
  }

  // INVENTARIO
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
        (c.telefono && c.telefono.includes(q))
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
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent('💅 ¡Hola! Te escribimos de Tiendas Yolo para saludarte y enviarte nuestras promociones del mes.')}`, '_blank');
      });
    });
  }

  // COTIZACIÓN FORMAL
  function showQuoteModal(quoteData = null) {
    const modal = document.getElementById('modal-quote-viewer');
    if (!modal) return;

    const rate = Number(state.config.rateBCV || 395.50);
    const quoteId = quoteData ? quoteData.id : "COT-" + new Date().getFullYear() + "-" + ("0000" + (state.quotes.length + 1)).slice(-4);
    const dateStr = quoteData ? quoteData.fecha : new Date().toLocaleDateString('es-VE');
    const clientName = quoteData ? quoteData.cliente : "Academia de Uñas";
    const clientPhone = quoteData ? quoteData.telefono : "0414-0000000";
    const clientSalon = quoteData ? (quoteData.salonAcademia || "Studio") : "Academia";
    const subtotalUSD = quoteData ? quoteData.subtotalUSD : 0;
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
    document.getElementById('print-quote-grand-usd').textContent = `$${subtotalUSD.toFixed(2)}`;
    document.getElementById('print-quote-grand-bs').textContent = `Bs. ${grandTotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    modal.style.display = 'flex';
  }

  // ============================================================================
  // GESTIÓN DE PRODUCTOS Y MOVIMIENTOS
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
      showToast("Ingresa nombre y precio del insumo.", "error");
      return;
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

    saveState();
    renderInventoryTable();
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
      notas: "Registrado manualmente en panel"
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

  function loadSettingsInputs() {
    document.getElementById('cfg-sheets-api-url').value = state.config.sheetsApiUrl || '';
    document.getElementById('cfg-rate-bcv').value = state.config.rateBCV || 395.50;
    document.getElementById('cfg-whatsapp').value = state.config.whatsappNumber || '584265604070';
    document.getElementById('cfg-admin-pin').value = state.config.adminPin || '2026';
    document.getElementById('cfg-delivery-free-min').value = state.config.deliveryFreeMinUSD || 15.00;
    document.getElementById('cfg-delivery-flat-fee').value = state.config.deliveryFlatFeeUSD || 2.00;
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
    document.getElementById('btn-unlock-pin').addEventListener('click', handleUnlock);
    document.getElementById('input-admin-pin').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUnlock();
    });
    document.getElementById('btn-lock-session').addEventListener('click', handleLockSession);

    // Tema
    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      localStorage.setItem('TY_THEME', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    });

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

    // Formularios
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

    document.getElementById('fin-amount-usd').addEventListener('input', (e) => {
      const val = Number(e.target.value) || 0;
      const rate = Number(state.config.rateBCV || 395.50);
      document.getElementById('fin-amount-bs').value = (val * rate).toFixed(2);
    });

    // Búsquedas
    document.getElementById('finances-search-input').addEventListener('input', (e) => renderFinancesTable(e.target.value));
    document.getElementById('inv-search-input').addEventListener('input', (e) => renderInventoryTable(e.target.value));
    document.getElementById('clients-search-input').addEventListener('input', (e) => renderClientsGrid(e.target.value));

    // Impresión
    document.getElementById('btn-print-quote').addEventListener('click', () => window.print());
    document.getElementById('btn-quote-send-wa').addEventListener('click', () => {
      const qId = document.getElementById('print-quote-id').textContent;
      const cName = document.getElementById('print-client-name').textContent;
      const tUSD = document.getElementById('print-quote-grand-usd').textContent;
      const text = encodeURIComponent(`💅 *TIENDAS YOLO® — COTIZACIÓN FORMAL*\n📄 *ID:* ${qId}\n👤 *Cliente:* ${cName}\n💎 *TOTAL:* ${tUSD}\n_Validez: 7 días continuos. Delivery gratis desde $15 en Maracaibo._`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });

    // Config Sheets
    document.getElementById('btn-save-sheets-config').addEventListener('click', () => {
      const url = document.getElementById('cfg-sheets-api-url').value.trim();
      state.config.sheetsApiUrl = url;
      saveState();
      updateCloudIndicator();
      showToast("URL de Google Sheets guardada.", "success");
    });

    document.getElementById('btn-test-sheets-connection').addEventListener('click', async () => {
      const res = await syncWithSheets('ping');
      const box = document.getElementById('cloud-sync-logs');
      if (res.success) {
        box.innerHTML = `🟢 <strong>Conexión exitosa:</strong> Backend de Tiendas Yolo respondió OK a las ${new Date().toLocaleTimeString()}.`;
      } else {
        box.innerHTML = `⚠️ <strong>Fallo:</strong> ${res.error || res.message}`;
      }
    });

    document.getElementById('btn-force-cloud-sync').addEventListener('click', async () => {
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

    document.getElementById('btn-save-commercial-config').addEventListener('click', () => {
      state.config.rateBCV = Number(document.getElementById('cfg-rate-bcv').value);
      state.config.whatsappNumber = document.getElementById('cfg-whatsapp').value.trim();
      state.config.adminPin = document.getElementById('cfg-admin-pin').value.trim() || '2026';
      state.config.deliveryFreeMinUSD = Number(document.getElementById('cfg-delivery-free-min').value);
      state.config.deliveryFlatFeeUSD = Number(document.getElementById('cfg-delivery-flat-fee').value);
      saveState();
      renderAdminDashboard();
      showToast("Parámetros y PIN actualizados.", "success");
    });

    // Exportaciones
    document.getElementById('btn-export-orders-csv').addEventListener('click', () => {
      const rows = [["ID", "Fecha", "Cliente", "Telefono", "Tipo Entrega", "Metodo Pago", "Total USD", "Total Bs", "Estado"]].concat(
        state.orders.map(o => [o.id, o.fecha, o.cliente, o.telefono, o.tipoEntrega, o.metodoPago, o.totalUSD, o.totalBs, o.estado])
      );
      exportToCSV("Tiendas_Yolo_Pedidos.csv", rows);
    });

    document.getElementById('btn-export-finances-csv').addEventListener('click', () => {
      const rows = [["ID", "Fecha", "Tipo", "Categoria", "Descripcion", "Cuenta", "Monto USD", "Monto Bs"]].concat(
        state.finances.map(f => [f.id, f.fecha, f.tipo, f.categoria, f.descripcion, f.cuentaMetodo, f.montoUSD, f.montoBs])
      );
      exportToCSV("Tiendas_Yolo_Finanzas.csv", rows);
    });

    document.getElementById('btn-export-inventory-csv').addEventListener('click', () => {
      const rows = [["ID", "SKU", "Nombre", "Categoria", "Precio USD", "Costo USD", "Stock Actual"]].concat(
        state.products.map(p => [p.id, p.sku, p.nombre, p.categoria, p.precioUSD, p.costoUSD, p.stockActual])
      );
      exportToCSV("Tiendas_Yolo_Inventario.csv", rows);
    });

    // Backup JSON
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

    document.getElementById('btn-dash-see-all-orders').addEventListener('click', () => {
      const ordersTabBtn = document.querySelector('[data-tab="admin-orders"]');
      if (ordersTabBtn) ordersTabBtn.click();
    });
  }

  // Arranque
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    checkAuthentication();
    setupEventListeners();
    renderAllAdminModules();
  });

})();
