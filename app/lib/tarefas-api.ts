export type TarefaDaLista = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: string;
};

export type FeedbackTarefa = {
  tipo: "sucesso" | "erro" | "aviso";
  mensagem: string;
};

export function mensagemDeFalha(erro: unknown, mensagemPadrao: string): string {
  if (erro instanceof TypeError) {
    return "Não foi possível conectar ao servidor. Tente novamente.";
  }

  return erro instanceof Error && erro.message.trim()
    ? erro.message
    : mensagemPadrao;
}

export function extrairMensagemDeErro(
  payload: unknown,
  mensagemPadrao: string
): string {
  const mensagem = (
    payload as { error?: { json?: { message?: unknown } } } | null
  )?.error?.json?.message;

  return typeof mensagem === "string" ? mensagem : mensagemPadrao;
}

function ehTarefaDaLista(valor: unknown): valor is TarefaDaLista {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  const tarefa = valor as Partial<TarefaDaLista>;

  return (
    typeof tarefa.id === "string" &&
    typeof tarefa.titulo === "string" &&
    (tarefa.descricao === undefined || typeof tarefa.descricao === "string") &&
    typeof tarefa.dataCriacao === "string"
  );
}

export async function solicitarListagem(): Promise<TarefaDaLista[]> {
  const resposta = await fetch("/api/trpc/tarefa.listar", {
    method: "GET",
    cache: "no-store"
  });
  const payload = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(
      extrairMensagemDeErro(payload, "Não foi possível atualizar as tarefas.")
    );
  }

  const tarefas = (
    payload as { result?: { data?: { json?: unknown } } } | null
  )?.result?.data?.json;

  if (!Array.isArray(tarefas) || !tarefas.every(ehTarefaDaLista)) {
    throw new Error("A resposta da listagem de tarefas é inválida.");
  }

  return tarefas;
}
