/* Cloud Tips hub: search, category filter, show more, grid/list view.
   State is mirrored to ?q= and ?cat= so a filtered view can be shared,
   and the 404 page search form lands here already filtered. */
  // Search + category filtering
  (function(){
    const search = document.getElementById('tip-search');
    const clearBtn = document.getElementById('search-clear');
    const catRow = document.getElementById('cat-row');
    const grid = document.getElementById('tip-grid');
    const note = document.getElementById('result-note');
    const empty = document.getElementById('no-results');
    const feedback = document.getElementById('search-feedback');
    if(!search || !grid) return;

    const cards = [...grid.querySelectorAll('.tip-card')];
    cards.forEach(c => {
      c.dataset.text = ((c.textContent || '') + ' ' + (c.dataset.kw || ''))
        .toLowerCase().replace(/\s+/g,' ');
    });

    const moreBtn = document.getElementById('more-btn');
    const moreWrap = document.getElementById('more-wrap');
    const LIMIT = 3;

    let activeCat = 'all';
    let expanded = false;

    // reflect search and category in the URL so a filtered view can be shared or bookmarked
    function syncURL(){
      const q = search.value.trim();
      const params = new URLSearchParams();
      if(q) params.set('q', q);
      if(activeCat !== 'all') params.set('cat', activeCat);
      const qs = params.toString();
      history.replaceState(null, '', qs ? '?' + qs + location.hash : location.pathname + location.hash);
    }

    // restore state if someone arrives on a filtered link
    (function restore(){
      const params = new URLSearchParams(location.search);
      const q = params.get('q'), cat = params.get('cat');
      if(q) search.value = q;
      if(cat){
        const btn = catRow.querySelector('.cat-btn[data-filter="' + cat + '"]');
        if(btn){
          catRow.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeCat = cat;
        }
      }
    })();

    function apply(){
      const q = search.value.trim().toLowerCase();
      const filtering = !!q || activeCat !== 'all';

      // which cards match the current search + category
      const matches = cards.filter(c => {
        const okCat = activeCat === 'all' || c.dataset.cat === activeCat;
        const okText = !q || c.dataset.text.includes(q);
        return okCat && okText;
      });

      // while filtering, always reveal every match so nothing hides behind the button
      const showAll = filtering || expanded;

      cards.forEach(c => {
        c.hidden = !matches.includes(c);
        c.classList.remove('is-extra');
      });
      if(!showAll){
        matches.slice(LIMIT).forEach(c => c.classList.add('is-extra'));
      }
      grid.classList.toggle('show-all', showAll);

      // category pill counts reflect the current search, so they never look frozen
      catRow.querySelectorAll('.cat-btn').forEach(btn => {
        const f = btn.dataset.filter;
        const n = cards.filter(c =>
          (f === 'all' || c.dataset.cat === f) && (!q || c.dataset.text.includes(q))
        ).length;
        const badge = btn.querySelector('.count');
        if(badge) badge.textContent = n;
        btn.classList.toggle('empty', n === 0);
        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
        // a category with no matches should not look selectable
        btn.disabled = n === 0 && !btn.classList.contains('active');
      });

      // immediate feedback beside the search box
      if(feedback){
        feedback.textContent = q
          ? (matches.length === 0
              ? 'No guides match "' + search.value.trim() + '"'
              : matches.length + (matches.length === 1 ? ' guide matches "' : ' guides match "') + search.value.trim() + '"')
          : '';
        feedback.classList.toggle('show', !!q);
      }

      const hidden = Math.max(0, matches.length - LIMIT);
      const needsBtn = !filtering && hidden > 0;
      moreWrap.hidden = !needsBtn;
      if(needsBtn){
        moreBtn.querySelector('.lbl').textContent =
          expanded ? 'Show fewer guides' : 'Show ' + hidden + ' more guide' + (hidden === 1 ? '' : 's');
        moreBtn.classList.toggle('open', expanded);
        moreBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        const hint = document.getElementById('more-hint');
        if(hint) hint.textContent = expanded ? 'Showing every guide' : 'Click below to see more';
      }

      empty.classList.toggle('show', matches.length === 0);
      grid.hidden = matches.length === 0;
      clearBtn.classList.toggle('show', q.length > 0);

      syncURL();

      const shownCount = showAll ? matches.length : Math.min(LIMIT, matches.length);
      note.textContent = (filtering || expanded)
        ? matches.length + (matches.length === 1 ? ' guide' : ' guides')
        : shownCount + ' of ' + matches.length + ' guides';
    }

    if(moreBtn){
      moreBtn.addEventListener('click', () => {
        if(expanded){
          // play the exit animation before collapsing back down
          grid.classList.add('collapsing');
          const top = document.getElementById('all-tips').getBoundingClientRect().top + window.scrollY - 90;
          setTimeout(() => {
            grid.classList.remove('collapsing');
            expanded = false;
            apply();
            if(window.scrollY > top) window.scrollTo({top: top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
          }, 260);
        } else {
          expanded = true;
          apply();
        }
      });
    }

    let t;
    search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 120); });
    search.addEventListener('search', apply);
    // Enter filters in place; without JavaScript the form submits as ?q=
    if(search.form) search.form.addEventListener('submit', e => { e.preventDefault(); apply(); });
    // Escape clears the field, which is what people expect from a search box
    search.addEventListener('keydown', e => {
      if(e.key === 'Escape' && search.value){
        e.preventDefault();
        search.value = '';
        apply();
      }
    });
    clearBtn.addEventListener('click', () => { search.value = ''; search.focus(); apply(); });

    catRow.addEventListener('click', e => {
      const btn = e.target.closest('.cat-btn');
      if(!btn) return;
      catRow.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.filter;
      apply();
    });

    // set the initial collapsed state on load
    apply();
  })();

  // Grid / list view toggle
  (function(){
    const toggle = document.getElementById('view-toggle');
    const grid = document.getElementById('tip-grid');
    if(!toggle || !grid) return;
    toggle.addEventListener('click', e => {
      const btn = e.target.closest('.view-btn');
      if(!btn) return;
      toggle.querySelectorAll('.view-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed','false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      grid.classList.toggle('list-view', btn.dataset.view === 'list');
    });
  })();
