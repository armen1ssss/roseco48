import { priceDisclaimer, priceFactors, priceGroups } from '@/lib/prices';

const rub = (value: number) => value.toLocaleString('ru-RU');

/**
 * Прайс: таблица по объектам, без JavaScript.
 *
 * Мобильный: строка превращается в карточку «название слева, цена справа»,
 * переноса и горизонтальной прокрутки нет — таблица на 360 px не ломается.
 * Десктоп: обычная таблица с липкой шапкой столбцов (визуально),
 * цены выровнены по правому краю, цифры табличные — цену сравнивают глазами.
 *
 * Навигация по разделам — якорями-«таблетками»: работают с клавиатуры,
 * читаются скринридером, не требуют состояния.
 */
export function PriceTable() {
  return (
    <>
      <nav className="chip-row" aria-label="Разделы прайса">
        {priceGroups.map((group) => (
          <a className="chip" href={`#${group.id}`} key={group.id}>
            {group.title}
          </a>
        ))}
      </nav>

      <div className="price-groups">
        {priceGroups.map((group) => (
          <section className="price-group" id={group.id} key={group.id} aria-labelledby={`${group.id}-title`}>
            <div className="section-head">
              <h2 className="h2" id={`${group.id}-title`}>
                {group.title}
              </h2>
              <p className="lead">{group.lead}</p>
            </div>

            <table className="price mt-5">
              <caption className="visually-hidden">Цены: {group.title.toLowerCase()}</caption>
              <thead>
                <tr>
                  <th scope="col">Показатель</th>
                  <th scope="col">Единица</th>
                  <th scope="col" style={{ textAlign: 'right' }}>
                    Цена, ₽
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">
                      {item.name}
                      {item.note && <span className="price__note">{item.note}</span>}
                    </th>
                    <td className="price__unit">{item.unit}</td>
                    <td className="price__value">
                      {item.priceNote ? `${item.priceNote} ` : ''}
                      {rub(item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>

      <div className="factor-list">
        {priceFactors.map((factor) => (
          <div className="step" key={factor.title}>
            <h3>{factor.title}</h3>
            <p>{factor.text}</p>
          </div>
        ))}
      </div>

      <p className="small muted mt-6">{priceDisclaimer}</p>
    </>
  );
}
