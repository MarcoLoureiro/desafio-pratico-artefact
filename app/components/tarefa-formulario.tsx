"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { mensagemDeFalha, solicitarListagem } from "../lib/tarefas-api";

type TarefaInicial = {
  id: string;
  titulo: string;
  descricao?: string;
};

type TarefaFormularioProps = {
  tarefa?: TarefaInicial;
};

type Feedback = {
  tipo: "sucesso" | "erro";
  mensagem: string;
};

function extrairMensagemDeErro(payload: unknown): string {
  const erro = (
    payload as {
      error?: {
        json?: {
          message?: unknown;
          data?: {
            zodError?: {
              fieldErrors?: Record<string, string[]>;
            } | null;
          };
        };
      };
    } | null
  )?.error?.json;
  const erroDoTitulo = erro?.data?.zodError?.fieldErrors?.titulo?.[0];

  if (erroDoTitulo) {
    return erroDoTitulo;
  }

  return typeof erro?.message === "string"
    ? erro.message
    : "Não foi possível salvar a tarefa.";
}

async function salvarTarefa(
  tarefa: TarefaInicial | undefined,
  titulo: string,
  descricao: string
): Promise<void> {
  const procedimento = tarefa ? "atualizar" : "criar";
  const descricaoNormalizada = descricao.trim();
  const dados = {
    ...(tarefa ? { id: tarefa.id } : {}),
    titulo: titulo.trim(),
    ...(descricaoNormalizada || tarefa
      ? { descricao: descricaoNormalizada }
      : {})
  };
  const resposta = await fetch(`/api/trpc/tarefa.${procedimento}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ json: dados })
  });

  if (!resposta.ok) {
    const payload = await resposta.json().catch(() => null);
    throw new Error(extrairMensagemDeErro(payload));
  }
}

export default function TarefaFormulario({ tarefa }: TarefaFormularioProps) {
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? "");
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? "");
  const [tituloTocado, setTituloTocado] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const tituloVazio = titulo.trim().length === 0;
  const mostrarErroTitulo = tituloVazio && (tituloTocado || tentouEnviar);
  const modoEdicao = tarefa !== undefined;

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTentouEnviar(true);
    setFeedback(null);

    if (tituloVazio) {
      setTituloTocado(true);
      return;
    }

    setEnviando(true);

    try {
      await salvarTarefa(tarefa, titulo, descricao);
      let atualizacaoConfirmada = true;

      try {
        await solicitarListagem();
      } catch {
        atualizacaoConfirmada = false;
      }

      const resultado = `${modoEdicao ? "atualizada" : "criada"}${
        atualizacaoConfirmada ? "" : "-com-aviso"
      }`;
      const destino = new URL("/", window.location.origin);
      destino.searchParams.set("resultado", resultado);
      window.location.assign(destino);
    } catch (erro) {
      setFeedback({
        tipo: "erro",
        mensagem: mensagemDeFalha(
          erro,
          "Não foi possível salvar a tarefa."
        )
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={enviarFormulario}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div>
        <label
          htmlFor="titulo"
          className="block text-sm font-semibold text-slate-800"
        >
          Título <span className="text-red-600">*</span>
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          value={titulo}
          onChange={(evento) => setTitulo(evento.target.value)}
          onBlur={() => setTituloTocado(true)}
          required
          aria-invalid={mostrarErroTitulo}
          aria-describedby={mostrarErroTitulo ? "erro-titulo" : undefined}
          placeholder="Ex.: Finalizar relatório"
          className={`mt-2 min-h-11 w-full rounded-xl border bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${mostrarErroTitulo
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
        />
        {mostrarErroTitulo && (
          <p id="erro-titulo" className="mt-1.5 text-sm text-red-600">
            O título é obrigatório.
          </p>
        )}
      </div>

      <div className="mt-6">
        <label
          htmlFor="descricao"
          className="block text-sm font-semibold text-slate-800"
        >
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={descricao}
          onChange={(evento) => setDescricao(evento.target.value)}
          rows={5}
          placeholder="Inclua detalhes importantes sobre a tarefa"
          className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <p className="mt-1.5 text-sm text-slate-500">Campo opcional.</p>
      </div>

      {feedback && (
        <div
          className={`mt-6 rounded-xl border px-4 py-3 text-sm ${feedback.tipo === "sucesso"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
            }`}
          role={feedback.tipo === "erro" ? "alert" : "status"}
          aria-live="polite"
        >
          {feedback.mensagem}
        </div>
      )}

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={enviando || tituloVazio}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {enviando
            ? "Salvando..."
            : modoEdicao
              ? "Salvar alterações"
              : "Criar tarefa"}
        </button>
      </div>
    </form>
  );
}
