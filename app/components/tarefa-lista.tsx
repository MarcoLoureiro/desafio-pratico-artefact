"use client";

import Link from "next/link";
import { useState } from "react";

import {
  extrairMensagemDeErro,
  solicitarListagem,
  type TarefaDaLista
} from "../lib/tarefas-api";

type Feedback =
  | { tipo: "sucesso"; mensagem: string }
  | { tipo: "erro"; mensagem: string };

type TarefaListaProps = {
  tarefasIniciais: TarefaDaLista[];
};

const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo"
});

async function solicitarExclusao(id: string): Promise<void> {
  const resposta = await fetch("/api/trpc/tarefa.deletar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ json: { id } })
  });

  if (!resposta.ok) {
    const payload = await resposta.json().catch(() => null);
    throw new Error(
      extrairMensagemDeErro(payload, "Não foi possível excluir a tarefa.")
    );
  }
}

export default function TarefaLista({
  tarefasIniciais
}: TarefaListaProps) {
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function atualizarLista() {
    setAtualizando(true);
    setFeedback(null);

    try {
      const tarefasAtualizadas = await solicitarListagem();
      setTarefas(tarefasAtualizadas);
      setFeedback({
        tipo: "sucesso",
        mensagem: "Lista de tarefas atualizada."
      });
    } catch (erro) {
      setFeedback({
        tipo: "erro",
        mensagem:
          erro instanceof Error
            ? erro.message
            : "Não foi possível atualizar as tarefas."
      });
    } finally {
      setAtualizando(false);
    }
  }

  async function excluirTarefa(tarefa: TarefaDaLista) {
    setIdEmExclusao(tarefa.id);
    setFeedback(null);

    try {
      await solicitarExclusao(tarefa.id);
      try {
        const tarefasAtualizadas = await solicitarListagem();
        setTarefas(tarefasAtualizadas);
        setFeedback({
          tipo: "sucesso",
          mensagem: `A tarefa “${tarefa.titulo}” foi excluída.`
        });
      } catch {
        setTarefas((tarefasAtuais) =>
          tarefasAtuais.filter((item) => item.id !== tarefa.id)
        );
        setFeedback({
          tipo: "erro",
          mensagem:
            "A tarefa foi excluída, mas não foi possível atualizar a lista."
        });
      }
    } catch (erro) {
      setFeedback({
        tipo: "erro",
        mensagem:
          erro instanceof Error
            ? erro.message
            : "Não foi possível excluir a tarefa."
      });
    } finally {
      setIdEmExclusao(null);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Lista de tarefas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {tarefas.length === 1
              ? "1 tarefa cadastrada"
              : `${tarefas.length} tarefas cadastradas`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            {tarefas.length}
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${feedback.tipo === "sucesso"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-800"
            }`}
          role={feedback.tipo === "erro" ? "alert" : "status"}
        >
          {feedback.mensagem}
        </div>
      )}

      {tarefas.length === 0 ? (
        <div className="py-16 text-center">
          <div
            className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-6"
            >
              <path d="M9 11.5 11 13.5 15.5 9" />
              <path d="M6.5 3.75h11A2.75 2.75 0 0 1 20.25 6.5v11a2.75 2.75 0 0 1-2.75 2.75h-11a2.75 2.75 0 0 1-2.75-2.75v-11A2.75 2.75 0 0 1 6.5 3.75Z" />
            </svg>
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">
            Nenhuma tarefa cadastrada
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            As tarefas criadas aparecerão aqui.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {tarefas.map((tarefa) => {
            const excluindo = idEmExclusao === tarefa.id;

            return (
              <li
                key={tarefa.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    {tarefa.titulo}
                  </h3>
                  {tarefa.descricao && (
                    <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                      {tarefa.descricao}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    Criada em {formatadorData.format(new Date(tarefa.dataCriacao))}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/tarefas/${encodeURIComponent(tarefa.id)}/editar`}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 sm:flex-none"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => excluirTarefa(tarefa)}
                    disabled={atualizando || idEmExclusao !== null}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    aria-label={`Excluir a tarefa ${tarefa.titulo}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="size-4"
                      aria-hidden="true"
                    >
                      <path d="M4 7h16M9 7V4.75h6V7m-8.25 0 .75 12.25h9L17.25 7M10 10.5v5.5m4-5.5v5.5" />
                    </svg>
                    {excluindo ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
