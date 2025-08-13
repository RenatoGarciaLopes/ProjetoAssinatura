const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs protegidas para o processo de renderização
contextBridge.exposeInMainWorld('electronAPI', {
  // Seleção de arquivos PDF
  selectFiles: () => ipcRenderer.invoke('select-files'),
  
  // Seleção de imagem da assinatura
  selectSignatureImage: () => ipcRenderer.invoke('select-signature-image'),
  
  // Salvar PDF assinado
  saveSignedPDF: (fileName, pdfData) => 
    ipcRenderer.invoke('save-signed-pdf', { fileName, pdfData }),
  
  // Mostrar mensagens nativas
  showMessage: (type, title, message) => 
    ipcRenderer.invoke('show-message', { type, title, message }),
  
  // Verificar se está rodando no Electron
  isElectron: true,
  
  // Informações da plataforma
  platform: process.platform,
  
  // Versão do Electron
  electronVersion: process.versions.electron
});

// Expor algumas APIs úteis do Node.js
contextBridge.exposeInMainWorld('nodeAPI', {
  // Verificar se arquivo existe
  fileExists: (filePath) => {
    try {
      const fs = require('fs');
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  },
  
  // Obter informações do arquivo
  getFileInfo: (filePath) => {
    try {
      const fs = require('fs');
      const path = require('path');
      const stats = fs.statSync(filePath);
      return {
        name: path.basename(filePath),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      };
    } catch (error) {
      return null;
    }
  }
});

// Log para debug
console.log('Preload script carregado com sucesso');
console.log('Plataforma:', process.platform);
console.log('Versão do Electron:', process.versions.electron);
