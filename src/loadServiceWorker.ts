export default function loadServiceWorker() {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    const installApp = document.getElementById('install-offline-app');

    installApp.addEventListener('click', async () => {
      if (deferredPrompt !== null) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
        }
      }
    });

    document.getElementById('install-app-btn-container').style.display = 'block';
    deferredPrompt = e;
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });

  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.getElementById('install-app-btn-container').style.display = 'none';
  }
}
