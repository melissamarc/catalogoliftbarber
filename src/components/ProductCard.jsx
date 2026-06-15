function ProductCard({ produto, adicionarAoCarrinho }) {
  return (
    <div className={`card-produto ${produto.esgotado ? "esgotado" : ""}`}>
      <img src={produto.imagem} alt={produto.nome} />

      {produto.esgotado && <span className="selo">Esgotado</span>}

      <h2>{produto.nome}</h2>
      <p>R$ {produto.preco.toFixed(2).replace(".", ",")}</p>

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