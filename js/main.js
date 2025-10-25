// Main JS: search, navigation, theme toggle, analytics stub, and tools registry
(function(){
  const d = document;

  // Theme toggle
  const root = d.documentElement;
  const themeToggle = d.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'dark') root.classList.add('dark');
  if(themeToggle){
    themeToggle.textContent = root.classList.contains('dark') ? '☀️' : '🌙';
    themeToggle.addEventListener('click',()=>{
      root.classList.toggle('dark');
      const dark = root.classList.contains('dark');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      themeToggle.textContent = dark ? '☀️' : '🌙';
    });
  }

  // Tools Registry (Phase 1 implements first 5 fully)
  const TOOLS = [
    { id:'word-counter', name:'Word Counter', description:'Count words, characters, and paragraphs.', category:'text', href:'tools/word-counter' },
    { id:'password-generator', name:'Password Generator', description:'Create secure passwords with custom options.', category:'text', href:'tools/password-generator' },
    { id:'qr-generator', name:'QR Code Generator', description:'Generate a QR code from text or URL.', category:'image', href:'tools/qr-generator' },
    { id:'image-resizer', name:'Image Resizer', description:'Resize images client-side and download.', category:'image', href:'tools/image-resizer' },
    { id:'unit-converter', name:'Unit Converter', description:'Convert length, weight, and temperature.', category:'utility', href:'tools/unit-converter' },

    // Placeholders for upcoming tools (Phase 2)
    { id:'text-case-converter', name:'Text Case Converter', description:'UPPER, lower, Title, CamelCase.', category:'text', href:'tools/text-case-converter' },
    { id:'lorem-ipsum', name:'Lorem Ipsum Generator', description:'Generate placeholder text.', category:'text', href:'tools/lorem-ipsum' },
    { id:'text-diff', name:'Text Difference Checker', description:'Compare two texts to see differences.', category:'text', href:'tools/text-diff' },
    { id:'url-shortener', name:'URL Shortener (Simulated)', description:'Simulate URL shortening.', category:'text', href:'tools/url-shortener' },
    { id:'md-to-html', name:'Markdown to HTML', description:'Convert Markdown to HTML.', category:'text', href:'tools/markdown-to-html' },

    { id:'color-picker', name:'Color Picker', description:'Pick colors in HEX, RGB, HSL.', category:'image', href:'tools/color-picker' },
    { id:'img-to-base64', name:'Image to Base64', description:'Convert images to Base64.', category:'image', href:'tools/image-to-base64' },
    { id:'favicon-generator', name:'Favicon Generator', description:'Create favicons from images.', category:'image', href:'tools/favicon-generator' },

    { id:'json-formatter', name:'JSON Formatter', description:'Format and validate JSON.', category:'developer', href:'tools/json-formatter' },
    { id:'html-encoder', name:'HTML Encoder/Decoder', description:'Encode/Decode HTML entities.', category:'developer', href:'tools/html-encoder' },
    { id:'css-minifier', name:'CSS Minifier', description:'Minify CSS code.', category:'developer', href:'tools/css-minifier' },
    { id:'js-minifier', name:'JavaScript Minifier', description:'Minify JS code.', category:'developer', href:'tools/js-minifier' },
    { id:'cps-tool', name:'Clicks Per Second (CPS)', description:'Test your clicking speed across durations.', category:'developer', href:'tools/cps-tool' },
    { id:'hash-generator', name:'Hash Generator', description:'MD5, SHA1, SHA256 (client-side).', category:'developer', href:'tools/hash-generator' },
    { id:'base64-tool', name:'Base64 Encoder/Decoder', description:'Encode/Decode Base64.', category:'developer', href:'tools/base64-tool' },

    // SEO category
    { id:'seo-meta-tool', name:'SEO Meta Tool', description:'Generate and preview SEO meta tags.', category:'seo', href:'tools/seo-meta-tool' },
    { id:'keyword-research', name:'Keyword Research (Country-wise)', description:'Explore keyword ideas by country.', category:'seo', href:'tools/keyword-research' },
    { id:'backlink-checker', name:'Backlink Checker', description:'Check backlinks for a domain (placeholder).', category:'seo', href:'tools/backlink-checker' },
    { id:'serp-preview', name:'SERP Preview', description:'Preview how your page may appear in search results.', category:'seo', href:'tools/serp-preview' },
    { id:'sitemap-generator', name:'Sitemap Generator', description:'Generate an XML sitemap from URLs.', category:'seo', href:'tools/sitemap-generator' },
    { id:'robots-tester', name:'Robots.txt Generator & Tester', description:'Create and test robots.txt rules.', category:'seo', href:'tools/robots-tester' },

    { id:'percentage-calculator', name:'Percentage Calculator', description:'Compute percentages easily.', category:'utility', href:'tools/percentage-calculator' },
    { id:'age-calculator', name:'Age Calculator', description:'Calculate age from birthdate.', category:'utility', href:'tools/age-calculator' },
    { id:'random-number', name:'Random Number Generator', description:'Generate random numbers.', category:'utility', href:'tools/random-number' },
    { id:'timer-stopwatch', name:'Timer/Stopwatch', description:'Online timer and stopwatch.', category:'utility', href:'tools/timer-stopwatch' },
    { id:'invoice-generator', name:'Invoice Generator', description:'Create simple invoices.', category:'utility', href:'tools/invoice-generator' }
  ];

  // Render tools into category grids
  function renderTools(filter=""){
    const grids = {
      text: d.getElementById('grid-text'),
      image: d.getElementById('grid-image'),
      developer: d.getElementById('grid-developer'),
      utility: d.getElementById('grid-utility'),
      seo: d.getElementById('grid-seo')
    };
    Object.values(grids).forEach(g=>{ if(g) g.innerHTML=''; });
    const q = filter.trim().toLowerCase();
    TOOLS.filter(t=>!q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).forEach(tool=>{
      const card = d.createElement('article');
      card.className = 'tool-card';
      card.innerHTML = `
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <div class="actions">
          <a class="btn-primary" href="${tool.href}" aria-label="Open ${tool.name}">Open</a>
        </div>
      `;
      const grid = grids[tool.category];
      if(grid) grid.appendChild(card);
    });
  }

  // Search
  function searchTools(){
    const input = d.getElementById('searchInput');
    renderTools(input ? input.value : '');
  }
  window.searchTools = searchTools;
  const searchBtn = d.getElementById('searchBtn');
  if(searchBtn){
    searchBtn.addEventListener('click', searchTools);
  }
  const searchInput = d.getElementById('searchInput');
  if(searchInput){
    searchInput.addEventListener('input', (e)=> renderTools(e.target.value));
  }

  // Smooth scroll for nav anchors
  d.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if(id.length > 1){
        e.preventDefault();
        d.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null, '', id);
      }
    });
  });

  // Highlight current page in master navigation
  (function highlightMasterNav(){
    try{
      const links = d.querySelectorAll('.master-nav-inner a[href]');
      if(!links.length) return;

      // Normalize current path for matching (handles '/', '/index', and file-based paths)
      const loc = location;
      let path = loc.pathname || '/';
      // When opened from file://, pathname may include full filename without leading '/'
      if(!path.startsWith('/')) path = '/' + path;
      const fileName = path.split('/').filter(Boolean).pop() || '';
      const isHome = (path === '/' || fileName === '' || fileName.toLowerCase() === 'index');
      const candidates = new Set([path]);
      if(fileName) {
        candidates.add('/' + fileName);
        candidates.add(fileName);
      }
      // Only consider '/' as a candidate when actually on the home page
      if(isHome) {
        candidates.add('/');
        candidates.add('/index');
        candidates.add('index');
      }

      links.forEach(a=>{
        const href = a.getAttribute('href') || '';
        // Consider absolute path, relative file name, and root
        const abs = href.startsWith('/') ? href : ('/' + href);
        const rel = href.replace(/^\//,'');
        if(candidates.has(abs) || candidates.has('/' + rel) || candidates.has(rel)){
          a.classList.add('active');
          a.setAttribute('aria-current','page');
        }
      });
    }catch(e){ /* noop */ }
  })();

  function setupMobileNav(){
    try{
      const navbar = d.querySelector('.navbar');
      if(!navbar) return;
      const menu = navbar.querySelector('.nav-menu');
      if(!menu) return;
      if(navbar.querySelector('.nav-toggle')) return;
      const btn = d.createElement('button');
      btn.className = 'nav-toggle';
      btn.setAttribute('aria-label','Toggle navigation');
      btn.setAttribute('aria-expanded','false');
      const id = 'primary-menu';
      menu.id = menu.id || id;
      btn.setAttribute('aria-controls', menu.id);
      ['bar','bar','bar'].forEach(()=>{ const s=d.createElement('span'); s.className='bar'; btn.appendChild(s); });
      navbar.insertBefore(btn, menu);
      const closeAll = ()=>{ menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); };
      btn.addEventListener('click', ()=>{
        const open = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      menu.addEventListener('click', (e)=>{
        const a = e.target.closest('a[href]');
        if(a) closeAll();
      });
      d.addEventListener('click', (e)=>{
        if(!menu.classList.contains('open')) return;
        if(e.target === btn || btn.contains(e.target)) return;
        if(e.target === menu || menu.contains(e.target)) return;
        closeAll();
      });
      d.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape') closeAll();
      });
      const mql = window.matchMedia('(min-width: 769px)');
      mql.addEventListener('change', (ev)=>{ if(ev.matches) closeAll(); });
    }catch(e){}
  }

  // Simple analytics stub: count clicks on tool cards (localStorage)
  d.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href]');
    if(!a) return;
    const href = a.getAttribute('href');
    if(href && href.startsWith('tools/')){
      const key = `analytics:${href}`;
      const n = parseInt(localStorage.getItem(key)||'0',10) + 1;
      localStorage.setItem(key, String(n));
    }
  });

  // Initial render
  renderTools('');
  setupMobileNav();
  // Email helper used by header topbar
  window.openEmail = function(to, subject){
    try{
      const s = subject ? encodeURIComponent(subject) : '';
      const href = `mailto:${to}${s?`?subject=${s}`:''}`;
      location.href = href;
    }catch(e){ /* noop */ }
  };
  // Service worker registration (only on http/https)
  try{
    if('serviceWorker' in navigator && location.protocol.startsWith('http')){
      navigator.serviceWorker.register('/sw.js');
    }
  }catch(e){ /* noop */ }
})();