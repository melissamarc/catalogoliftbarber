import { supabase } from "../lib/supabase";

export async function cadastrarProduto(produto) {
  const { data, error } = await supabase
    .from("produtos")
    .insert([produto])
    .select();

  if (error) {
    console.error("Erro ao cadastrar produto:", error);
    return null;
  }

  return data[0];
}

export async function listarProdutosAdmin() {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Erro ao listar produtos:", error);
    return [];
  }

  return data;
}

export async function atualizarProduto(id, campos) {
  const { data, error } = await supabase
    .from("produtos")
    .update(campos)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Erro ao atualizar produto:", error);
    return null;
  }

  return data[0];
}

export async function excluirProduto(id) {
  const { error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir produto:", error);
    return false;
  }

  return true;
}