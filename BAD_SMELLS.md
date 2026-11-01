# Análise de Bad Smells — `src/ReportGenerator.js`

Após analisar o método `generateReport`, foi possível identificar alguns problemas na organização do código que podem dificultar sua leitura, manutenção e futuras alterações. A seguir, estão os principais Bad Smells encontrados e algumas sugestões de como poderiam ser corrigidos.

## 1. Método Longo (Long Method)

- **Onde:** método `generateReport` (linhas 11–68).
- **Problema:** o método possui muitas responsabilidades diferentes. Ele é responsável por montar o cabeçalho, verificar quais informações cada perfil de usuário pode visualizar, formatar os dados e calcular o total do relatório. Como tudo isso está concentrado em um único método, o código acaba ficando mais difícil de entender e manter.
- **Possível refatoração:** dividir o método em funções menores, cada uma responsável por uma parte do relatório, como a geração do cabeçalho, do conteúdo e do rodapé.

## 2. Condicionais Complexas (Complex Conditionals)

- **Onde:** linhas 16–24, 28–54 e 58–65.
- **Problema:** existem várias verificações de `if/else` dentro do método, principalmente para diferenciar os formatos CSV e HTML e os perfis ADMIN e USER. Algumas dessas condições ficam aninhadas, tornando a leitura mais complicada. Além disso, se futuramente for necessário adicionar outro formato de relatório ou um novo perfil de usuário, será preciso alterar diferentes partes do código.
- **Possível refatoração:** separar as regras de cada formato em classes ou métodos próprios, utilizando uma abordagem como Strategy ou polimorfismo. Também seria interessante simplificar algumas condições para facilitar a leitura.

## 3. Números Mágicos (Magic Numbers)

- **Onde:** linha 30 (`item.value > 1000`) e linha 45 (`item.value <= 500`).
- **Problema:** os valores `1000` e `500` são utilizados diretamente nas condições, sem deixar claro o que representam. Pelo contexto, eles parecem estar relacionados a regras de negócio, como limites de prioridade e de visualização para determinados usuários. Isso pode gerar confusão para quem precisar entender ou alterar essas regras futuramente.
- **Possível refatoração:** criar constantes com nomes que expliquem o significado desses valores. Por exemplo:

```js
const PRIORITY_THRESHOLD = 1000;
const USER_MAX_VISIBLE_VALUE = 500;
```

Dessa forma, fica mais fácil entender o objetivo de cada condição. O mesmo poderia ser feito com algumas strings utilizadas no código, como `CSV`, `HTML`, `ADMIN` e `USER`.

## 4. Código Duplicado (Duplicated Code)

- **Onde:** linhas 35–42 e 46–52.
- **Problema:** existem trechos que realizam praticamente a mesma tarefa em diferentes partes do método. A montagem das linhas CSV aparece repetida, assim como a estrutura utilizada para gerar as linhas HTML. Também há repetição do cálculo do total em diferentes condições. Isso aumenta o tamanho do código e pode dificultar futuras alterações, já que seria necessário modificar mais de um trecho para realizar a mesma mudança.
- **Possível refatoração:** criar métodos específicos para formatar as linhas CSV e HTML, evitando repetir a mesma lógica. Outra possibilidade seria filtrar primeiro os itens que cada usuário pode visualizar e, depois, realizar a formatação e o cálculo do total em um único lugar.

## 5. Outros pontos observados

Além dos Bad Smells anteriores, também foram encontrados alguns detalhes que merecem atenção:

- **Alteração dos dados recebidos:** na linha 32, o código utiliza `item.priority = true`, modificando diretamente um objeto recebido como parâmetro. Isso pode causar problemas em outras partes do sistema que utilizam esse mesmo objeto.
- **Dependência não utilizada:** o construtor recebe uma variável chamada `database` e armazena seu valor em `this.db`, mas essa dependência não é utilizada em nenhum outro ponto da classe. Caso não exista uma necessidade futura, ela poderia ser removida.
- **Falta de tratamento para valores inesperados:** se o formato do relatório ou o perfil do usuário receber um valor diferente dos esperados, o método pode gerar um resultado vazio ou incompleto, sem informar claramente que ocorreu algum problema.

## Resumo

| # | Bad Smell | Localização | Refatoração sugerida |
|---|---|---|---|
| 1 | Método Longo | `generateReport` (linhas 11–68) | Extract Method |
| 2 | Condicionais Complexas | Linhas 16–65 | Strategy, polimorfismo e simplificação das condições |
| 3 | Números Mágicos | Linhas 30 e 45 | Criar constantes nomeadas |
| 4 | Código Duplicado | Linhas 35–52 | Extrair métodos e reutilizar trechos de código |
| 5 | Alteração de parâmetros e dependência não utilizada | Linhas 3 e 32 | Evitar alterações nos objetos recebidos e remover dependências desnecessárias |

De modo geral, o principal problema encontrado no código é a concentração de muitas responsabilidades dentro do método `generateReport`. A separação dessas tarefas e a redução das repetições deixariam a implementação mais organizada, facilitando tanto a compreensão quanto a manutenção do sistema.