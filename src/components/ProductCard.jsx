import { useMemo, useState } from "react";

function ProductCard({ produto, adicionarAoCarrinho }) {
  const variacoesCor = produto.variacoes?.filter(
    (variacao) => variacao.tipo === "cor"
  );

  const variacoesTexto = produto.variacoes?.filter(
    (variacao) => variacao.tipo === "texto"
  );

  const [corSelecionada, setCorSelecionada] = useState(
    variacoesCor?.[0] || null
  );

  const [textoSelecionado, setTextoSelecionado] = useState(
    variacoesTexto?.[0] || null
  );

  const imagemProduto = useMemo(() => {
    if (corSelecionada?.imagem_url) return corSelecionada.imagem_url;
    if (textoSelecionado?.imagem_url) return textoSelecionado.imagem_url;

    return produto.imagem_url || "/sem-imagem.png";
  }, [produto.imagem_url, corSelecionada, textoSelecionado]);

  function handleAdicionar() {
    const variacoesSelecionadas = [];

    if (corSelecionada) variacoesSelecionadas.push(corSelecionada);
    if (textoSelecionado) variacoesSelecionadas.push(textoSelecionado);

    adicionarAoCarrinho(produto, variacoesSelecionadas);
  }

  return (
    <div className={`card-produto ${produto.esgotado ? "esgotado" : ""}`}>
      <div className="imagem-produto">
        <img
          src={imagemProduto}
          alt={produto.nome}
          onError={(e) => {
            e.target.src = "/sem-imagem.png";
          }}
        />

        {produto.esgotado && <span className="selo">Esgotado</span>}
      </div>

      <div className="conteudo-produto">
        <h2>{produto.nome}</h2>

        {variacoesCor?.length > 0 && (
          <div className="variacoes-produto">
            {variacoesCor.map((variacao) => (
              <button
                key={variacao.id}
                type="button"
                className={`bolinha-variacao ${
                  corSelecionada?.id === variacao.id ? "selecionada" : ""
                }`}
                style={{ background: variacao.valor }}
                title={variacao.nome}
                onClick={() => setCorSelecionada(variacao)}
              />
            ))}
          </div>
        )}

        {variacoesTexto?.length > 0 && (
          <div className="variacoes-texto-produto">
            {variacoesTexto.map((variacao) => (
              <button
                key={variacao.id}
                type="button"
                className={
                  textoSelecionado?.id === variacao.id ? "selecionada" : ""
                }
                onClick={() => setTextoSelecionado(variacao)}
              >
                {variacao.nome}
              </button>
            ))}
          </div>
        )}

        <div className="rodape-produto">
          <p>R$ {Number(produto.preco).toFixed(2).replace(".", ",")}</p>

          <button
            className="botao-sacola"
            disabled={produto.esgotado}
            onClick={handleAdicionar}
            title={produto.esgotado ? "Indisponível" : "Adicionar ao carrinho"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" />
              <path d="M3 6H21" />
              <path d="M16 10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10" />
              <path d="M12 17V21" />
              <path d="M10 19H14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;