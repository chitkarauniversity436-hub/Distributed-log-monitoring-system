function Category() {
  const categories = [
    "Men",
    "Women",
    "Shoes",
    "Accessories",
    "Electronics",
    "Bags"
  ];

  return (
    <main className="page">
      <h1>Categories</h1>

      <p className="page-text">
        Choose a category to find the products
        you are looking for.
      </p>

      <div className="category-list">
        {categories.map((name) => (
          <div className="category-box" key={name}>
            <h3>{name}</h3>

            <button>
              View Products
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Category;