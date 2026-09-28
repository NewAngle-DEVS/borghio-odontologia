# Borghi Odontologia: site institucional

Site de página única, estático, em React + TypeScript + Vite + Tailwind CSS v4, com cena 3D procedural (Three.js via React Three Fiber) e sequência controlada pelo scroll (GSAP ScrollTrigger).

## Conceito: "Anatomia do cuidado"

A clínica é apresentada como a construção de um dente, peça por peça.

| Cor | Hex | Função |
| --- | --- | --- |
| Porcelana | `#F3F0EA` | Fundo principal (esmalte/cerâmica) |
| Papel | `#FBFAF7` | Superfícies de leitura |
| Marinho Borghi | `#14234B` / `#0F1A38` | Marca, texto, seção do hiperboloide e rodapé |
| Cobalto | `#3C5CC4` | Ações, foco, marcadores |
| Titânio | `#8C95A3` | Detalhes técnicos |
| Gengiva | `#E3BFAE` | Acento mínimo (cintura do hiperboloide) |

Tipografia: **Instrument Serif** (títulos editoriais, itálicos pontuais) + **Manrope** (interface e leitura).

### Sequência principal (desktop ≥ 1024 px, sem movimento reduzido)
Seção `#inicio` com 430vh e palco `position: sticky` (sem captura da roda do mouse):
1. **Apresentação (0–18%)**: título "Cuidando do / sorriso / da sua família." e implante montado à direita, girando devagar e reagindo discretamente ao cursor.
2. **Exploração (18–66%)**: o título sai, a peça vai ao centro e se separa em coroa, pilar e implante (que "desrosqueia"). Rótulos HTML ficam ancorados a cada peça por projeção 3D→tela.
3. **Transição (66–100%)**: as peças se remontam, o objeto desliza para a esquerda e o texto de especialidades entra à direita, levando a `#especialidades`.

O GSAP controla apenas os elementos HTML e um número de progresso. O React Three Fiber controla exclusivamente os objetos 3D, então nenhuma propriedade é disputada por duas bibliotecas.

**Mobile / tablet / movimento reduzido:** layout linear sem fixação. O 3D fica na primeira dobra com qualidade reduzida (DPR ≤ 1,4, menos segmentos) e se separa parcialmente enquanto a primeira dobra sai da tela. As três peças viram uma lista vertical. Com `prefers-reduced-motion`, a cena fica estática (`frameloop="demand"`) e nenhum conteúdo depende de animação.

**Fallback:** sem WebGL, ou se a cena falhar (ErrorBoundary), entra uma ilustração esquemática em SVG, identificada como tal.

A renderização pausa (`frameloop="never"`) quando o palco sai da tela.

## Estrutura

```
src/
  content/site.ts          ← TODO o conteúdo editável (contatos, especialidades, FAQ)
  hooks/useEnv.ts          ← media queries, reduced motion, WebGL, reveal, in-view
  three/ImplantScene.tsx   ← cena 3D procedural (carregada via React.lazy)
  components/              ← Header, ImplantSequence, Specialties, Family,
                             Hyperboloid, Process, Faq, Contact, Footer, ui
public/
  images/                  ← imagens ILUSTRATIVAS geradas (não retratam a clínica)
  404.html, robots.txt, sitemap.xml, _headers, favicon.svg
```

## Desenvolvimento e build

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
npm run preview  # testa o build
```

## Publicação: GitHub → Cloudflare Pages → domínio

1. Envie o repositório ao GitHub.
2. No Cloudflare Pages: *Create project → Connect to Git*.
   - Framework preset: **None** (ou Vite)
   - Build command: `npm run build`
   - Output directory: `dist`
   - Variável: `NODE_VERSION=20` (ou superior)
3. *Custom domains → Set up a domain* → `www.borghiodontologia.com.br` (e o domínio sem www, com redirecionamento). O HTTPS é emitido automaticamente pela Cloudflare depois que o DNS estiver apontado.
4. O `404.html` em `dist/` é servido automaticamente pelo Pages para rotas inexistentes.
5. Analytics futuro: o Cloudflare Web Analytics pode ser ativado no painel sem alterar o código, e é gratuito.

> **Observação sobre o bundle:** o `vite.config.ts` deste ambiente usa `vite-plugin-singlefile`, que coloca todo o JS dentro do `index.html` e anula a divisão de código do `React.lazy` (o Three.js acaba no bundle inicial). Para produção no Cloudflare Pages, recomenda-se **remover `viteSingleFile()`** do `vite.config.ts`. Assim a cena 3D vira um chunk separado, carregado sob demanda, e o texto e os CTAs aparecem ainda mais cedo.

### URLs e redirecionamentos
O domínio antigo (`borghiodontologia.com.br`, deduzido do endereço da página do Facebook) não respondeu durante a análise, então não foi possível levantar URLs antigas. Se existirem páginas antigas indexadas, crie `public/_redirects`, por exemplo:

```
/especialidades   /#especialidades   301
/contato          /#contato          301
```

A URL canônica usada em `index.html`, `robots.txt` e `sitemap.xml` é `https://www.borghiodontologia.com.br/`. **Confirme o domínio antes de publicar.**

## Pendências reais de conteúdo

- **Fontes bloqueadas:** Instagram, Facebook e o domínio antigo não permitiram leitura automatizada. O conteúdo veio das capturas de tela do perfil e do Linktree.
- **Logotipo oficial:** o site usa um logotipo tipográfico provisório ("Borghi Odontologia"). Envie o arquivo vetorial (SVG/PDF) do logo com o dente.
- **Endereço completo, cidade e horários:** não verificados. Hoje o site só aponta para o link do Google Maps do Linktree. Com o endereço, dá para acrescentar o mapa incorporado e `address`/`openingHours` no JSON-LD.
- **Equipe:** nomes, especialidades e CRO dos profissionais (três pessoas aparecem na foto de perfil) não estavam acessíveis. Não foi criada seção de equipe para não inventar dados.
- **Lista completa de especialidades:** a bio do Instagram vem truncada depois de "Ortopedia Funcional dos Maxilares…". O site mostra as três confirmadas e um item "Outras especialidades" que leva ao WhatsApp.
- **Fotos reais:** consultório, equipe e bastidores substituiriam as imagens ilustrativas geradas por IA (todas identificadas no site como ilustrativas).
- **Responsável técnico / CRO:** recomendado no rodapé, conforme as normas do CFO para publicidade odontológica.
- **Formulário:** não há backend. O "Monte sua mensagem" apenas abre o WhatsApp com o texto pronto, sem simular envio.
