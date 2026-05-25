# Plano 45 Dias

Webapp estático para acompanhar dieta, cardio, treino, água, métricas e sinais de excesso durante o ciclo de 45 dias.

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

O app salva no navegador e sincroniza automaticamente com uma linha pública no Supabase, na tabela `dieta`, usando o registro `id = 1`.

Para ativar a nuvem, rode uma vez o SQL em `supabase/schema.sql` no SQL Editor do Supabase.

Depois:

1. Abra o app.
2. Use normalmente no celular ou no PC.
3. Ao marcar algo em um aparelho, o outro carrega o progresso pela nuvem.
