var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

function showMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    'min-width': 800,
    'min-height': 600
  });
  mainWindow.setTitle('Inbox by Google');
  mainWindow.loadUrl('https://inbox.google.com/');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', showMainWindow);

app.on('ready', showMainWindow);
