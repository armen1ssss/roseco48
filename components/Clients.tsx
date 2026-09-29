/**
 * Заказчики: социальное доказательство без цитат от лица чужих сотрудников.
 * Логотипы публикуем только с письменного разрешения правообладателя,
 * поэтому по умолчанию здесь подписи-заготовки, а вместо отзыва — правила
 * работы: что заказчик получает по договору.
 */
export function Clients() {
  return (
    <section className="section section--sage" id="klienty" aria-labelledby="clients-title">
      <div className="container">
        <div className="section-head">
          <p className="kicker">Нам доверяют</p>
          <h2 className="h2" id="clients-title">
            Работаем с водоканалами, заводами и агрохолдингами
          </h2>
        </div>

        <ul className="logos">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index}>
              Логотип
              <br />
              с разрешения
            </li>
          ))}
        </ul>

        <p className="lead clients__note">
          Отбор проб, протоколы и отчётность — по договору, с закрывающими документами. Названия предприятий и
          логотипы публикуем только с их письменного согласия.
        </p>
      </div>
    </section>
  );
}
