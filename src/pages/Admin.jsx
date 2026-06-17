import { useEffect, useState } from "react";
import { enviarImagem } from "../services/uploadService";
import {
  cadastrarProduto,
  listarProdutosAdmin,
  atualizarProduto,
  excluirProduto,
  listarVariacoes,
  cadastrarVariacao,
  excluirVariacao,
} from "../services/adminProdutoService";

function Admin() {
  const [produtos, setProdutos] = useState([]);

  const [produtoEditando, setProdutoEditando] = useState(null);
  const [produtoVariacao, setProdutoVariacao] = useState(null);
  const [variacoes, setVariacoes] = useState([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemAtual, setImagemAtual] = useState("");
  const [esgotado, setEsgotado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [variacaoNome, setVariacaoNome] = useState("");
  const [variacaoTipo, setVariacaoTipo] = useState("cor");
  const [variacaoValor, setVariacaoValor] = useState("#000000");
  const [variacaoImagem, setVariacaoImagem] = useState(null);
  const [carregandoVariacao, setCarregandoVariacao] = useState(false);

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

  async function abrirVariacoes(produto) {
    setProdutoVariacao(produto);

    const dados = await listarVariacoes(produto.id);
    setVariacoes(dados);

    setVariacaoNome("");
    setVariacaoTipo("cor");
    setVariacaoValor("#000000");
    setVariacaoImagem(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function fecharVariacoes() {
    setProdutoVariacao(null);
    setVariacoes([]);
    setVariacaoNome("");
    setVariacaoTipo("cor");
    setVariacaoValor("#000000");
    setVariacaoImagem(null);
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

  async function handleSubmitVariacao(e) {
    e.preventDefault();

    if (!produtoVariacao) return;

    setCarregandoVariacao(true);

    let imagemUrl = null;

    if (variacaoImagem) {
      imagemUrl = await enviarImagem(variacaoImagem);
    }

    const novaVariacao = {
      produto_id: produtoVariacao.id,
      nome: variacaoNome,
      tipo: variacaoTipo,
      valor: variacaoValor,
      imagem_url: imagemUrl,
      ativo: true,
    };

    const resultado = await cadastrarVariacao(novaVariacao);

    if (resultado) {
      const dados = await listarVariacoes(produtoVariacao.id);
      setVariacoes(dados);

      setVariacaoNome("");
      setVariacaoTipo("cor");
      setVariacaoValor("#000000");
      setVariacaoImagem(null);

      alert("Variação cadastrada com sucesso!");
    } else {
      alert("Erro ao cadastrar variação");
    }

    setCarregandoVariacao(false);
  }

  async function removerVariacao(variacao) {
    const confirmar = confirm(`Excluir a variação "${variacao.nome}"?`);

    if (!confirmar) return;

    const excluiu = await excluirVariacao(variacao.id);

    if (excluiu && produtoVariacao) {
      const dados = await listarVariacoes(produtoVariacao.id);
      setVariacoes(dados);
    }
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

      if (produtoVariacao?.id === produto.id) {
        fecharVariacoes();
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
          <p>Gerencie produtos, variações, imagens, preços e disponibilidade.</p>
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

      {produtoVariacao && (
        <section className="admin-card variacoes-admin-card">
          <div className="admin-lista-topo">
            <div>
              <h2>Variações</h2>
              <p className="subtitulo-admin">{produtoVariacao.nome}</p>
            </div>

            <button
              type="button"
              className="botao-cancelar-edicao"
              onClick={fecharVariacoes}
            >
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmitVariacao} className="form-admin form-variacao-admin">
            <input
              type="text"
              placeholder="Nome da variação. Ex: Preto, Azul, 110V"
              value={variacaoNome}
              onChange={(e) => setVariacaoNome(e.target.value)}
              required
            />

            <select
              value={variacaoTipo}
              onChange={(e) => {
                setVariacaoTipo(e.target.value);
                setVariacaoValor(e.target.value === "cor" ? "#000000" : "");
              }}
            >
              <option value="cor">Cor</option>
              <option value="texto">Texto / Voltagem / Tamanho</option>
            </select>

            {variacaoTipo === "cor" ? (
              <input
                type="color"
                value={variacaoValor}
                onChange={(e) => setVariacaoValor(e.target.value)}
              />
            ) : (
              <input
                type="text"
                placeholder="Valor. Ex: 110V, 220V, P, M, G"
                value={variacaoValor}
                onChange={(e) => setVariacaoValor(e.target.value)}
                required
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setVariacaoImagem(e.target.files[0])}
            />

            <button type="submit" disabled={carregandoVariacao}>
              {carregandoVariacao ? "Salvando..." : "Adicionar variação"}
            </button>
          </form>

          <div className="lista-variacoes-admin">
            {variacoes.length === 0 ? (
              <p className="texto-vazio-admin">Nenhuma variação cadastrada.</p>
            ) : (
              variacoes.map((variacao) => (
                <div className="variacao-admin-item" key={variacao.id}>
                  <div className="variacao-preview">
                    {variacao.tipo === "cor" ? (
                      <span
                        className="bolinha-cor-admin"
                        style={{ background: variacao.valor }}
                      />
                    ) : (
                      <span className="tag-texto-admin">{variacao.valor}</span>
                    )}

                    <div>
                      <strong>{variacao.nome}</strong>
                      <small>{variacao.tipo}</small>
                    </div>
                  </div>

                  {variacao.imagem_url && (
                    <img src={variacao.imagem_url} alt={variacao.nome} />
                  )}

                  <button
                    className="perigo"
                    onClick={() => removerVariacao(variacao)}
                  >
                    Excluir
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}

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

                <button onClick={() => abrirVariacoes(produto)}>
                  Variações
                </button>

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