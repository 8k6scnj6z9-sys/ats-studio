"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

const messages = {
  invalid: "Password incorreta.",
  limited: "Demasiadas tentativas. Tenta de novo daqui a 15 minutos.",
  not_configured: "O admin não está configurado (ADMIN_PASSWORD_HASH / ADMIN_SESSION_SECRET).",
};

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <form action={action} className="mx-auto mt-24 max-w-sm space-y-5">
      <h1 className="font-display text-4xl">Admin</h1>
      <label className="block space-y-2">
        <span className="text-sm text-paper/70">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          autoFocus
          className="w-full rounded-md border border-line bg-ash px-3 py-2 text-paper focus:border-flame focus:outline-none"
        />
      </label>
      {state?.error && (
        <p role="alert" className="text-sm text-flame">
          {messages[state.error]}
        </p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-full bg-flame px-4 py-2 font-medium text-ink hover:bg-paper disabled:opacity-60"
      >
        {pending ? "A entrar…" : "Entrar"}
      </button>
    </form>
  );
}
