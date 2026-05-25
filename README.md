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

## Dados

Os registros ficam salvos no `localStorage` do navegador. O botão `Backup` baixa um JSON com o estado atual do plano, e `Importar` restaura esse arquivo no mesmo navegador ou em outro dispositivo.

Isso significa que celular e PC não sincronizam automaticamente. Para levar registros de um para o outro, use `Backup` no aparelho atual e `Importar` no outro.
