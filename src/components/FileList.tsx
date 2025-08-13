import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Description,
  CheckCircle,
  RadioButtonUnchecked,
  DragIndicator,
} from '@mui/icons-material';
import type { PDFFile, SignatureConfig, SignaturePosition } from '../types';

interface FileListProps {
  files: PDFFile[];
  onFileSelection: (fileId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onSignaturePosition: (fileId: string, position: SignaturePosition) => void;
  signatureConfig: SignatureConfig;
}

const FileList: React.FC<FileListProps> = ({
  files,
  onFileSelection,
  onSelectAll,
  onSignaturePosition,
}) => {
  const [showPositioning, setShowPositioning] = useState<string | null>(null);

  const allSelected = files.length > 0 && files.every(file => file.selected);
  const someSelected = files.some(file => file.selected);

  const handleSelectAll = () => {
    onSelectAll(!allSelected);
  };

  const handleFileSelect = (fileId: string, selected: boolean) => {
    onFileSelection(fileId, selected);
  };

  const handlePositionClick = (fileId: string) => {
    setShowPositioning(showPositioning === fileId ? null : fileId);
  };

  const handlePositionSelect = (fileId: string, position: SignaturePosition) => {
    onSignaturePosition(fileId, position);
    setShowPositioning(null);
  };

  if (files.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Arquivos PDF
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Nenhum arquivo PDF selecionado ainda.
            <br />
            Use o painel esquerdo para adicionar arquivos.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Arquivos PDF ({files.length})
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={handleSelectAll}
            />
          }
          label="Selecionar Todos"
          sx={{ mb: 2 }}
        />

        <List>
          {files.map((file, index) => (
            <React.Fragment key={file.id}>
              <ListItem
                sx={{
                  bgcolor: file.selected ? 'primary.50' : 'transparent',
                  borderRadius: 1,
                  mb: 1,
                  border: file.selected ? '1px solid' : '1px solid transparent',
                  borderColor: 'primary.main',
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={file.selected}
                    onChange={(e) => handleFileSelect(file.id, e.target.checked)}
                    icon={<RadioButtonUnchecked />}
                    checkedIcon={<CheckCircle color="primary" />}
                  />
                </ListItemIcon>

                <ListItemIcon>
                  <Description color="primary" />
                </ListItemIcon>

                <ListItemText
                  primary={file.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip
                        label="PDF"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {file.signaturePosition && (
                        <Chip
                          label="Posição definida"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                />

                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handlePositionClick(file.id)}
                    sx={{
                      color: file.signaturePosition ? 'success.main' : 'primary.main',
                    }}
                  >
                    <DragIndicator />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              {showPositioning === file.id && (
                <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Posicionar Assinatura (apenas para o primeiro arquivo)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5].map((page) => (
                      <Chip
                        key={page}
                        label={`Página ${page}`}
                        onClick={() =>
                          handlePositionSelect(file.id, {
                            x: 100,
                            y: 100,
                            page,
                          })
                        }
                        variant={
                          file.signaturePosition?.page === page ? 'filled' : 'outlined'
                        }
                        color="primary"
                        clickable
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    A assinatura será aplicada na mesma posição em todos os documentos selecionados
                  </Typography>
                </Box>
              )}

              {index < files.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default FileList;
