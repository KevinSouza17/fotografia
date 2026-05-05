  // Navbar scroll
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 80) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  // Portfolio filter
  function filterPortfolio(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.portfolio-item').forEach(item => {
      if (cat === 'todos' || item.dataset.cat === cat) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Modal
  function openModal(el) {
    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (!img) return;
    document.getElementById('modalImg').src = img.src.replace('w=400', 'w=1200').replace('w=600', 'w=1200').replace('w=700', 'w=1200').replace('w=900', 'w=1200');
    document.getElementById('modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('modal').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Form submit
  function enviarForm() {
    const nome = document.getElementById('f-nome').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const tipo = document.getElementById('f-tipo').value;

    if (!nome || !email || !tipo) {
      alert('Por favor, preencha pelo menos nome, e-mail e tipo de serviço.');
      return;
    }

    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
  }

  // Galeria protegida
  function acessarGaleria() {
    const senha = document.getElementById('galeriaPass').value;
    const errorEl = document.getElementById('galeriaError');
    const gridEl = document.getElementById('galeriaGrid');

    if (senha === '1234' || senha === 'rafael2024' || senha === 'demo') {
      gridEl.classList.add('visible');
      errorEl.style.display = 'none';
    } else {
      errorEl.style.display = 'block';
      gridEl.classList.remove('visible');
    }
  }

  document.getElementById('galeriaPass').addEventListener('keypress', e => {
    if (e.key === 'Enter') acessarGaleria();
  });