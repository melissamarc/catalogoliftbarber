import { useEffect, useState } from "react";
import { enviarImagem } from "../services/uploadService";
import {
  cadastrarProduto,
  listarProdutosAdmin,
  atualizarProduto,
  excluirProduto,
} from "../services/adminProdutoService";

function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [imagem, setImagem] = useState(null);
  const [esgotado, setEsgotado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    document.body.classList.add("tema-claro");

    return () => {
      document.body.classList.remove("tema-claro");
    };
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    const dados = await listarProdutosAdmin();
    setProdutos(dados);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);

    let imagemUrl = null;

    if (imagem) {
      imagemUrl = await enviarImagem(imagem);
    }

    const produto = {
      nome,
      preco: Number(preco),
      categoria,
      marca,
      imagem_url: imagemUrl,
      esgotado,
      ativo: true,
    };

    const produtoCadastrado = await cadastrarProduto(produto);

    if (produtoCadastrado) {
      alert("Produto cadastrado com sucesso!");

      setNome("");
      setPreco("");
      setCategoria("");
      setMarca("");
      setImagem(null);
      setEsgotado(false);

      carregarProdutos();
    } else {
      alert("Erro ao cadastrar produto");
    }

    setCarregando(false);
  }

  async function alternarEsgotado(produto) {
    await atualizarProduto(produto.id, {
      esgotado: !produto.esgotado,
    });

    carregarProdutos();
  }

  async function removerProduto(produto) {
    const confirmar = confirm(
      `Tem certeza que deseja excluir "${produto.nome}"?`
    );

    if (!confirmar) return;

    const excluiu = await excluirProduto(produto.id);

    if (excluiu) {
      carregarProdutos();
    }
  }

  async function editarPreco(produto) {
    const novoPreco = prompt("Novo preço:", produto.preco);

    if (!novoPreco) return;

    await atualizarProduto(produto.id, {
      preco: Number(novoPreco),
    });

    carregarProdutos();
  }

  const totalProdutos = produtos.length;

  const produtosDisponiveis = produtos.filter(
    (produto) => !produto.esgotado
  ).length;

  const produtosEsgotados = produtos.filter(
    (produto) => produto.esgotado
  ).length;

  const totalCategorias = new Set(
    produtos.map((produto) => produto.categoria).filter(Boolean)
  ).size;

  return (
    <div className="admin admin-compacto">
      <header className="admin-header">
        <div>
          <h1>Painel Admin</h1>
          <p>Gerencie produtos, preços e disponibilidade.</p>
        </div>
      </header>

      <section className="dashboard-admin">
        <div>
          <strong>{totalProdutos}</strong>
          <span>Produtos</span>
        </div>

        <div>
          <strong>{produtosDisponiveis}</strong>
          <span>Disponíveis</span>
        </div>

        <div>
          <strong>{produtosEsgotados}</strong>
          <span>Esgotados</span>
        </div>

        <div>
          <strong>{totalCategorias}</strong>
          <span>Categorias</span>
        </div>
      </section>

      <section className="admin-card">
        <h2>Novo produto</h2>

        <form onSubmit={handleSubmit} className="form-admin">
          <input
            type="text"
            placeholder="Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files[0])}
          />

          <label className="checkbox-admin">
            <input
              type="checkbox"
              checked={esgotado}
              onChange={(e) => setEsgotado(e.target.checked)}
            />
            Produto esgotado
          </label>

          <button type="submit" disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar produto"}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-lista-topo">
          <h2>Produtos cadastrados</h2>
          <span>{produtos.length} itens</span>
        </div>

        <div className="lista-admin">
          {produtos.map((produto) => (
            <div className="produto-admin" key={produto.id}>
              <img src={produto.imagem_url} alt={produto.nome} />

              <div className="info-produto-admin">
                <strong>{produto.nome}</strong>

                <div className="meta-produto-admin">
                  <span>
                    R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                  </span>
                  <span>{produto.categoria}</span>
                  <span>{produto.marca || "Sem marca"}</span>
                </div>

                <small
                  className={
                    produto.esgotado ? "status esgotado" : "status disponivel"
                  }
                >
                  {produto.esgotado ? "Esgotado" : "Disponível"}
                </small>
              </div>

              <div className="acoes-admin">
                <button onClick={() => alternarEsgotado(produto)}>
                  {produto.esgotado ? "Disponível" : "Esgotar"}
                </button>

                <button onClick={() => editarPreco(produto)}>Preço</button>

                <button
                  className="perigo"
                  onClick={() => removerProduto(produto)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;