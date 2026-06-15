import { useState } from "react";
import { enviarImagem } from "../services/uploadService";

function TestUpload() {
  const [imagemUrl, setImagemUrl] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleUpload(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    setCarregando(true);

    const url = await enviarImagem(arquivo);

    setImagemUrl(url);
    setCarregando(false);
  }

  return (
    <div className="teste-upload">
      <h2>Teste de Upload</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {carregando && <p>Enviando imagem...</p>}

      {imagemUrl && (
        <>
          <p>Imagem enviada com sucesso!</p>
          <img src={imagemUrl} alt="Imagem enviada" />
          <p>{imagemUrl}</p>
        </>
      )}
    </div>
  );
}

export default TestUpload;