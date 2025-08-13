declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      platform: string;
      electronVersion: string;
      selectFiles: () => Promise<Array<{
        path: string;
        name: string;
        size: number;
      }>>;
      selectSignatureImage: () => Promise<string | null>;
      saveSignedPDF: (fileName: string, pdfData: number[]) => Promise<string | null>;
      showMessage: (type: 'info' | 'warning' | 'error', title: string, message: string) => Promise<any>;
    };
    nodeAPI?: {
      fileExists: (filePath: string) => boolean;
      getFileInfo: (filePath: string) => {
        name: string;
        size: number;
        created: Date;
        modified: Date;
        isFile: boolean;
        isDirectory: boolean;
      } | null;
    };
  }
}

export {};
