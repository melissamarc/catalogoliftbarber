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

export async function listarVariacoes(produtoId) {
  const { data, error } = await supabase
    .from("produto_variacoes")
    .select("*")
    .eq("produto_id", produtoId)
    .eq("ativo", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Erro ao listar variações:", error);
    return [];
  }

  return data;
}

export async function cadastrarVariacao(variacao) {
  const { data, error } = await supabase
    .from("produto_variacoes")
    .insert([variacao])
    .select();

  if (error) {
    console.error("Erro ao cadastrar variação:", error);
    return null;
  }

  return data[0];
}

export async function atualizarVariacao(id, campos) {
  const { data, error } = await supabase
    .from("produto_variacoes")
    .update(campos)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Erro ao atualizar variação:", error);
    return null;
  }

  return data[0];
}

export async function excluirVariacao(id) {
  const { error } = await supabase
    .from("produto_variacoes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir variação:", error);
    return false;
  }

  return true;
}