# Sistema de Assinatura em Lote de PDFs

Uma aplicação web moderna para assinar múltiplos documentos PDF em lote usando React, TypeScript e Material-UI.

## 🚀 Funcionalidades

- **Upload de Arquivos PDF**: Arraste e solte ou selecione múltiplos arquivos PDF
- **Gerenciamento de Assinatura**: 
  - Upload de imagem da assinatura (PNG, JPG, JPEG, SVG, GIF)
  - Ajuste de tamanho da assinatura (50px - 200px)
  - Controle de opacidade (10% - 100%)
- **Seleção de Arquivos**: Selecione arquivos individuais ou todos de uma vez
- **Posicionamento da Assinatura**: Defina a página e posição da assinatura
- **Assinatura em Lote**: Processe todos os arquivos selecionados de uma vez
- **Download Automático**: PDFs assinados são baixados automaticamente

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **Upload de Arquivos**: React Dropzone
- **Processamento de PDF**: PDF-lib
- **Build Tool**: Vite
- **Gerenciamento de Estado**: React Hooks

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd assinatura
```

2. Instale as dependências:
```bash
yarn install
```

3. Execute em modo de desenvolvimento:
```bash
yarn dev
```

4. Abra o navegador em `http://localhost:5173`

## 🎯 Como Usar

### 1. Adicionar Arquivos PDF
- Clique em "BUSCAR ARQUIVOS" no painel esquerdo
- Arraste e solte arquivos PDF ou clique para selecionar
- Suporta múltiplos arquivos de uma vez

### 2. Configurar Assinatura
- No painel "ASSINATURAS", arraste uma imagem da sua assinatura
- Ajuste o tamanho usando o slider (50px - 200px)
- Configure a opacidade conforme necessário

### 3. Selecionar Arquivos
- Use o checkbox "SELECIONAR TODOS" para selecionar todos os arquivos
- Ou selecione arquivos individuais conforme necessário

### 4. Definir Posição da Assinatura
- Clique no ícone de posicionamento (🎯) ao lado de um arquivo
- Escolha a página onde a assinatura será aplicada
- A posição será aplicada a todos os documentos selecionados

### 5. Assinar Documentos
- Clique no botão "ASSINAR X DOCUMENTO(S)" no canto inferior direito
- Aguarde o processamento
- Os PDFs assinados serão baixados automaticamente

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── FileUploader.tsx      # Upload de arquivos PDF
│   ├── SignatureManager.tsx  # Gerenciamento da assinatura
│   ├── FileList.tsx          # Lista de arquivos
│   └── SignatureButton.tsx   # Botão de assinatura
├── services/           # Serviços
│   └── pdfService.ts         # Processamento de PDFs
├── types/              # Definições de tipos TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada
```

## 🔧 Scripts Disponíveis

- `yarn dev` - Executa em modo de desenvolvimento
- `yarn build` - Gera build de produção
- `yarn preview` - Visualiza build de produção
- `yarn lint` - Executa linter

## 📋 Requisitos

- Node.js 18+ 
- Yarn ou npm
- Navegador moderno com suporte a ES6+

## 🎨 Personalização

A aplicação usa Material-UI com um tema personalizado. Você pode modificar:

- Cores do tema em `src/App.tsx`
- Estilos dos componentes usando a prop `sx`
- Layout e espaçamentos conforme necessário

## 🚨 Limitações

- Suporta apenas arquivos PDF
- Imagens de assinatura: PNG, JPG, JPEG, SVG, GIF
- Tamanho máximo de arquivo depende do navegador
- Processamento é feito no cliente (não há upload para servidor)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique o console do navegador para erros
2. Certifique-se de que os arquivos são PDFs válidos
3. Verifique se a imagem da assinatura está em formato suportado
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ usando React e Material-UI**
