import { company, mapPoint } from '@/lib/content';

/**
 * Контакты и карта — привычная схема: слева телефон, почта, адрес и график,
 * справа карта с кнопкой «Открыть на карте».
 *
 * Заявку принимаем голосом: для расчёта нужно уточнить объект, показатели и
 * сроки — это быстрее обсудить, чем описывать в форме. Кнопка «Позвонить»
 * на телефоне открывает звонилку в одно нажатие, поэтому это ссылка tel:.
 *
 * Карта встроена через виджет и грузится лениво: пока её нет, на месте карты
 * стоит адрес — блок не выглядит пустым и адрес всё равно читается.
 */
export function Contacts({ id = 'zayavka' }: { id?: string }) {
  return (
    <section className="section section--line" id={id} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="section-head">
          <p className="kicker">Контакты</p>
          <h2 className="h2" id={`${id}-title`}>
            Позвоните — посчитаем стоимость
          </h2>
          <p className="lead">
            Скажите, что за объект и какие показатели нужны. Цену и срок назовём в разговоре, письменный расчёт
            пришлём после него.
          </p>
        </div>

        <div className="contact-layout">
          <div className="contact-panel">
            <div className="info-list">
              <div>
                <span>Единый номер, бесплатно</span>
                <b>
                  <a href={company.phoneHref}>{company.phoneFree}</a>
                </b>
              </div>
              <div>
                <span>Городской номер</span>
                <b>
                  <a href={company.phoneCityHref}>{company.phoneCity}</a>
                </b>
              </div>
              <div>
                <span>Почта для заявок и документов</span>
                <b>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </b>
              </div>
              <div>
                <span>Адрес</span>
                <b>{company.addressFull}</b>
                <span className="mt-3">{company.addressNote}</span>
              </div>
              <div>
                <span>График работы</span>
                <b>{company.hours}</b>
              </div>
            </div>

            <div className="btn-row">
              <a className="btn btn--primary" href={company.phoneHref}>
                Позвонить: {company.phoneFree}
              </a>
              <a className="btn btn--ghost" href={`mailto:${company.email}`}>
                Написать письмо
              </a>
            </div>

            <p className="small muted mt-4">
              Что подготовить к звонку: адрес объекта, список показателей или цель анализа, нужный срок.
            </p>
          </div>

          <div className="contact-map">
            <div className="map">
              {/* Пока карта грузится (или если её заблокируют), в блоке виден адрес, а не пустое поле */}
              <p className="map__placeholder" aria-hidden="true">
                <b>{mapPoint.label}</b>
                {company.addressNote}
              </p>
              <iframe
                className="map__frame"
                src={mapPoint.embed}
                title={`Карта: ${company.addressFull}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="map__row">
              <p className="map__address">
                <b>{mapPoint.label}</b>
                {company.addressNote}
              </p>
              <a className="btn btn--ghost btn--sm" href={mapPoint.link} target="_blank" rel="noopener noreferrer">
                Открыть на карте
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
