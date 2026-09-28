import { Icon } from '@/components/icons';

/** Questions that open to their answers (native <details>, no script): homepage and service pages. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map(({ q, a }) => (
        <details key={q} className="faq__item">
          <summary><span>{q}</span><Icon name="plus" aria-hidden="true" /></summary>
          <div className="faq__a"><p>{a}</p></div>
        </details>
      ))}
    </div>
  );
}
