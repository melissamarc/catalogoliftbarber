import { supabase } from "../lib/supabase";

export async function enviarImagem(arquivo) {
  if (!arquivo) {
    return null;
  }

  const extensao = arquivo.name.split(".").pop();

  const nomeArquivo = `produto-${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from("produtos")
    .upload(nomeArquivo, arquivo);

  if (error) {
    console.error("Erro ao enviar imagem:", error);
    return null;
  }

  const { data } = supabase.storage
    .from("produtos")
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}