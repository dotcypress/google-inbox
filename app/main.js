const { app, shell, BrowserWindow, Menu } = require('electron')
const { parse } = require('url')

const template = [{
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  } ]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.reload()
      }
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (function () {
      return process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11'
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (function () {
      return process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  } ]
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  } ]
}]

if (process.platform === 'darwin') {
  var name = app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: 'About ' + name,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: 'Hide ' + name,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Shift+H',
      role: 'hideothers'
    }, {
      label: 'Show All',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function () {
        app.quit()
      }
    } ]
  })
  template[3].submenu.push({
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  })
}

const menu = Menu.buildFromTemplate(template)
const inboxUrl = 'https://inbox.google.com/'
var appUrl = inboxUrl
var isReady = false
var mainWindow = null

function showMainWindow (appUrl) {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    'min-width': 800,
    'min-height': 600
  })
  mainWindow.setTitle('Inbox by Google')
  mainWindow.loadURL(appUrl)
  mainWindow.webContents.on('new-window', function (event, url) {
    event.preventDefault()
    if (url.startsWith('https://accounts.google.com') || url.startsWith('https://inbox.google.com')) {
      mainWindow.loadURL(url)
      return
    }
    shell.openExternal(url)
  })
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  Menu.setApplicationMenu(menu)
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  showMainWindow(inboxUrl)
})

app.on('open-url', function (ev, url) {
  const options = parse(url)
  if (options.protocol !== 'mailto:') {
    return
  }
  const query = options.query || ''
  appUrl = `${inboxUrl}?to=${options.auth}@${options.host}&${query}`
  if (!isReady) {
    return
  }
  if (mainWindow) {
    mainWindow.loadURL(appUrl)
    mainWindow.focus()
  } else {
    showMainWindow(appUrl)
  }
})

app.on('ready', () => {
  isReady = true
  showMainWindow(appUrl)
})
