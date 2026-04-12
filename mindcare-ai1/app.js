let currentPage = 'dashboard'

function navigateTo(pageId) {
  if (pageId === currentPage) return
  currentPage = pageId

  // Update desktop nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId)
  })

  // Update mobile nav
  document.querySelectorAll('.mob-nav-btn').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId)
  })

  // Hide all pages
  document.querySelectorAll('.page').forEach(el => {
    el.classList.remove('active')
    el.style.animation = ''
  })

  // Show & render target page
  const page = document.getElementById(`page-${pageId}`)
  if (page) {
    page.classList.add('active')
    // Re-trigger animation
    void page.offsetWidth
    page.style.animation = 'pageIn .35s cubic-bezier(.22,1,.36,1) both'
  }

  // Render page content
  const renderers = {
    dashboard: renderDashboard,
    checkin:   renderCheckin,
    history:   renderHistory,
    progress:  renderProgress,
    resources: renderResources,
  }
  renderers[pageId]?.()
}

// ─── BUILD SIDEBAR ────────────────────────────────────────────────────────────

function buildSidebar() {
  const sections = [
    { key: 'main',    label: 'Main'    },
    { key: 'health',  label: 'Health'  },
    { key: 'support', label: 'Support' },
  ]
  const sidebar = document.getElementById('sidebar-nav')
  if (!sidebar) return

  sections.forEach(sec => {
    const items = NAV_ITEMS.filter(n => n.section === sec.key)
    if (!items.length) return

    const label = document.createElement('div')
    label.className = 'nav-section-label'
    label.textContent = sec.label
    sidebar.appendChild(label)

    items.forEach(item => {
      const el = document.createElement('div')
      el.className = 'nav-item' + (item.id === currentPage ? ' active' : '')
      el.dataset.page = item.id
      el.innerHTML = `<span class="icon">${item.icon}</span> ${item.label}`
      el.addEventListener('click', () => navigateTo(item.id))
      sidebar.appendChild(el)
    })
  })
}

// ─── BUILD MOBILE NAV ─────────────────────────────────────────────────────────

function buildMobileNav() {
  const nav = document.getElementById('mobile-nav-items')
  if (!nav) return
  const mobileItems = NAV_ITEMS.slice(0, 5)
  nav.innerHTML = mobileItems.map(item => `
    <button class="mob-nav-btn ${item.id === currentPage ? 'active' : ''}" data-page="${item.id}" onclick="navigateTo('${item.id}')">
      <span class="mob-nav-icon">${item.icon}</span>
      <span class="mob-nav-label">${item.label}</span>
    </button>`).join('')
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar()
  buildMobileNav()
  navigateTo('dashboard')
})
