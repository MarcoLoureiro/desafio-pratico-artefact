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