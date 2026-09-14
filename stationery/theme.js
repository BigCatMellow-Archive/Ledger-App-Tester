(() => {
  'use strict';

  const THEME_KEY = 'ledger-stationery-theme-v1';
  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function loadVisualRefresh(){
    if(document.querySelector('link[data-ledger-visual-refresh]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './visual-refresh.css?v=20260914-1';
    link.dataset.ledgerVisualRefresh = 'true';
    document.head.appendChild(link);
  }

  function savedTheme(){
    const value = localStorage.getItem(THEME_KEY);
    return value === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme){
    const next = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
    if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#181715' : '#f2eee3');

    const button = document.getElementById('themeToggle');
    if (button){
      button.setAttribute('aria-pressed', String(next === 'dark'));
      button.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = next === 'dark' ? 'Light mode' : 'Dark mode';
    }
  }

  loadVisualRefresh();
  applyTheme(savedTheme());

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(savedTheme());
    const button = document.getElementById('themeToggle');
    if (!button) return;
    button.addEventListener('click', () => {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  });
})();
