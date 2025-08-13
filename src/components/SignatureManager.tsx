import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  Button,
  Alert,
} from '@mui/material';
import { Edit, Image, FolderOpen } from '@mui/icons-material';
import type { SignatureConfig } from '../types';

interface SignatureManagerProps {
  config: SignatureConfig;
  onConfigChange: (config: SignatureConfig) => void;
}

const SignatureManager: React.FC<SignatureManagerProps> = ({
  config,
  onConfigChange,
}) => {
  const [isElectron] = useState(() => {
    return typeof window !== 'undefined' && (window as any).electronAPI?.isElectron;
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onConfigChange({ ...config, image: result });
        };
        reader.readAsDataURL(file);
      }
    },
    [config, onConfigChange]
  );

  const handleNativeImageSelect = useCallback(async () => {
    if (isElectron && (window as any).electronAPI) {
      try {
        const imageData = await (window as any).electronAPI.selectSignatureImage();
        if (imageData) {
          onConfigChange({ ...config, image: imageData });
        }
      } catch (error) {
        console.error('Erro ao selecionar imagem:', error);
      }
    }
  }, [isElectron, config, onConfigChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.gif'],
    },
    multiple: false,
  });

  const handleSizeChange = (_event: Event, newValue: number | number[]) => {
    onConfigChange({ ...config, size: newValue as number });
  };

  const handleOpacityChange = (_event: Event, newValue: number | number[]) => {
    onConfigChange({ ...config, opacity: newValue as number });
  };

  const clearSignature = () => {
    onConfigChange({ ...config, image: null });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Edit color="primary" />
          Assinaturas
        </Typography>

        {!config.image ? (
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
            <Image sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            
            {isDragActive ? (
              <Typography variant="body1" color="primary">
                Solte a imagem da assinatura aqui...
              </Typography>
            ) : (
              <Box>
                <Typography variant="body1" gutterBottom>
                  Arraste e solte uma imagem da assinatura
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ou
                </Typography>
                <Button 
                  variant="outlined" 
                  component="span"
                  onClick={isElectron ? handleNativeImageSelect : undefined}
                  startIcon={isElectron ? <FolderOpen /> : undefined}
                >
                  {isElectron ? 'Selecionar do Sistema' : 'Selecionar Imagem'}
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img
                src={config.image}
                alt="Assinatura"
                style={{
                  maxWidth: '100%',
                  maxHeight: 100,
                  objectFit: 'contain',
                }}
              />
            </Box>
            
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={clearSignature}
              sx={{ mb: 2 }}
            >
              Remover Assinatura
            </Button>
          </Box>
        )}

        {config.image && (
          <>
            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              Tamanho da Assinatura: {config.size}px
            </Typography>
            <Slider
              value={config.size}
              onChange={handleSizeChange}
              min={50}
              max={200}
              step={10}
              marks
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" gutterBottom>
              Opacidade: {Math.round(config.opacity * 100)}%
            </Typography>
            <Slider
              value={config.opacity}
              onChange={handleOpacityChange}
              min={0.1}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="auto"
            />
          </>
        )}

        {!config.image && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Adicione uma imagem da sua assinatura para continuar
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SignatureManager;
