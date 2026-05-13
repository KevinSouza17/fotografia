// ── LOGIN ──
function doLogin() {
  const val = document.getElementById('loginInput').value;
  if (val === '1234') {
    const lp = document.getElementById('loginPage');
    lp.classList.add('hiding');
    setTimeout(() => { lp.style.display = 'none'; document.getElementById('siteWrapper').style.display = 'block'; initSite(); }, 600);
  } else {
    const err = document.getElementById('loginErr');
    err.style.display = 'block';
    document.getElementById('loginInput').style.borderBottomColor = '#f87171';
    setTimeout(() => { err.style.display = 'none'; document.getElementById('loginInput').style.borderBottomColor = 'var(--gold)'; }, 2500);
  }
}
document.getElementById('loginInput').addEventListener('keypress', e => { if(e.key==='Enter') doLogin(); });

// ── PAGE NAVIGATION ──
let currentPage = 'hero';
const pageIds = ['hero','sobre','portfolio','pacotes','agendar','depoimentos','galeria'];
const pagesWithFooter = ['sobre','portfolio','pacotes','depoimentos'];

function goTo(page) {
  if (page === currentPage) { window.scrollTo({top:0,behavior:'smooth'}); return; }
  document.getElementById('page'+cap(currentPage)).classList.remove('active');
  document.getElementById('page'+cap(page)).classList.add('active');
  currentPage = page;
  window.scrollTo({top:0});
  updateNav(page);
  // Show/hide shared footer & social strip
  const needsFooter = pagesWithFooter.includes(page);
  document.getElementById('sharedSocialStrip').style.display = needsFooter ? 'block' : 'none';
  // Scroll nav update
  const nav = document.getElementById('navbar');
  if (page === 'hero') {
    nav.classList.remove('scrolled');
  } else {
    nav.classList.add('scrolled');
  }
}

function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

function updateNav(page) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const map = {sobre:'nl-sobre',portfolio:'nl-portfolio',pacotes:'nl-pacotes',depoimentos:'nl-depoimentos',galeria:'nl-galeria'};
  if (map[page]) document.getElementById(map[page]).classList.add('active');
}

// ── INIT ──
function initSite() {
  initCalendar();
  // Hero nav transparent
  const nav = document.getElementById('navbar');
  nav.classList.remove('scrolled');
  window.addEventListener('scroll', () => {
    if (currentPage === 'hero') {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }
  });
}

// ── PORTFOLIO FILTER ──
function filterPort(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.port-item').forEach(item => {
    item.style.display = (cat==='todos' || item.dataset.cat===cat) ? '' : 'none';
  });
}

// ── MODAL ──
function openModal(el) {
  const img = el.tagName==='IMG' ? el : el.querySelector('img');
  if (!img) return;
  const src = img.src.replace(/w=\d+/, 'w=1400');
  document.getElementById('modalImg').src = src;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// ── SHARE ──
const shareUrls = {
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
  whatsapp: 'https://api.whatsapp.com/send?text=',
  twitter: 'https://twitter.com/intent/tweet?text='
};
const shareTexts = {
  instagram: 'Veja as fotos do Rafael Lima Fotografia! @rafaellimafoto',
  facebook: 'Fotos incríveis do Rafael Lima Fotografia!',
  whatsapp: 'Que fotos lindas do Rafael Lima Fotografia! 📸 rafaellimafoto.com.br',
  twitter: 'Fotos incríveis do @rafaellimafoto! 📸 #RafaelLimaFotografia'
};

function sharePhoto(net, el, fromModal) {
  const text = encodeURIComponent(shareTexts[net] || 'Rafael Lima Fotografia');
  let url;
  if (net === 'instagram') {
    showToast('📸 Abra o Instagram e use a foto da sua galeria privada para compartilhar!');
    return;
  } else if (net === 'whatsapp') {
    url = `https://api.whatsapp.com/send?text=${text}`;
  } else if (net === 'facebook') {
    url = `https://www.facebook.com/sharer/sharer.php?u=https://rafaellimafoto.com.br&quote=${text}`;
  } else if (net === 'twitter') {
    url = `https://twitter.com/intent/tweet?text=${text}`;
  }
  if (url) window.open(url, '_blank', 'width=600,height=500');
}

function shareGallery(net) {
  sharePhoto(net, null, false);
}

function openSocial(net) {
  const urls = {
    instagram: 'https://www.instagram.com/rafaellimafoto',
    facebook: 'https://www.facebook.com',
    whatsapp: 'https://api.whatsapp.com/send?phone=5511999990000&text=Olá Rafael! Vi seu site e gostaria de saber mais sobre seus serviços.'
  };
  if(urls[net]) window.open(urls[net],'_blank');
}

// ── CALENDAR ──
let calYear, calMonth_n, selectedDate = null, selectedTime = null;

function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth_n = now.getMonth();
  renderCal();
}

function renderCal() {
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  document.getElementById('calMonth').textContent = `${months[calMonth_n]} ${calYear}`;
  const grid = document.getElementById('calGrid');
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  let html = days.map(d=>`<div class="cal-day-name">${d}</div>`).join('');
  const first = new Date(calYear, calMonth_n, 1).getDay();
  const total = new Date(calYear, calMonth_n+1, 0).getDate();
  const today = new Date();
  for(let i=0;i<first;i++) html += `<div class="cal-day empty"></div>`;
  for(let d=1;d<=total;d++){
    const dt = new Date(calYear,calMonth_n,d);
    const isPast = dt < new Date(today.getFullYear(),today.getMonth(),today.getDate());
    const isSel = selectedDate && selectedDate.getDate()===d && selectedDate.getMonth()===calMonth_n && selectedDate.getFullYear()===calYear;
    const isToday = dt.toDateString()===today.toDateString();
    const cls = isPast?'cal-day unavailable':(isSel?'cal-day selected':(isToday?'cal-day today':'cal-day'));
    html += `<div class="${cls}" ${!isPast?`onclick="selectDate(${d})"`:''}>${d}</div>`;
  }
  grid.innerHTML = html;
  updateSinal();
}

