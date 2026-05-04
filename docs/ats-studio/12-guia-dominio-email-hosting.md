# Guia de dominio, email e hosting

> Documento interno. Confirmar precos antes de enviar a clientes, porque dominios, email e SaaS mudam frequentemente.

## Recomendacao simples para ATS Studio

Para comecar:

- Dominio: Porkbun ou Cloudflare Registrar
- Email: Zoho Mail, Porkbun Email ou Google Workspace
- Hosting: Vercel

## Opcao economica

Ideal para pequenos negocios.

- Dominio: Porkbun
- Email: Zoho Mail ou Porkbun Email
- Hosting: Vercel Hobby, se o projeto permitir

Vantagens:

- Barato
- Simples
- Bom para sites institucionais pequenos

Limites:

- Menos premium que Google Workspace
- Pode exigir configuracao DNS mais manual

## Opcao equilibrada

Ideal para empresas que querem algo profissional sem complicar.

- Dominio: Cloudflare ou Porkbun
- Email: Google Workspace ou Microsoft 365
- Hosting: Vercel

Vantagens:

- Email profissional robusto
- Melhor experiencia para cliente
- Bom para equipas

Limites:

- Custo mensal por utilizador

## Opcao premium

Ideal para empresas com maior exigencia.

- Dominio: Cloudflare
- Email: Google Workspace ou Microsoft 365
- Hosting: Vercel Pro
- Analytics e monitorizacao

Vantagens:

- Mais robusto
- Melhor para equipas
- Melhor suporte e controlo

Limites:

- Custo mensal superior

## O que o cliente precisa comprar

Normalmente o cliente deve ser dono de:

- Dominio
- Conta de email
- Conta de hosting
- Conta Google Analytics/Search Console

A ATS Studio pode ajudar a configurar, mas idealmente os acessos pertencem ao cliente.

## Informacao a pedir ao cliente

- Nome de dominio desejado
- Emails desejados
- Quem vai usar cada email
- Cartao/metodo de pagamento para subscricoes
- Quem deve receber notificacoes tecnicas

## Exemplo de emails profissionais

- geral@empresa.pt
- hello@empresa.pt
- info@empresa.pt
- contacto@empresa.pt
- nome@empresa.pt

Para ATS Studio:

- geral@atstudio.pt
- alexandre@atstudio.pt
- projects@atstudio.pt

## DNS basico

Registos comuns:

- A record: aponta dominio para servidor
- CNAME: aponta subdominio, como www
- MX: email
- TXT: verificacao, SPF, DKIM, DMARC

## Checklist de configuracao

- Dominio comprado
- Nameservers corretos
- DNS configurado
- Email validado
- SPF configurado
- DKIM configurado
- DMARC configurado
- Dominio ligado a Vercel
- SSL ativo
- www e dominio raiz funcionam

## Como explicar ao cliente

```text
O dominio e o email devem ficar em teu nome/conta, porque sao ativos da tua empresa.

Eu posso ajudar a escolher, comprar e configurar tudo, mas no final tu ficas com controlo sobre dominio, email e alojamento.
```

