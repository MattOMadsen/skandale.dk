const APP_VERSION = 'v2.01.04';

function setVersion() {
  const el = document.getElementById('navbar-version');
  if (el) el.textContent = APP_VERSION;
}

window.setVersion = setVersion;
window.APP_VERSION = APP_VERSION;