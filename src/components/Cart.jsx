function Cart({
  carrinho,
  aumentarQuantidade,
  diminuirQuantidade,
  removerDoCarrinho,
  limparCarrinho,
  total,
  linkWhatsapp,
  vendedores,
  vendedorSelecionado,
  setVendedorSelecionado,
}) {
  const quantidadeItens = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  return (
    <section className="carrinho">
      <div className="carrinho-topo">
        <div>
          <h2>Carrinho</h2>
          <span>{quantidadeItens} item(ns)</span>
        </div>
      </div>

      <div className="seletor-vendedor">
        <label>Escolha seu vendedor</label>

        <select
          value={vendedorSelecionado?.nome || ""}
          onChange={(e) => {
            const vendedor = vendedores.find(
              (item) => item.nome === e.target.value
            );

            setVendedorSelecionado(vendedor || null);
          }}
        >
          <option value="">Selecione um vendedor</option>

          {vendedores.map((vendedor) => (
            <option key={vendedor.nome} value={vendedor.nome}>
              {vendedor.nome}
            </option>
          ))}
        </select>
      </div>

      {carrinho.length === 0 ? (
        <p className="carrinho-vazio">Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="lista-carrinho">
            {carrinho.map((item) => {
              const imagemProduto = item.imagem_url || "/sem-imagem.png";

              return (
                <div className="item-carrinho" key={item.itemCarrinhoId}>
                  <img
                    src={imagemProduto}
                    alt={item.nome}
                    onError={(e) => {
                      e.target.src = "/sem-imagem.png";
                    }}
                  />

                  <div className="item-carrinho-info">
                   <div className="item-carrinho-topo">
  <strong>{item.nome}</strong>

  <button
    className="remover-item"
    onClick={() => removerDoCarrinho(item.itemCarrinhoId)}
  >
    ×
  </button>
</div>

{item.variacoesSelecionadas?.length > 0 && (
  <div className="variacoes-carrinho">
    {item.variacoesSelecionadas.map((variacao) => (
      <span key={variacao.id}>{variacao.nome}</span>
    ))}
  </div>
)}

<p>
  R$ {(item.preco * item.quantidade)
    .toFixed(2)
    .replace(".", ",")}
</p>

<div className="controles">
  ...
</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="resumo-pedido">
            <div>
              <span>Subtotal</span>
              <strong>R$ {total.toFixed(2).replace(".", ",")}</strong>
            </div>

            <div>
              <span>Itens</span>
              <strong>{quantidadeItens}</strong>
            </div>

            <div className="linha-total">
              <span>Total</span>
              <strong>R$ {total.toFixed(2).replace(".", ",")}</strong>
            </div>
          </div>

          <button className="botao-limpar" onClick={limparCarrinho}>
            Limpar carrinho
          </button>

          <a
            className={`botao-whatsapp ${
              !vendedorSelecionado ? "desabilitado" : ""
            }`}
            href={vendedorSelecionado ? linkWhatsapp : "#"}
            target="_blank"
            onClick={(e) => {
              if (!vendedorSelecionado) {
                e.preventDefault();
                alert("Selecione um vendedor antes de enviar o pedido.");
              }
            }}
          >
            Enviar pedido pelo WhatsApp
          </a>
        </>
      )}
    </section>
  );
}

export default Cart;