# previaarquitetura

Prévias de sites da Zinkra para o nicho de **arquitetos e escritórios de arquitetura**. Cada cliente tem a sua pasta e só recebe o link dela.

## Como funciona a privacidade
- A página inicial (`/`) não lista nada: só diz que é uma área de prévias privadas.
- Cada prévia fica numa pasta com um código no fim, para ninguém adivinhar o link: `/nome-do-cliente-x7k2/`.
- Nenhuma página aparece no Google (`robots.txt`, meta `noindex` e cabeçalho `X-Robots-Tag`).
- Este README não vai para o site (`.vercelignore`). A lista de clientes e links fica no Cérebro, não aqui.

## Prévia nova
1. Crie a pasta `nome-do-cliente-<4 letras/números aleatórios>/` com o `index.html` e os arquivos do site.
2. Use só caminhos relativos dentro da pasta (`style.css`, `img/foto.jpg`).
3. Commit e push: a Vercel publica sozinha. O link é `https://<projeto>.vercel.app/<pasta>/`.

> A prévia `britos/` é anterior a esta regra e ficou sem código no link para não quebrar o link já enviado.
