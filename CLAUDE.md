# Página inicial do app de reumatologia pediátrica

Página inicial da organização GitHub `reumatopedhias`, publicada em https://reumatopedhias.github.io/ (repositório `reumatopedhias/reumatopedhias.github.io`). É o "app" instalável no celular (PWA): o residente escolhe a doença do paciente e abre as métricas usadas no serviço. O dono do projeto é médico reumatologista pediátrico, não programador: explique em português, de forma simples, o que cada comando faz antes de rodá-lo, e confirme antes de publicar (`git push`), porque o site é público.

## Estrutura
- `index.html`: página única (HTML + CSS + JS, sem dependências nem build). A lista `DOENCAS` no script define doenças e métricas; métrica sem `url` aparece como "em breve".
- `manifest.webmanifest` + `icones/`: nome, cores e ícones do app instalado.
- `sw.js`: modo offline. Guarda só os arquivos das páginas, nunca dados de pacientes.

## Como as calculadoras entram
- Cada calculadora vive no seu próprio repositório da organização (ex.: `reumatopedhias/jdmai` → `/jdmai/`) e tem seu próprio CLAUDE.md. Esta página só aponta para elas e as abre dentro de um quadro (iframe), com a barra de "voltar" do app.
- Para acrescentar uma calculadora: (1) adicionar `url` na lista `DOENCAS`; (2) incluir a pasta em `PASTAS` e os arquivos (página e imagens) em `ARQUIVOS` no `sw.js`; (3) aumentar `VERSAO` no `sw.js`.
- Ao trocar fotos de uma calculadora, também aumentar `VERSAO`, senão o celular continua mostrando as fotos antigas.
- O `sw.js` não deve interceptar `/questionarios/`: os questionários são preenchidos pelo paciente e ficam fora do app dos residentes.

## Decisões
- Doenças planejadas: DMJ (JDMAI, pronta), AIJ (JADAS pronta: boneco de 71 articulações, cJADAS-10 em destaque, JADAS-10/27/71 e critérios de Wallace; sJADAS pronta: sJADAS10 com cortes de Rosina 2024, mSMS, Wallace e lembrete de SAM; JSpADA pronta: JSpADA de 8 itens, JSpADA7 sem Schober e modificada de 6 itens, bonecos de articulações e de 36 enteses, Wallace, sem pontos de corte), LESj (SLEDAI-2K; LLDAS e DORIS a decidir, incluindo o limite pediátrico de prednisona).
- Público inicial: residentes do serviço. O link é público (GitHub Pages), mas não é divulgado.
- Não guardar dados de pacientes (sem localStorage nem envio para servidor).
