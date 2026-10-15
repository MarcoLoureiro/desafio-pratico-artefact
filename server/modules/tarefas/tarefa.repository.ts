import { randomUUID } from "node:crypto";

import type { CriarTarefaInput } from "./tarefa.input";
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
