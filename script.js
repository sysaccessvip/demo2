// script.js — sysaccessvip (WhatsApp contact)
// Número destino (tu número publicado): +51 960436357
// Formará un mensaje y abrirá https://wa.me/<number>?text=<encoded message>

(() => {
  const INTRO_DURATION = 1800;
  const TYPED_WORDS = [
    "Arquitectura · Código · Entrega",
    "APIs seguras · Test · CI/CD",
    "PWA · Móvil · Escalable"
  ];
  const TYPING_SPEED = 36;
  const TYPING_PAUSE = 900;

  // Cambia aquí si deseas otro número (debe incluir código país sin +)
  const WHATSAPP_NUMBER = '51960436357'; // <--- tu número tal como pediste

  // Elementos
  const intro = document.getElementById('intro');
  const typedEl = document.getElementById('typed');
  const waDirect = document.getElementById('waDirect');
  const ctaContact = document.getElementById('ctaContact');
  const quickContact = document.getElementById('quickContact');
  const modal = document.getElementById('modal');
  const contactForm = document.getElementById('contactForm');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Intro ----------
  function hideIntro() {
    if (!intro) return;
    intro.style.transition = 'opacity .45s ease, transform .45s ease';
    intro.style.opacity = '0';
    intro.style.transform = 'scale(.98) translateY(-12px)';
    setTimeout(() => intro.remove(), 520);
  }
  setTimeout(hideIntro, INTRO_DURATION);
  intro && intro.addEventListener('click', hideIntro, { once: true });

  // ---------- Typed headline ----------
  function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
  async function runTyped(el, words){
    let idx = 0;
    while(true){
      const word = words[idx % words.length];
      el.textContent = '';
      for(let i=0;i<word.length;i++){
        el.textContent += word[i];
        await wait(TYPING_SPEED);
      }
      await wait(TYPING_PAUSE);
      for(let i=word.length;i>0;i--){
        el.textContent = el.textContent.slice(0, -1);
        await wait(TYPING_SPEED / 2);
      }
      idx++;
    }
  }
  if (typedEl) runTyped(typedEl, TYPED_WORDS);

  // ---------- Modal open/close ----------
  function openModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    const first = modal.querySelector('input, textarea, select, button');
    if(first) first.focus();
  }
  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  [ctaContact, quickContact].forEach(el => { if(el) el.addEventListener('click', openModal); });

  modal && modal.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModal));
  modal && modal.addEventListener('click', (e) => { if (e.target === modal.querySelector('.modal__backdrop')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

  // ---------- WhatsApp direct (nav button) ----------
  if (waDirect) {
    waDirect.addEventListener('click', (e) => {
      e.preventDefault();
      // mensaje rápido de saludo
      const text = encodeURIComponent('Hola, te contacto desde sysaccessvip. Quisiera solicitar información sobre un proyecto.');
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  // ---------- quickContact button (abre chat con mensaje mínimo) ----------
  if (quickContact) {
    quickContact.addEventListener('click', () => {
      const text = encodeURIComponent('Hola, quiero solicitar una cotización. ¿Podemos conversar?');
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  // ---------- Form submit -> WhatsApp ----------
  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // recolección datos
      const data = new FormData(contactForm);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const service = data.get('service') || '';
      const message = data.get('message') || '';

      // Construye el mensaje que verás en WhatsApp
      const lines = [
        `*Nuevo mensaje desde sysaccessvip*`,
        `*Nombre:* ${name}`,
        `*Email:* ${email}`,
        `*Servicio:* ${service}`,
        `*Mensaje:* ${message}`
      ];
      const text = encodeURIComponent(lines.join('\n'));

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

      // Abrir en nueva pestaña (WhatsApp Web / App)
      window.open(url, '_blank', 'noopener');

      // feedback al usuario (toast) y cerrar modal
      showToast('Abriendo WhatsApp... comprueba tu aplicación o WhatsApp Web.', 'success');
      closeModal();
      contactForm.reset();
    });
  }

  // ---------- Toast ----------
  function showToast(message, type='info'){
    const t = document.createElement('div');
    t.className = `sys-toast sys-toast--${type}`;
    t.textContent = message;
    document.body.appendChild(t);
    requestAnimationFrame(()=> t.classList.add('sys-toast--visible'));
    setTimeout(()=> {
      t.classList.remove('sys-toast--visible');
      setTimeout(()=> t.remove(), 300);
    }, 3400);
  }

  // inyecta estilos de toast (por si falta)
  (function injectToastStyles(){
    if (document.getElementById('sys-toast-styles')) return;
    const css = `
      .sys-toast{position:fixed;right:20px;bottom:20px;padding:12px 16px;border-radius:10px;background:linear-gradient(90deg, rgba(4,20,30,0.9), rgba(2,10,18,0.9));color:#e6f9f7;box-shadow:0 10px 30px rgba(2,8,20,0.6);opacity:0;transform:translateY(8px);transition:all .28s ease;z-index:999}
      .sys-toast--visible{opacity:1;transform:translateY(0)}
      .sys-toast--success{background:linear-gradient(90deg,#0a3, #06a76d)}
      .sys-toast--error{background:linear-gradient(90deg,#ff5a5a, #ff9a9a)}
    `;
    const s = document.createElement('style');
    s.id = 'sys-toast-styles';
    s.textContent = css;
    document.head.appendChild(s);
  })();

})();
