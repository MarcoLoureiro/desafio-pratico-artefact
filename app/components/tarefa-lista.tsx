"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  extrairMensagemDeErro,
  mensagemDeFalha,
  solicitarPaginaDeTarefas,
  type FeedbackTarefa,
  type PaginaDeTarefas,
  type TarefaDaLista
} from "../lib/tarefas-api";

type TarefaListaProps = {
  paginaInicial: PaginaDeTarefas;
  feedbackInicial?: FeedbackTarefa;
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
  paginaInicial,
  feedbackInicial
}: TarefaListaProps) {
  const [tarefas, setTarefas] = useState(paginaInicial.itens);
  const [proximoCursor, setProximoCursor] = useState(
    paginaInicial.proximoCursor
  );
  const [total, setTotal] = useState(paginaInicial.total);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [falhaAoCarregarMais, setFalhaAoCarregarMais] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackTarefa | null>(
    feedbackInicial ?? null
  );
  const sentinelaRef = useRef<HTMLDivElement | null>(null);
  const carregamentoEmAndamentoRef = useRef(false);

  useEffect(() => {
    if (feedbackInicial) {
      window.history.replaceState(null, "", "/");
    }
  }, [feedbackInicial]);

  const carregarMais = useCallback(async () => {
    if (!proximoCursor || carregamentoEmAndamentoRef.current) {
      return;
    }

    carregamentoEmAndamentoRef.current = true;
    setCarregandoMais(true);
    setFalhaAoCarregarMais(false);

    try {
      const pagina = await solicitarPaginaDeTarefas(proximoCursor);

      setTarefas((tarefasAtuais) => {
        const idsCarregados = new Set(tarefasAtuais.map((tarefa) => tarefa.id));
        const novosItens = pagina.itens.filter(
          (tarefa) => !idsCarregados.has(tarefa.id)
        );

        return [...tarefasAtuais, ...novosItens];
      });
      setProximoCursor(pagina.proximoCursor);
      setTotal(pagina.total);
    } catch (erro) {
      setFalhaAoCarregarMais(true);
      setFeedback({
        tipo: "erro",
        mensagem: mensagemDeFalha(
          erro,
          "Não foi possível carregar mais tarefas."
        )
      });
    } finally {
      carregamentoEmAndamentoRef.current = false;
      setCarregandoMais(false);
    }
  }, [proximoCursor]);

  useEffect(() => {
    const sentinela = sentinelaRef.current;

    if (!sentinela || !proximoCursor || falhaAoCarregarMais) {
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          void carregarMais();
        }
      },
      { rootMargin: "200px" }
    );

    observador.observe(sentinela);

    return () => observador.disconnect();
  }, [carregarMais, falhaAoCarregarMais, proximoCursor]);

  async function atualizarLista() {
    setAtualizando(true);
    setFeedback(null);

    try {
      const pagina = await solicitarPaginaDeTarefas();
      setTarefas(pagina.itens);
      setProximoCursor(pagina.proximoCursor);
      setTotal(pagina.total);
      setFalhaAoCarregarMais(false);
      setFeedback({
        tipo: "sucesso",
        mensagem: "Lista de tarefas atualizada."
      });
    } catch (erro) {
      setFeedback({
        tipo: "erro",
        mensagem: mensagemDeFalha(
          erro,
          "Não foi possível atualizar as tarefas."
        )
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
        const pagina = await solicitarPaginaDeTarefas();
        setTarefas(pagina.itens);
        setProximoCursor(pagina.proximoCursor);
        setTotal(pagina.total);
        setFalhaAoCarregarMais(false);
        setFeedback({
          tipo: "sucesso",
          mensagem: `A tarefa “${tarefa.titulo}” foi excluída.`
        });
      } catch {
        setTarefas((tarefasAtuais) =>
          tarefasAtuais.filter((item) => item.id !== tarefa.id)
        );
        setProximoCursor(null);
        setTotal((totalAtual) => Math.max(0, totalAtual - 1));
        setFeedback({
          tipo: "erro",
          mensagem:
            "A tarefa foi excluída, mas não foi possível atualizar a lista."
        });
      }
    } catch (erro) {
      setFeedback({
        tipo: "erro",
        mensagem: mensagemDeFalha(
          erro,
          "Não foi possível excluir a tarefa."
        )
      });
    } finally {
      setIdEmExclusao(null);
    }
  }

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      aria-busy={atualizando || carregandoMais || idEmExclusao !== null}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Lista de tarefas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {total === 1
              ? "1 tarefa cadastrada"
              : `${total} tarefas cadastradas`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={atualizarLista}
            disabled={atualizando || idEmExclusao !== null}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className={`size-4 ${atualizando ? "animate-spin" : ""}`}
              aria-hidden="true"
            >
              <path d="M20 11a8 8 0 1 0-2.34 5.66M20 5v6h-6" />
            </svg>
            {atualizando ? "Atualizando..." : "Atualizar"}
          </button>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            {total}
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`mt-5 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${
            feedback.tipo === "sucesso"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : feedback.tipo === "aviso"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-red-200 bg-red-50 text-red-800"
          }`}
          role={feedback.tipo === "erro" ? "alert" : "status"}
          aria-live="polite"
        >
          <span>{feedback.mensagem}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="shrink-0 rounded font-semibold opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="Fechar mensagem"
          >
            ×
          </button>
        </div>
      )}

      {total === 0 ? (
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
        <>
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
                      Criada em{" "}
                      {formatadorData.format(new Date(tarefa.dataCriacao))}
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

          {proximoCursor ? (
            falhaAoCarregarMais ? (
              <div className="flex justify-center pt-6">
                <button
                  type="button"
                  onClick={() => void carregarMais()}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                >
                  Tentar carregar novamente
                </button>
              </div>
            ) : (
              <div
                ref={sentinelaRef}
                className="flex min-h-16 items-center justify-center pt-5 text-sm text-slate-500"
                role="status"
                aria-live="polite"
              >
                {carregandoMais ? "Carregando mais tarefas..." : ""}
              </div>
            )
          ) : (
            <p className="pt-6 text-center text-sm text-slate-500">
              Todas as tarefas foram carregadas.
            </p>
          )}
        </>
      )}
    </section>
  );
}
