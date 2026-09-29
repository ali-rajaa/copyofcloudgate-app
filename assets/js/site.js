/* CloudGate site.js: every shared behaviour in one deferred file.
   Nothing here is needed to read a page; each block no-ops when its
   elements are missing, and the no-JS state of every component is usable. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Header: firm up once content passes beneath ----------
     An IntersectionObserver on a 1px sentinel instead of a scroll listener. */
  var header = doc.getElementById('site-header');
  if (header && 'IntersectionObserver' in window) {
    var sentinel = doc.createElement('div');
    sentinel.className = 'scroll-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    doc.body.insertBefore(sentinel, doc.body.firstChild);
    new IntersectionObserver(function (e) {
      header.classList.toggle('scrolled', !e[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Mobile menu ---------- */
  var toggle = doc.querySelector('.menu-toggle');
  var menu = doc.getElementById('mobile-menu');
  var backdrop = doc.getElementById('nav-backdrop');
  if (header && toggle && menu) {
    var setMenu = function (open, restoreFocus) {
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      menu.style.setProperty('--menu-h', open ? menu.scrollHeight + 'px' : '0px');
      root.classList.toggle('menu-lock', open);
      if (backdrop) backdrop.hidden = !open;
      if (!open && restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', function () {
      setMenu(!header.classList.contains('menu-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) setMenu(false, true);
    });
    // the menu only exists below the desktop breakpoint
    window.matchMedia('(min-width: 1041px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = doc.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // stagger siblings in card rows so a row lands as one gesture
    doc.querySelectorAll('.feat-grid, .why-grid, .steps-row, .plan-strip, .glance, .plans, .plat-grid').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--stagger', (i * 70) + 'ms'); });
    });
  }

  /* ---------- FAQ accordion ----------
     Each question toggles on its own: opening one never collapses another,
     so the row you tapped never moves out from under your finger. Height is
     animated with the Web Animations API from the answer's current on-screen
     height, so tapping again mid-flight reverses from where it is (no jump).
     Critically damped feel: fast start, no overshoot; closing is quicker than
     opening. Reduced motion gets a short cross-fade instead. */
  var OPEN_MS = 380, CLOSE_MS = 240, EASE = 'cubic-bezier(.22,1,.36,1)';
  function setFaq(btn, open) {
    var ans = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!ans) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var inner = ans.firstElementChild;
    var from = ans.classList.contains('is-open') || ans.classList.contains('is-moving')
      ? ans.getBoundingClientRect().height : 0;   // live value, not the target
    if (ans._anim) { ans._anim.cancel(); ans._anim = null; }
    if (inner && inner._anim) { inner._anim.cancel(); inner._anim = null; }
    ans.classList.add('is-moving');
    ans.classList.toggle('is-open', open);
    var to = open ? inner.getBoundingClientRect().height : 0;
    if (reduceMotion.matches) {
      ans.classList.remove('is-moving');
      if (open && inner.animate) inner.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' });
      return;
    }
    var dur = open ? OPEN_MS : CLOSE_MS;
    ans._anim = ans.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: dur, easing: EASE });
    if (inner.animate) {
      inner._anim = inner.animate(
        open ? [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }]
             : [{ opacity: 1 }, { opacity: 0 }],
        { duration: open ? dur : dur * 0.6, easing: EASE, fill: 'both' });
    }
    ans._anim.onfinish = function () {
      ans._anim = null;
      if (inner._anim) { inner._anim.cancel(); inner._anim = null; }
      ans.classList.remove('is-moving');   // settles at height:auto when open, display:none when closed
    };
  }
  doc.querySelectorAll('.faq-list').forEach(function (list) {
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-q');
      if (btn) setFaq(btn, btn.getAttribute('aria-expanded') !== 'true');
    });
  });

  /* ---------- Contents on phones and tablets ----------
     The sidebar contents list is hidden below 1024px, so a copy of it opens
     as a disclosure at the top of the article. Built from the same list, so
     the two can never disagree. */
  var tocList = doc.querySelector('.toc ul');
  var artMain = doc.querySelector('.art-main');
  if (tocList && artMain) {
    var det = doc.createElement('details');
    det.className = 'toc-mobile';
    var sum = doc.createElement('summary');
    sum.textContent = 'On this page';
    var count = doc.createElement('small');
    count.textContent = tocList.children.length + ' sections';
    sum.appendChild(count);
    det.appendChild(sum);
    var list = tocList.cloneNode(true);
    det.appendChild(list);
    list.addEventListener('click', function (e) { if (e.target.closest('a')) det.open = false; });
    artMain.insertBefore(det, artMain.firstChild);
  }

  /* ---------- Section scrollspy (guide TOC, legal contents, hub nav) ---------- */
  doc.querySelectorAll('.toc, .legal-nav, .about-nav').forEach(function (box) {
    var links = box.querySelectorAll('a[href^="#"]');
    var map = new Map();
    links.forEach(function (l) {
      var el = doc.getElementById(l.getAttribute('href').slice(1));
      if (el) map.set(el, l);
    });
    if (!map.size) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
        var a = map.get(e.target);
        a.classList.add('active');
        a.setAttribute('aria-current', 'location');
        if (box.scrollHeight > box.clientHeight && a.offsetTop > box.clientHeight - 60) {
          box.scrollTop = a.offsetTop - box.clientHeight / 2;
        }
      });
    }, { rootMargin: '-110px 0px -72% 0px' });
    map.forEach(function (l, el) { spy.observe(el); });
  });

  /* ---------- Sticky jump bar shadow (features) ---------- */
  var jw = doc.getElementById('jump-wrap');
  if (jw) {
    var probe = doc.createElement('div');
    probe.className = 'jump-probe';
    jw.parentNode.insertBefore(probe, jw);
    new IntersectionObserver(function (e) {
      jw.classList.toggle('stuck', !e[0].isIntersecting);
    }, { rootMargin: '-90px 0px 0px 0px' }).observe(probe);
  }

  /* ---------- Horizontal rails: previous / next buttons ----------
     Rails scroll natively (touch, trackpad, keyboard); buttons are an extra. */
  doc.querySelectorAll('.rail-nav').forEach(function (nav) {
    var rail = doc.getElementById(nav.querySelector('.rail-btn').dataset.rail);
    if (!rail) return;
    var btns = nav.querySelectorAll('.rail-btn');
    var update = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      nav.hidden = max < 8;
      btns[0].disabled = rail.scrollLeft < 4;
      btns[1].disabled = rail.scrollLeft > max - 4;
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var card = rail.firstElementChild;
        var step = card ? card.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
        rail.scrollBy({ left: step * Number(b.dataset.dir), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      });
    });
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- 404: show the failed address and seed the guide search ----------
     textContent only: the path is user controlled and never parsed as HTML. */
  var nfAddr = doc.getElementById('nf-addr');
  if (nfAddr) {
    var path = location.pathname;
    if (path && path !== '/' && path !== '/404.html') {
      nfAddr.textContent = 'You tried to open ' + path;
      nfAddr.hidden = false;
      var stop = ['guides', 'guide', 'how', 'to', 'the', 'a', 'an', 'for', 'and', 'of', 'on', 'in', 'is', 'your', 'my', 'html', 'index'];
      var words = path.toLowerCase().replace(/\.[a-z0-9]+$/, '').split(/[^a-z0-9]+/)
        .filter(function (w) { return w.length > 1 && stop.indexOf(w) === -1; });
      var field = doc.getElementById('nf-q');
      if (field && words.length) field.value = words.slice(0, 4).join(' ');
    }
  }
})();
