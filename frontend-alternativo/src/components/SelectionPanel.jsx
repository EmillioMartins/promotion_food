import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../utils/format';
import {
  Button, ImagePlaceholder, QtyStepper,
} from './ui.jsx';

export default function SelectionPanel() {
  const navigate = useNavigate();
  const { items, setQty, remove, clear, totals } = useCart();
  const selectedCount = items.reduce((total, item) => total + item.qty, 0);

  return (
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
  );
}
