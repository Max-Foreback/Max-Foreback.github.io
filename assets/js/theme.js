(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark');

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    btn.setAttribute('aria-pressed', next === 'dark');
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();
