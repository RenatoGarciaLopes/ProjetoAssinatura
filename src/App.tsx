import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container } from '@mui/material';
import type { PDFFile, SignatureConfig } from './types';
import FileUploader from './components/FileUploader';
import SignatureManager from './components/SignatureManager';
import FileList from './components/FileList';
import SignatureButton from './components/SignatureButton';
import { PDFService } from './services/pdfService';
import { v4 as uuidv4 } from 'uuid';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [signatureConfig, setSignatureConfig] = useState<SignatureConfig>({
    image: null,
    size: 100,
    opacity: 1,
  });

  const handleFileUpload = (files: File[]) => {
    const newFiles: PDFFile[] = files.map(file => ({
      id: uuidv4(),
      name: file.name,
      file,
      selected: false,
    }));
    setPdfFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileSelection = (fileId: string, selected: boolean) => {
    setPdfFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, selected } : file
      )
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setPdfFiles(prev =>
      prev.map(file => ({ ...file, selected }))
    );
  };

  const handleSignaturePosition = (fileId: string, position: { x: number; y: number; page: number }) => {
    setPdfFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, signaturePosition: position } : file
      )
    );
  };

  const handleSignDocuments = async () => {
    const selectedFiles = pdfFiles.filter(file => file.selected);
    if (selectedFiles.length === 0) {
      const message = 'Selecione pelo menos um arquivo para assinar';
      if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
        await (window as any).electronAPI.showMessage('warning', 'Atenção', message);
      } else {
        alert(message);
      }
      return;
    }

    if (!signatureConfig.image) {
      const message = 'Adicione uma imagem de assinatura primeiro';
      if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
        await (window as any).electronAPI.showMessage('warning', 'Atenção', message);
      } else {
        alert(message);
      }
      return;
    }

    try {
      // Verificar se pelo menos um arquivo tem posição definida
      const hasPosition = selectedFiles.some(file => file.signaturePosition);
      if (!hasPosition) {
        const message = 'Defina a posição da assinatura para pelo menos um arquivo';
        if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
          await (window as any).electronAPI.showMessage('warning', 'Atenção', message);
        } else {
          alert(message);
        }
        return;
      }

      // Usar a posição do primeiro arquivo selecionado como padrão
      const defaultPosition = selectedFiles.find(file => file.signaturePosition)?.signaturePosition || {
        x: 100,
        y: 100,
        page: 1,
      };

      // Assinar os documentos
      const results = await PDFService.signMultiplePDFs(
        selectedFiles,
        signatureConfig,
        defaultPosition
      );

      if (results.length > 0) {
        // Fazer download dos PDFs assinados
        await PDFService.downloadAllSignedPDFs(results);
        const successMessage = `${results.length} documento(s) assinado(s) com sucesso!`;
        if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
          await (window as any).electronAPI.showMessage('info', 'Sucesso', successMessage);
        } else {
          alert(successMessage);
        }
      } else {
        const errorMessage = 'Nenhum documento foi assinado. Verifique os arquivos e tente novamente.';
        if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
          await (window as any).electronAPI.showMessage('error', 'Erro', errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('Erro ao assinar documentos:', error);
      const errorMessage = 'Erro ao assinar documentos. Verifique o console para mais detalhes.';
      if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
        await (window as any).electronAPI.showMessage('error', 'Erro', errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  const selectedCount = pdfFiles.filter(file => file.selected).length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Painel Esquerdo */}
            <Box sx={{ width: 300, flexShrink: 0 }}>
              <FileUploader onFileUpload={handleFileUpload} />
              <SignatureManager
                config={signatureConfig}
                onConfigChange={setSignatureConfig}
              />
            </Box>

            {/* Painel Direito */}
            <Box sx={{ flex: 1 }}>
              <FileList
                files={pdfFiles}
                onFileSelection={handleFileSelection}
                onSelectAll={handleSelectAll}
                onSignaturePosition={handleSignaturePosition}
                signatureConfig={signatureConfig}
              />
              
              {selectedCount > 0 && (
                <SignatureButton
                  selectedCount={selectedCount}
                  onSign={handleSignDocuments}
                />
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
