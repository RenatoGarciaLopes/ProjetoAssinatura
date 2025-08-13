export interface PDFFile {
  id: string;
  name: string;
  file: File;
  selected: boolean;
  signaturePosition?: {
    x: number;
    y: number;
    page: number;
  };
}

export interface SignatureConfig {
  image: string | null;
  size: number;
  opacity: number;
}

export interface SignaturePosition {
  x: number;
  y: number;
  page: number;
}
