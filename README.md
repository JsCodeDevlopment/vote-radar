# Vote Radar 🇧🇷

Plataforma de acompanhamento de mandato e transparência política. Confronte a atuação de parlamentares com suas próprias posições sobre políticas públicas, com rastreabilidade total até a **fonte primária oficial**.

---

## 🏛️ Pilares de Neutralidade Editorial e Rastreabilidade

1. **Separação Visual Clara**:
   - `DADO OFICIAL`: Dados brutos obtidos diretamente dos portais da Câmara, TSE ou Senado.
   - `ANÁLISE DO SISTEMA`: Classificações de projetos, temas e cálculos de compatibilidade.
   - `OPINIÃO DO USUÁRIO`: Posições marcadas pelo cidadão (estritamente privadas sob a LGPD).
   - `NOTÍCIA DE TERCEIROS`: Notícias jornalísticas agregadas (apenas título, resumo, fonte e link original).

2. **Rastreabilidade Total**:
   - Toda informação factual relevante aponta diretamente para sua `Source` (URL oficial, nome do órgão e data de coleta).
   - O voto contra uma matéria não é simplificado como "contra a política": o usuário conta com a justificativa *"Por que essa classificação?"* e o método utilizado (`OFFICIAL`, `RULE`, `AI` ou `HUMAN`).

---

## 📁 Estrutura do Monorepo

```text
vote-radar/
├── apps/
│   ├── web/               # Frontend Next.js (App Router, React 19, TypeScript)
│   │   ├── app/           # Rotas: /, /explorar, /parlamentares/[id], /proposicoes/[id],
│   │   │                  #        /politicas, /dashboard, /login, /register
│   │   ├── components/    # Componentes UI, Header, AuthProvider, Cards e Badges
│   │   ├── features/      # Abas do perfil: Resumo, Votos, Projetos, Gastos, Gabinete, Notícias
│   │   ├── lib/           # Cliente de API, adaptador Mock automático, tipos e regras de compatibilidade
│   │   └── hooks/         # Hooks de requisição assíncrona
│   │
│   └── api/               # Backend NestJS + Prisma ORM (PostgreSQL)
│       ├── prisma/        # schema.prisma (Data Model completo das 10 fases)
│       └── src/           # Módulos do backend
│
├── docker-compose.yml     # PostgreSQL 16 local
└── package.json           # Workspaces npm configurados
```

---

## 🚀 Como Rodar Localmente

### 1. Pré-requisitos
- **Node.js** 20+ ou 22+
- **Docker Desktop** (ou PostgreSQL local)

### 2. Rodando o Frontend (Next.js)

O frontend conta com um mecanismo inteligente em `NEXT_PUBLIC_DATA_MODE=auto`:
- Se a API NestJS estiver rodando, ele se comunica normalmente com ela.
- Se a API ainda estiver desligada ou em desenvolvimento, ele inicializa com o dataset de demonstração realista em memória/localStorage, permitindo navegar por todas as telas, testar login, seguir parlamentares, definir políticas e ver o cálculo de compatibilidade imediatamente.

Para iniciar o frontend:

```powershell
# Na raiz do projeto
npm run dev:web
```

Acesse: [http://localhost:3001](http://localhost:3001)

---

### 3. Rodando o Banco de Dados e a API (NestJS)

#### Opção A: Com Docker (Recomendado)
1. Abra o **Docker Desktop**.
2. Suba o container do PostgreSQL:
   ```powershell
   npm run db:up
   ```
3. Aplique as migrações do Prisma e gere os tipos:
   ```powershell
   npm run prisma:migrate
   ```
4. Inicie a API:
   ```powershell
   npm run dev:api
   ```
   A API estará em: [http://localhost:3000](http://localhost:3000)

#### Opção B: Com PostgreSQL já instalado no Windows
Se já possuir um serviço local do PostgreSQL (ex.: porta `5433`):
1. Crie o banco `CREATE DATABASE politics_tracker;`.
2. Configure a connection string no arquivo `apps/api/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:<sua_senha>@localhost:5433/politics_tracker"
   ```
3. Execute:
   ```powershell
   npm run prisma:migrate
   npm run dev:api
   ```

---

## 🛠️ Telas e Recursos Implementados no Frontend

| Rota | Descrição |
|---|---|
| `/` | **Página Inicial**: Hero com busca de deputados, carrossel de seguidos e timeline/feed de atualizações recentes. |
| `/explorar` | **Busca de Parlamentares**: Filtro por nome, estado (UF) e partido. |
| `/parlamentares/[id]` | **Perfil do Parlamentar**: Estatísticas do mandato, aba "Você votou nele. E agora?", e abas: **Resumo**, **Votos** (com comparativo por política), **Projetos** (com filtros de tramitação), **Gastos** (cota por categoria, mês e notas), **Gabinete** (servidores por função) e **Notícias** (agregador). |
| `/proposicoes/[id]` | **Detalhe do Projeto**: Ementa, autores, políticas públicas associadas com justificativa e grau de confiança, votações nominais e histórico completo de tramitação. |
| `/politicas` | **Minhas Políticas Públicas**: Posicionamento privado por temas (Economia, Tributação, Saúde, Educação, Segurança, etc.). |
| `/dashboard` | **Meu Painel**: Compatibilidade média com seus deputados, contadores de atividades e feed exclusivo dos parlamentares que você segue. |
| `/login` e `/register` | **Autenticação**: Cadastro e login de cidadãos com foco em privacidade (LGPD). |
