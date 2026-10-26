# 001 · Landing Page Izaías Machado — Changelog + Guia de Manutenção

## Changelog
- **001 (22/10/2026)** — Criação inicial: Vite + React 18 + Tailwind v4, GSAP/ScrollTrigger, Lenis, Framer Motion, Three.js, Anime.js, Button estilo shadcn (cva). 6 seções + navbar + footer com copyright.

## Rodar
`npm install` → `npm run dev` · build: `npm run build` (pasta `dist/`, deploy na Vercel).

## Mapa de pastas
| Caminho | O que faz |
|---|---|
| `src/lib/content.js` | **Todos os textos, números, links do WhatsApp, itens de menu, créditos e ano do copyright** |
| `src/App.jsx` | Estrutura das seções, loader (Anime.js), navbar (Framer), Lenis, troca de cor do "chão" |
| `src/components/Clipper3D.jsx` | Máquina de barbear + tesoura em Three.js, poses por seção |
| `src/components/ui/button.jsx` | Botões (variantes `copper`, `steel`, `ghost`) |
| `src/index.css` | Paleta (`@theme`), classes `.glass`, `.glass-dark`, `.skeu`, `.plate`, `.gold-text` |
| `public/img0.jpg` | Foto do Izaías (seção Sobre) · `img1.jpg`/`img2.jpg` = resultados |

## Onde editar cada coisa
- **Textos / emojis**: `content.js` (não há emojis no layout; adicione na string desejada).
- **WhatsApp**: constante `WA` no topo de `content.js` (formato `55` + DDD + número). Mensagens: objeto `LINKS`.
- **Fotos**: troque os arquivos em `public/` mantendo o nome, ou altere os caminhos em `content.js` (`RESULTS`) / `App.jsx` (`/img0.jpg`).
- **Novo resultado**: adicione uma linha em `RESULTS` (`[caminho, título, legenda]`).
- **Cores**: `@theme` em `index.css` (cobre `#B86F4B`, areia `#E9E0D5`, obsidian `#171717`, marrom `#38312D`, taupe `#77665B`, dourado `#C9A36A`). Cor do fundo por seção: prop `bg` em `<Sec>` no `App.jsx`.
- **Posição da máquina por seção**: array `POSES` em `Clipper3D.jsx` → `[x, y, rotZ, rotY, escala]`; ordem = `SECTION_IDS`.
- **Material/forma da máquina**: `buildClipper()`; materiais `chrome`, `black`, `copper` no topo.
- **Velocidade do scroll**: `lerp` do Lenis em `App.jsx`.
- **Copyright/rodapé**: `FOOTER` em `content.js` (`credit` = crédito do dev, opcional).
- **SEO / título / fontes**: `index.html`.
- **APIs / tokens**: não há. Único link externo é o WhatsApp e Google Fonts.

## Pendências sugeridas
Vídeo/GLB real da máquina (substituir `buildClipper` por `GLTFLoader`), Instagram/mapa, depoimentos, confirmação de autorização de uso das fotos de clientes, code-splitting do Three.js.
