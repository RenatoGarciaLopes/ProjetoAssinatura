# Sistema de Assinatura em Lote - Versão Desktop (Electron)

Esta é a versão desktop da aplicação de assinatura em lote, construída com Electron para oferecer uma experiência nativa no desktop.

## 🚀 Funcionalidades da Versão Desktop

### ✨ Vantagens do Electron

- **Interface Nativa**: Aparência e comportamento de aplicação desktop nativa
- **Acesso ao Sistema de Arquivos**: Seleção direta de arquivos do computador
- **Diálogos Nativos**: Usa os diálogos padrão do sistema operacional
- **Salvamento Direto**: Salva PDFs diretamente no sistema de arquivos
- **Notificações Nativas**: Mensagens e alertas do sistema operacional
- **Multiplataforma**: Funciona em Windows, macOS e Linux

### 🔧 Funcionalidades Específicas

1. **Seleção de Arquivos Nativa**
   - Botão "Selecionar do Sistema" abre diálogo nativo do SO
   - Navegação direta pelas pastas do computador
   - Suporte a múltiplos arquivos PDF

2. **Upload de Assinatura Nativo**
   - Seleção de imagem via diálogo nativo
   - Suporte a todos os formatos de imagem
   - Preview em tempo real

3. **Salvamento Inteligente**
   - Diálogo de salvamento nativo
   - Escolha da pasta de destino
   - Nomeação personalizada dos arquivos

4. **Interface Adaptativa**
   - Detecta automaticamente se está rodando no Electron
   - Fallback para funcionalidades web quando necessário
   - Botões e ícones específicos para desktop

## 🛠️ Tecnologias

- **Electron 37**: Framework para aplicações desktop
- **React 19**: Interface do usuário
- **TypeScript**: Tipagem estática
- **Material-UI**: Componentes de interface
- **PDF-lib**: Processamento de PDFs
- **Electron Builder**: Empacotamento e distribuição

## 📦 Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 18+
- Yarn ou npm
- Git

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd assinatura

# Instale as dependências
yarn install

# Instale as dependências do Electron
yarn postinstall
```

### Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev                    # Apenas o servidor Vite
yarn electron:dev          # Electron + Vite (recomendado)

# Build
yarn build                 # Build da aplicação web
yarn electron:build        # Build completo para Electron
yarn electron:pack         # Empacotamento para distribuição
yarn electron:dist         # Build de distribuição

# Outros
yarn lint                  # Verificação de código
yarn preview               # Preview do build web
```

## 🎯 Como Usar

### 1. Desenvolvimento

```bash
# Terminal 1: Iniciar servidor Vite
yarn dev

# Terminal 2: Iniciar Electron
yarn electron:dev
```

### 2. Build para Produção

```bash
# Build completo
yarn electron:dist

# Os arquivos serão gerados em:
# - macOS: release/mac/
# - Windows: release/win/
# - Linux: release/linux/
```

## 🏗️ Estrutura do Projeto

```
assinatura/
├── electron/              # Código do Electron
│   ├── main.js           # Processo principal
│   └── preload.js        # Script de preload
├── src/                   # Código da aplicação React
│   ├── components/        # Componentes React
│   ├── services/          # Serviços (PDF, etc.)
│   └── types/             # Definições TypeScript
├── build/                 # Recursos de build
├── dist/                  # Build da aplicação web
├── electron-builder.json  # Configuração do electron-builder
└── package.json           # Dependências e scripts
```

## 🔒 Segurança

### Configurações de Segurança do Electron

- **Context Isolation**: Ativado para segurança
- **Node Integration**: Desabilitado
- **Remote Module**: Desabilitado
- **Preload Script**: Comunicação segura via IPC

### APIs Expostas

- `selectFiles()`: Seleção de arquivos PDF
- `selectSignatureImage()`: Seleção de imagem
- `saveSignedPDF()`: Salvamento de PDFs
- `showMessage()`: Mensagens nativas

## 🚀 Distribuição

### Empacotamento Automático

```bash
# Para todas as plataformas
yarn electron:dist

# Para plataforma específica
yarn electron:dist -- --mac
yarn electron:dist -- --win
yarn electron:dist -- --linux
```

### Formatos de Saída

- **macOS**: `.dmg`, `.zip` (x64, ARM64)
- **Windows**: `.exe` (NSIS), `.exe` (Portable)
- **Linux**: `.AppImage`, `.deb`, `.rpm`

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de Build**
   ```bash
   # Limpar e reinstalar
   rm -rf node_modules
   yarn install
   yarn postinstall
   ```

2. **Erro de Dependências**
   ```bash
   # Reinstalar dependências do Electron
   yarn postinstall
   ```

3. **Problemas de Permissão (macOS)**
   - Verificar configurações de segurança
   - Permitir aplicações de desenvolvedores

### Logs e Debug

- **Desenvolvimento**: DevTools abertos automaticamente
- **Produção**: Logs no console do sistema
- **Electron**: `--enable-logging` flag

## 🔄 Atualizações

### Atualizar Electron

```bash
# Atualizar versão
yarn upgrade electron electron-builder

# Reinstalar dependências
yarn postinstall
```

### Atualizar Dependências

```bash
# Atualizar todas as dependências
yarn upgrade

# Verificar vulnerabilidades
yarn audit
```

## 📱 Plataformas Suportadas

- **macOS**: 10.15+ (Catalina)
- **Windows**: 10+ (x64)
- **Linux**: Ubuntu 18.04+, CentOS 7+

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste em múltiplas plataformas
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido com ❤️ usando Electron e React**
