// Tools functions and utilities
(function(){
  const d = document;

  // Clipboard helper
  function copyText(el){
    const value = typeof el === 'string' ? el : (el?.value || el?.textContent || '');
    if(!value) return false;
    navigator.clipboard?.writeText(value);
    return true;
  }
  window.copyText = copyText;

  // Word Counter
  function analyzeTextStats(text){
    const characters = text.length;
    const words = (text.trim().match(/\b\w+\b/g) || []).length;
    const paragraphs = (text.split(/\n{2,}/).filter(Boolean)).length || (text.trim()?1:0);
    const lines = text.split(/\n/).length;
    return {characters, words, paragraphs, lines};
  }
  window.analyzeTextStats = analyzeTextStats;

  // Password Generator
  function generatePassword(opts){
    const length = Math.max(4, Math.min(128, opts.length||12));
    const pools = [];
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>/?';
    if(opts.lower) pools.push(lowers);
    if(opts.upper) pools.push(uppers);
    if(opts.number) pools.push(digits);
    if(opts.symbol) pools.push(symbols);
    if(pools.length===0) pools.push(lowers);
    let pwd = '';
    // ensure at least one from each selected pool
    pools.forEach(pool => { pwd += pool[Math.floor(Math.random()*pool.length)]; });
    while(pwd.length < length){
      const pool = pools[Math.floor(Math.random()*pools.length)];
      pwd += pool[Math.floor(Math.random()*pool.length)];
    }
    // shuffle
    pwd = pwd.split('').sort(()=>Math.random()-0.5).join('');
    return pwd.slice(0,length);
  }
  window.generatePassword = generatePassword;

  // QR Code Generator (requires qrcode.min.js on page)
  function makeQRCode(el, text){
    if(!window.QRCode) return;
    el.innerHTML = '';
    new QRCode(el, {
      text: text || '',
      width: 220,
      height: 220,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
  window.makeQRCode = makeQRCode;

  // Image Resizer
  async function resizeImage(file, maxW, maxH, mime){
    const img = new Image();
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(maxW/bitmap.width, maxH/bitmap.height, 1);
    const w = Math.round(bitmap.width * ratio);
    const h = Math.round(bitmap.height * ratio);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise(res=> canvas.toBlob(res, mime||file.type||'image/png', 0.92));
    return {blob, width:w, height:h, canvas};
  }
  window.resizeImage = resizeImage;

  // Unit Converter
  const LENGTH_FACTORS = { // to meters
    m:1, km:1000, cm:0.01, mm:0.001, mi:1609.344, yd:0.9144, ft:0.3048, in:0.0254
  };
  const WEIGHT_FACTORS = { // to kilograms
    kg:1, g:0.001, lb:0.45359237, oz:0.028349523125
  };
  function convertLength(value, from, to){
    const meters = value * (LENGTH_FACTORS[from]||1);
    return meters / (LENGTH_FACTORS[to]||1);
  }
  function convertWeight(value, from, to){
    const kg = value * (WEIGHT_FACTORS[from]||1);
    return kg / (WEIGHT_FACTORS[to]||1);
  }
  function convertTemperature(value, from, to){
    let c;
    if(from==='C') c=value; else if(from==='F') c=(value-32)*5/9; else if(from==='K') c=value-273.15; else c=value;
    if(to==='C') return c; if(to==='F') return (c*9/5)+32; if(to==='K') return c+273.15; return c;
  }
  window.convertLength = convertLength;
  window.convertWeight = convertWeight;
  window.convertTemperature = convertTemperature;

  // Text Case Converter utilities
  function toTitleCase(str){
    return str.toLowerCase().replace(/\b([a-z])([a-z]*)/g, (_,a,b)=> a.toUpperCase()+b);
  }
  function toCamelCase(str){
    const words = str.replace(/[_-]/g,' ').split(/\s+/).filter(Boolean);
    if(words.length===0) return '';
    return words[0].toLowerCase() + words.slice(1).map(w=> w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join('');
  }
  function toSnakeCase(str){
    return str.replace(/([a-z])([A-Z])/g,'$1_$2').replace(/\s+|-/g,'_').toLowerCase();
  }
  function toKebabCase(str){
    return str.replace(/([a-z])([A-Z])/g,'$1-$2').replace(/\s+|_/g,'-').toLowerCase();
  }
  function toSentenceCase(str){
    const s = str.toLowerCase();
    return s.replace(/(^|[.!?]\s+)([a-z])/g, (m,prefix,chr)=> prefix + chr.toUpperCase());
  }
  window.toTitleCase = toTitleCase;
  window.toCamelCase = toCamelCase;
  window.toSnakeCase = toSnakeCase;
  window.toKebabCase = toKebabCase;
  window.toSentenceCase = toSentenceCase;

  // Lorem Ipsum Generator
  function loremIpsum(paragraphs=2, sentencesPerParagraph=[3,6]){
    const WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','ut','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','ut','aliquip','ex','ea','commodo','consequat'];
    function sentence(){
      const len = 6 + Math.floor(Math.random()*8);
      const arr = Array.from({length:len},()=> WORDS[Math.floor(Math.random()*WORDS.length)]);
      let s = arr.join(' ');
      s = s.charAt(0).toUpperCase()+s.slice(1) + '.';
      return s;
    }
    function paragraph(){
      const min = sentencesPerParagraph[0], max = sentencesPerParagraph[1];
      const n = Math.max(1, min + Math.floor(Math.random()*(Math.max(max,min)-min+1)));
      return Array.from({length:n}, sentence).join(' ');
    }
    return Array.from({length:Math.max(1, paragraphs)}, paragraph).join('\n\n');
  }
  window.loremIpsum = loremIpsum;

  // JSON Formatter/Validator
  function jsonFormat(input){
    try{
      const obj = JSON.parse(input);
      return { ok:true, output: JSON.stringify(obj, null, 2) };
    }catch(err){
      return { ok:false, error: String(err) };
    }
  }
  window.jsonFormat = jsonFormat;

  // Base64 with UTF-8 safety
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  function base64Encode(str){
    const bytes = encoder.encode(str);
    let binary = '';
    bytes.forEach(b=> binary += String.fromCharCode(b));
    return btoa(binary);
  }
  function base64Decode(b64){
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i);
    return decoder.decode(bytes);
  }
  window.base64Encode = base64Encode;
  window.base64Decode = base64Decode;

  // Percentage Calculator helpers
  function percentOf(part, whole){ return (whole===0)? NaN : (part/whole)*100; }
  function whatIsXPercentOfY(x, y){ return (x/100)*y; }
  function percentChange(oldVal, newVal){ return (oldVal===0)? NaN : ((newVal-oldVal)/oldVal)*100; }
  window.percentOf = percentOf;
  window.whatIsXPercentOfY = whatIsXPercentOfY;
  window.percentChange = percentChange;

  // Age Calculator
  function calculateAge(isoDate){
    const dob = new Date(isoDate);
    if(isNaN(dob.getTime())) return null;
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    if(days < 0){
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    if(months < 0){ months += 12; years -= 1; }
    return {years, months, days};
  }
  window.calculateAge = calculateAge;

  // Color utilities
  function hexToRgb(hex){
    hex = hex.replace(/^#/, '');
    if(hex.length===3) hex = hex.split('').map(c=>c+c).join('');
    const num = parseInt(hex, 16);
    return {r:(num>>16)&255, g:(num>>8)&255, b:num&255};
  }
  function rgbToHex(r,g,b){
    return '#' + [r,g,b].map(v=>{
      const s = Math.max(0, Math.min(255, v|0)).toString(16).padStart(2,'0');
      return s;
    }).join('');
  }
  function rgbToHsl(r,g,b){
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    let h,s,l=(max+min)/2;
    if(max===min){ h=s=0; }
    else{
      const d = max-min;
      s = l>0.5 ? d/(2-max-min) : d/(max+min);
      switch(max){
        case r: h=(g-b)/d + (g<b?6:0); break;
        case g: h=(b-r)/d + 2; break;
        case b: h=(r-g)/d + 4; break;
      }
      h/=6;
    }
    return {h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100)};
  }
  function hslToRgb(h,s,l){
    h/=360; s/=100; l/=100;
    if(s===0){ const v=Math.round(l*255); return {r:v,g:v,b:v}; }
    const hue2rgb = (p,q,t)=>{ if(t<0) t+=1; if(t>1) t-=1; if(t<1/6) return p+(q-p)*6*t; if(t<1/2) return q; if(t<2/3) return p+(q-p)*(2/3 - t)*6; return p; };
    const q = l < 0.5 ? l*(1+s) : l + s - l*s;
    const p = 2*l - q;
    const r = Math.round(hue2rgb(p,q,h+1/3)*255);
    const g = Math.round(hue2rgb(p,q,h)*255);
    const b = Math.round(hue2rgb(p,q,h-1/3)*255);
    return {r,g,b};
  }
  window.hexToRgb = hexToRgb;
  window.rgbToHex = rgbToHex;
  window.rgbToHsl = rgbToHsl;
  window.hslToRgb = hslToRgb;

  // Simple Markdown to HTML (basic subset: headings, bold, italic, code, links, lists)
  function markdownToHtml(md){
    let html = md
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    html = html.replace(/^######\s+(.*)$/gm,'<h6>$1</h6>')
               .replace(/^#####\s+(.*)$/gm,'<h5>$1</h5>')
               .replace(/^####\s+(.*)$/gm,'<h4>$1</h4>')
               .replace(/^###\s+(.*)$/gm,'<h3>$1</h3>')
               .replace(/^##\s+(.*)$/gm,'<h2>$1</h2>')
               .replace(/^#\s+(.*)$/gm,'<h1>$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
               .replace(/\*(.+?)\*/g,'<em>$1</em>')
               .replace(/`([^`]+?)`/g,'<code>$1</code>')
               .replace(/\[(.+?)\]\((https?:[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1<\/a>');
    // Lists
    html = html.replace(/^(?:-\s+.*(?:\n|$))+?/gm, match=>{
      const items = match.trim().split(/\n/).map(l=> l.replace(/^-\s+/,''));
      return '<ul>' + items.map(i=>`<li>${i}</li>`).join('') + '</ul>';
    });
    // Paragraphs (simple)
    html = html.split(/\n{2,}/).map(block=> block.match(/^<h\d|^<ul|^<p|^<pre|^<code/) ? block : `<p>${block.replace(/\n/g,'<br>')}</p>`).join('\n');
    return html;
  }
  window.markdownToHtml = markdownToHtml;

  // Simple text diff (line-by-line)
  function diffLines(a,b){
    const al = a.split(/\r?\n/); const bl = b.split(/\r?\n/);
    const max = Math.max(al.length, bl.length);
    const diffs = [];
    for(let i=0;i<max;i++){
      const left = al[i]??''; const right = bl[i]??'';
      diffs.push({index:i+1, same:left===right, left, right});
    }
    return diffs;
  }
  window.diffLines = diffLines;

  // Random number helper
  function randomInt(min, max){ min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random()*(max-min+1))+min; }
  window.randomInt = randomInt;

  // Stopwatch/Timer helper
  function createStopwatch(){
    let start = 0, elapsed = 0, running = false, rafId = null, onTick = null;
    function tick(){ if(!running) return; const now = performance.now(); elapsed += (now - start); start = now; if(onTick) onTick(elapsed); rafId = requestAnimationFrame(tick); }
    return {
      start(cb){ if(running) return; onTick = cb || onTick; running = true; start = performance.now(); rafId = requestAnimationFrame(tick); },
      stop(){ if(!running) return; running = false; if(rafId) cancelAnimationFrame(rafId); rafId=null; },
      reset(){ elapsed = 0; },
      getElapsed(){ return elapsed; }
    };
  }
  window.createStopwatch = createStopwatch;

  // HTML Encoder/Decoder
  function htmlEncode(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function htmlDecode(str){
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }
  window.htmlEncode = htmlEncode; window.htmlDecode = htmlDecode;

  // CSS Minifier (very basic)
  function cssMinify(input){
    let s = input;
    s = s.replace(/\/\*[\s\S]*?\*\//g, ''); // remove comments
    s = s.replace(/\s+/g, ' '); // collapse whitespace
    s = s.replace(/\s*([{}:;,>])\s*/g, '$1'); // trim around symbols
    s = s.replace(/;}/g, '}');
    return s.trim();
  }
  window.cssMinify = cssMinify;

  // JS Minifier (very basic, non-AST; not safe for production)
  function jsMinify(input){
    let s = input;
    s = s.replace(/(^|\n)\s*\/\/.*(?=\n|$)/g, '$1'); // line comments
    s = s.replace(/\/\*[\s\S]*?\*\//g, ''); // block comments
    s = s.replace(/\s+/g, ' ');
    s = s.replace(/\s*([{}();,:+\-/*<>?=&|])\s*/g, '$1');
    return s.trim();
  }
  window.jsMinify = jsMinify;

  // Hashing utilities
  function toHex(buf){
    return Array.from(new Uint8Array(buf)).map(b=> b.toString(16).padStart(2,'0')).join('');
  }
  async function sha1(str){
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-1', data);
    return toHex(hash);
  }
  async function sha256(str){
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return toHex(hash);
  }
  // Lightweight MD5 implementation
  function md5(str){
    function cmn(q,a,b,x,s,t){a=(a+q+x+t)|0;return(((a<<s)|(a>>> (32-s)))+b)|0}
    function ff(a,b,c,d,x,s,t){return cmn((b&c)|((~b)&d),a,b,x,s,t)}
    function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&(~d)),a,b,x,s,t)}
    function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t)}
    function ii(a,b,c,d,x,s,t){return cmn(c^(b|(~d)),a,b,x,s,t)}
    function md51(s){
      const txt='';
      const n=s.length;
      const state=[1732584193,-271733879,-1732584194,271733878];
      let i;
      for(i=64;i<=n;i+=64){ md5blk(s.substring(i-64,i),state); }
      s=s.substring(i-64);
      const tail=Array(16).fill(0);
      for(i=0;i<s.length;i++) tail[i>>2]|=s.charCodeAt(i)<<((i%4)<<3);
      tail[i>>2]|=0x80<<((i%4)<<3);
      if(i>55){ md5cycle(state, tail); for(i=0;i<16;i++) tail[i]=0; }
      tail[14]=n*8; md5cycle(state, tail);
      return state;
    }
    function md5blk(s, state){
      const x = new Array(16);
      for(let i=0;i<16;i++){ x[i]= s.charCodeAt(i*4) + (s.charCodeAt(i*4+1)<<8) + (s.charCodeAt(i*4+2)<<16) + (s.charCodeAt(i*4+3)<<24); }
      md5cycle(state,x);
    }
    function md5cycle(x,k){
      let [a,b,c,d]=x;
      a=ff(a,b,c,d,k[0],7,-680876936);d=ff(d,a,b,c,k[1],12,-389564586);c=ff(c,d,a,b,k[2],17,606105819);b=ff(b,c,d,a,k[3],22,-1044525330);
      a=ff(a,b,c,d,k[4],7,-176418897);d=ff(d,a,b,c,k[5],12,1200080426);c=ff(c,d,a,b,k[6],17,-1473231341);b=ff(b,c,d,a,k[7],22,-45705983);
      a=ff(a,b,c,d,k[8],7,1770035416);d=ff(d,a,b,c,k[9],12,-1958414417);c=ff(c,d,a,b,k[10],17,-42063);b=ff(b,c,d,a,k[11],22,-1990404162);
      a=ff(a,b,c,d,k[12],7,1804603682);d=ff(d,a,b,c,k[13],12,-40341101);c=ff(c,d,a,b,k[14],17,-1502002290);b=ff(b,c,d,a,k[15],22,1236535329);
      a=gg(a,b,c,d,k[1],5,-165796510);d=gg(d,a,b,c,k[6],9,-1069501632);c=gg(c,d,a,b,k[11],14,643717713);b=gg(b,c,d,a,k[0],20,-373897302);
      a=gg(a,b,c,d,k[5],5,-701558691);d=gg(d,a,b,c,k[10],9,38016083);c=gg(c,d,a,b,k[15],14,-660478335);b=gg(b,c,d,a,k[4],20,-405537848);
      a=gg(a,b,c,d,k[9],5,568446438);d=gg(d,a,b,c,k[14],9,-1019803690);c=gg(c,d,a,b,k[3],14,-187363961);b=gg(b,c,d,a,k[8],20,1163531501);
      a=gg(a,b,c,d,k[13],5,-1444681467);d=gg(d,a,b,c,k[2],9,-51403784);c=gg(c,d,a,b,k[7],14,1735328473);b=gg(b,c,d,a,k[12],20,-1926607734);
      a=hh(a,b,c,d,k[5],4,-378558);d=hh(d,a,b,c,k[8],11,-2022574463);c=hh(c,d,a,b,k[11],16,1839030562);b=hh(b,c,d,a,k[14],23,-35309556);
      a=hh(a,b,c,d,k[1],4,-1530992060);d=hh(d,a,b,c,k[4],11,1272893353);c=hh(c,d,a,b,k[7],16,-155497632);b=hh(b,c,d,a,k[10],23,-1094730640);
      a=hh(a,b,c,d,k[13],4,681279174);d=hh(d,a,b,c,k[0],11,-358537222);c=hh(c,d,a,b,k[3],16,-722521979);b=hh(b,c,d,a,k[6],23,76029189);
      a=ii(a,b,c,d,k[0],6,-198630844);d=ii(d,a,b,c,k[7],10,1126891415);c=ii(c,d,a,b,k[14],15,-1416354905);b=ii(b,c,d,a,k[5],21,-57434055);
      a=ii(a,b,c,d,k[12],6,1700485571);d=ii(d,a,b,c,k[3],10,-1894986606);c=ii(c,d,a,b,k[10],15,-1051523);b=ii(b,c,d,a,k[1],21,-2054922799);
      a=ii(a,b,c,d,k[8],6,1873313359);d=ii(d,a,b,c,k[15],10,-30611744);c=ii(c,d,a,b,k[6],15,-1560198380);b=ii(b,c,d,a,k[13],21,1309151649);
      x[0]= (x[0]+a)|0; x[1]=(x[1]+b)|0; x[2]=(x[2]+c)|0; x[3]=(x[3]+d)|0;
    }
    function rhex(n){
      const s = (n>>>0).toString(16).padStart(8,'0');
      return s.match(/../g).reverse().join('');
    }
    const x = md51(unescape(encodeURIComponent(str)));
    return rhex(x[0])+rhex(x[1])+rhex(x[2])+rhex(x[3]);
  }
  async function hashDigest(alg, str){
    if(alg==='MD5') return md5(str);
    if(alg==='SHA-1') return await sha1(str);
    if(alg==='SHA-256') return await sha256(str);
    return '';
  }
  window.hashDigest = hashDigest;

  // File to Base64 data URL
  function imageToDataURL(file){
    return new Promise((resolve,reject)=>{
      const fr = new FileReader();
      fr.onload = ()=> resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }
  window.imageToDataURL = imageToDataURL;

  // URL Shortener (simulated)
  function generateSlug(len=6){
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let out=''; for(let i=0;i<len;i++) out += chars[Math.floor(Math.random()*chars.length)];
    return out;
  }
  window.generateSlug = generateSlug;

  // Invoice totals
  function computeInvoiceTotals(items, taxRate){
    const subtotal = items.reduce((s,it)=> s + (Number(it.qty)||0)*(Number(it.price)||0), 0);
    const tax = subtotal * (Math.max(0, Number(taxRate)||0) / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }
  window.computeInvoiceTotals = computeInvoiceTotals;
})();