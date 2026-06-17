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

  const [produtoEditando, setProdutoEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemAtual, setImagemAtual] = useState("");
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

  function limparFormulario() {
    setProdutoEditando(null);
    setNome("");
    setPreco("");
    setCategoria("");
    setMarca("");
    setImagem(null);
    setImagemAtual("");
    setEsgotado(false);
  }

  function iniciarEdicao(produto) {
    setProdutoEditando(produto);

    setNome(produto.nome || "");
    setPreco(produto.preco || "");
    setCategoria(produto.categoria || "");
    setMarca(produto.marca || "");
    setImagem(null);
    setImagemAtual(produto.imagem_url || "");
    setEsgotado(Boolean(produto.esgotado));

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);

    let imagemUrl = imagemAtual || null;

    if (imagem) {
      imagemUrl = await enviarImagem(imagem);
    }

    const dadosProduto = {
      nome,
      preco: Number(preco),
      categoria,
      marca,
      imagem_url: imagemUrl,
      esgotado,
      ativo: true,
    };

    let resultado = null;

    if (produtoEditando) {
      resultado = await atualizarProduto(produtoEditando.id, dadosProduto);
    } else {
      resultado = await cadastrarProduto(dadosProduto);
    }

    if (resultado) {
      alert(
        produtoEditando
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!"
      );

      limparFormulario();
      carregarProdutos();
    } else {
      alert("Erro ao salvar produto");
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
      if (produtoEditando?.id === produto.id) {
        limparFormulario();
      }

      carregarProdutos();
    }
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
          <p>Gerencie produtos, preços, imagens, marcas e disponibilidade.</p>
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
        <div className="admin-lista-topo">
          <h2>{produtoEditando ? "Editar produto" : "Novo produto"}</h2>

          {produtoEditando && (
            <button
              type="button"
              className="botao-cancelar-edicao"
              onClick={limparFormulario}
            >
              Cancelar edição
            </button>
          )}
        </div>

        {imagemAtual && (
          <div className="preview-imagem-admin">
            <img src={imagemAtual} alt="Imagem atual do produto" />
            <span>Imagem atual</span>
          </div>
        )}

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
            {carregando
              ? "Salvando..."
              : produtoEditando
              ? "Salvar alterações"
              : "Salvar produto"}
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
                <button onClick={() => iniciarEdicao(produto)}>Editar</button>

                <button onClick={() => alternarEsgotado(produto)}>
                  {produto.esgotado ? "Disponível" : "Esgotar"}
                </button>

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