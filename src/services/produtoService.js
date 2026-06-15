import { supabase } from "../lib/supabase";

export async function buscarProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .eq("ativo", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }

  return data;
}