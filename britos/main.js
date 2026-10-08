(() => {
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => [...el.querySelectorAll(s)]
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  // 1. abertura: o G da marca é desenhado em um traço e depois preenchido
  const gPath = $('.g-draw path')
  if (gPath) gPath.style.setProperty('--len', Math.ceil(gPath.getTotalLength()))
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('loaded')))

  // 2. topo fica sólido ao rolar; botão do WhatsApp aparece depois do início
  const top = $('.top'), wa = $('.wa-float')
  const onScroll = () => {
    const y = scrollY
    top.classList.toggle('solid', y > 40)
    wa.classList.toggle('show', y > innerHeight * 0.6)
    // linha do "Como trabalho" acompanha a rolagem
    const steps = $('.steps')
    if (steps) {
      const r = steps.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3)))
      steps.style.setProperty('--p', reduce ? 1 : p.toFixed(3))
    }
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll()

  // 3. menu do celular
  const menuBtn = $('.menu-btn'), menu = $('#menu-movel')
  menuBtn.addEventListener('click', () => {
    const open = menu.hidden
    menu.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.textContent = open ? 'Fechar' : 'Menu'
  })
  $$('a', menu).forEach((a) => a.addEventListener('click', () => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menu' }))

  // 4. link ativo na navegação
  const links = $$('.nav a')
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id))
  }), { rootMargin: '-45% 0px -50% 0px' })
  $$('main section[id]').forEach((s) => spy.observe(s))

  // 5. fotos se revelam uma vez ao entrar na tela
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    $$('.about-photo img, .service img, .quote-band img').forEach((img) => { img.classList.add('reveal'); io.observe(img) })
  }

  // 6. filtro dos projetos
  const items = $$('.gallery li')
  $$('.filters button').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.f
    $$('.filters button').forEach((x) => x.setAttribute('aria-selected', String(x === b)))
    items.forEach((li) => li.classList.add('out'))
    setTimeout(() => {
      items.forEach((li) => li.classList.toggle('hide', f !== 'todos' && li.dataset.cat !== f))
      requestAnimationFrame(() => items.forEach((li) => li.classList.remove('out')))
    }, reduce ? 0 : 260)
  }))

  // 7. ampliar foto
  const lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('figcaption', lb)
  let cur = 0, lastFocus = null
  const visible = () => items.filter((li) => !li.classList.contains('hide'))
  const show = (i) => {
    const list = visible(); cur = (i + list.length) % list.length
    const img = $('img', list[cur])
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt; lbCap.textContent = $('.cap', list[cur])?.firstChild?.textContent || ''
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = ''
  }
  const open = (li) => { lastFocus = document.activeElement; show(visible().indexOf(li)); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus() }
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; lastFocus?.focus() }
  items.forEach((li) => $('button', li).addEventListener('click', () => open(li)))
  $('.lb-close', lb).addEventListener('click', close)
  $('.lb-prev', lb).addEventListener('click', () => show(cur - 1))
  $('.lb-next', lb).addEventListener('click', () => show(cur + 1))
  lb.addEventListener('click', (e) => { if (e.target === lb) close() })
  addEventListener('keydown', (e) => {
    if (lb.hidden) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowRight') show(cur + 1)
    if (e.key === 'ArrowLeft') show(cur - 1)
  })
  let sx = 0
  lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX }, { passive: true })
  lb.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)) })

  const ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear()
})()
// mostra cada foto assim que termina de carregar
document.querySelectorAll('img.ux').forEach((img) => {
  const done = () => img.classList.add('ok')
  if (img.complete && img.naturalWidth) done(); else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }) }
})
