# 002 · Remodel v2 (atualiza o guia da 001)

## Changelog
- Máquina e tesoura refeitas em PBR (metal escovado, lâmina com dentes, tesoura offset). Movimento esporádico: investida lateral com giro a cada seção + ações aleatórias (tremor, snip da tesoura, giro, balanço).
- Botões agora flat (`btn-flat`) ou glass (`btn-glass`, `btn-line`). Clay removido.
- Navbar some ao rolar para baixo e volta ao rolar para cima (`Nav` em `App.jsx`).
- Removidos travessões, numerações e títulos pequenos de seção.
- Sobre: cena pinada (retrato abre, P&B vira cor, mapa visagista desenhado no rosto, texto revelado por palavra).
- Visagismo: seletor de formato de rosto + 4 benefícios com ícones.
- Resultados: molduras editoriais com parallax. Atendimentos: seletor + formulário que monta a mensagem do WhatsApp.
- Número do WhatsApp trocado; mensagens dizem "pelo seu site". Footer ampliado.

## Onde editar
| O quê | Onde |
|---|---|
| Número WhatsApp | `WA` em `src/lib/content.js` (confirmar: informado com 12 dígitos) |
| Textos, tags, formatos de rosto (`SHAPES`), benefícios, rodapé | `src/lib/content.js` |
| Mensagem do formulário | função `send` em `Services`, `src/Sections.jsx` |
| Campos do formulário | `Services`, `src/Sections.jsx` |
| Cena Sobre (linhas do rosto, tempos) | `About`, `src/Sections.jsx` (coordenadas do SVG em px da foto 750x875) |
| Poses e ações aleatórias da máquina | `POSES` e `loop` em `Clipper3D.jsx` |
| Modelo 3D real | colocar `public/models/clipper.glb` e `scissors.glb` (carregam sozinhos) |
| Botões / vidro | `ui/button.jsx` e `index.css` |
| Marquee e wordmark do rodapé | `Footer` em `App.jsx` |

## Atualização 003
- Tesoura real: `public/models/scissors.glb` (animação de abrir/fechar do próprio arquivo é usada nos "snips"). Orientação em `SC_ROT` no `Clipper3D.jsx`.
- Máquina: colocar `public/models/clipper.glb` (Sketchfab "Hair Clipper" by ChakkitPP, baixar em glTF/GLB). Ao usar, manter o crédito do autor conforme a licença (campo `credit` em `FOOTER`).
- Transição entre seções agora é um deslize suave (sem sair da tela). `POSES` ganhou o 6º valor: posição X da tesoura.
- Correção dos cantos de Resultados: grid com `items-start` (o item mais baixo esticava e os cantos ficavam fora da imagem).

## Atualização 004
- Tesoura: `SC_ROT` zerado (o GLB já vem de frente) e escala maior.
- Sobre: texto gigante agora em duas linhas em contorno, "VISAGISMO ✦" e "IZAÍAS MACHADO ✦", movendo em sentidos opostos (`.ab-bigA` / `.ab-bigB` em `Sections.jsx`).
- Atendimentos: máquina e tesoura vão para as margens; posições X escalam com a proporção da janela (`kx` em `Clipper3D.jsx`); classe `.readable` (sombra de texto) no bloco da esquerda.
- Rodapé: `Carousel` (faixa infinita; acelera/inverte com a rolagem, desacelera no hover). Botão `ToTop` no canto inferior direito (Lenis, 1.8s). Links de âncora também rolam suave.
- Máquina refeita: casco extrudado com cantos arredondados, grip, parafusos nos trilhos, lâminas com dentes reais (`buildClipper`).
- Botão ToTop agora usa .btn-top (vidro dourado/marrom). Carrossel: velocidade base 2.4, hover desacelera para 0.35 com transição suave (Carousel em App.jsx).
