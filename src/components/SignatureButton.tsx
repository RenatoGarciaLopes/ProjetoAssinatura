import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';

interface SignatureButtonProps {
  selectedCount: number;
  onSign: () => void;
}

const SignatureButton: React.FC<SignatureButtonProps> = ({ selectedCount, onSign }) => {
  return (
    <Box sx={{ mt: 3, textAlign: 'right' }}>
      <Button
        variant="contained"
        size="large"
        startIcon={<Edit />}
        onClick={onSign}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
          },
        }}
      >
        ASSINAR {selectedCount} DOCUMENTO{selectedCount > 1 ? 'S' : ''}
      </Button>
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Clique para assinar {selectedCount} documento{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
      </Typography>
    </Box>
  );
};

export default SignatureButton;
