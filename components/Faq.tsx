import { faq } from '@/lib/content';

/**
 * FAQ — вопросы из реальных звонков: сроки, отбор проб, оплата, договор, выезд.
 * Аккордеон на нативных <details>: работает с клавиатуры и в скринридерах
 * без JS-библиотек. Строка вопроса — цель 60 px, комфортно на тап.
 * Разметка FAQPage добавляется на главной и на страницах услуг.
 */
export function Faq({ items = faq, title = 'Частые вопросы' }: { items?: typeof faq; title?: string }) {
  return (
    <section className="section section--line" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-head center">
          <p className="kicker">FAQ</p>
          <h2 className="h2" id="faq-title">
            {title}
          </h2>
        </div>

        <div className="faq">
          {items.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              <p className="faq__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
