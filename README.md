# atstudio.pt

Website da ATS Studio (Next.js 16, PT/EN). Os conteúdos editáveis vivem num CMS próprio em `/admin`, com SQLite (libSQL + Drizzle) e imagens em disco. Não depende do Sanity nem da Vercel.

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # validação dos conteúdos e da seed
npm run lint
npm run build
```

A base de dados local fica em `data/cms.db` (ignorada pelo Git). Na primeira execução é criada e preenchida com `lib/cms/seed.json` (exportação do Sanity de 2026-11-03) e com as páginas legais de `lib/legal-content.ts`.

Para entrar no `/admin` em local, define `ADMIN_PASSWORD_HASH` (gerado com `node scripts/hash-admin-password.mjs`) e `ADMIN_SESSION_SECRET` (32 caracteres ou mais) no ambiente. Ver `.env.example`.

## CMS

- `/admin`: projetos, processo, Centro de Recursos, páginas legais e definições do site (redes sociais), sempre em PT e EN.
- "Publicar" grava na base de dados e a alteração fica logo visível no site, porque as páginas são renderizadas a cada pedido.
- Imagens: PNG, JPEG, WebP ou AVIF até 8 MB, servidas em `/media/<hash>.<ext>`. Não se aceita SVG, porque pode conter scripts.
- Formas e validação dos conteúdos em `lib/cms/schema.ts`. Para um campo novo, basta acrescentá-lo à forma e ao tipo usado pelo site.

## Produção (VPS Contabo, Coolify)

- O `Dockerfile` gera uma imagem standalone. Volume persistente em `/data`, com `cms.db` e `media/`. Health check em `/api/health`.
- Variáveis de runtime no Coolify: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `PAGESPEED_API_KEY`, `ADMIN_PASSWORD_HASH` e `ADMIN_SESSION_SECRET`. Nunca as commitar.
- Backup diário: `deploy/vps-backup.sh` (base de dados com `VACUUM INTO` e media) para o R2 EU, com retenção de 30 dias e alerta por email em caso de falha.
- Restauro: extrair o arquivo, confirmar o `MANIFEST.sha256` e copiar `cms.db` e `media/` para o volume `/data`, com o contentor parado.

Rodapé: "Powered by ATS Studio", com ligação para https://atstudio.pt.
