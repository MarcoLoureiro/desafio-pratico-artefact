import { randomUUID } from "node:crypto";

import type {
  AtualizarTarefaInput,
  CriarTarefaInput,
  DeletarTarefaInput,
  ListarTarefasPaginadasInput
} from "./tarefa.input";
import { tarefaSchema, type Tarefa } from "./tarefa.schema";

type ArmazenamentoGlobal = typeof globalThis & {
  tarefasDoDesafioArtefact?: Tarefa[];
};

const armazenamentoGlobal = globalThis as ArmazenamentoGlobal;
const tarefas = (armazenamentoGlobal.tarefasDoDesafioArtefact ??= []);

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

export function listarTarefasPaginadas({
  cursor,
  limite
}: ListarTarefasPaginadasInput) {
  const tarefasOrdenadas = [...tarefas].sort(
    (tarefaA, tarefaB) =>
      tarefaB.dataCriacao.getTime() - tarefaA.dataCriacao.getTime()
  );
  const indiceDoCursor = cursor
    ? tarefasOrdenadas.findIndex((tarefa) => tarefa.id === cursor)
    : -1;
  const indiceInicial = indiceDoCursor >= 0 ? indiceDoCursor + 1 : 0;
  const tarefasDaPagina = tarefasOrdenadas.slice(
    indiceInicial,
    indiceInicial + limite + 1
  );
  const temProximaPagina = tarefasDaPagina.length > limite;
  const itens = tarefasDaPagina.slice(0, limite);

  return {
    itens: structuredClone(itens),
    proximoCursor: temProximaPagina ? itens.at(-1)?.id ?? null : null,
    total: tarefasOrdenadas.length
  };
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
