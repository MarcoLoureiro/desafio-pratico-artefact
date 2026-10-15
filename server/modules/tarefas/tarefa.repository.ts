import { randomUUID } from "node:crypto";

import type {
  AtualizarTarefaInput,
  CriarTarefaInput,
  DeletarTarefaInput
} from "./tarefa.input";
import { tarefaSchema, type Tarefa } from "./tarefa.schema";

const tarefas: Tarefa[] = [];

export function criarTarefa(input: CriarTarefaInput): Tarefa {

  const tarefa = tarefaSchema.parse({
    id: randomUUID(),
    ...input,
    dataCriacao: new Date()
  });

  tarefas.push(tarefa);

  return tarefa;
}

export function listarTarefas(): Tarefa[] {
  return structuredClone(tarefas);
}

export function atualizarTarefa(input: AtualizarTarefaInput): Tarefa | undefined {

  const indice = tarefas.findIndex((tarefa) => tarefa.id === input.id);

  if (indice === -1) {
    return undefined;
  }

  const tarefaAtualizada = tarefaSchema.parse({
    ...tarefas[indice],
    ...(input.titulo !== undefined ? { titulo: input.titulo } : {}),
    ...(input.descricao !== undefined ? { descricao: input.descricao } : {})
  });

  tarefas[indice] = tarefaAtualizada;

  return structuredClone(tarefaAtualizada);
}

export function deletarTarefa(input: DeletarTarefaInput): Tarefa | undefined {

  const indice = tarefas.findIndex((tarefa) => tarefa.id === input.id);

  if (indice === -1) {
    return undefined;
  }

  const [tarefaRemovida] = tarefas.splice(indice, 1);

  return structuredClone(tarefaRemovida);
}
