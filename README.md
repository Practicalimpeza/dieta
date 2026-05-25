# Plano 45 Dias

Webapp estático para acompanhar dieta, cardio, treino, refeed, métricas e sinais de excesso durante o ciclo de 45 dias.

## Como usar

Abra `index.html` no navegador.

Para servir localmente:

```powershell
python -m http.server 4173
```

Depois acesse `http://localhost:4173`.

Quando publicado no GitHub Pages, acesse pelo celular ou PC em:

```text
https://practicalimpeza.github.io/dieta/
```

## Sincronização

O app salva no navegador e, quando você entra com uma conta Supabase, sincroniza automaticamente com a tabela `diet_states`.

Para ativar a nuvem, rode uma vez o SQL em `supabase/schema.sql` no SQL Editor do Supabase.

Depois:

1. Abra o app.
2. Crie uma conta com email e senha.
3. Entre com a mesma conta no celular e no PC.

O botão `Backup` continua disponível como segurança manual, mas não é mais necessário para sincronizar entre aparelhos.
