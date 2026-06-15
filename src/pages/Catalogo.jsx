import { useEffect, useState } from "react";
import { buscarProdutos } from "../services/produtoService";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import Cart from "../components/Cart";
import logo from "../assets/logo.png";

function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho");

    if (carrinhoSalvo) {
      return JSON.parse(carrinhoSalvo);
    }

    return [];
  });

  const [busca, setBusca] = useState("");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  useEffect(() => {
    async function carregarProdutos() {
      const dados = await buscarProdutos();
      setProdutos(dados);
    }

    carregarProdutos();
  }, []);

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const categorias = [
    "Todos",
    ...new Set(produtos.map((produto) => produto.categoria)),
  ];

  const produtosFiltrados = produtos.filter((produto) => {
    const atendeCategoria =
      categoriaSelecionada === "Todos" ||
      produto.categoria === categoriaSelecionada;

    const atendeBusca = produto.nome
      .toLowerCase()
      .includes(busca.toLowerCase());

    return atendeCategoria && atendeBusca;
  });

  function adicionarAoCarrinho(produto) {
    const produtoExiste = carrinho.find((item) => item.id === produto.id);

    if (produtoExiste) {
      setCarrinho(
        carrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  }

  function aumentarQuantidade(id) {
    setCarrinho(
      carrinho.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  }

  function diminuirQuantidade(id) {
    setCarrinho(
      carrinho
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function removerDoCarrinho(id) {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  }

  function limparCarrinho() {
    setCarrinho([]);
  }

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  const quantidadeItensCarrinho = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );
const vendedores = [
  { nome: "Paulo", telefone: "5511985753791" },
  { nome: "Marcos", telefone: "5511980488753" },
  { nome: "Cadu", telefone: "5511979819639" },
  { nome: "João", telefone: "5511993430573" },
];

const [vendedorSelecionado, setVendedorSelecionado] = useState(vendedores[0]);

  const itensMensagem = carrinho
    .map((item) => {
      return `${item.quantidade}x ${item.nome} - R$ ${(
        item.preco * item.quantidade
      )
        .toFixed(2)
        .replace(".", ",")}`;
    })
    .join("\n");

 const mensagemWhatsapp = `Olá, ${vendedorSelecionado.nome}! Gostaria de fazer esse pedido:

${itensMensagem}

Total: R$ ${total.toFixed(2).replace(".", ",")}`;

 const linkWhatsapp = `https://wa.me/${vendedorSelecionado.telefone}?text=${encodeURIComponent(
  mensagemWhatsapp
)}`;

  return (
    <main>
      <header className="cabecalho">
  <div className="logo-area">
    <img src={logo} alt="Lift Barber" className="logo" />

    <div>
      <h1>Lift Barber</h1>
      <span>Catálogo Oficial</span>
    </div>
  </div>

  <button
    className="icone-carrinho"
    onClick={() => setCarrinhoAberto(true)}
  >
    🛒 {quantidadeItensCarrinho}
  </button>
</header>

      <input
        type="text"
        placeholder="Buscar produtos..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="campo-busca"
      />

      <CategoryFilter
        categorias={categorias}
        categoriaSelecionada={categoriaSelecionada}
        setCategoriaSelecionada={setCategoriaSelecionada}
      />

      <section className="grade-produtos">
        {produtosFiltrados.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            adicionarAoCarrinho={adicionarAoCarrinho}
          />
        ))}
      </section>

      {carrinhoAberto && (
        <div
          className="overlay-carrinho"
          onClick={() => setCarrinhoAberto(false)}
        >
          <div
            className="gaveta-carrinho"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="fechar-carrinho"
              onClick={() => setCarrinhoAberto(false)}
            >
              ×
            </button>

           <Cart
  carrinho={carrinho}
  aumentarQuantidade={aumentarQuantidade}
  diminuirQuantidade={diminuirQuantidade}
  removerDoCarrinho={removerDoCarrinho}
  limparCarrinho={limparCarrinho}
  total={total}
  linkWhatsapp={linkWhatsapp}
  vendedores={vendedores}
  vendedorSelecionado={vendedorSelecionado}
  setVendedorSelecionado={setVendedorSelecionado}
/>

          </div>
        </div>
      )}
    </main>
  );
}

export default Catalogo;