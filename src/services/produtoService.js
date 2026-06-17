import { supabase } from "../lib/supabase";

export async function buscarProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select(`
      *,
      produto_variacoes (
        id,
        produto_id,
        nome,
        tipo,
        valor,
        imagem_url,
        ativo
      )
    `)
    .eq("ativo", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }

  return data.map((produto) => ({
    ...produto,
    variacoes: (produto.produto_variacoes || []).filter(
      (variacao) => variacao.ativo
    ),
  }));
}