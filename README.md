# Projeto WebGL

Este projeto é um exemplo de como usar WebGL para desenhar e transformar formas geométricas em um canvas HTML. O código permite aplicar transformações como translação, rotação, escala e espelhamento em um conjunto de triângulos desenhados no canvas.

## Funcionalidades

- Desenho de formas geométricas usando WebGL.
- Aplicação de transformações geométricas (translação, rotação, escala e espelhamento).
- Controle das transformações via teclado.

## Controles do Teclado

- `t`: Modo de translação.
- `r`: Modo de rotação.
- `s`: Modo de escala.
- `m`: Espelhar a forma.
- `i`: Resetar transformações.
- `ArrowUp`: Transladar para cima, rotacionar no sentido horário ou aumentar a escala.
- `ArrowDown`: Transladar para baixo, rotacionar no sentido anti-horário ou diminuir a escala.
- `ArrowLeft`: Transladar para a esquerda.
- `ArrowRight`: Transladar para a direita.

## Como Rodar

1. Certifique-se de ter o Node.js e o npm instalados em sua máquina.
2. Clone este repositório:
   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
3. Navegue até o diretório do projeto:
   ```sh
   cd seu-repositorio
   ```
4. Instale as dependências:
   ```sh
   npm install
   ```
5. Abra o arquivo `polygon.html` em um navegador que suporte WebGL.

## Estrutura do Projeto

- `script.js`: Contém o código JavaScript para inicializar o WebGL, criar shaders, aplicar transformações e desenhar as formas geométricas.
- `index.html`: Contém o HTML básico com um canvas para renderizar as formas.

## Dependências

- Nenhuma dependência externa é necessária para rodar este projeto.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
