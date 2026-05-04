# Guia de previews para clientes com Vercel

> Objetivo: enviar ao cliente um link real do website antes do lancamento.

## Fluxo recomendado

1. Criar projeto localmente
2. Guardar codigo num repositorio GitHub
3. Ligar o repositorio a Vercel
4. Criar uma branch por fase ou por ronda de alteracoes
5. Fazer push para GitHub
6. Vercel cria automaticamente um preview
7. Enviar link ao cliente
8. Receber feedback agrupado
9. Fazer ajustes
10. Publicar em producao quando aprovado

## Tipos de links

### Preview

Usado durante desenvolvimento.

Exemplo:

```text
https://cliente-site-git-homepage-ats-studio.vercel.app
```

### Producao

Usado apos aprovacao final.

Exemplo:

```text
https://www.cliente.pt
```

## Quando enviar preview

Enviar preview quando:

- A estrutura principal esta pronta
- O design esta aplicado
- A versao mobile esta minimamente cuidada
- As principais paginas ja existem
- Ainda ha tempo para feedback

Nao enviar preview quando:

- O site esta visualmente partido
- Ha conteudo sensivel ou errado
- O cliente ainda nao aprovou direcao visual
- Existem dados reais que nao devem estar publicos

## Email de envio

```text
Olá [Nome],

Segue o link de preview do website:

[LINK]

Pedia-te para veres no computador e no telemovel.

Nesta fase, o ideal e validares:

- Estrutura
- Textos
- Imagens
- Seccoes
- Contactos
- Sensacao geral da marca

Envia-me o feedback agrupado por pagina para conseguirmos ajustar tudo com consistencia.

Obrigado,
Alexandre
ATS Studio
```

## Como organizar feedback

Pedir ao cliente para responder assim:

```text
Home:
- Alterar texto do hero para [...]
- A imagem X podia ser mais clara

Servicos:
- Acrescentar servico Y

Contacto:
- Trocar email para [...]
```

## Boas praticas

- Nao enviar 10 links diferentes ao cliente
- Usar sempre o link mais recente
- Guardar feedback por ronda
- Confirmar por escrito quando o cliente aprova
- Nao publicar em dominio final sem aprovacao

## Publicacao final

Depois de aprovado:

1. Fazer merge para branch principal
2. Confirmar deploy de producao
3. Ligar dominio final
4. Testar site no dominio
5. Testar formulario
6. Enviar email de lancamento ao cliente

