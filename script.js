const PHONE_INTL = '967777066424';

const header = document.getElementById('header');
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const form = document.getElementById('requestForm');
const formNote = document.getElementById('formNote');
const yearEl = document.getElementById('year');

if (yearEl) yearEl.textContent = new Date().getFullYear();

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const closeNav = () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'فتح القائمة');
};

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
});

nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) closeNav();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];

if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => spy.observe(section));
}

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    const select = document.getElementById('service');
    if (select) select.value = link.dataset.service;
  });
});

const setNote = (text, isError = false) => {
  formNote.textContent = text;
  formNote.classList.toggle('error', isError);
};

const markInvalid = (field) => {
  field.classList.add('invalid');
  field.addEventListener('input', () => field.classList.remove('invalid'), { once: true });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.elements.name;
  const phone = form.elements.phone;
  const service = form.elements.service;
  const priority = form.elements.priority;
  const message = form.elements.message;

  let valid = true;
  if (name.value.trim().length < 2) { markInvalid(name); valid = false; }
  if (phone.value.replace(/\D/g, '').length < 7) { markInvalid(phone); valid = false; }
  if (!service.value) { markInvalid(service); valid = false; }
  if (message.value.trim().length < 5) { markInvalid(message); valid = false; }

  if (!valid) {
    setNote('يرجى تعبئة الحقول المطلوبة بشكل صحيح.', true);
    return;
  }

  const text = [
    'طلب جديد — يوسف الهدار (brxvih)',
    `الاسم: ${name.value.trim()}`,
    `الهاتف: ${phone.value.trim()}`,
    `الخدمة: ${service.value}`,
    `الأولوية: ${priority.value}`,
    `التفاصيل: ${message.value.trim()}`
  ].join('\n');

  const url = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(text)}`;
  setNote('تم تجهيز طلبك، جارٍ فتح واتساب…');
  window.open(url, '_blank', 'noopener');
  form.reset();
  setTimeout(() => setNote(''), 6000);
});
