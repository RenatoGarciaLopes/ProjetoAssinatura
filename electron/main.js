const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Manter referência global do objeto da janela
let mainWindow;

function createWindow() {
  // Criar a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'Sistema de Assinatura em Lote',
    show: false,
    titleBarStyle: 'default',
    resizable: true,
    maximizable: true,
    fullscreenable: false
  });

  // Carregar o arquivo index.html da aplicação
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Mostrar a janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitido quando a janela é fechada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Abrir links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Este evento será emitido quando o Electron terminar a inicialização
app.whenReady().then(createWindow);

// Quit quando todas as janelas estiverem fechadas
app.on('window-all-closed', () => {
  // No macOS é comum para aplicações e suas barras de menu
  // permanecerem ativas até que o usuário saia explicitamente com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // No macOS é comum recriar uma janela na aplicação quando o
  // ícone do dock é clicado e não há outras janelas abertas
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers para comunicação com o processo de renderização
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documentos PDF', extensions: ['pdf'] },
      { name: 'Todos os arquivos', extensions: ['*'] }
    ]
  });

  if (!result.canceled) {
    return result.filePaths.map(filePath => ({
      path: filePath,
      name: path.basename(filePath),
      size: fs.statSync(filePath).size
    }));
  }
  return [];
});

ipcMain.handle('select-signature-image', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Imagens', extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'] },
      { name: 'Todos os arquivos', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    const ext = path.extname(filePath).toLowerCase();
    
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.svg') mimeType = 'image/svg+xml';
    
    return `data:${mimeType};base64,${base64}`;
  }
  return null;
});

ipcMain.handle('save-signed-pdf', async (event, { fileName, pdfData }) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: fileName,
    filters: [
      { name: 'Documentos PDF', extensions: ['pdf'] }
    ]
  });

  if (!result.canceled) {
    const buffer = Buffer.from(pdfData);
    fs.writeFileSync(result.filePath, buffer);
    return result.filePath;
  }
  return null;
});

ipcMain.handle('show-message', async (event, { type, title, message }) => {
  const options = {
    type: type || 'info',
    title: title || 'Sistema de Assinatura',
    message: message || '',
    buttons: ['OK']
  };

  return await dialog.showMessageBox(mainWindow, options);
});

// Configurações de segurança
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Prevenir navegação para URLs externos
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && 
        parsedUrl.origin !== 'file://') {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
});
