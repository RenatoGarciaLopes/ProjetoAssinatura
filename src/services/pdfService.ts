import { PDFDocument, PDFImage } from 'pdf-lib';
import type { PDFFile, SignatureConfig, SignaturePosition } from '../types';

export class PDFService {
  static async signPDF(
    pdfFile: PDFFile,
    signatureConfig: SignatureConfig,
    position: SignaturePosition
  ): Promise<Uint8Array> {
    try {
      // Ler o PDF
      const pdfBytes = await pdfFile.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Obter a página especificada
      const pages = pdfDoc.getPages();
      const targetPage = pages[position.page - 1] || pages[pages.length - 1];
      
      if (!targetPage) {
        throw new Error('Página não encontrada');
      }

      // Converter a imagem da assinatura para PDF
      let signatureImage: PDFImage;
      
      if (signatureConfig.image) {
        // Remover o prefixo data:image/...;base64,
        const base64Data = signatureConfig.image.split(',')[1];
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Verificar formato da imagem
        if (!signatureConfig.image.includes('image/png') && 
            !signatureConfig.image.includes('image/jpeg') && 
            !signatureConfig.image.includes('image/jpg')) {
          throw new Error('Formato de imagem não suportado. Use PNG ou JPEG.');
        }
        
        signatureImage = await pdfDoc.embedPng(imageBytes);
      } else {
        throw new Error('Imagem da assinatura não fornecida');
      }

      // Calcular dimensões da página
      const { width: pageWidth, height: pageHeight } = targetPage.getSize();
      
      // Calcular posição da assinatura (convertendo de coordenadas de tela para PDF)
      const signatureWidth = signatureConfig.size;
      const signatureHeight = (signatureWidth * signatureImage.height) / signatureImage.width;
      
      // Posicionar a assinatura (ajustar conforme necessário)
      const x = Math.min(position.x, pageWidth - signatureWidth);
      const y = pageHeight - position.y - signatureHeight; // Inverter Y para coordenadas PDF
      
      // Desenhar a assinatura na página
      targetPage.drawImage(signatureImage, {
        x,
        y,
        width: signatureWidth,
        height: signatureHeight,
        opacity: signatureConfig.opacity,
      });

      // Salvar o PDF modificado
      const signedPdfBytes = await pdfDoc.save();
      return signedPdfBytes;
    } catch (error) {
      console.error('Erro ao assinar PDF:', error);
      throw error;
    }
  }

  static async signMultiplePDFs(
    files: PDFFile[],
    signatureConfig: SignatureConfig,
    defaultPosition: SignaturePosition
  ): Promise<{ fileName: string; signedPdf: Uint8Array }[]> {
    const selectedFiles = files.filter(file => file.selected);
    const results: { fileName: string; signedPdf: Uint8Array }[] = [];

    for (const file of selectedFiles) {
      try {
        // Usar a posição específica do arquivo ou a posição padrão
        const position = file.signaturePosition || defaultPosition;
        
        const signedPdf = await this.signPDF(file, signatureConfig, position);
        results.push({
          fileName: file.name.replace('.pdf', '_assinado.pdf'),
          signedPdf,
        });
      } catch (error) {
        console.error(`Erro ao assinar ${file.name}:`, error);
        // Continuar com os outros arquivos
      }
    }

    return results;
  }

  static async downloadSignedPDF(fileName: string, pdfBytes: Uint8Array): Promise<string | null> {
    // Verificar se está rodando no Electron
    if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
      try {
        const savedPath = await (window as any).electronAPI.saveSignedPDF(fileName, Array.from(pdfBytes));
        return savedPath;
      } catch (error) {
        console.error('Erro ao salvar PDF via Electron:', error);
        // Fallback para download via navegador
        return this.downloadViaBrowser(fileName, pdfBytes);
      }
    } else {
      // Fallback para navegador
      return this.downloadViaBrowser(fileName, pdfBytes);
    }
  }

  private static downloadViaBrowser(fileName: string, pdfBytes: Uint8Array): string | null {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return null; // Não retorna caminho no navegador
  }

  static async downloadAllSignedPDFs(
    results: { fileName: string; signedPdf: Uint8Array }[]
  ): Promise<void> {
    if (typeof window !== 'undefined' && (window as any).electronAPI?.isElectron) {
      // No Electron, salvar um por vez para melhor controle
      for (const result of results) {
        try {
          await this.downloadSignedPDF(result.fileName, result.signedPdf);
        } catch (error) {
          console.error(`Erro ao salvar ${result.fileName}:`, error);
        }
      }
    } else {
      // No navegador, download em lote
      results.forEach(result => {
        this.downloadViaBrowser(result.fileName, result.signedPdf);
      });
    }
  }
}
