const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true, // Ejecutar en pantalla completa
    webPreferences: {
      nodeIntegration: true,    // Permite usar Node.js en la ventana (para poder usar funciones, si las tenés)
      contextIsolation: false,  // Para que el contexto JS del navegador no esté aislado (necesario para nodeIntegration)
    }
  });

  win.loadFile('menu.html');  // Tu archivo principal
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // En macOS normalmente no se cierra la app si todas las ventanas están cerradas
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // En macOS si no hay ventanas abiertas, crea una al hacer clic en el dock
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
