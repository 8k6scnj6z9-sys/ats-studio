"use server";

import { redirect } from "next/navigation";
import { login, logout, requireAdmin } from "@/lib/cms/auth";
import { deleteEntry, getEntry, moveEntry, saveEntry } from "@/lib/cms/db";
import { entryTypes, prune, validate, type EntryType } from "@/lib/cms/schema";

function entryType(value: string): EntryType {
  if (!Object.hasOwn(entryTypes, value)) throw new Error("Tipo inválido");
  return value as EntryType;
}

export async function loginAction(_: unknown, form: FormData) {
  const result = await login(String(form.get("password") ?? ""));
  if (result.error) return result;
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

export async function saveEntryAction(rawType: string, previousKey: string | null, json: string) {
  await requireAdmin();
  const type = entryType(rawType);
  const { singleton, optional } = entryTypes[type];
  if (json.length > 1_000_000) return { errors: ["Conteúdo demasiado grande"] };

  let data: unknown;
  try {
    data = prune(JSON.parse(json), optional);
  } catch {
    return { errors: ["JSON inválido"] };
  }
  const errors = validate(type, data);
  if (errors.length) return { errors };

  // Singletons keep their fixed key; the rest are keyed by slug.
  const key = singleton ? previousKey : (data as { slug: string }).slug;
  if (!key) return { errors: ["Chave em falta"] };
  if (singleton && !(await getEntry(type, key))) return { errors: ["Página desconhecida"] };
  if (key !== previousKey && (await getEntry(type, key))) {
    return { errors: [`slug: já existe um item com "${key}"`] };
  }
  await saveEntry(type, key, data, previousKey ?? undefined);
  return { errors: [], key };
}

export async function deleteEntryAction(rawType: string, key: string) {
  await requireAdmin();
  const type = entryType(rawType);
  if (entryTypes[type].singleton) throw new Error("Não é possível apagar esta página");
  await deleteEntry(type, key);
  redirect("/admin");
}

export async function moveEntryAction(rawType: string, key: string, direction: -1 | 1) {
  await requireAdmin();
  await moveEntry(entryType(rawType), key, direction === -1 ? -1 : 1);
  redirect("/admin");
}
