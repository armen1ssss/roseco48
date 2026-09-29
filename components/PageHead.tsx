import Link from 'next/link';

export type Crumb = { label: string; href: string };

/**
 * Шапка внутренней страницы: хлебные крошки, H1, лид, действия.
 * Крошки дают контекст «где я» и путь назад; активный пункт не ссылка.
 * Ссылки крошек имеют цель 44 px по высоте — на телефоне по ним легко попасть.
 */
export function PageHead({
  breadcrumbs,
  kicker,
  title,
  lead,
  actions,
  children,
}: {
  breadcrumbs: Crumb[];
  kicker?: string;
  title: string;
  lead?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="container page-head">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {index > 0 && (
              <span className="breadcrumbs__sep" aria-hidden="true">
                /
              </span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span style={{ paddingBlock: '12px' }} aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href}>{crumb.label}</Link>
            )}
          </span>
        ))}
      </nav>

      <div className="stack" style={{ maxWidth: '78ch' }}>
        {kicker && <p className="kicker">{kicker}</p>}
        <h1 className="page-head__title">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>

      {actions && <div className="btn-row" style={{ marginTop: 0 }}>{actions}</div>}
      {children}
    </section>
  );
}
