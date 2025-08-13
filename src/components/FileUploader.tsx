import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
} from '@mui/material';
import { CloudUpload, Description, FolderOpen } from '@mui/icons-material';

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [isElectron] = useState(() => {
    return typeof window !== 'undefined' && (window as any).electronAPI?.isElectron;
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
      if (pdfFiles.length > 0) {
        onFileUpload(pdfFiles);
      }
    },
    [onFileUpload]
  );

  const handleNativeFileSelect = useCallback(async () => {
    if (isElectron && (window as any).electronAPI) {
      try {
        const selectedFiles = await (window as any).electronAPI.selectFiles();
        if (selectedFiles && selectedFiles.length > 0) {
          // Converter os arquivos nativos para File objects
          const files = await Promise.all(
            selectedFiles.map(async (fileInfo: any) => {
              const response = await fetch(`file://${fileInfo.path}`);
              const blob = await response.blob();
              return new File([blob], fileInfo.name, { type: 'application/pdf' });
            })
          );
          onFileUpload(files);
        }
      } catch (error) {
        console.error('Erro ao selecionar arquivos:', error);
      }
    }
  }, [isElectron, onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  const hasFiles = acceptedFiles.length > 0;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description color="primary" />
          Buscar Arquivos
        </Typography>
        
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'primary.50' : 'grey.50',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          
          {isDragActive ? (
            <Typography variant="body1" color="primary">
              Solte os arquivos PDF aqui...
            </Typography>
          ) : (
            <Box>
              <Typography variant="body1" gutterBottom>
                Arraste e solte arquivos PDF aqui
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ou
              </Typography>
              <Button 
                variant="contained" 
                component="span"
                onClick={isElectron ? handleNativeFileSelect : undefined}
                startIcon={isElectron ? <FolderOpen /> : undefined}
              >
                {isElectron ? 'Selecionar do Sistema' : 'Selecionar Arquivos'}
              </Button>
            </Box>
          )}
        </Box>

        {hasFiles && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {acceptedFiles.length} arquivo(s) selecionado(s)
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
