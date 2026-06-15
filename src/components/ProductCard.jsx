function ProductCard({ produto, adicionarAoCarrinho }) {
  const imagemProduto = produto.imagem_url || "/sem-imagem.png";

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
      </div>

      {produto.esgotado && <span className="selo">Esgotado</span>}

      <h2>{produto.nome}</h2>
      <p>R$ {Number(produto.preco).toFixed(2).replace(".", ",")}</p>

      <button
        disabled={produto.esgotado}
        onClick={() => adicionarAoCarrinho(produto)}
      >
        {produto.esgotado ? "Indisponível" : "Adicionar"}
      </button>
    </div>
  );
}

export default ProductCard;