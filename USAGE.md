# @true-agents/core - Kullanım Kılavuzu

Bu rehber, ayrı projelerde true-agents paketini nasıl kullanacağınızı gösterir.

## 📦 Kurulum

### 1. Yeni Bir Projede Kullanım

```bash
# Yeni proje oluştur
mkdir my-project && cd my-project
npm init -y

# true-agents kur
npm install @true-agents/core
```

### 2. Mevcut Projeye Ekleme

```bash
cd existing-project
npm install @true-agents/core
```

---

## 🚀 Kullanım Yöntemleri

### Yöntem 1: CLI Aracı (En Basit)

```bash
# Doğrudan npx ile kullan (kurulum gerektirmez)
npx @true-agents/core "Implement user authentication"

# Global kurulum ile her yerden kullan
npm install -g @true-agents/core
true-agents "Fix the bug in payment module"

# Specific persona ile
true-agents --persona mimar "Create REST API endpoints"

# Paralel görevler
true-agents --parallel "Fix frontend bug" "Update backend" "Run tests"
```

### Yöntem 2: Programatik Kullanım

```typescript
// src/agents.ts
import { TrueCLI, PERSONAS } from '@true-agents/core';

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

### Yöntem 3: Persona Dosyalarını Doğrudan Kullanma

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

// Persona tanımını oku
function getPersonaPrompt(personaName: string): string {
  const personaPath = join(
    process.cwd(),
    'node_modules',
    '@true-agents/core',
    'personas',
    'specialist',
    `${personaName}.md`
  );
  return readFileSync(personaPath, 'utf-8');
}

// Kullanım
const mimarPrompt = getPersonaPrompt('mimar');
console.log(mimarPrompt);
```

---

## 🎯 Gerçek Hayat Senaryoları

### Senaryo 1: Full-Stack Web Uygulaması

```bash
# Proje yapısı
my-web-app/
├── frontend/
├── backend/
└── package.json

# Backend için MİMAR persona
cd backend
npx @true-agents/core --persona mimar "Implement JWT authentication middleware"

# Frontend için KAŞIF persona (research)
cd frontend
npx @true-agents/core --persona kasif "Find React state management best practices"

# Test için TEST persona
cd ..
npx @true-agents/core --persona test "Write integration tests for API"
```

### Senaryo 2: Data Analysis Projesi

```bash
# Veri analizi için ANALİZCİ persona
npx @true-agents/core --persona analizci "Analyze user behavior data from database"

# Sonuçları doğrulamak için SENTINEL
npx @true-agents/core --persona sentinel "Verify the analysis results"
```

### Senaryo 3: Code Refactoring

```bash
# Kod yapısını anlamak için ARKEOLOG
npx @true-agents/core --persona arkeolog "Analyze the codebase structure"

# Refactoring için MİMAR
npx @true-agents/core --persona mimar "Refactor the payment module"

# Sonucu test için TEST
npx @true-agents/core --persona test "Verify refactored code works correctly"
```

---

## 🔧 Yapılandırma

### package.json Scripts Ekleyin

```json
{
  "name": "my-project",
  "scripts": {
    "agent": "true-agents",
    "agent:build": "true-agents --persona mimar",
    "agent:research": "true-agents --persona kasif",
    "agent:verify": "true-agents --persona sentinel",
    "agent:test": "true-agents --persona test"
  },
  "devDependencies": {
    "@true-agents/core": "^1.0.0"
  }
}
```

Kullanım:

```bash
npm run agent:build "Implement new feature"
npm run agent:research "Find best practices for X"
npm run agent:verify "Check if everything is correct"
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

## 🔄 Gelişmiş Kullanım

### Paralel Çalıştırma

```bash
# Aynı anda 3 farklı görev
npx @true-agents/core --parallel \
  "Implement user registration" \
  "Design database schema" \
  "Write API documentation"
```

### Thinking Seviyesi Ayarlama

```bash
# Basit görev (hızlı)
npx @true-agents/core --thinking none "Fix typo"

# Orta komplekslik
npx @true-agents/core --thinking think "Add validation"

# Karmaşık görev
npx @true-agents/core --thinking think-hard "Implement caching"

# Kritik görev
npx @true-agents/core --thinking ultrathink "Refactor core architecture"
```

### Model Seçimi

```bash
# Sonnet (hızlı, günlük görevler)
npx @true-agents/core --model sonnet "Update README"

# Opus (karmaşık, kritik görevler)
npx @true-agents/core --model opus "Design system architecture"
```

---

## 🛠️ Entegrasyon Örnekleri

### Express.js ile Entegrasyon

```typescript
// src/services/agentService.ts
import { TrueCLI } from '@true-agents/core';

export class AgentService {
  private cli: TrueCLI;

  constructor() {
    this.cli = new TrueCLI();
  }

  async generateCode(task: string): Promise<string> {
    // Agent'ı çalıştır ve sonucu döndür
    await this.cli.run(['cli', `--persona mimar`, task]);
    return "Task completed";
  }
}

// Express route
app.post('/api/generate', async (req, res) => {
  const { task } = req.body;
  const agent = new AgentService();
  await agent.generateCode(task);
  res.json({ success: true });
});
```

### React Projesi ile Entegrasyon

```bash
# React projesi oluşturup agent ekleyin
npx create-react-app my-app
cd my-app
npm install @true-agents/core

# package.json'a script ekleyin
# "agent": "true-agents"

# Kullanım
npm run agent -- "Add Redux state management"
```

### Next.js Projesi ile Entegrasyon

```bash
npx create-next-app@latest my-app
cd my-app
npm install @true-agents/core

# API route ile agent kullanımı
# pages/api/agent.ts veya app/api/agent/route.ts
```

---

## 📝 İpuçları

1. **Otomatik Persona Seçimi**: Task açıklamasındaki kelimelere göre doğru persona otomatik seçilir
2. **Paralel Çalışma**: Birbirinden bağımsız görevler için paralel mod kullanın
3. **Thinking Levels**: Görev karmaşıklığına göre thinking seviyesini ayarlayın
4. **Model Seçimi**: Basit görevler için sonnet, karmaşık için opus kullanın

---

## 🐛 Sorun Giderme

### CLI Çalışmıyorsa

```bash
# Global kurulum yapın
npm install -g @true-agents/core
# veya
npx @true-agents/core "task"
```

### Persona Dosyaları Bulunamıyorsa

```bash
# node_modules'da kontrol edin
ls node_modules/@true-agents/core/personas/
```

### Claude Code CLI Gerekli

Bu paket Claude Code CLI ile çalışır. Önce onu kurun:

```bash
# Claude Code CLI kurulumu
npm install -g @anthropic-ai/claude-code
```
