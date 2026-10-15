import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryService, productService } from '../../services';
import { useAsync } from '../../hooks/useAsync';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import {
  Button, Chip, EmptyState, ImagePlaceholder, Input, Loading, PageHeader, QtyStepper,
} from '../../components/ui.jsx';
import { money } from '../../utils/format';

export default function Catalog() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { add, items, setQty, remove, clear, totals } = useCart();
  const toast = useToast();
  const { data: categories } = useAsync(() => categoryService.list(), []);
  const { data: products } = useAsync(
    () => productService.list({ category, search, onlyAvailable: true, sort: 'expiresAt' }),
    [category, search],
  );

  const handleAdd = (p) => {
    add(p, 1);
    toast(`${p.name} adicionado ao carrinho`);
  };

  const selectedCount = items.reduce((total, item) => total + item.qty, 0);

  return (
    <>
      <PageHeader
        eyebrow="Ofertas da semana"
        title="Produtos perto do vencimento"
        subtitle="Itens em perfeito estado com até 60% de desconto."
        action={
          <Input
            className="w-full sm:w-[220px]"
            placeholder="Buscar produto"
            aria-label="Buscar produto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />
      <div className="flex flex-wrap gap-2">
        <Chip active={!category} onClick={() => setCategory('')}>
          Todos
        </Chip>
        {categories?.map((c) => (
          <Chip key={c.id} active={category === c.name} onClick={() => setCategory(c.name)}>
            {c.name}
          </Chip>
        ))}
      </div>
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div>
          {!products ? (
            <Loading />
          ) : products.length === 0 ? (
            <EmptyState>Nenhuma oferta encontrada.</EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={handleAdd} />
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-md border border-line bg-white p-4 lg:sticky lg:top-6" aria-labelledby="selection-title">
          <div className="flex items-baseline justify-between gap-2 border-b border-line pb-3">
            <h2 id="selection-title" className="text-[15px] font-semibold text-brand">Minha seleção</h2>
            <span className="text-[11px] font-semibold text-muted">
              {selectedCount} {selectedCount === 1 ? 'item' : 'itens'}
            </span>
          </div>

          {items.length === 0 ? (
            <p className="py-5 text-xs text-muted">Sua seleção está vazia.</p>
          ) : (
            <ul className="divide-y divide-line">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 py-3">
                  <ImagePlaceholder
                    src={product.images?.[0]}
                    className="h-12 w-12 shrink-0 rounded"
                    label={product.name}
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/produtos/${product.id}`}
                      className="line-clamp-2 text-[11px] font-semibold leading-snug text-brand"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-[10px] text-muted">
                      {qty} × {money(product.promoPrice)}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <QtyStepper
                        size="sm"
                        value={qty}
                        max={product.stock}
                        onChange={(quantity) => setQty(product.id, quantity)}
                      />
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        className="text-[10px] font-semibold text-danger hover:underline"
                        aria-label={`Remover ${product.name} da seleção`}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-between gap-2 border-t border-line pt-3 text-xs">
            <span className="text-muted">Total estimado</span>
            <strong className="text-brand">{money(totals.total)}</strong>
          </div>
          <p className="mt-2 text-[10px] text-muted">Valores sujeitos à confirmação na loja.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              variant="yellow"
              className="w-full"
              disabled={items.length === 0}
              onClick={() => navigate('/carrinho')}
            >
              Comprar
            </Button>
            <Button
              variant="outline"
              className="w-full px-2 text-[11px]"
              disabled={items.length === 0}
              onClick={clear}
            >
              Limpar seleção
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}
