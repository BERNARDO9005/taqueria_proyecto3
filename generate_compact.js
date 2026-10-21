const fs = require('fs');

const code = `<!DOCTYPE html>
<html lang="es-MX" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Taquería El Buen Taquito</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'bg-page': '#0f172a', 'bg-surface': '#172554', 'bg-card': '#1e293b',
            primary: '#2563eb', 'primary-hover': '#1d4ed8', accent: '#0ea5e9',
            gold: '#fbbf24', 'gold-strong': '#f59e0b', text: '#f1f5f9',
            'text-muted': '#94a3b8', success: '#22c55e', error: '#ef4444'
          },
          fontFamily: { sans: ['Inter', 'sans-serif'] }
        }
      }
    };
  </script>
  <style>
    @media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
    .no-sb::-webkit-scrollbar { display: none; }
    .no-sb { -ms-overflow-style: none; scrollbar-width: none; }
    body.modal-open { overflow: hidden; }
  </style>
</head>
<body class="bg-bg-page text-text font-sans antialiased min-h-screen flex flex-col selection:bg-accent selection:text-white">

  <!-- Header -->
  <header class="sticky top-0 z-40 bg-bg-surface/90 backdrop-blur-md border-b border-white/10">
    <div class="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
      <a href="#hero" class="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-accent rounded-xl p-1">
        <div class="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-base group-hover:scale-105 transition-transform"><i class="fa-solid fa-fire-burner"></i></div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base font-bold text-white tracking-tight">El Buen Taquito</span>
            <span id="badge-status" class="text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1"></span>
          </div>
          <p class="text-[10px] text-text-muted hidden sm:block">Sabor de la calle, directo a tu casa</p>
        </div>
      </a>
      <div class="flex-1 max-w-xs sm:max-w-md mx-2">
        <div class="relative w-full">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs"></i>
          <input type="text" id="input-search" placeholder="Buscar tacos, gringas, bebidas..." class="w-full pl-8 pr-3 py-1.5 bg-bg-card/80 border border-white/10 rounded-full text-xs text-text placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent">
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button id="btn-admin" class="w-8 h-8 rounded-full bg-bg-card/70 hover:bg-bg-card border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors" title="Admin Fotos"><i class="fa-solid fa-gear text-xs"></i></button>
        <button id="btn-open-cart" class="relative px-3 py-1.5 rounded-full bg-primary hover:bg-primary-hover border border-white/10 flex items-center gap-1.5 text-xs font-semibold text-white shadow active:scale-95 transition-transform">
          <i class="fa-solid fa-basket-shopping text-xs"></i>
          <span class="hidden sm:inline">Carrito</span>
          <span id="cart-counter" class="bg-gold text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">0</span>
        </button>
      </div>
    </div>
    <nav class="bg-bg-surface/95 border-t border-white/5 py-1.5 px-4 shadow-sm backdrop-blur-md" aria-label="Categorías">
      <div class="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto no-sb" id="category-chips"></div>
    </nav>
  </header>

  <!-- Main -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-5 space-y-8" id="main-content">
    <section id="hero" class="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-bg-card" aria-roledescription="carousel" aria-label="Promociones">
      <div class="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden select-none" id="carousel-track"></div>
      <button id="carousel-prev" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform" aria-label="Anterior"><i class="fa-solid fa-chevron-left text-xs"></i></button>
      <button id="carousel-next" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform" aria-label="Siguiente"><i class="fa-solid fa-chevron-right text-xs"></i></button>
      <div class="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-950/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10" id="carousel-indicators"></div>
    </section>
    <div id="menu-container" class="space-y-8"></div>
    <div id="tracker-banner" class="hidden fixed bottom-4 right-4 sm:right-6 sm:w-88 z-30">
      <div class="bg-bg-surface/95 backdrop-blur-md border border-accent/40 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 text-white">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent animate-pulse"><i class="fa-solid fa-clock text-xs"></i></div>
          <div class="min-w-0">
            <p class="text-[9px] font-bold text-accent uppercase tracking-wider">Pedido Activo</p>
            <p id="tracker-banner-title" class="text-xs font-bold text-white truncate">Cargando...</p>
          </div>
        </div>
        <button id="btn-open-tracker" class="px-2.5 py-1 rounded-xl bg-accent hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0">Rastrear</button>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-bg-surface border-t border-white/10 mt-12 py-6 text-text-muted text-xs">
    <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <i class="fa-solid fa-fire-burner text-gold text-base"></i>
          <span class="font-bold text-white text-sm">Taquería El Buen Taquito</span>
        </div>
        <p class="leading-relaxed">Sabor de la calle directo a tu casa. Todo preparado al momento con sazón tradicional.</p>
      </div>
      <div>
        <h4 class="font-bold text-white mb-1.5 uppercase tracking-wider text-[11px]">Sucursal & Horarios</h4>
        <p id="footer-hours" class="mb-1"><i class="fa-regular fa-clock mr-1 text-gold"></i> Lun - Dom: 1:00 PM a 11:00 PM</p>
        <p id="footer-address" class="mb-1"><i class="fa-solid fa-location-dot mr-1 text-gold"></i> Av. Revolución 456, Col. Escandón, CDMX</p>
        <p id="footer-phone"><i class="fa-solid fa-phone mr-1 text-gold"></i> 55 1234 5678</p>
      </div>
      <div>
        <h4 class="font-bold text-white mb-1.5 uppercase tracking-wider text-[11px]">Contacto & Redes</h4>
        <p class="leading-relaxed mb-2">Simulación interactiva single-page con look DiDi Food / Rappi. Sin APIs externas.</p>
        <div class="flex items-center gap-3 text-base">
          <a href="#" class="hover:text-gold" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
          <a href="#" class="hover:text-gold" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" id="footer-whatsapp" class="hover:text-gold hidden" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>
    </div>
    <div class="max-w-6xl mx-auto px-4 pt-4 mt-4 border-t border-white/5 text-center text-text-muted/70 text-[11px]">&copy; 2026 Taquería El Buen Taquito. Todos los derechos reservados.</div>
  </footer>

  <!-- Overlays -->
  <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-1.5 pointer-events-none" aria-live="polite"></div>

  <div id="custom-dialog" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="bg-bg-card border border-white/10 rounded-2xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl">
      <div class="w-10 h-10 mx-auto rounded-full bg-gold/20 text-gold flex items-center justify-center text-lg"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <h3 id="dialog-title" class="text-sm font-bold text-white">¿Estás seguro?</h3>
      <p id="dialog-message" class="text-xs text-text-muted"></p>
      <div class="flex items-center justify-center gap-2 pt-1">
        <button id="dialog-cancel" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-text-muted text-xs font-semibold">Cancelar</button>
        <button id="dialog-confirm" class="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold">Confirmar</button>
      </div>
    </div>
  </div>

  <!-- Customizer -->
  <div id="modal-customizer" class="fixed inset-0 z-50 hidden flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="bg-bg-card border-t sm:border border-white/10 w-full sm:max-w-md max-h-[88vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-bg-surface/80">
        <div>
          <h2 id="customizer-title" class="text-sm font-bold text-white leading-tight">Personalizar</h2>
          <p id="customizer-base-price" class="text-xs text-gold font-semibold">$0.00 base</p>
        </div>
        <button id="btn-close-customizer" class="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white flex items-center justify-center"><i class="fa-solid fa-xmark text-xs"></i></button>
      </div>
      <div class="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs" id="customizer-body"></div>
      <div class="p-3.5 border-t border-white/10 bg-bg-surface/90 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 bg-bg-card border border-white/10 rounded-xl px-2 py-1">
          <button id="btn-qty-minus" class="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold text-xs">-</button>
          <span id="customizer-qty" class="w-5 text-center font-bold text-xs text-white">1</span>
          <button id="btn-qty-plus" class="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold text-xs">+</button>
        </div>
        <button id="btn-customizer-submit" class="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-slate-700 disabled:text-text-muted text-white font-bold text-xs flex items-center justify-between shadow">
          <span id="customizer-submit-text">Agregar</span>
          <span id="customizer-live-total" class="font-extrabold text-white text-xs">$0.00</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Cart Drawer -->
  <div id="slideover-cart" class="fixed inset-0 z-50 hidden flex justify-end bg-slate-950/70 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="bg-bg-card border-l border-white/10 w-full sm:max-w-md h-full flex flex-col shadow-2xl">
      <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-bg-surface/80">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-basket-shopping text-accent text-xs"></i>
          <h2 class="text-sm font-bold text-white">Tu Pedido</h2>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-clear-cart" class="text-xs text-error hover:text-red-400 font-medium px-2 py-0.5 rounded hover:bg-white/5 hidden">Vaciar</button>
          <button id="btn-close-cart" class="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white flex items-center justify-center"><i class="fa-solid fa-xmark text-xs"></i></button>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-3.5 space-y-2.5" id="cart-items-container"></div>
      <div class="p-3.5 border-t border-white/10 bg-bg-surface/95 space-y-2.5" id="cart-footer">
        <div class="space-y-1 text-xs">
          <div class="flex justify-between text-text-muted"><span>Subtotal</span><span id="cart-subtotal" class="text-white font-medium">$0.00</span></div>
          <div class="flex justify-between text-text-muted"><span id="cart-delivery-label">Costo de envío</span><span id="cart-delivery-fee" class="text-white font-medium">$25.00</span></div>
          <div class="flex justify-between text-xs font-bold text-white pt-1.5 border-t border-white/10"><span>Total</span><span id="cart-total" class="text-gold text-sm">$0.00</span></div>
        </div>
        <button id="btn-start-checkout" class="w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-slate-700 disabled:text-text-muted text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow">
          <span>Continuar con la Entrega</span><i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Checkout Modal -->
  <div id="modal-checkout" class="fixed inset-0 z-50 hidden flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="bg-bg-card border border-white/10 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs">
      <div class="px-4 py-2.5 border-b border-white/10 bg-bg-surface/90 flex items-center justify-between">
        <div>
          <h2 class="text-xs font-bold text-white">Finalizar Compra</h2>
          <p id="checkout-step-indicator" class="text-[10px] text-text-muted">Paso 1 de 2: Entrega</p>
        </div>
        <button id="btn-close-checkout" class="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white flex items-center justify-center"><i class="fa-solid fa-xmark text-[10px]"></i></button>
      </div>
      <div class="flex-1 overflow-y-auto p-3.5 space-y-3" id="checkout-body">
        <div id="step-delivery" class="space-y-2.5">
          <div class="grid grid-cols-2 gap-1.5 bg-bg-page/70 p-1 rounded-xl border border-white/10">
            <button type="button" id="type-delivery" class="py-1.5 rounded-lg font-bold bg-primary text-white flex items-center justify-center gap-1 shadow"><i class="fa-solid fa-motorcycle text-xs"></i> A Domicilio</button>
            <button type="button" id="type-pickup" class="py-1.5 rounded-lg font-semibold text-text-muted hover:text-white flex items-center justify-center gap-1"><i class="fa-solid fa-store text-xs"></i> Recoger en Tienda</button>
          </div>
          <div id="pickup-info" class="hidden p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent space-y-0.5 text-[11px]">
            <p class="font-bold"><i class="fa-solid fa-location-dot mr-1"></i> Sucursal para recoger:</p>
            <p id="pickup-store-address" class="text-white font-medium"></p>
            <p class="text-[10px] text-text-muted">* Sin costo de envío.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label for="del-name" class="block font-medium text-text-muted mb-0.5 text-[11px]">Nombre completo *</label>
              <input type="text" id="del-name" placeholder="Tu nombre" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent">
              <p id="err-del-name" class="text-error text-[10px] hidden"></p>
            </div>
            <div>
              <label for="del-phone" class="block font-medium text-text-muted mb-0.5 text-[11px]">Teléfono (10 dígitos) *</label>
              <input type="tel" id="del-phone" maxlength="10" placeholder="5512345678" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent">
              <p id="err-del-phone" class="text-error text-[10px] hidden"></p>
            </div>
          </div>
          <div id="delivery-address-section" class="space-y-2 pt-1 border-t border-white/5">
            <button type="button" id="btn-use-gps" class="w-full py-1.5 px-3 rounded-xl bg-bg-surface hover:bg-slate-800 border border-accent/40 text-accent font-semibold flex items-center justify-center gap-1.5">
              <i class="fa-solid fa-location-crosshairs text-xs"></i><span id="gps-btn-label">Usar mi ubicación actual (GPS)</span>
            </button>
            <div id="gps-status" class="hidden p-1.5 rounded-lg border text-[10px]"></div>
            <div class="grid grid-cols-3 gap-2">
              <div class="col-span-2">
                <label for="del-street" class="block font-medium text-text-muted mb-0.5 text-[11px]">Calle *</label>
                <input type="text" id="del-street" placeholder="Av. Revolución" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent">
                <p id="err-del-street" class="text-error text-[10px] hidden"></p>
              </div>
              <div>
                <label for="del-num-ext" class="block font-medium text-text-muted mb-0.5 text-[11px]">No. Ext *</label>
                <input type="text" id="del-num-ext" placeholder="123" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent">
                <p id="err-del-num-ext" class="text-error text-[10px] hidden"></p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label for="del-num-int" class="block font-medium text-text-muted mb-0.5 text-[11px]">No. Int (Opcional)</label>
                <input type="text" id="del-num-int" placeholder="Depto 4B" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent">
              </div>
              <div>
                <label for="del-colonia" class="block font-medium text-text-muted mb-0.5 text-[11px]">Colonia *</label>
                <input type="text" id="del-colonia" placeholder="Escandón" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent">
                <p id="err-del-colonia" class="text-error text-[10px] hidden"></p>
              </div>
            </div>
            <div>
              <label for="del-notes" class="block font-medium text-text-muted mb-0.5 text-[11px]">Referencias de entrega</label>
              <textarea id="del-notes" rows="2" maxlength="200" placeholder="Ej. Fachada gris, portón de madera..." class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent resize-none"></textarea>
            </div>
          </div>
        </div>

        <div id="step-payment" class="space-y-2.5 hidden">
          <div class="grid grid-cols-2 gap-1.5 bg-bg-page/70 p-1 rounded-xl border border-white/10">
            <button type="button" id="pay-method-card" class="py-1.5 rounded-lg font-bold bg-primary text-white flex items-center justify-center gap-1 shadow"><i class="fa-solid fa-credit-card text-xs"></i> Tarjeta</button>
            <button type="button" id="pay-method-cash" class="py-1.5 rounded-lg font-semibold text-text-muted hover:text-white flex items-center justify-center gap-1"><i class="fa-solid fa-money-bill-wave text-xs"></i> Efectivo</button>
          </div>
          <div class="p-2 bg-bg-surface/60 rounded-xl border border-white/10 flex items-center justify-between text-xs">
            <span class="text-text-muted">Total a pagar:</span><span id="checkout-pay-total" class="text-gold font-extrabold text-sm">$0.00</span>
          </div>
          <div id="payment-card-form" class="space-y-2">
            <p class="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px]"><i class="fa-solid fa-circle-info mr-1"></i> Simulación: no se procesan pagos reales.</p>
            <div>
              <label for="card-number" class="block font-medium text-text-muted mb-0.5 text-[11px]">Número de tarjeta *</label>
              <input type="text" id="card-number" maxlength="19" placeholder="4000 1234 5678 9010" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl font-mono text-white focus:outline-none focus:border-accent">
              <p id="err-card-number" class="text-error text-[10px] hidden"></p>
              <p class="text-[9px] text-text-muted mt-0.5">Tip declinada: <span class="text-gold font-mono">4000 0000 0000 0002</span></p>
            </div>
            <div>
              <label for="card-holder" class="block font-medium text-text-muted mb-0.5 text-[11px]">Titular *</label>
              <input type="text" id="card-holder" placeholder="Como figura en la tarjeta" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent">
              <p id="err-card-holder" class="text-error text-[10px] hidden"></p>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label for="card-expiry" class="block font-medium text-text-muted mb-0.5 text-[11px]">Vencimiento (MM/AA) *</label>
                <input type="text" id="card-expiry" maxlength="5" placeholder="12/28" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl font-mono text-white focus:outline-none focus:border-accent">
                <p id="err-card-expiry" class="text-error text-[10px] hidden"></p>
              </div>
              <div>
                <label for="card-cvv" class="block font-medium text-text-muted mb-0.5 text-[11px]">CVV *</label>
                <input type="password" id="card-cvv" maxlength="4" placeholder="123" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl font-mono text-white focus:outline-none focus:border-accent">
                <p id="err-card-cvv" class="text-error text-[10px] hidden"></p>
              </div>
            </div>
          </div>
          <div id="payment-cash-form" class="space-y-2 hidden">
            <div>
              <label for="cash-amount" class="block font-medium text-text-muted mb-0.5 text-[11px]">¿Con cuánto pagas? *</label>
              <input type="number" id="cash-amount" step="1" min="0" placeholder="0" class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl font-bold text-white focus:outline-none focus:border-accent">
              <p id="err-cash-amount" class="text-error text-[10px] hidden"></p>
            </div>
            <div class="grid grid-cols-4 gap-1" id="quick-cash-buttons">
              <button type="button" data-val="exact" class="py-1 rounded bg-bg-surface hover:bg-slate-700 text-white font-semibold border border-white/10 text-[11px]">Exacto</button>
              <button type="button" data-val="100" class="py-1 rounded bg-bg-surface hover:bg-slate-700 text-white font-semibold border border-white/10 text-[11px]">$100</button>
              <button type="button" data-val="200" class="py-1 rounded bg-bg-surface hover:bg-slate-700 text-white font-semibold border border-white/10 text-[11px]">$200</button>
              <button type="button" data-val="500" class="py-1 rounded bg-bg-surface hover:bg-slate-700 text-white font-semibold border border-white/10 text-[11px]">$500</button>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
              <div><span class="text-[10px] text-text-muted block">Tu cambio:</span><span id="cash-change-text" class="text-sm font-bold text-success">$0.00</span></div>
              <i class="fa-solid fa-hand-holding-dollar text-lg text-success/60"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 py-2.5 border-t border-white/10 bg-bg-surface/90 flex items-center justify-between gap-2">
        <button id="btn-checkout-back" class="hidden px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-text-muted hover:text-white font-semibold text-xs border border-white/10">Atrás</button>
        <button id="btn-checkout-next" class="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-1 shadow">
          <span>Ir a Forma de Pago</span><i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Tracker Modal -->
  <div id="modal-tracker" class="fixed inset-0 z-50 hidden flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="bg-bg-card border border-white/10 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs">
      <div class="px-4 py-2.5 border-b border-white/10 bg-bg-surface/90 flex items-center justify-between">
        <div><span class="text-[9px] text-accent font-bold uppercase tracking-wider">Rastreador en vivo</span><h2 id="tracker-order-id" class="text-xs font-bold text-white">TBT-0000</h2></div>
        <button id="btn-close-tracker" class="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white flex items-center justify-center"><i class="fa-solid fa-xmark text-[10px]"></i></button>
      </div>
      <div class="flex-1 overflow-y-auto p-3.5 space-y-3">
        <div class="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] flex items-center justify-between">
          <span><i class="fa-solid fa-info-circle mr-1"></i> Demo: el estado avanza automáticamente.</span>
          <span id="tracker-elapsed" class="font-mono font-bold text-white">0s</span>
        </div>
        <div class="space-y-2.5" id="tracker-timeline">
          <div class="timeline-step flex items-start gap-2.5" data-stage="1">
            <div class="step-icon w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-text-muted text-xs">
              <i class="fa-solid fa-check hidden text-[10px]"></i><span class="num text-[11px]">1</span>
            </div>
            <div class="pt-0.5 flex-1"><h4 class="font-bold text-text-muted step-title">Pedido Recibido / Confirmado</h4><p class="text-[10px] text-text-muted">La cocina recibió tu orden.</p></div>
          </div>
          <div class="timeline-step flex items-start gap-2.5" data-stage="2">
            <div class="step-icon w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-text-muted text-xs">
              <i class="fa-solid fa-check hidden text-[10px]"></i><span class="num text-[11px]">2</span>
            </div>
            <div class="pt-0.5 flex-1"><h4 class="font-bold text-text-muted step-title">En el Comal / Preparando</h4><p class="text-[10px] text-text-muted">Asando carne y calentando tortillas.</p></div>
          </div>
          <div class="timeline-step flex items-start gap-2.5" data-stage="3">
            <div class="step-icon w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-text-muted text-xs">
              <i class="fa-solid fa-check hidden text-[10px]"></i><span class="num text-[11px]">3</span>
            </div>
            <div class="pt-0.5 flex-1"><h4 class="font-bold text-text-muted step-title" id="stage-3-title">En Camino</h4><p class="text-[10px] text-text-muted" id="stage-3-desc">El repartidor va hacia ti.</p></div>
          </div>
          <div class="timeline-step flex items-start gap-2.5" data-stage="4">
            <div class="step-icon w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-text-muted text-xs">
              <i class="fa-solid fa-check hidden text-[10px]"></i><span class="num text-[11px]">4</span>
            </div>
            <div class="pt-0.5 flex-1"><h4 class="font-bold text-text-muted step-title">Entregado</h4><p class="text-[10px] text-text-muted">¡Buen provecho!</p></div>
          </div>
        </div>
        <div class="p-2.5 bg-bg-surface/50 rounded-xl border border-white/10 space-y-1 text-[10px]">
          <div class="flex justify-between"><span class="text-text-muted">Tipo:</span><span id="tracker-type" class="font-bold text-white"></span></div>
          <div class="flex justify-between"><span class="text-text-muted">Destino:</span><span id="tracker-destination" class="font-medium text-white max-w-[200px] truncate text-right"></span></div>
          <div class="flex justify-between"><span class="text-text-muted">Pago:</span><span id="tracker-payment" class="font-medium text-white"></span></div>
          <div class="flex justify-between border-t border-white/10 pt-1 font-bold text-xs"><span>Total:</span><span id="tracker-total" class="text-gold"></span></div>
        </div>
        <div class="space-y-1.5">
          <a id="btn-maps-link" href="#" target="_blank" rel="noopener noreferrer" class="w-full py-1.5 px-3 rounded-xl bg-bg-surface hover:bg-slate-800 border border-white/10 text-accent font-semibold flex items-center justify-center gap-1.5"><i class="fa-solid fa-map-location-dot"></i> Ver en Google Maps</a>
          <a id="btn-whatsapp-order" href="#" target="_blank" rel="noopener noreferrer" class="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 hidden"><i class="fa-brands fa-whatsapp"></i> Enviar por WhatsApp</a>
          <button id="btn-new-order" class="w-full py-1.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold flex items-center justify-center gap-1"><i class="fa-solid fa-rotate-right"></i> Hacer otro pedido</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Admin Modal -->
  <div id="modal-admin" class="fixed inset-0 z-50 hidden flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="bg-bg-card border border-white/10 w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs">
      <div class="px-4 py-2.5 border-b border-white/10 bg-bg-surface/90 flex items-center justify-between">
        <div class="flex items-center gap-2"><i class="fa-solid fa-images text-gold"></i><h2 class="text-xs font-bold text-white">Gestor de Imágenes</h2></div>
        <button id="btn-close-admin" class="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-text-muted hover:text-white flex items-center justify-center"><i class="fa-solid fa-xmark text-[10px]"></i></button>
      </div>
      <div id="admin-pin-view" class="p-6 text-center space-y-2.5 my-auto">
        <div class="w-10 h-10 mx-auto rounded-full bg-gold/20 text-gold flex items-center justify-center text-lg"><i class="fa-solid fa-lock"></i></div>
        <div><h3 class="text-sm font-bold text-white">Acceso Administrativo</h3><p class="text-[10px] text-text-muted">Ingresa el PIN de seguridad (default: 1234).</p></div>
        <div class="max-w-xs mx-auto space-y-1.5">
          <input type="password" id="admin-pin-input" maxlength="6" placeholder="PIN" class="w-full text-center px-3 py-1.5 bg-bg-page border border-white/10 rounded-xl text-sm font-mono tracking-widest text-white focus:outline-none focus:border-accent">
          <p id="admin-pin-error" class="text-error text-[10px] hidden">PIN incorrecto.</p>
          <button id="btn-verify-pin" class="w-full py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold">Desbloquear</button>
        </div>
      </div>
      <div id="admin-content-view" class="hidden flex-1 overflow-y-auto p-3.5 space-y-3">
        <div class="flex border-b border-white/10 gap-3 font-semibold text-xs">
          <button type="button" id="tab-btn-carousel" class="pb-1 border-b-2 border-primary text-white">Carrusel</button>
          <button type="button" id="tab-btn-catalog" class="pb-1 border-b-2 border-transparent text-text-muted hover:text-white">Fotos Menú</button>
        </div>
        <div id="tab-view-carousel" class="space-y-2.5">
          <div class="flex items-center justify-between"><span class="font-bold text-text-muted uppercase text-[9px]">Diapositivas</span><button id="btn-reset-carousel-defaults" class="text-gold hover:underline text-[10px]">Restaurar default</button></div>
          <div id="admin-carousel-list" class="space-y-1.5"></div>
          <div class="p-2.5 rounded-xl bg-bg-surface/50 border border-white/10 space-y-1.5">
            <h5 class="font-bold text-white text-[10px]">Agregar Diapositiva</h5>
            <div class="grid grid-cols-2 gap-1.5">
              <input type="text" id="new-slide-title" placeholder="Título" class="px-2 py-1 bg-bg-page border border-white/10 rounded-lg text-white text-[10px]">
              <input type="text" id="new-slide-subtitle" placeholder="Subtítulo" class="px-2 py-1 bg-bg-page border border-white/10 rounded-lg text-white text-[10px]">
            </div>
            <div class="flex gap-1.5">
              <input type="url" id="new-slide-url" placeholder="https://..." class="flex-1 px-2 py-1 bg-bg-page border border-white/10 rounded-lg text-white text-[10px]">
              <label class="px-2.5 py-1 bg-slate-800 border border-white/10 rounded-lg text-white cursor-pointer text-[10px]"><span>Subir</span><input type="file" id="new-slide-file" accept="image/*" class="hidden"></label>
            </div>
            <p id="new-slide-error" class="text-error text-[10px] hidden"></p>
            <button id="btn-add-slide" class="w-full py-1 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-[10px]">Guardar</button>
          </div>
        </div>
        <div id="tab-view-catalog" class="space-y-2 hidden">
          <div class="flex items-center justify-between"><span class="font-bold text-text-muted uppercase text-[9px]">Fotos del Menú</span><button id="btn-reset-menu-photos" class="text-gold hover:underline text-[10px]">Restaurar todas</button></div>
          <div id="admin-catalog-list" class="space-y-1.5"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    /* SECTION 0: CONFIG */
    const CONFIG = {
      name: 'Taquería El Buen Taquito',
      tagline: 'Sabor de la calle, directo a tu casa',
      phone: '55 1234 5678',
      address: 'Av. Revolución 456, Col. Escandón, CDMX',
      hours: { open: '13:00', close: '23:00', days: [0, 1, 2, 3, 4, 5, 6] },
      deliveryFee: 2500,
      maxQtyPerLine: 20,
      adminPin: '1234',
      whatsappNumber: '5215512345678',
      trackerStageSeconds: [0, 10, 20, 30]
    };

    /* SECTION 1: STATE */
    const DEFAULT_SLIDES = [
      { id: 's1', title: '¡Tacos al Pastor Tradicionales!', subtitle: 'Con piña miel, cebolla, cilantro y salsas de la casa.', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=70' },
      { id: 's2', title: 'Especialidades al Carbón', subtitle: 'Gringas doraditas con queso fundido y carne al pastor.', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=70' },
      { id: 's3', title: 'Aguas Frescas Artesanales', subtitle: 'Horchata y Jamaica 100% naturales para refrescarte.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=70' }
    ];

    const DEFAULT_CATALOG = [
      { id: 'taco-pastor', name: 'Tacos al Pastor', description: 'Carne de cerdo marinada con achiote y especias, piña, cilantro y cebolla. (por pieza)', price: 2800, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=70', available: true, customizer: { tortilla: true, salsas: true, toppings: true, extraCheese: true } },
      { id: 'taco-bistec', name: 'Tacos de Bistec', description: 'Carne de res asada con toque de la casa. (por pieza)', price: 3200, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=70', available: true, customizer: { tortilla: true, salsas: true, toppings: true, extraCheese: true } },
      { id: 'taco-suadero', name: 'Tacos de Suadero', description: 'Confitado tradicional en cazuela, jugoso y suave. (por pieza)', price: 3000, category: 'Tacos', image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=800&q=70', available: true, customizer: { tortilla: true, salsas: true, toppings: true, extraCheese: true } },
      { id: 'gringa-pastor', name: 'Gringas al Pastor', description: 'Tortilla de harina grande, queso derretido, carne al pastor y piña.', price: 6500, category: 'Especialidades', image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=800&q=70', available: true, customizer: { tortillaFixed: 'Tortilla de harina', salsas: true, toppings: true, extraCheese: true } },
      { id: 'torta-especial', name: 'Tortas Especiales', description: 'Telera dorada con mantequilla, aguacate, frijoles y carne a elegir.', price: 7500, category: 'Tortas', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=70', available: true, customizer: { meat: true, salsas: true, toppings: true, extraCheese: true } },
      { id: 'agua-horchata', name: 'Agua de Horchata', description: 'Agua fresca artesanal de arroz con canela.', price: 3500, category: 'Bebidas y Postres', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=70', available: true, customizer: {} },
      { id: 'agua-jamaica', name: 'Agua de Jamaica', description: 'Agua fresca artesanal de flor de jamaica natural.', price: 3500, category: 'Bebidas y Postres', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=70', available: true, customizer: {} },
      { id: 'refresco', name: 'Refresco Mexicano', description: 'Refresco embotellado de 355 ml, a elegir sabor.', price: 3000, category: 'Bebidas y Postres', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=70', available: true, customizer: { flavor: true } },
      { id: 'flan', name: 'Flan Napolitano', description: 'Postre casero tradicional con caramelo dorado.', price: 4500, category: 'Bebidas y Postres', image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=70', available: true, customizer: {} }
    ];

    const STATE = {
      menu: [...DEFAULT_CATALOG], slides: [...DEFAULT_SLIDES], cart: [], activeOrder: null,
      searchQuery: '', activeCategory: 'Tacos', slideIndex: 0, slideTimer: null,
      customizerItem: null, editingCartIndex: null, deliveryType: 'delivery',
      paymentMethod: 'card', gpsCoords: null, trackerTimer: null, dialogCallback: null
    };

    /* SECTION 2: STORAGE */
    const STORAGE_KEYS = { CART: 'taqueria:v1:cart', PHOTOS: 'taqueria:v1:photos', DELIVERY: 'taqueria:v1:delivery', ORDER: 'taqueria:v1:order' };
    const Storage = {
      get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch(e) { return null; } },
      set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e) { if(e.name === 'QuotaExceededError') showToast('Memoria llena.', 'error'); return false; } },
      remove(k) { try { localStorage.removeItem(k); } catch(e) {} }
    };

    /* SECTION 3: UTILS */
    const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
    const formatMoney = (c) => mxn.format((c || 0) / 100);
    const escapeHtml = (s) => String(s || '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
    const SVG_TACO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%231e293b'/><circle cx='100' cy='100' r='50' fill='%23fbbf24' opacity='0.2'/><path d='M60 120 C60 80, 140 80, 140 120 Z' fill='%23f59e0b'/><circle cx='85' cy='105' r='5' fill='%23ef4444'/><circle cx='115' cy='105' r='5' fill='%2322c55e'/><text x='100' y='155' font-family='sans-serif' font-size='12' fill='%2394a3b8' text-anchor='middle'>El Buen Taquito</text></svg>";

    function validateLuhn(s) {
      const c = s.replace(/\\D/g, '');
      if (c.length < 13 || c.length > 19) return false;
      let sum = 0, alt = false;
      for (let i = c.length - 1; i >= 0; i--) {
        let n = parseInt(c.charAt(i), 10);
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n; alt = !alt;
      }
      return sum % 10 === 0;
    }

    function checkIsOpen() {
      const now = new Date();
      if (!CONFIG.hours.days.includes(now.getDay())) return false;
      const [oh, om] = CONFIG.hours.open.split(':').map(Number);
      const [ch, cm] = CONFIG.hours.close.split(':').map(Number);
      const cur = now.getHours() * 60 + now.getMinutes();
      return cur >= (oh * 60 + om) && cur < (ch * 60 + cm);
    }

    /* SECTION 4: UI FEEDBACK */
    function showToast(msg, type = 'info') {
      const cont = document.getElementById('toast-container');
      const t = document.createElement('div');
      const icons = { success: 'fa-circle-check text-success', error: 'fa-circle-exclamation text-error', info: 'fa-circle-info text-accent' };
      t.className = 'pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-card border border-white/10 text-white text-xs shadow-xl transition-all duration-300 transform translate-y-2 opacity-0';
      t.innerHTML = \`<i class="fa-solid \${icons[type] || icons.info}"></i><span>\${escapeHtml(msg)}</span>\`;
      cont.appendChild(t);
      requestAnimationFrame(() => t.classList.remove('translate-y-2', 'opacity-0'));
      setTimeout(() => { t.classList.add('opacity-0', 'translate-y-2'); setTimeout(() => t.remove(), 300); }, 3500);
    }

    function openDialog({ title, message, confirmText = 'Aceptar', onConfirm }) {
      document.getElementById('dialog-title').textContent = title;
      document.getElementById('dialog-message').textContent = message;
      document.getElementById('dialog-confirm').textContent = confirmText;
      STATE.dialogCallback = onConfirm;
      document.getElementById('custom-dialog').classList.remove('hidden');
      lockScroll(true);
    }
    function closeDialog() {
      document.getElementById('custom-dialog').classList.add('hidden');
      STATE.dialogCallback = null;
      lockScroll(false);
    }

    function lockScroll(lock) {
      if (lock) document.body.classList.add('modal-open');
      else {
        const any = ['modal-customizer', 'slideover-cart', 'modal-checkout', 'modal-tracker', 'modal-admin', 'custom-dialog']
          .some(id => !document.getElementById(id).classList.contains('hidden'));
        if (!any) document.body.classList.remove('modal-open');
      }
    }

    /* SECTION 5: RENDER */
    const CATEGORIES = ['Tacos', 'Especialidades', 'Tortas', 'Bebidas y Postres'];

    function renderStatusBadge() {
      const b = document.getElementById('badge-status'), open = checkIsOpen();
      b.className = open ? 'text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 bg-success/20 text-success border border-success/30' : 'text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 bg-error/20 text-error border border-error/30';
      b.innerHTML = open ? '<span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> Abierto' : '<span class="w-1.5 h-1.5 rounded-full bg-error"></span> Cerrado';
    }

    function renderCategoryChips() {
      document.getElementById('category-chips').innerHTML = CATEGORIES.map(cat => {
        const a = STATE.activeCategory === cat;
        return \`<button type="button" data-cat="\${escapeHtml(cat)}" class="chip-cat whitespace-nowrap px-3.5 py-1 rounded-full text-xs font-semibold border transition-all \${a ? 'bg-primary border-primary text-white shadow' : 'bg-bg-card/80 border-white/10 text-text-muted hover:text-white'}">\${escapeHtml(cat)}</button>\`;
      }).join('');
    }

    function renderCarousel() {
      const track = document.getElementById('carousel-track'), dots = document.getElementById('carousel-indicators'), slides = STATE.slides;
      if (!slides.length) return;
      track.innerHTML = slides.map((s, i) => \`
        <div class="absolute inset-0 transition-opacity duration-500 \${i === STATE.slideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}">
          <img src="\${escapeHtml(s.image)}" alt="\${escapeHtml(s.title)}" loading="lazy" onerror="this.onerror=null;this.src='\${SVG_TACO}'" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/40 to-transparent flex flex-col justify-end p-4 sm:p-6">
            <span class="text-[9px] uppercase font-bold text-gold tracking-wider">Especial</span>
            <h2 class="text-sm sm:text-xl font-extrabold text-white leading-tight">\${escapeHtml(s.title)}</h2>
            <p class="text-xs text-text-muted mt-0.5 line-clamp-1 max-w-sm">\${escapeHtml(s.subtitle)}</p>
          </div>
        </div>\`).join('');
      dots.innerHTML = slides.map((_, i) => \`<button type="button" data-slide="\${i}" class="w-2 h-2 rounded-full transition-all \${i === STATE.slideIndex ? 'bg-gold w-4' : 'bg-white/40'}"></button>\`).join('');
    }

    function setSlide(i) {
      if (!STATE.slides.length) return;
      STATE.slideIndex = (i + STATE.slides.length) % STATE.slides.length;
      renderCarousel();
    }
    function startCarousel() { stopCarousel(); STATE.slideTimer = setInterval(() => setSlide(STATE.slideIndex + 1), 5000); }
    function stopCarousel() { if (STATE.slideTimer) { clearInterval(STATE.slideTimer); STATE.slideTimer = null; } }

    function renderMenu() {
      const container = document.getElementById('menu-container'), q = STATE.searchQuery.toLowerCase().trim();
      const filtered = STATE.menu.filter(it => !q || it.name.toLowerCase().includes(q) || it.description.toLowerCase().includes(q));

      if (!filtered.length) {
        container.innerHTML = \`<div class="text-center py-10 px-4 bg-bg-card/40 rounded-2xl border border-white/5 space-y-2"><i class="fa-solid fa-magnifying-glass text-xl text-text-muted"></i><p class="font-bold text-white text-xs">Sin resultados para "\${escapeHtml(STATE.searchQuery)}"</p><button id="btn-reset-search" class="px-3 py-1 rounded-xl bg-primary text-white text-xs font-semibold">Ver todo</button></div>\`;
        return;
      }

      container.innerHTML = CATEGORIES.map(cat => {
        const items = filtered.filter(it => it.category === cat);
        if (!items.length) return '';
        return \`
          <section id="sec-\${cat.replace(/\\s+/g, '-').toLowerCase()}" class="menu-sec scroll-mt-24" data-category="\${escapeHtml(cat)}">
            <div class="flex items-center gap-2 mb-2.5">
              <h3 class="text-base font-bold text-white">\${escapeHtml(cat)}</h3>
              <span class="text-[10px] px-2 py-0.2 rounded-full bg-white/5 text-text-muted font-semibold">\${items.length}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              \${items.map(it => \`
                <div class="card-item group bg-bg-card border border-white/10 hover:border-accent/40 rounded-2xl p-3 flex flex-col justify-between shadow cursor-pointer transition-all" data-id="\${escapeHtml(it.id)}">
                  <div class="space-y-2">
                    <div class="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900">
                      <img src="\${escapeHtml(it.image)}" alt="\${escapeHtml(it.name)}" loading="lazy" onerror="this.onerror=null;this.src='\${SVG_TACO}'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                      <span class="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-gold border border-white/10">\${formatMoney(it.price)}</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-white text-xs group-hover:text-accent transition-colors">\${escapeHtml(it.name)}</h4>
                      <p class="text-[11px] text-text-muted mt-0.5 line-clamp-2 leading-relaxed">\${escapeHtml(it.description)}</p>
                    </div>
                  </div>
                  <div class="pt-2.5 flex items-center justify-between border-t border-white/5 mt-2">
                    <span class="text-xs font-extrabold text-gold">\${formatMoney(it.price)}</span>
                    <button type="button" class="px-2.5 py-1 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1 shadow"><i class="fa-solid fa-plus text-[9px]"></i> Agregar</button>
                  </div>
                </div>\`).join('')}
            </div>
          </section>\`;
      }).join('');
    }

    function calculateCart() {
      let subtotal = 0; const valid = [];
      for (const line of STATE.cart) {
        const it = STATE.menu.find(m => m.id === line.itemId);
        if (!it) continue;
        let unit = it.price;
        if (line.options?.extraCheese) unit += 1500;
        const total = unit * line.quantity;
        subtotal += total;
        valid.push({ ...line, unitPrice: unit, totalPrice: total });
      }
      STATE.cart = valid;
      const deliveryFee = STATE.deliveryType === 'pickup' ? 0 : CONFIG.deliveryFee;
      return { subtotal, deliveryFee, total: subtotal + deliveryFee };
    }

    function renderCartDrawer() {
      const container = document.getElementById('cart-items-container'), { subtotal, deliveryFee, total } = calculateCart();
      const count = STATE.cart.reduce((s, it) => s + it.quantity, 0);

      document.getElementById('cart-counter').textContent = count;
      document.getElementById('cart-counter').classList.toggle('hidden', count === 0);
      document.getElementById('cart-subtotal').textContent = formatMoney(subtotal);
      document.getElementById('cart-delivery-fee').textContent = deliveryFee === 0 ? 'Gratis' : formatMoney(deliveryFee);
      document.getElementById('cart-delivery-label').textContent = STATE.deliveryType === 'pickup' ? 'Recoger en tienda' : 'Costo de envío';
      document.getElementById('cart-total').textContent = formatMoney(total);
      document.getElementById('checkout-pay-total').textContent = formatMoney(total);

      const clearBtn = document.getElementById('btn-clear-cart'), chkBtn = document.getElementById('btn-start-checkout');

      if (!STATE.cart.length) {
        clearBtn.classList.add('hidden'); chkBtn.disabled = true;
        container.innerHTML = \`<div class="text-center py-10 space-y-2"><div class="w-10 h-10 mx-auto rounded-full bg-white/5 flex items-center justify-center text-text-muted"><i class="fa-solid fa-basket-shopping text-sm"></i></div><p class="text-xs text-text-muted">Tu carrito está vacío.</p><button id="btn-back-to-menu" class="px-3 py-1 rounded-xl bg-primary text-white text-xs font-semibold">Ver menú</button></div>\`;
        return;
      }

      clearBtn.classList.remove('hidden'); chkBtn.disabled = false;
      container.innerHTML = STATE.cart.map((line, idx) => {
        const item = STATE.menu.find(m => m.id === line.itemId), name = item ? item.name : 'Platillo';
        const mods = [];
        if (line.options.tortilla) mods.push(\`Tortilla: \${line.options.tortilla}\`);
        if (line.options.meat) mods.push(\`Carne: \${line.options.meat}\`);
        if (line.options.flavor) mods.push(\`Sabor: \${line.options.flavor}\`);
        if (line.options.toppings) mods.push(line.options.toppings);
        if (line.options.salsas?.length) mods.push(\`Salsas: \${line.options.salsas.join(', ')}\`);
        if (line.options.extraCheese) mods.push('Extra queso (+$15)');

        return \`
          <div class="p-2.5 bg-bg-surface/50 border border-white/5 rounded-xl space-y-1.5 text-xs">
            <div class="flex justify-between items-start">
              <div><h4 class="font-bold text-white">\${escapeHtml(name)}</h4><p class="text-gold font-semibold text-[11px]">\${formatMoney(line.unitPrice)} c/u</p></div>
              <span class="font-bold text-white">\${formatMoney(line.totalPrice)}</span>
            </div>
            \${mods.length ? \`<p class="text-[10px] text-text-muted bg-slate-900/60 p-1.5 rounded-lg border border-white/5">\${mods.map(escapeHtml).join(' • ')}</p>\` : ''}
            \${line.notes ? \`<p class="text-[10px] text-accent italic"><i class="fa-solid fa-pencil text-[8px] mr-1"></i>"\${escapeHtml(line.notes)}"</p>\` : ''}
            <div class="flex items-center justify-between pt-1 border-t border-white/5">
              <div class="flex items-center gap-1.5 bg-bg-card border border-white/10 rounded-lg px-1.5 py-0.5">
                <button type="button" class="btn-cart-minus text-text-muted hover:text-white font-bold px-1" data-index="\${idx}">-</button>
                <span class="w-3 text-center font-bold text-white text-xs">\${line.quantity}</span>
                <button type="button" class="btn-cart-plus text-text-muted hover:text-white font-bold px-1" data-index="\${idx}">+</button>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" class="btn-cart-edit text-accent hover:underline text-[11px]" data-index="\${idx}">Editar</button>
                <button type="button" class="btn-cart-remove text-error hover:text-red-400 text-xs" data-index="\${idx}"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            </div>
          </div>\`;
      }).join('');
    }

    /* SECTION 6: CUSTOMIZER */
    function openCustomizer(itemId, editingIdx = null) {
      const it = STATE.menu.find(m => m.id === itemId);
      if (!it) return;
      STATE.customizerItem = it; STATE.editingCartIndex = editingIdx;

      document.getElementById('customizer-title').textContent = it.name;
      document.getElementById('customizer-base-price').textContent = \`\${formatMoney(it.price)} base\`;

      let q = 1, opts = {}, notes = '';
      if (editingIdx !== null && STATE.cart[editingIdx]) {
        const l = STATE.cart[editingIdx];
        q = l.quantity; opts = l.options || {}; notes = l.notes || '';
      }
      document.getElementById('customizer-qty').textContent = q;

      const cfg = it.customizer || {};
      let html = '';

      if (cfg.tortilla) {
        const sel = opts.tortilla || 'Maíz';
        html += \`<div class="space-y-1"><span class="font-bold text-text-muted uppercase text-[9px]">Tortilla *</span><div class="grid grid-cols-2 gap-1.5">\${['Maíz','Harina'].map(t => \`<label class="flex items-center justify-center py-1.5 px-2 rounded-xl border border-white/10 bg-bg-page/70 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/20 font-semibold text-xs"><input type="radio" name="opt-tortilla" value="\${t}" \${sel === t ? 'checked':''} class="hidden">\${t}</label>\`).join('')}</div></div>\`;
      } else if (cfg.tortillaFixed) {
        html += \`<div class="p-2 rounded-xl bg-bg-page/50 border border-white/5 flex justify-between text-xs"><span class="text-text-muted">Tortilla:</span><span class="font-bold text-white">\${escapeHtml(cfg.tortillaFixed)}</span></div>\`;
      }

      if (cfg.meat) {
        const selMeat = opts.meat || '';
        html += \`<div class="space-y-1"><span class="font-bold text-text-muted uppercase text-[9px]">Carne *</span><div class="grid grid-cols-3 gap-1.5">\${['Pastor','Bistec','Suadero'].map(m => \`<label class="flex items-center justify-center py-1.5 rounded-xl border border-white/10 bg-bg-page/70 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/20 font-semibold text-xs text-center"><input type="radio" name="opt-meat" value="\${m}" \${selMeat === m ? 'checked':''} class="hidden">\${m}</label>\`).join('')}</div><p id="err-cust-meat" class="text-error text-[10px] hidden">Elige la carne</p></div>\`;
      }

      if (cfg.flavor) {
        const selFlav = opts.flavor || '';
        html += \`<div class="space-y-1"><span class="font-bold text-text-muted uppercase text-[9px]">Sabor *</span><div class="grid grid-cols-2 sm:grid-cols-4 gap-1">\${['Cola','Naranja','Toronja','Limón'].map(f => \`<label class="flex items-center justify-center py-1.5 rounded-xl border border-white/10 bg-bg-page/70 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/20 font-semibold text-xs text-center"><input type="radio" name="opt-flavor" value="\${f}" \${selFlav === f ? 'checked':''} class="hidden">\${f}</label>\`).join('')}</div><p id="err-cust-flavor" class="text-error text-[10px] hidden">Elige un sabor</p></div>\`;
      }

      if (cfg.toppings) {
        const selTop = opts.toppings || 'Con cebolla y cilantro';
        html += \`<div class="space-y-1"><span class="font-bold text-text-muted uppercase text-[9px]">Verdura</span><div class="grid grid-cols-2 gap-1.5">\${['Con cebolla y cilantro','Sin cebolla'].map(top => \`<label class="flex items-center justify-center py-1.5 px-2 rounded-xl border border-white/10 bg-bg-page/70 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/20 font-semibold text-xs text-center"><input type="radio" name="opt-toppings" value="\${top}" \${selTop === top ? 'checked':''} class="hidden">\${top}</label>\`).join('')}</div></div>\`;
      }

      if (cfg.salsas) {
        const selS = opts.salsas || [], isSin = selS.includes('Sin salsa');
        html += \`<div class="space-y-1"><span class="font-bold text-text-muted uppercase text-[9px]">Salsas</span><div class="grid grid-cols-2 gap-1.5">\${['Verde','Roja','Picante de la casa'].map(s => \`<label class="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-white/10 bg-bg-page/70 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/20 text-xs"><input type="checkbox" name="opt-salsa" value="\${s}" \${!isSin && selS.includes(s) ? 'checked':''} class="salsa-chk rounded bg-slate-800 text-primary"> \${s}</label>\`).join('')}<label class="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-white/10 bg-bg-page/70 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/20 text-xs col-span-2"><input type="checkbox" name="opt-salsa" value="Sin salsa" \${isSin ? 'checked':''} id="cust-sin-salsa" class="rounded bg-slate-800 text-primary"> Sin salsa</label></div></div>\`;
      }

      if (cfg.extraCheese) {
        html += \`<div class="pt-1.5 border-t border-white/5"><label class="flex items-center justify-between p-2 rounded-xl border border-white/10 bg-bg-page/70 cursor-pointer has-[:checked]:border-gold has-[:checked]:bg-gold/10"><div class="flex items-center gap-2"><input type="checkbox" id="cust-extra-cheese" \${opts.extraCheese ? 'checked':''} class="rounded bg-slate-800 text-gold"><span class="font-bold text-white text-xs">Extra queso</span></div><span class="font-bold text-gold text-xs">+ $15.00 c/u</span></label></div>\`;
      }

      html += \`<div class="space-y-1 pt-1.5 border-t border-white/5"><div class="flex justify-between items-center text-[10px] text-text-muted"><label for="cust-notes" class="font-bold uppercase text-[9px]">Instrucciones</label><span id="cust-notes-len">0/200</span></div><textarea id="cust-notes" maxlength="200" rows="2" placeholder="Ej. Bien doradito..." class="w-full px-2.5 py-1.5 bg-bg-page border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-accent resize-none">\${escapeHtml(notes)}</textarea></div>\`;

      const body = document.getElementById('customizer-body');
      body.innerHTML = html;

      const sin = document.getElementById('cust-sin-salsa'), chks = document.querySelectorAll('.salsa-chk');
      if (sin) {
        sin.addEventListener('change', () => { if (sin.checked) chks.forEach(c => c.checked = false); });
        chks.forEach(c => { c.addEventListener('change', () => { if (c.checked && sin.checked) sin.checked = false; }); });
      }

      const notEl = document.getElementById('cust-notes'), lenEl = document.getElementById('cust-notes-len');
      if (notEl && lenEl) {
        lenEl.textContent = \`\${notEl.value.length}/200\`;
        notEl.addEventListener('input', () => { lenEl.textContent = \`\${notEl.value.length}/200\`; });
      }

      body.addEventListener('change', updateCustomizerLiveTotal);
      updateCustomizerLiveTotal();

      document.getElementById('modal-customizer').classList.remove('hidden');
      lockScroll(true);
    }

    function updateCustomizerLiveTotal() {
      const it = STATE.customizerItem;
      if (!it) return;
      const q = parseInt(document.getElementById('customizer-qty').textContent, 10) || 1;
      let unit = it.price;
      if (document.getElementById('cust-extra-cheese')?.checked) unit += 1500;
      document.getElementById('customizer-live-total').textContent = formatMoney(unit * q);

      let ok = true;
      if (it.customizer?.meat) {
        const has = !!document.querySelector('input[name="opt-meat"]:checked');
        const err = document.getElementById('err-cust-meat');
        if (!has) { ok = false; err?.classList.remove('hidden'); } else err?.classList.add('hidden');
      }
      if (it.customizer?.flavor) {
        const has = !!document.querySelector('input[name="opt-flavor"]:checked');
        const err = document.getElementById('err-cust-flavor');
        if (!has) { ok = false; err?.classList.remove('hidden'); } else err?.classList.add('hidden');
      }
      document.getElementById('btn-customizer-submit').disabled = !ok;
      document.getElementById('customizer-submit-text').textContent = STATE.editingCartIndex !== null ? 'Guardar' : 'Agregar';
    }

    function closeCustomizer() {
      document.getElementById('modal-customizer').classList.add('hidden');
      STATE.customizerItem = null; STATE.editingCartIndex = null; lockScroll(false);
    }

    function commitCustomizer() {
      const it = STATE.customizerItem;
      if (!it) return;
      const q = parseInt(document.getElementById('customizer-qty').textContent, 10) || 1, options = {};
      if (it.customizer.tortilla) options.tortilla = document.querySelector('input[name="opt-tortilla"]:checked')?.value;
      else if (it.customizer.tortillaFixed) options.tortilla = it.customizer.tortillaFixed;
      if (it.customizer.meat) options.meat = document.querySelector('input[name="opt-meat"]:checked')?.value;
      if (it.customizer.flavor) options.flavor = document.querySelector('input[name="opt-flavor"]:checked')?.value;
      if (it.customizer.toppings) options.toppings = document.querySelector('input[name="opt-toppings"]:checked')?.value;
      if (it.customizer.salsas) {
        const s = []; document.querySelectorAll('input[name="opt-salsa"]:checked').forEach(c => s.push(c.value));
        options.salsas = s;
      }
      if (document.getElementById('cust-extra-cheese')?.checked) options.extraCheese = true;

      const notes = (document.getElementById('cust-notes')?.value || '').trim();
      let unit = it.price;
      if (options.extraCheese) unit += 1500;
      const total = unit * q;

      if (STATE.editingCartIndex !== null) {
        STATE.cart[STATE.editingCartIndex] = { id: STATE.cart[STATE.editingCartIndex].id, itemId: it.id, quantity: q, options, notes, unitPrice: unit, totalPrice: total };
        showToast('Platillo actualizado', 'success');
      } else {
        const m = STATE.cart.findIndex(l => l.itemId === it.id && l.notes === notes && JSON.stringify(l.options) === JSON.stringify(options));
        if (m >= 0) {
          const nq = Math.min(STATE.cart[m].quantity + q, CONFIG.maxQtyPerLine);
          STATE.cart[m].quantity = nq; STATE.cart[m].totalPrice = STATE.cart[m].unitPrice * nq;
          showToast(\`Cantidad actualizada: \${nq}\`, 'success');
        } else {
          STATE.cart.push({ id: 'line-' + Date.now().toString(36), itemId: it.id, quantity: q, options, notes, unitPrice: unit, totalPrice: total });
          showToast('Agregado al carrito', 'success');
        }
      }
      Storage.set(STORAGE_KEYS.CART, STATE.cart);
      renderCartDrawer();
      closeCustomizer();
    }

    /* SECTION 7: CHECKOUT */
    function openCheckout() {
      if (!STATE.cart.length) return;
      closeCart(); loadSavedDelivery(); setCheckoutStep(1);
      document.getElementById('modal-checkout').classList.remove('hidden');
      lockScroll(true);
    }
    function closeCheckout() { document.getElementById('modal-checkout').classList.add('hidden'); lockScroll(false); }

    function setCheckoutStep(s) {
      const d = document.getElementById('step-delivery'), p = document.getElementById('step-payment');
      const ind = document.getElementById('checkout-step-indicator'), back = document.getElementById('btn-checkout-back'), next = document.getElementById('btn-checkout-next');
      if (s === 1) {
        d.classList.remove('hidden'); p.classList.add('hidden'); ind.textContent = 'Paso 1 de 2: Entrega';
        back.classList.add('hidden'); next.innerHTML = '<span>Ir a Forma de Pago</span><i class="fa-solid fa-arrow-right text-[10px]"></i>';
      } else {
        d.classList.add('hidden'); p.classList.remove('hidden'); ind.textContent = 'Paso 2 de 2: Forma de Pago';
        back.classList.remove('hidden'); next.innerHTML = '<span>Confirmar y Pagar</span><i class="fa-solid fa-check text-[10px]"></i>';
        updateCashChange();
      }
    }

    function setDeliveryType(t) {
      STATE.deliveryType = t;
      const bDel = document.getElementById('type-delivery'), bPic = document.getElementById('type-pickup');
      const sec = document.getElementById('delivery-address-section'), info = document.getElementById('pickup-info');
      if (t === 'delivery') {
        bDel.className = 'py-1.5 rounded-lg font-bold bg-primary text-white flex items-center justify-center gap-1 shadow';
        bPic.className = 'py-1.5 rounded-lg font-semibold text-text-muted hover:text-white flex items-center justify-center gap-1';
        sec.classList.remove('hidden'); info.classList.add('hidden');
      } else {
        bPic.className = 'py-1.5 rounded-lg font-bold bg-primary text-white flex items-center justify-center gap-1 shadow';
        bDel.className = 'py-1.5 rounded-lg font-semibold text-text-muted hover:text-white flex items-center justify-center gap-1';
        sec.classList.add('hidden'); info.classList.remove('hidden');
        document.getElementById('pickup-store-address').textContent = CONFIG.address || 'Av. Revolución 456, Col. Escandón, CDMX';
      }
      renderCartDrawer();
    }

    function loadSavedDelivery() {
      const s = Storage.get(STORAGE_KEYS.DELIVERY);
      if (!s) return;
      if (s.name) document.getElementById('del-name').value = s.name;
      if (s.phone) document.getElementById('del-phone').value = s.phone;
      if (s.street) document.getElementById('del-street').value = s.street;
      if (s.numExt) document.getElementById('del-num-ext').value = s.numExt;
      if (s.numInt) document.getElementById('del-num-int').value = s.numInt;
      if (s.colonia) document.getElementById('del-colonia').value = s.colonia;
      if (s.notes) document.getElementById('del-notes').value = s.notes;
      if (s.gps) STATE.gpsCoords = s.gps;
      if (s.deliveryType) setDeliveryType(s.deliveryType);
    }

    function validateStep1() {
      let ok = true;
      const name = document.getElementById('del-name').value.trim(), phone = document.getElementById('del-phone').value.trim();
      const errN = document.getElementById('err-del-name'), errP = document.getElementById('err-del-phone');

      if (!name) { errN.textContent = 'Nombre requerido'; errN.classList.remove('hidden'); ok = false; } else errN.classList.add('hidden');
      if (!/^[0-9]{10}$/.test(phone)) { errP.textContent = '10 dígitos celulares'; errP.classList.remove('hidden'); ok = false; } else errP.classList.add('hidden');

      if (STATE.deliveryType === 'delivery') {
        const street = document.getElementById('del-street').value.trim(), numExt = document.getElementById('del-num-ext').value.trim(), colonia = document.getElementById('del-colonia').value.trim(), notes = document.getElementById('del-notes').value.trim();
        const hasFull = street && numExt && colonia, hasGps = STATE.gpsCoords && notes;
        const errS = document.getElementById('err-del-street'), errE = document.getElementById('err-del-num-ext'), errC = document.getElementById('err-del-colonia');

        if (!hasFull && !hasGps) {
          if (!street) { errS.textContent = 'Requerido'; errS.classList.remove('hidden'); } else errS.classList.add('hidden');
          if (!numExt) { errE.textContent = 'Requerido'; errE.classList.remove('hidden'); } else errE.classList.add('hidden');
          if (!colonia) { errC.textContent = 'Requerido'; errC.classList.remove('hidden'); } else errC.classList.add('hidden');
          ok = false;
        } else { errS.classList.add('hidden'); errE.classList.add('hidden'); errC.classList.add('hidden'); }
      }

      if (ok) {
        Storage.set(STORAGE_KEYS.DELIVERY, {
          name, phone, deliveryType: STATE.deliveryType,
          street: document.getElementById('del-street').value.trim(), numExt: document.getElementById('del-num-ext').value.trim(),
          numInt: document.getElementById('del-num-int').value.trim(), colonia: document.getElementById('del-colonia').value.trim(),
          notes: document.getElementById('del-notes').value.trim(), gps: STATE.gpsCoords
        });
      }
      return ok;
    }

    function requestGPS() {
      const status = document.getElementById('gps-status'), btn = document.getElementById('gps-btn-label');
      if (!navigator.geolocation) {
        status.className = 'p-1.5 rounded-lg border bg-error/10 border-error/30 text-error';
        status.textContent = 'Navegador sin soporte de GPS.'; status.classList.remove('hidden'); return;
      }
      btn.textContent = 'Localizando...';
      status.className = 'p-1.5 rounded-lg border bg-accent/10 border-accent/30 text-accent';
      status.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Buscando GPS...'; status.classList.remove('hidden');

      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
          STATE.gpsCoords = { lat, lng, acc: Math.round(acc) };
          btn.textContent = 'GPS guardado';
          status.className = 'p-1.5 rounded-lg border bg-success/10 border-success/30 text-success';
          status.innerHTML = \`<i class="fa-solid fa-circle-check mr-1"></i> GPS: Lat \${lat.toFixed(4)}, Lng \${lng.toFixed(4)} (±\${Math.round(acc)}m)\`;
          showToast('Ubicación registrada', 'success');
        },
        err => {
          btn.textContent = 'Usar mi ubicación actual (GPS)';
          status.className = 'p-1.5 rounded-lg border bg-error/10 border-error/30 text-error';
          const m = { 1: 'Permiso GPS denegado.', 2: 'Posición no disponible.', 3: 'Tiempo de espera agotado.' };
          status.textContent = m[err.code] || 'Error de GPS.';
          showToast(status.textContent, 'error');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    function setPaymentMethod(m) {
      STATE.paymentMethod = m;
      const bCard = document.getElementById('pay-method-card'), bCash = document.getElementById('pay-method-cash');
      const fCard = document.getElementById('payment-card-form'), fCash = document.getElementById('payment-cash-form');
      if (m === 'card') {
        bCard.className = 'py-1.5 rounded-lg font-bold bg-primary text-white flex items-center justify-center gap-1 shadow';
        bCash.className = 'py-1.5 rounded-lg font-semibold text-text-muted hover:text-white flex items-center justify-center gap-1';
        fCard.classList.remove('hidden'); fCash.classList.add('hidden');
      } else {
        bCash.className = 'py-1.5 rounded-lg font-bold bg-primary text-white flex items-center justify-center gap-1 shadow';
        bCard.className = 'py-1.5 rounded-lg font-semibold text-text-muted hover:text-white flex items-center justify-center gap-1';
        fCash.classList.remove('hidden'); fCard.classList.add('hidden'); updateCashChange();
      }
    }

    function updateCashChange() {
      const { total } = calculateCart(), val = parseFloat(document.getElementById('cash-amount').value) || 0;
      const c = Math.round(val * 100), chg = c - total;
      const err = document.getElementById('err-cash-amount'), txt = document.getElementById('cash-change-text');

      if (c < total && val > 0) {
        err.textContent = \`Monto menor al total (\${formatMoney(total)})\`; err.classList.remove('hidden');
        txt.textContent = '$0.00'; txt.className = 'text-sm font-bold text-error';
      } else {
        err.classList.add('hidden'); txt.textContent = formatMoney(Math.max(0, chg)); txt.className = 'text-sm font-bold text-success';
      }
    }

    function submitCheckout() {
      const { total } = calculateCart();
      if (STATE.paymentMethod === 'card') {
        const num = document.getElementById('card-number').value.replace(/\\s+/g, ''), holder = document.getElementById('card-holder').value.trim();
        const exp = document.getElementById('card-expiry').value.trim(), cvv = document.getElementById('card-cvv').value.trim();
        const errNum = document.getElementById('err-card-number'), errHol = document.getElementById('err-card-holder');
        const errExp = document.getElementById('err-card-expiry'), errCvv = document.getElementById('err-card-cvv');

        let ok = true;
        if (!validateLuhn(num)) { errNum.textContent = 'Tarjeta inválida (Luhn)'; errNum.classList.remove('hidden'); ok = false; } else errNum.classList.add('hidden');
        if (!holder) { errHol.textContent = 'Titular requerido'; errHol.classList.remove('hidden'); ok = false; } else errHol.classList.add('hidden');

        const m = exp.match(/^(\\d{2})\\/(\\d{2})$/);
        if (!m) { errExp.textContent = 'Formato MM/AA'; errExp.classList.remove('hidden'); ok = false; }
        else {
          const em = parseInt(m[1], 10), ey = parseInt('20' + m[2], 10), now = new Date();
          if (em < 1 || em > 12 || ey < now.getFullYear() || (ey === now.getFullYear() && em < now.getMonth() + 1)) {
            errExp.textContent = 'Tarjeta vencida'; errExp.classList.remove('hidden'); ok = false;
          } else errExp.classList.add('hidden');
        }
        if (cvv.length < 3) { errCvv.textContent = 'CVV inválido'; errCvv.classList.remove('hidden'); ok = false; } else errCvv.classList.add('hidden');

        if (!ok) return;

        if (num === '4000000000000002') {
          const btn = document.getElementById('btn-checkout-next');
          btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Verificando...';
          setTimeout(() => {
            btn.disabled = false; btn.innerHTML = '<span>Confirmar y Pagar</span><i class="fa-solid fa-check text-[10px]"></i>';
            errNum.textContent = 'Transacción rechazada por el banco emisor.'; errNum.classList.remove('hidden');
            showToast('Pago rechazado por el banco (Simulación)', 'error');
          }, 1500);
          return;
        }

        const btn = document.getElementById('btn-checkout-next');
        btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Autorizando...';
        setTimeout(() => {
          document.getElementById('card-number').value = ''; document.getElementById('card-holder').value = '';
          document.getElementById('card-expiry').value = ''; document.getElementById('card-cvv').value = '';
          finishOrder('Tarjeta de crédito / débito');
        }, 2000);
      } else {
        const val = parseFloat(document.getElementById('cash-amount').value) || 0, c = Math.round(val * 100);
        if (c < total) { showToast(\`Monto insuficiente (mínimo \${formatMoney(total)})\`, 'error'); return; }
        finishOrder(\`Efectivo (Pago: \${formatMoney(c)}, Cambio: \${formatMoney(c - total)})\`);
      }
    }

    function finishOrder(pay) {
      const totals = calculateCart(), s = Storage.get(STORAGE_KEYS.DELIVERY) || {};
      const dest = STATE.deliveryType === 'pickup' ? (CONFIG.address || 'Recoger en local') : \`\${s.street || ''} #\${s.numExt || ''}, Col. \${s.colonia || ''}\`;
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2), mm = String(now.getMonth() + 1).padStart(2, '0'), dd = String(now.getDate()).padStart(2, '0');
      const orderId = \`TBT-\${yy}\${mm}\${dd}-\${Math.floor(1000 + Math.random() * 9000)}\`;

      const order = { id: orderId, createdAt: Date.now(), items: [...STATE.cart], deliveryType: STATE.deliveryType, destination: dest, notes: s.notes || '', gps: STATE.gpsCoords, paymentMethod: pay, totals };
      STATE.activeOrder = order; Storage.set(STORAGE_KEYS.ORDER, order);
      STATE.cart = []; Storage.set(STORAGE_KEYS.CART, []); renderCartDrawer();
      closeCheckout(); showToast('¡Pedido recibido!', 'success'); openTracker();
    }

    /* SECTION 8: TRACKER & MAPS */
    function checkActiveOrder() {
      const o = Storage.get(STORAGE_KEYS.ORDER), b = document.getElementById('tracker-banner');
      if (!o) { b.classList.add('hidden'); STATE.activeOrder = null; return; }
      STATE.activeOrder = o; b.classList.remove('hidden'); updateTrackerStageUI();
    }

    function openTracker() {
      if (!STATE.activeOrder) return;
      const o = STATE.activeOrder;
      document.getElementById('tracker-order-id').textContent = o.id;
      document.getElementById('tracker-type').textContent = o.deliveryType === 'pickup' ? 'Recoger en tienda' : 'A Domicilio';
      document.getElementById('tracker-destination').textContent = o.destination;
      document.getElementById('tracker-payment').textContent = o.paymentMethod;
      document.getElementById('tracker-total').textContent = formatMoney(o.totals.total);

      if (o.deliveryType === 'pickup') {
        document.getElementById('stage-3-title').textContent = 'Listo para recoger';
        document.getElementById('stage-3-desc').textContent = 'Empaquetado y listo en sucursal.';
      } else {
        document.getElementById('stage-3-title').textContent = 'En Camino';
        document.getElementById('stage-3-desc').textContent = 'El repartidor va velozmente hacia ti.';
      }

      const maps = document.getElementById('btn-maps-link');
      if (o.deliveryType === 'pickup') maps.href = \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(CONFIG.address)}\`;
      else if (o.gps?.lat && o.gps?.lng) maps.href = \`https://www.google.com/maps?q=\${o.gps.lat},\${o.gps.lng}\`;
      else maps.href = \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(o.destination)}\`;

      const wa = document.getElementById('btn-whatsapp-order');
      if (CONFIG.whatsappNumber) {
        wa.href = \`https://wa.me/\${CONFIG.whatsappNumber}?text=\${encodeURIComponent(\`Hola Taquería El Buen Taquito! Pedido *\${o.id}* por *\${formatMoney(o.totals.total)}*.\`)}\`;
        wa.classList.remove('hidden');
      } else wa.classList.add('hidden');

      document.getElementById('modal-tracker').classList.remove('hidden');
      lockScroll(true); startTracker();
    }

    function closeTracker() { document.getElementById('modal-tracker').classList.add('hidden'); stopTracker(); lockScroll(false); }

    function getTrackerStage(sec) {
      const t = CONFIG.trackerStageSeconds;
      if (sec >= t[3]) return 4; if (sec >= t[2]) return 3; if (sec >= t[1]) return 2; return 1;
    }

    function updateTrackerStageUI() {
      if (!STATE.activeOrder) return;
      const elapsed = Math.floor((Date.now() - STATE.activeOrder.createdAt) / 1000), stage = getTrackerStage(elapsed);
      document.getElementById('tracker-elapsed').textContent = \`\${elapsed}s\`;
      const banner = document.getElementById('tracker-banner-title');
      const names = { 1: 'Confirmado', 2: 'En el Comal', 3: STATE.activeOrder.deliveryType === 'pickup' ? 'Listo en tienda' : 'En camino', 4: '¡Entregado!' };
      if (banner) banner.textContent = names[stage];

      document.querySelectorAll('.timeline-step').forEach(el => {
        const s = parseInt(el.getAttribute('data-stage'), 10), icon = el.querySelector('.step-icon');
        const check = el.querySelector('.fa-check'), num = el.querySelector('.num'), title = el.querySelector('.step-title');
        if (s < stage) {
          icon.className = 'step-icon w-7 h-7 rounded-full bg-success/20 border-2 border-success text-success flex items-center justify-center font-bold text-xs';
          check.classList.remove('hidden'); num.classList.add('hidden'); title.className = 'font-bold text-white step-title';
        } else if (s === stage) {
          icon.className = 'step-icon w-7 h-7 rounded-full bg-primary/20 border-2 border-primary text-primary flex items-center justify-center font-bold text-xs animate-pulse';
          check.classList.add('hidden'); num.classList.remove('hidden'); title.className = 'font-bold text-primary step-title';
        } else {
          icon.className = 'step-icon w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-700 text-text-muted flex items-center justify-center font-bold text-xs';
          check.classList.add('hidden'); num.classList.remove('hidden'); title.className = 'font-bold text-text-muted step-title';
        }
      });
    }

    function startTracker() { stopTracker(); updateTrackerStageUI(); STATE.trackerTimer = setInterval(updateTrackerStageUI, 1000); }
    function stopTracker() { if (STATE.trackerTimer) { clearInterval(STATE.trackerTimer); STATE.trackerTimer = null; } }

    function resetOrder() {
      Storage.remove(STORAGE_KEYS.ORDER); STATE.activeOrder = null; stopTracker(); closeTracker(); checkActiveOrder(); showToast('Pedido finalizado.', 'info');
    }

    /* SECTION 9: ADMIN MANAGER */
    function openAdminModal() {
      const unl = sessionStorage.getItem('taqueria:admin_unlocked') === 'true';
      const pv = document.getElementById('admin-pin-view'), cv = document.getElementById('admin-content-view');
      if (unl) { pv.classList.add('hidden'); cv.classList.remove('hidden'); renderAdminCarousel(); renderAdminCatalog(); }
      else { pv.classList.remove('hidden'); cv.classList.add('hidden'); document.getElementById('admin-pin-input').value = ''; document.getElementById('admin-pin-error').classList.add('hidden'); }
      document.getElementById('modal-admin').classList.remove('hidden'); lockScroll(true);
    }
    function closeAdminModal() { document.getElementById('modal-admin').classList.add('hidden'); lockScroll(false); }

    function unlockAdmin() {
      if (document.getElementById('admin-pin-input').value.trim() === CONFIG.adminPin) {
        sessionStorage.setItem('taqueria:admin_unlocked', 'true');
        document.getElementById('admin-pin-view').classList.add('hidden');
        document.getElementById('admin-content-view').classList.remove('hidden');
        renderAdminCarousel(); renderAdminCatalog(); showToast('Panel desbloqueado', 'success');
      } else document.getElementById('admin-pin-error').classList.remove('hidden');
    }

    function renderAdminCarousel() {
      document.getElementById('admin-carousel-list').innerHTML = STATE.slides.map((s, i) => \`
        <div class="flex items-center gap-2 p-1.5 bg-bg-surface/50 rounded-xl border border-white/5">
          <img src="\${escapeHtml(s.image)}" alt="" onerror="this.onerror=null;this.src='\${SVG_TACO}'" class="w-8 h-8 rounded-lg object-cover bg-slate-900">
          <div class="flex-1 min-w-0"><h5 class="font-bold text-white truncate text-[11px]">\${escapeHtml(s.title)}</h5></div>
          <button type="button" class="btn-del-slide text-error p-1" data-index="\${i}"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>\`).join('');
    }

    function renderAdminCatalog() {
      document.getElementById('admin-catalog-list').innerHTML = STATE.menu.map(it => \`
        <div class="flex items-center gap-2 p-1.5 bg-bg-surface/50 rounded-xl border border-white/5">
          <img src="\${escapeHtml(it.image)}" alt="" onerror="this.onerror=null;this.src='\${SVG_TACO}'" class="w-8 h-8 rounded-lg object-cover bg-slate-900" id="prev-\${it.id}">
          <div class="flex-1 min-w-0">
            <span class="font-bold text-white truncate block text-[11px]">\${escapeHtml(it.name)}</span>
            <div class="flex items-center gap-1 mt-0.5">
              <input type="url" placeholder="URL" class="admin-url flex-1 px-1.5 py-0.5 bg-bg-page border border-white/10 rounded text-white text-[10px]" data-id="\${it.id}">
              <label class="px-2 py-0.5 bg-slate-800 border border-white/10 rounded text-white cursor-pointer text-[9px]"><span>Subir</span><input type="file" accept="image/*" class="admin-file hidden" data-id="\${it.id}"></label>
              <button type="button" class="btn-reset-photo text-gold hover:underline text-[9px]" data-id="\${it.id}">Reset</button>
            </div>
          </div>
        </div>\`).join('');
    }

    function downscaleImage(file) {
      return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) return reject(new Error('No es imagen válida'));
        if (file.size > 5 * 1024 * 1024) return reject(new Error('Máximo 5 MB'));
        const r = new FileReader();
        r.onload = e => {
          const img = new Image();
          img.onload = () => {
            let w = img.width, h = img.height;
            if (w > 1280) { h = Math.round((h * 1280) / w); w = 1280; }
            const cvs = document.createElement('canvas'); cvs.width = w; cvs.height = h;
            cvs.getContext('2d').drawImage(img, 0, 0, w, h);
            resolve(cvs.toDataURL('image/jpeg', 0.8));
          };
          img.onerror = () => reject(new Error('Error al decodificar'));
          img.src = e.target.result;
        };
        r.onerror = () => reject(new Error('Error al leer'));
        r.readAsDataURL(file);
      });
    }

    function verifyUrl(u) {
      return new Promise((resolve, reject) => {
        if (!u || (!u.startsWith('http://') && !u.startsWith('https://') && !u.startsWith('data:image/'))) return reject(new Error('Debe ser http(s)://'));
        const img = new Image();
        img.onload = () => resolve(u);
        img.onerror = () => reject(new Error('No se pudo cargar'));
        img.src = u;
      });
    }

    function savePhotos() {
      const d = { slides: STATE.slides, overrides: {} };
      STATE.menu.forEach(it => {
        const def = DEFAULT_CATALOG.find(x => x.id === it.id);
        if (def && it.image !== def.image) d.overrides[it.id] = it.image;
      });
      Storage.set(STORAGE_KEYS.PHOTOS, d);
    }

    function loadSavedPhotos() {
      const s = Storage.get(STORAGE_KEYS.PHOTOS);
      if (!s) return;
      if (Array.isArray(s.slides) && s.slides.length) STATE.slides = s.slides;
      if (s.overrides) STATE.menu = STATE.menu.map(it => s.overrides[it.id] ? { ...it, image: s.overrides[it.id] } : it);
    }

    /* SECTION 10: EVENTS */
    function openCart() { renderCartDrawer(); document.getElementById('slideover-cart').classList.remove('hidden'); lockScroll(true); }
    function closeCart() { document.getElementById('slideover-cart').classList.add('hidden'); lockScroll(false); }

    function initEvents() {
      let sTimer = null;
      document.getElementById('input-search').addEventListener('input', e => {
        clearTimeout(sTimer); sTimer = setTimeout(() => { STATE.searchQuery = e.target.value; renderMenu(); }, 200);
      });

      document.getElementById('category-chips').addEventListener('click', e => {
        const b = e.target.closest('.chip-cat');
        if (!b) return;
        const cat = b.getAttribute('data-cat');
        STATE.activeCategory = cat; renderCategoryChips();
        document.getElementById(\`sec-\${cat.replace(/\\s+/g, '-').toLowerCase()}\`)?.scrollIntoView({ behavior: 'smooth' });
      });

      window.addEventListener('scroll', () => {
        let cur = STATE.activeCategory;
        document.querySelectorAll('.menu-sec').forEach(s => {
          if (s.getBoundingClientRect().top <= 140) cur = s.getAttribute('data-category');
        });
        if (cur && cur !== STATE.activeCategory) { STATE.activeCategory = cur; renderCategoryChips(); }
      }, { passive: true });

      document.getElementById('menu-container').addEventListener('click', e => {
        if (e.target.id === 'btn-reset-search') {
          STATE.searchQuery = ''; document.getElementById('input-search').value = ''; renderMenu(); return;
        }
        const card = e.target.closest('.card-item');
        if (card) openCustomizer(card.getAttribute('data-id'));
      });

      document.getElementById('carousel-prev').addEventListener('click', () => setSlide(STATE.slideIndex - 1));
      document.getElementById('carousel-next').addEventListener('click', () => setSlide(STATE.slideIndex + 1));
      document.getElementById('carousel-indicators').addEventListener('click', e => {
        const b = e.target.closest('button');
        if (b) setSlide(parseInt(b.getAttribute('data-slide'), 10));
      });

      const hero = document.getElementById('hero');
      hero.addEventListener('mouseenter', stopCarousel); hero.addEventListener('mouseleave', startCarousel);
      hero.addEventListener('focusin', stopCarousel); hero.addEventListener('focusout', startCarousel);
      document.addEventListener('visibilitychange', () => document.hidden ? stopCarousel() : startCarousel());

      let tx = 0;
      hero.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
      hero.addEventListener('touchend', e => {
        const diff = tx - e.changedTouches[0].screenX;
        if (diff > 50) setSlide(STATE.slideIndex + 1); if (diff < -50) setSlide(STATE.slideIndex - 1);
      }, { passive: true });

      window.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' && !document.querySelector('input:focus, textarea:focus')) setSlide(STATE.slideIndex - 1);
        if (e.key === 'ArrowRight' && !document.querySelector('input:focus, textarea:focus')) setSlide(STATE.slideIndex + 1);
      });

      document.getElementById('btn-qty-minus').addEventListener('click', () => {
        const q = document.getElementById('customizer-qty'); let v = parseInt(q.textContent, 10) || 1;
        if (v > 1) { q.textContent = --v; updateCustomizerLiveTotal(); }
      });
      document.getElementById('btn-qty-plus').addEventListener('click', () => {
        const q = document.getElementById('customizer-qty'); let v = parseInt(q.textContent, 10) || 1;
        if (v < CONFIG.maxQtyPerLine) { q.textContent = ++v; updateCustomizerLiveTotal(); }
      });
      document.getElementById('btn-close-customizer').addEventListener('click', closeCustomizer);
      document.getElementById('btn-customizer-submit').addEventListener('click', commitCustomizer);

      document.getElementById('btn-open-cart').addEventListener('click', openCart);
      document.getElementById('btn-close-cart').addEventListener('click', closeCart);
      document.getElementById('btn-clear-cart').addEventListener('click', () => {
        openDialog({
          title: '¿Vaciar carrito?', message: 'Se eliminarán todos los productos.', confirmText: 'Sí, vaciar',
          onConfirm: () => { STATE.cart = []; Storage.set(STORAGE_KEYS.CART, []); renderCartDrawer(); showToast('Carrito vaciado', 'info'); }
        });
      });

      document.getElementById('cart-items-container').addEventListener('click', e => {
        if (e.target.id === 'btn-back-to-menu') { closeCart(); document.getElementById('menu-container').scrollIntoView({ behavior: 'smooth' }); return; }
        const p = e.target.closest('.btn-cart-plus');
        if (p) {
          const i = parseInt(p.getAttribute('data-index'), 10);
          if (STATE.cart[i] && STATE.cart[i].quantity < CONFIG.maxQtyPerLine) { STATE.cart[i].quantity++; Storage.set(STORAGE_KEYS.CART, STATE.cart); renderCartDrawer(); }
          return;
        }
        const m = e.target.closest('.btn-cart-minus');
        if (m) {
          const i = parseInt(m.getAttribute('data-index'), 10);
          if (STATE.cart[i]) {
            if (STATE.cart[i].quantity > 1) STATE.cart[i].quantity--; else STATE.cart.splice(i, 1);
            Storage.set(STORAGE_KEYS.CART, STATE.cart); renderCartDrawer();
          }
          return;
        }
        const r = e.target.closest('.btn-cart-remove');
        if (r) {
          const i = parseInt(r.getAttribute('data-index'), 10);
          STATE.cart.splice(i, 1); Storage.set(STORAGE_KEYS.CART, STATE.cart); renderCartDrawer(); showToast('Platillo eliminado', 'info'); return;
        }
        const ed = e.target.closest('.btn-cart-edit');
        if (ed) {
          const i = parseInt(ed.getAttribute('data-index'), 10), l = STATE.cart[i];
          if (l) { closeCart(); openCustomizer(l.itemId, i); }
        }
      });

      document.getElementById('btn-start-checkout').addEventListener('click', openCheckout);
      document.getElementById('btn-close-checkout').addEventListener('click', closeCheckout);
      document.getElementById('type-delivery').addEventListener('click', () => setDeliveryType('delivery'));
      document.getElementById('type-pickup').addEventListener('click', () => setDeliveryType('pickup'));
      document.getElementById('btn-use-gps').addEventListener('click', requestGPS);
      document.getElementById('pay-method-card').addEventListener('click', () => setPaymentMethod('card'));
      document.getElementById('pay-method-cash').addEventListener('click', () => setPaymentMethod('cash'));

      document.getElementById('card-number').addEventListener('input', e => {
        let v = e.target.value.replace(/\\D/g, '').slice(0, 16);
        e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
      });
      document.getElementById('card-expiry').addEventListener('input', e => {
        let v = e.target.value.replace(/\\D/g, '').slice(0, 4);
        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
        e.target.value = v;
      });
      document.getElementById('cash-amount').addEventListener('input', updateCashChange);
      document.getElementById('quick-cash-buttons').addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        const v = b.getAttribute('data-val'), { total } = calculateCart();
        document.getElementById('cash-amount').value = v === 'exact' ? (total / 100).toFixed(2) : v;
        updateCashChange();
      });

      document.getElementById('btn-checkout-back').addEventListener('click', () => setCheckoutStep(1));
      document.getElementById('btn-checkout-next').addEventListener('click', () => {
        const is1 = !document.getElementById('step-delivery').classList.contains('hidden');
        if (is1) { if (validateStep1()) setCheckoutStep(2); } else submitCheckout();
      });

      document.getElementById('btn-open-tracker').addEventListener('click', openTracker);
      document.getElementById('btn-close-tracker').addEventListener('click', closeTracker);
      document.getElementById('btn-new-order').addEventListener('click', resetOrder);

      document.getElementById('dialog-confirm').addEventListener('click', () => { if (STATE.dialogCallback) STATE.dialogCallback(); closeDialog(); });
      document.getElementById('dialog-cancel').addEventListener('click', closeDialog);

      document.getElementById('btn-admin').addEventListener('click', openAdminModal);
      document.getElementById('btn-close-admin').addEventListener('click', closeAdminModal);
      document.getElementById('btn-verify-pin').addEventListener('click', unlockAdmin);
      document.getElementById('admin-pin-input').addEventListener('keydown', e => { if (e.key === 'Enter') unlockAdmin(); });

      const tabC = document.getElementById('tab-btn-carousel'), tabK = document.getElementById('tab-btn-catalog');
      const viewC = document.getElementById('tab-view-carousel'), viewK = document.getElementById('tab-view-catalog');
      tabC.addEventListener('click', () => {
        tabC.className = 'pb-1 border-b-2 border-primary text-white'; tabK.className = 'pb-1 border-b-2 border-transparent text-text-muted hover:text-white';
        viewC.classList.remove('hidden'); viewK.classList.add('hidden');
      });
      tabK.addEventListener('click', () => {
        tabK.className = 'pb-1 border-b-2 border-primary text-white'; tabC.className = 'pb-1 border-b-2 border-transparent text-text-muted hover:text-white';
        viewK.classList.remove('hidden'); viewC.classList.add('hidden');
      });

      document.getElementById('btn-add-slide').addEventListener('click', async () => {
        const title = document.getElementById('new-slide-title').value.trim();
        const subtitle = document.getElementById('new-slide-subtitle').value.trim();
        const url = document.getElementById('new-slide-url').value.trim();
        const file = document.getElementById('new-slide-file').files?.[0];
        const err = document.getElementById('new-slide-error');

        if (!title) { err.textContent = 'Título requerido'; err.classList.remove('hidden'); return; }
        try {
          let img = '';
          if (file) img = await downscaleImage(file);
          else if (url) img = await verifyUrl(url);
          else { err.textContent = 'URL o archivo requerido'; err.classList.remove('hidden'); return; }

          err.classList.add('hidden');
          STATE.slides.push({ id: 's-' + Date.now().toString(36), title, subtitle, image: img });
          savePhotos(); renderAdminCarousel(); renderCarousel();
          document.getElementById('new-slide-title').value = ''; document.getElementById('new-slide-subtitle').value = '';
          document.getElementById('new-slide-url').value = ''; document.getElementById('new-slide-file').value = '';
          showToast('Diapositiva agregada', 'success');
        } catch(e) { err.textContent = e.message; err.classList.remove('hidden'); }
      });

      document.getElementById('admin-carousel-list').addEventListener('click', e => {
        const b = e.target.closest('.btn-del-slide');
        if (!b) return;
        const i = parseInt(b.getAttribute('data-index'), 10);
        if (STATE.slides.length <= 1) { showToast('Debe haber al menos una diapositiva', 'error'); return; }
        STATE.slides.splice(i, 1);
        if (STATE.slideIndex >= STATE.slides.length) STATE.slideIndex = 0;
        savePhotos(); renderAdminCarousel(); renderCarousel();
      });

      document.getElementById('btn-reset-carousel-defaults').addEventListener('click', () => {
        STATE.slides = [...DEFAULT_SLIDES]; STATE.slideIndex = 0; savePhotos(); renderAdminCarousel(); renderCarousel(); showToast('Carrusel restaurado', 'info');
      });

      document.getElementById('admin-catalog-list').addEventListener('change', async e => {
        const f = e.target.closest('.admin-file');
        if (f?.files?.[0]) {
          const id = f.getAttribute('data-id');
          try {
            const dataUrl = await downscaleImage(f.files[0]), it = STATE.menu.find(m => m.id === id);
            if (it) {
              it.image = dataUrl; savePhotos(); renderMenu();
              document.getElementById(\`prev-\${id}\`).src = dataUrl; showToast(\`Foto actualizada: \${it.name}\`, 'success');
            }
          } catch(err) { showToast(err.message, 'error'); }
        }
      });

      document.getElementById('admin-catalog-list').addEventListener('keydown', async e => {
        if (e.key === 'Enter' && e.target.classList.contains('admin-url')) {
          e.preventDefault();
          const id = e.target.getAttribute('data-id'), val = e.target.value.trim();
          try {
            const okUrl = await verifyUrl(val), it = STATE.menu.find(m => m.id === id);
            if (it) {
              it.image = okUrl; savePhotos(); renderMenu();
              document.getElementById(\`prev-\${id}\`).src = okUrl; e.target.value = ''; showToast(\`Foto actualizada: \${it.name}\`, 'success');
            }
          } catch(err) { showToast(err.message, 'error'); }
        }
      });

      document.getElementById('admin-catalog-list').addEventListener('click', e => {
        const b = e.target.closest('.btn-reset-photo');
        if (!b) return;
        const id = b.getAttribute('data-id'), def = DEFAULT_CATALOG.find(d => d.id === id), it = STATE.menu.find(m => m.id === id);
        if (def && it) {
          it.image = def.image; savePhotos(); renderMenu();
          document.getElementById(\`prev-\${id}\`).src = def.image; showToast('Foto original restaurada', 'info');
        }
      });

      document.getElementById('btn-reset-menu-photos').addEventListener('click', () => {
        STATE.menu = DEFAULT_CATALOG.map(d => ({ ...d })); savePhotos(); renderMenu(); renderAdminCatalog(); showToast('Fotos del menú restauradas', 'info');
      });

      const modalList = [
        { id: 'modal-customizer', fn: closeCustomizer }, { id: 'slideover-cart', fn: closeCart },
        { id: 'modal-checkout', fn: closeCheckout }, { id: 'modal-tracker', fn: closeTracker },
        { id: 'modal-admin', fn: closeAdminModal }, { id: 'custom-dialog', fn: closeDialog }
      ];
      modalList.forEach(m => {
        const el = document.getElementById(m.id);
        el.addEventListener('click', e => { if (e.target === el) m.fn(); });
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          for (let i = modalList.length - 1; i >= 0; i--) {
            const el = document.getElementById(modalList[i].id);
            if (el && !el.classList.contains('hidden')) { modalList[i].fn(); break; }
          }
        }
      });
    }

    /* SECTION 11: INIT */
    document.addEventListener('DOMContentLoaded', () => {
      const savedCart = Storage.get(STORAGE_KEYS.CART);
      if (Array.isArray(savedCart)) STATE.cart = savedCart;
      loadSavedPhotos();

      if (CONFIG.phone) document.getElementById('footer-phone').innerHTML = \`<i class="fa-solid fa-phone mr-1 text-gold"></i> \${escapeHtml(CONFIG.phone)}\`;
      if (CONFIG.address) document.getElementById('footer-address').innerHTML = \`<i class="fa-solid fa-location-dot mr-1 text-gold"></i> \${escapeHtml(CONFIG.address)}\`;
      if (CONFIG.whatsappNumber) {
        const wa = document.getElementById('footer-whatsapp');
        wa.href = \`https://wa.me/\${CONFIG.whatsappNumber}\`;
        wa.classList.remove('hidden');
      }

      renderStatusBadge();
      renderCategoryChips();
      renderMenu();
      renderCarousel();
      renderCartDrawer();
      checkActiveOrder();
      startCarousel();
      initEvents();
    });
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', code);
console.log('Done! Length:', code.length);
console.log('Lines:', code.split('\n').length);
