# @true-agents/core - Kullanım Kılavuzu (Git ile)

Bu rehber, ayrı projelerde true-agents paketini **Git** üzerinden nasıl kullanacağınızı gösterir.

## 📦 Kurulum (Git ile)

### Yöntem 1: Submodule Olarak Ekleme (Önerilen)

Projenize true-agents'ı git submodule olarak ekleyin:

```bash
cd your-project

# Submodule olarak ekle
git submodule add https://github.com/erturke/true-agents.git libs/true-agents

# Submodule'ı başlat
git submodule update --init --recursive

# Bağımlılıkları yükle
cd libs/true-agents
npm install
cd ../..
```

### Yöntem 2: Direkt Klonlama

Projenizin içinde `libs/` klasörüne klonlayın:

```bash
cd your-project
mkdir -p libs
cd libs

# true-agents'ı klonla
git clone https://github.com/erturke/true-agents.git

# Bağımlılıkları yükle
cd true-agents
npm install
```

### Yöntem 3: Global Kullanım

Sistem genelinde kullanmak için:

```bash
# Kullanıcı dizinine klonla
cd ~
git clone https://github.com/erturke/true-agents.git
cd true-agents
npm install

# Path'e ekle (bash/zsh)
echo 'export PATH="$HOME/true-agents:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 🚀 Kullanım

### CLI Aracı (En Basit)

```bash
# true-agents klasöründen çalıştırın
cd libs/true-agents
npx tsx src/cli.ts "Implement user authentication"

# Veya global kurduysanız
true-agents "Implement user authentication"
```

### Persona Seçili Kullanım

```bash
cd libs/true-agents

# MİMAR ile kod yazdırma
npx tsx src/cli.ts --persona mimar "Fix the bug in payment module"

# KAŞIF ile araştırma
npx tsx src/cli.ts --persona kasif "Find React 19 best practices"

# Paralel çalıştırma
npx tsx src/cli.ts --parallel "Fix backend" "Update frontend" "Run tests"
```

### Programatik Kullanım

Projenizden true-agents'ı import edin:

```typescript
// your-project/src/agent.ts
import { TrueCLI, PERSONAS } from '../libs/true-agents/src/index.js';

class MyAgentSystem {
  private cli: TrueCLI;

  constructor() {
    this.cli = new TrueCLI();
  }

  async executeTask(task: string) {
    await this.cli.run(['cli', task]);
  }

  async showStatus() {
    await this.cli.run(['status']);
  }

  getPersonas() {
    return PERSONAS;
  }
}

// Kullanım
const agent = new MyAgentSystem();
await agent.executeTask("Analyze database schema");
```

---

## 🎯 Gerçek Hayat Senaryoları

### Senaryo 1: Full-Stack Web Uygulaması

```bash
my-web-app/
├── frontend/
├── backend/
└── libs/
    └── true-agents/          # Git submodule

# Backend için MİMAR persona
cd libs/true-agents
npx tsx src/cli.ts --persona mimar "Implement JWT authentication middleware"

# Frontend için KAŞIF persona
npx tsx src/cli.ts --persona kasif "Find React state management best practices"
```

### Senaryo 2: Monorepo Yapısı

```bash
my-monorepo/
├── packages/
│   ├── app/
│   └── api/
└── libs/
    └── true-agents/          # Paylaşılan agent kütüphanesi

# Her paket'ten agent kullanımı
cd ../../libs/true-agents
npx tsx src/cli.ts --persona mimar "Add user registration to app"
npx tsx src/cli.ts --persona mimar "Create API endpoints for user service"
```

### Senaryo 3: Script Entegrasyonu

Projenizin `package.json`'ına script ekleyin:

```json
{
  "name": "my-project",
  "scripts": {
    "agent": "tsx libs/true-agents/src/cli.ts",
    "agent:build": "tsx libs/true-agents/src/cli.ts --persona mimar",
    "agent:research": "tsx libs/true-agents/src/cli.ts --persona kasif",
    "agent:verify": "tsx libs/true-agents/src/cli.ts --persona sentinel",
    "agent:test": "tsx libs/true-agents/src/cli.ts --persona test"
  }
}
```

Kullanım:

```bash
npm run agent:build -- "Implement new feature"
npm run agent:research -- "Find best practices for X"
npm run agent:verify -- "Check if everything is correct"
```

---

## 📚 Persona Referansı

### CORE Personas (Her Zaman Aktif)

| Persona | Kullanım Alanı |
|---------|----------------|
| `sentinel` | Sonuç doğrulama, tamamlanma kontrolü |
| `hakem` | Karar verme, puanlama, onay |
| `kayitci` | Durum takibi, checkpoint |
| `denetci` | Kalite kontrol, reality check |

### SPECIALIST Personas (Göre Göre)

| Persona | Trigger | Kullanım Alanı |
|---------|---------|----------------|
| `mimar` | build, implement, code | Kod yazma, implementasyon |
| `kasif` | research, find, search | Araştırma, best practices |
| `analizci` | analyze, data, metrics | Veri analizi, metrikler |
| `test` | test, verify | Test yazma, doğrulama |
| `arkeolog` | understand, structure | Kod analizi, yapı anlama |

---

## 🔄 Güncelleme

Submodule kullanıyorsanız güncelleme:

```bash
# Submodule'ı güncelle
git submodule update --remote libs/true-agents

# Veya klasöre gitip pull yapın
cd libs/true-agents
git pull origin main
```

---

## 💡 İpuçları

1. **Otomatik Persona Seçimi**: Task açıklamasındaki kelimelere göre doğru persona otomatik seçilir
2. **Paralel Çalışma**: Birbirinden bağımsız görevler için paralel mod kullanın
3. **Thinking Levels**: Görev karmaşıklığına göre thinking seviyesini ayarlayın
   - `none` - Basit görevler
   - `think` - Orta karmaşıklık
   - `think-hard` - Karmaşık görevler
   - `ultrathink` - Kritik görevler

---

## 🔧 TypeScript Entegrasyonu

Projenizde `tsconfig.json` ayarları:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@true-agents/*": ["libs/true-agents/src/*"]
    }
  }
}
```

Kullanım:

```typescript
import { TrueCLI, PERSONAS } from '@true-agents/core/index.js';
```

---

## 🐛 Sorun Giderme

### Submodule Çalışmıyorsa

```bash
# Submodule'ı silip yeniden ekleyin
git submodule deinit -f libs/true-agents
git rm -f libs/true-agents
rm -rf .git/modules/libs/true-agents

# Yeniden ekleyin
git submodule add https://github.com/erturke/true-agents.git libs/true-agents
```

### CLI Çalışmıyorsa

```bash
# Bağımlılıkları kontrol edin
cd libs/true-agents
npm install

# Doğrudan çalıştırın
npx tsx src/cli.ts "test task"
```

---

## 📖 Daha Fazla

- **[master.md](./master.md)** - Complete system reference
- **[README.md](./README.md)** - Project overview
