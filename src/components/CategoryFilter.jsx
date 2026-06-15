function CategoryFilter({
  categorias,
  categoriaSelecionada,
  setCategoriaSelecionada,
}) {
  return (
    <section className="categorias">
      {categorias.map((categoria) => (
        <button
          key={categoria}
          onClick={() => setCategoriaSelecionada(categoria)}
          className={categoriaSelecionada === categoria ? "ativa" : ""}
        >
          {categoria}
        </button>
      ))}
    </section>
  );
}

export default CategoryFilter;