function selectDate(d) {
  selectedDate = new Date(calYear, calMonth_n, d);
  renderCal();
}

function changeMonth(dir) {
  calMonth_n += dir;
  if(calMonth_n>11){calMonth_n=0;calYear++;}
  if(calMonth_n<0){calMonth_n=11;calYear--;}
  renderCal();
}

function selectSlot(el) {
  if(el.classList.contains('taken')) return;
  document.querySelectorAll('.tslot').forEach(t=>t.classList.remove('selected'));
  el.classList.add('selected');
  selectedTime = el.textContent;
}

// ── TABS ──
function switchTab(tab, btn) {
  document.querySelectorAll('.btab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.booking-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+tab).classList.add('active');
}

// ── PAYMENT ──
function selectPay(btn, type) {
  document.querySelectorAll('.pm-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.card-fields').forEach(f=>f.classList.remove('show'));
  document.getElementById('pay-'+type).classList.add('show');
}

function updateSinal() {
  const prices = {'Essencial (R$1.800)':1800,'Premium (R$4.500)':4500,'Luxo (R$8.000)':8000};
  const sel = document.getElementById('f-pacote');
  if(!sel) return;
  const val = prices[sel.value];
  if(val){
    const sin = Math.round(val*.3);
    document.getElementById('sinVal').textContent = `R$${sin.toLocaleString('pt-BR')}`;
    document.getElementById('restVal').textContent = `R$${(val-sin).toLocaleString('pt-BR')}`;
  } else {
    document.getElementById('sinVal').textContent = '—';
    document.getElementById('restVal').textContent = '—';
  }
}

document.addEventListener('change', e => { if(e.target.id==='f-pacote') updateSinal(); });

function formatCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
}

// ── FINALIZAR AGENDAMENTO ──
function finalizarAgendamento() {
  const nome = document.getElementById('f-nome')?.value.trim();
  const email = document.getElementById('f-email')?.value.trim();
  if(!nome || !email) { showToast('⚠ Preencha nome e e-mail na aba "Seus Dados"'); return; }
  document.getElementById('formArea').style.display = 'none';
  document.getElementById('successMsg').style.display = 'block';
}

// ── GO TO AGENDAR WITH PACKAGE ──
function goToAgendar(pacote) {
  goTo('agendar');
  setTimeout(() => {
    const sel = document.getElementById('f-pacote');
    if(sel) { sel.value = pacote; updateSinal(); }
    switchTab('calendario', document.querySelectorAll('.btab')[0]);
  }, 100);
}

// ── GALERIA ──
function acessarGal() {
  const pass = document.getElementById('galPass').value;
  const err = document.getElementById('galErr');
  if(pass==='1234' || pass==='demo' || pass==='rafael') {
    document.getElementById('galGrid').classList.add('visible');
    document.getElementById('galShareRow').style.display = 'flex';
    document.getElementById('galDownload').style.display = 'flex';
    err.style.display = 'none';
  } else {
    err.style.display = 'block';
    document.getElementById('galGrid').classList.remove('visible');
    document.getElementById('galShareRow').style.display = 'none';
    document.getElementById('galDownload').style.display = 'none';
  }
}

// ── DEPOIMENTOS: RATING & STORY ──
let currentRating = 5;
function setRating(n) {
  currentRating = n;
  document.querySelectorAll('.rating-star').forEach((s,i) => {
    s.classList.toggle('active', i < n);
  });
}

function publicarHistoria() {
  const nome = document.getElementById('st-nome')?.value.trim();
  const tipo = document.getElementById('st-tipo')?.value;
  const texto = document.getElementById('st-texto')?.value.trim();
  if(!nome || !texto) { showToast('⚠ Preencha seu nome e sua história'); return; }

  // Add new card to grid
  const stars = '★'.repeat(currentRating) + '☆'.repeat(5-currentRating);
  const card = document.createElement('div');
  card.className = 'dep-card';
  card.style.animation = 'fadeUp .5s ease';
  card.innerHTML = `
    <span class="dep-quote">"</span>
    <div class="dep-stars">${stars}</div>
    <p class="dep-text">${texto}</p>
    <div class="dep-author">
      <div class="dep-avatar" style="background:var(--sand);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--accent);">${nome.charAt(0)}</div>
      <div><div class="dep-name">${nome}</div><div class="dep-event">${tipo || 'Cliente'} — ${new Date().toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</div></div>
    </div>`;
  document.getElementById('depGrid').appendChild(card);

  document.getElementById('storyForm').style.display = 'none';
  document.getElementById('storyPublished').style.display = 'block';
  showToast('✨ Sua história foi publicada!');
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.style.opacity = '0', 3000);
}

// ── NAV SCROLLED ON OTHER PAGES ──
window.addEventListener('load', () => {
  const nav = document.getElementById('navbar');
  document.querySelectorAll('.page:not(#pageHero)').forEach(pg => {
    pg.addEventListener('scroll', () => nav.classList.add('scrolled'));
  });
});