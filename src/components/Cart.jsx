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
  return (
    <section className="carrinho">
      <h2>Carrinho</h2>

      <div className="seletor-vendedor">
        <label>Escolha o vendedor</label>

        <select
          value={vendedorSelecionado.nome}
          onChange={(e) => {
            const vendedor = vendedores.find(
              (item) => item.nome === e.target.value
            );

            setVendedorSelecionado(vendedor);
          }}
        >
          {vendedores.map((vendedor) => (
            <option key={vendedor.nome} value={vendedor.nome}>
              {vendedor.nome}
            </option>
          ))}
        </select>
      </div>

      {carrinho.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {carrinho.map((item) => (
            <div className="item-carrinho" key={item.itemCarrinhoId}>
              <div>
                <strong>{item.nome}</strong>

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
              </div>

              <div className="controles">
                <button
                  onClick={() => diminuirQuantidade(item.itemCarrinhoId)}
                >
                  -
                </button>

                <span>{item.quantidade}</span>

                <button
                  onClick={() => aumentarQuantidade(item.itemCarrinhoId)}
                >
                  +
                </button>

                <button onClick={() => removerDoCarrinho(item.itemCarrinhoId)}>
                  Remover
                </button>
              </div>
            </div>
          ))}

          <h3>Total: R$ {total.toFixed(2).replace(".", ",")}</h3>

          <button className="botao-limpar" onClick={limparCarrinho}>
            Limpar carrinho
          </button>

          <a className="botao-whatsapp" href={linkWhatsapp} target="_blank">
            Enviar pedido pelo WhatsApp
          </a>
        </>
      )}
    </section>
  );
}

export default Cart;