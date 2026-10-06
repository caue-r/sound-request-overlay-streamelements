# sound-request-overlay-streamelements

Overlay para OBS que mostra automaticamente a música tocando no **Media Request** do StreamElements: capa do YouTube, título, canal, quem pediu, próxima da fila e uma barra de progresso.

Usa a API pública do StreamElements (`/kappa/v2/songrequest/{canal}/playing`), então **não precisa de token, servidor nem login**. São só arquivos HTML estáticos.

## Uso rápido

1. Abra o `index.html` no navegador, digite o nome do seu canal no StreamElements e ajuste as opções.
2. Copie a URL gerada.
3. No OBS, adicione uma fonte **Navegador**, **desmarque "Arquivo local"**, cole a URL e use 1920×1080.

Ou monte a URL na mão:

```
file:///C:/caminho/para/overlay.html?channel=SEU_CANAL
```

Se o repositório estiver no GitHub Pages, a URL fica `https://<usuario>.github.io/sound-request-overlay-streamelements/overlay.html?channel=SEU_CANAL`.

## Parâmetros

| Parâmetro   | Padrão          | Descrição                                                          |
|-------------|-----------------|--------------------------------------------------------------------|
| `channel`   | (obrigatório)   | Nome do canal no StreamElements ou o ID (24 caracteres hex)        |
| `theme`     | `classic`       | Estilo do card (veja abaixo)                                       |
| `position`  | `bottom-left`   | `bottom-left`, `bottom-right`, `top-left`, `top-right`             |
| `accent`    | `8b5cf6`        | Cor de destaque (hex sem `#`)                                      |
| `width`     | `460`           | Largura do card em px                                              |
| `label`     | `Tocando agora` | Texto acima do título                                              |
| `showFor`   | `0`             | Segundos que o card fica visível ao trocar de música (0 = sempre)  |
| `requester` | `1`             | `0` esconde quem pediu                                             |
| `next`      | `1`             | `0` esconde a próxima música                                       |
| `progress`  | `1`             | `0` esconde a barra de progresso                                   |
| `interval`  | `5`             | Intervalo de consulta à API, em segundos (mínimo 2)                |
| `demo`      | –               | `demo=1` mostra uma música fictícia para testar o visual           |

## Estilos

| `theme`   | Visual                                                              |
|-----------|---------------------------------------------------------------------|
| `classic` | Card escuro com borda colorida, miniatura e barra de progresso      |
| `minimal` | Só texto com sombra, sem fundo nem capa                              |
| `ambient` | A capa desfocada vira o fundo do card                                |
| `vinyl`   | Capa recortada como um disco de vinil girando                        |
| `pill`    | Compacto, numa linha só: capa redonda, título e quem pediu           |
| `cover`   | Vertical, com a capa grande em cima (máx. 320px de largura)          |

## Observações

- O card some sozinho quando não há música tocando.
- A API pública não informa a posição do player nem se ele está pausado. Por isso a barra de progresso é **estimada** a partir do momento em que o overlay viu a música começar. Se ficar fora de sincronia, desligue com `progress=0`.
- O visual pode ser ajustado nas variáveis CSS no topo do `overlay.css`.
