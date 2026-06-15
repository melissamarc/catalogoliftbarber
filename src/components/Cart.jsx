function Cart({
  carrinho,
  aumentarQuantidade,
  diminuirQuantidade,
  removerDoCarrinho,
  limparCarrinho,
  total,
  linkWhatsapp,
}) {
  return (
    <section className="carrinho">
      <h2>Carrinho</h2>

      {carrinho.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {carrinho.map((item) => (
            <div className="item-carrinho" key={item.id}>
              <div>
                <strong>{item.nome}</strong>
                <p>
                  R$ {(item.preco * item.quantidade)
                    .toFixed(2)
                    .replace(".", ",")}
                </p>
              </div>

              <div className="controles">
                <button onClick={() => diminuirQuantidade(item.id)}>-</button>
                <span>{item.quantidade}</span>
                <button onClick={() => aumentarQuantidade(item.id)}>+</button>
                <button onClick={() => removerDoCarrinho(item.id)}>
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