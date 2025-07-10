// File: frontend/src/pages/category/CategoryPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";
import ProductBlock from "../../components/blocks/ProductBlock";
import {
  fetchCategories,
  fetchSubcategories,
} from "../../services/categoryService";
import { fetchProducts } from "../../services/productService";
import { fetchSettings } from "../../services/settingsService";

export default function CategoryPage() {
  const { name, subname } = useParams();
  const [cats, setCats]         = useState([]);
  const [subcats, setSubcats]   = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sort, setSort]         = useState("recent");
  const [hero, setHero]         = useState({ imageUrl: "", text: "" });

  // 1. Cargar ajustes y categorías
  useEffect(() => {
    Promise.all([fetchSettings(), fetchCategories()])
      .then(([settingsData, categories]) => {
        setCats(categories);
        const cat = categories.find(c => c.name.toLowerCase() === name?.toLowerCase());
        if (cat && settingsData.siteSettings.categoryHeroes[cat.id]) {
          const ch = settingsData.siteSettings.categoryHeroes[cat.id];
          setHero({ imageUrl: ch.heroImageUrl, text: ch.heroText });
        } else {
          setHero({
            imageUrl: settingsData.siteSettings.heroImageUrl,
            text:     settingsData.siteSettings.heroText
          });
        }
      })
      .catch(() => {})
      .finally(() => {});
  }, [name]);

  // 2. Cargar subcategorías
  useEffect(() => {
    if (!name) return;
    const cat = cats.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!cat) return;
    fetchSubcategories(cat.id)
      .then(setSubcats)
      .catch(() => setSubcats([]));
  }, [name, cats]);

  // 3. Cargar productos filtrados
  useEffect(() => {
    setLoading(true);
    const filters = {};
    if (name) {
      const cat = cats.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (cat) filters.category_id = cat.id;
    }
    if (subname) {
      const sub = subcats.find(s => s.name.toLowerCase() === subname.toLowerCase());
      if (sub) filters.subcategory_id = sub.id;
    }
    filters.sort = sort;
    fetchProducts(filters)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [name, subname, sort, cats, subcats]);

  if (loading) return <div className="cp-loading">Cargando productos…</div>;

  return (
    <main className="cp-page">
      <header className="cp-hero">
        <div
          className="cp-hero-bg"
          style={{ backgroundImage: `url(${hero.imageUrl})` }}
        />
        <h1 className="cp-title">
          {hero.text ||
            (name
              ? name.charAt(0).toUpperCase() + name.slice(1)
              : "Todas las categorías")}
        </h1>
      </header>

      <div className="cp-controls">
        <nav className="cp-breadcrumb">
          <Link to="/">Home</Link>
          {name && <> &gt; <Link to={`/categoria/${name}`}>{name}</Link></>}
          {subname && <> &gt; <span>{subname}</span></>}
        </nav>

        {subcats.length > 0 && (
          <ul className="cp-subnav">
            <li className={!subname ? "active" : ""}>
              <Link to={`/categoria/${name}`}>All</Link>
            </li>
            {subcats.map(s => (
              <li key={s.id} className={s.name === subname ? "active" : ""}>
                <Link to={`/categoria/${name}/${s.name}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        )}

        <div className="cp-sort">
          <label>Orden:</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="recent">Más nuevos</option>
            <option value="price_asc">Precio ↑</option>
            <option value="price_desc">Precio ↓</option>
          </select>
        </div>
      </div>

      <section className="cp-grid">
        {products.map(p => (
          <ProductBlock key={p.id} product={p} />
        ))}
      </section>
    </main>
  );
}
