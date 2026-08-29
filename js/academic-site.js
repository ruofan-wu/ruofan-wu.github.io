(function () {
  'use strict';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    var isDark = theme === 'dark';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('aria-pressed', String(isDark));
    var icon = toggle.querySelector('.theme-icon');
    if (icon) icon.textContent = isDark ? '☀' : '◐';
  }

  function initializeTheme() {
    var toggle = document.querySelector('.theme-toggle');
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current);
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      try { localStorage.setItem('theme', next); } catch (error) {}
    });
  }

  function createPublicationItem(publication) {
    var item = document.createElement('li');
    item.setAttribute('itemscope', '');
    item.setAttribute('itemtype', 'https://schema.org/ScholarlyArticle');

    var year = document.createElement('span');
    year.className = 'publication-year';
    year.textContent = publication.year;
    year.setAttribute('itemprop', 'datePublished');

    var content = document.createElement('div');
    var title;
    if (publication.url) {
      title = document.createElement('a');
      title.href = publication.url;
      title.target = '_blank';
      title.rel = 'noopener noreferrer';
    } else {
      title = document.createElement('div');
    }
    title.className = 'publication-title';
    title.setAttribute('itemprop', 'name');

    if (publication.new) {
      var badge = document.createElement('span');
      badge.className = 'status-badge';
      badge.textContent = 'New';
      title.appendChild(badge);
    }
    title.appendChild(document.createTextNode(publication.title));

    var authors = document.createElement('p');
    authors.className = 'publication-authors';
    authors.innerHTML = publication.authors;

    var meta = document.createElement('p');
    meta.className = 'publication-meta';
    var venue = document.createElement('span');
    venue.className = 'venue';
    venue.textContent = publication.venue;
    meta.appendChild(venue);

    if (publication.url) {
      var paper = document.createElement('a');
      paper.className = 'paper-link';
      paper.href = publication.url;
      paper.target = '_blank';
      paper.rel = 'noopener noreferrer';
      paper.textContent = publication.preprint ? 'Preprint' : 'Paper';
      paper.setAttribute('aria-label', paper.textContent + ': ' + publication.title);
      meta.appendChild(paper);
    }

    content.appendChild(title);
    content.appendChild(authors);
    content.appendChild(meta);
    item.appendChild(year);
    item.appendChild(content);
    return item;
  }

  function fillList(id, publications) {
    var list = document.getElementById(id);
    if (!list) return;
    var fragment = document.createDocumentFragment();
    publications.forEach(function (publication) { fragment.appendChild(createPublicationItem(publication)); });
    list.replaceChildren(fragment);
  }

  function renderPublications() {
    var publications = Array.isArray(window.RUOFAN_PUBLICATIONS) ? window.RUOFAN_PUBLICATIONS : [];
    fillList('selected-publications', publications.filter(function (publication) { return publication.selected; }));

    var preprints = publications.filter(function (publication) { return publication.preprint; });
    var reviewed = publications.filter(function (publication) { return !publication.preprint; });
    fillList('preprint-publications', preprints);
    fillList('all-publications', reviewed);

    var preprintCount = document.getElementById('preprint-count');
    var publicationCount = document.getElementById('publication-count');
    if (preprintCount) preprintCount.textContent = preprints.length;
    if (publicationCount) publicationCount.textContent = reviewed.length;
  }

  function initializeBackToTop() {
    var button = document.querySelector('.back-to-top');
    if (!button) return;
    function updateVisibility() { button.classList.toggle('visible', window.scrollY > 360); }
    window.addEventListener('scroll', updateVisibility, { passive: true });
    button.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    updateVisibility();
  }

  function updateCopyrightYear() {
    var year = document.getElementById('copyright-year');
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    renderPublications();
    initializeBackToTop();
    updateCopyrightYear();
  });
}());
