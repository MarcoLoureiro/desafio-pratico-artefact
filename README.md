## 1. ReactJS e NextJS: Renderização e Estratégias
<h3> a) Explique, com suas próprias palavras, as diferenças entre:
○ Client-Side Rendering (CSR)
○ Server-Side Rendering (SSR)
○ Static Site Generation (SSG) </h3>

- No CSR a renderização ocorre principalmente no navegador, com o servidor entregando somente um html com o mínimo de conteúdo, encarregando o javascript demontar a interface e carregar os demais conteúdos necessários. Portanto no primeiro carregamento costuma ser mais lento.<br>

- No SSR a renderização funciona a base de requisições feitas pelo usuário, ou seja, o servidor entrega um html já gerado com os dados da requisição. Esse html é tratado pelo React para que a página se torne iterativa. Portanto o carregamento inicial é mais rápido do que o CSR.<br>

- NO SSG a renderização ocorre antecipadamente, sendo o html gerado na etapa de build do projeto e este mesmo arquivo reutilizado nas requisições (não atualiza mediante a requisições de usuário)

<h3>b) Em que cenários cada uma dessas abordagens pode ser vantajosa ou
problemática? Dê exemplos práticos.</h3>

CSR é vantajoso quando a aplicação possui muita interação depois do carregamento inicial e não depende tanto de SEO.

Exemplo de cenário vantajoso: 
- Um dashboard financeiro no qual o usuário altera filtros, períodos e gráficos. Depois que a página carrega, o React pode atualizar somente as partes necessárias sem recarregar tudo

Exemplo de cenário desvantajoso:
- Um site de notícias que receberia uma página vazia e só depois faria o carregamento por meio do javascript para exibição de notícias.


O SSR é vantajoso quando os dados mudam frequentemente e o conteúdo precisa chegar atualizado e preenchido no primeiro acesso.

Exemplo de cenário vantajoso: 
- Um e-commerce que precisa exibir a página com produtos disponíveis e com preços atualizados sempre que for acessada pelo usuário.

Exemplo de cenário desvantajoso:
- Atualizar uma página de gráficos que exija realizar consultas pesadas pode deixar o tempo de resposta da página lenta e sobrecarregar o servidor.

O SSG é vantajoso quando o conteúdo muda pouco e pode ser preparado antecipadamente.

Exemplo de cenário vantajoso: 
- Uma página institucional contendo informações, uma vez que o conteúdo não precisa ser atualizado constantemente

Exemplo de cenário desvantajoso:
- Um catálogo de cinema que exigiria atualização constante de filmes que estão em cartaz

## 2. Backend: Conceitos e Approaches

<h3> a) Quais são as principais maneiras de implementar um backend para uma
aplicação web?</h3>

- Backend integrado à aplicação como é o caso desse desafio que contém backend e frontend;<br>
- Backend separado que geralmente é desenvolvido como uma aplicação independente e disponibiliza uma API para consumo;<br>
- Backend as a Service (BaaS) cuja aplicação utiliza uma plataforma que já fornece funcionalidades de backend, como banco de dados, autenticação, APIs e etc (Firebase);<br>
- Serveless que divide o backend em funções que são executadas somente quando há requisições (AWS Lambda).<br>

<h3>b) Conhece a lib tRPC? Se sim, quais são as principais vantagens e desvantagens
de utilizar tRPC, especialmente em termos de segurança, tipagem e escalabilidade?</h3>

Sim. O tRPC permite que você construa e consuma APIs totalmente seguras sem esquemas ou geração de código. Combina conceitos de REST e GraphQL.
Em projetos TypeScript full-stack, manter os contratos de API sincronizados entre o cliente e o servidor é um problema comum. O tRPC faz isso aproveitando a inferência de tipos do TypeScript diretamente, sem nenhuma etapa de geração de código, e detecta problemas no momento da compilação.

Vantagem:
- Segurança de tipos estática completa e preenchimento automático no cliente, para entradas, saídas e erros<br>
- Sem geração de código, inchaço em tempo de execução ou pipeline de construção

Desvantagens:
- Maior acomplamento de backend e frontend.
- Em um cenário onde backend e frontend estão separados, estaria mais sucetível a haver problemas de integração.

## Pré-requisitos
Node na versão v22.23.3 (recomendada)

## Instruções de uso

```bash
npm ci
# or
npm install
# and
npm run dev
```

Em seguida abra a aplicação em [http://localhost:3000]

# Justificativas para decisões:

- Usei app router por ser a estrutura atual do NextJs que facilita separação de componentes e servidores
- Separei o backend em schema, input, repository e router para cada parte para isolar cada uma das responsabilidades
- Usei Zod para validar os dados na entrada e impedir tarefas sem título (conforme solicitado no desafio)
- Depois de criar, editar ou excluir, faço uma nova listagem para garantir que a interface mostre o estado atual do backend (para evitar que usuário tenha que fazer um refresh manual)
- Usei Tailwind CSS porque ele já fazia parte do projeto e me dava recursos bem parecidos com os quais já estava habituado no Bootstrap