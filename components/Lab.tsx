'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { equipment } from '@/lib/content';
import { asset } from '@/lib/asset';

/**
 * Кадры к пунктам галереи оборудования — по порядку пунктов в content.ts.
 * Ко всем шести пунктам есть фотография, поэтому заглушек в разметке нет.
 */
const photos = [
  { src: '/photos/lab-spectrometer.jpg', alt: 'Лаборант готовит пробу к анализу на спектрометре' },
  { src: '/photos/lab-chromatograph.jpg', alt: 'Лаборант ставит виалу в автосамплер газового хроматографа' },
  {
    src: '/photos/sampling-site.jpg',
    alt: 'Пробоотборник на телескопической штанге: отбор пробы воды с причала',
  },
  { src: '/photos/lab-balance.jpg', alt: 'Лаборант ставит бюкс на чашу аналитических весов в весовом зале' },
  { src: '/photos/lab-prep.jpg', alt: 'Дозирование пробы воды пипеткой в лабораторную посуду' },
  { src: '/photos/lab-instruments.jpg', alt: 'Аналитическое оборудование лаборатории на рабочих местах' },
];

const widePhoto = {
  src: '/photos/lab-instruments.jpg',
  alt: 'Общий вид лабораторного зала: приборы на рабочих местах',
};

/**
 * Лаборатория и оборудование — одна секция, одна мысль: собственные возможности.
 * Сертификат ГОСТ живёт в «Документах», здесь ему не место.
 *
 * Лайтбокс: закрывается по Esc, по клику вне панели и кнопкой;
 * фокус возвращается на кнопку галереи; фон не скроллится.
 */
export function Lab({ showMedia = true }: { showMedia?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex]);

  const close = () => {
    setOpenIndex(null);
    lastTrigger.current?.focus();
  };

  /* Два факта о лаборатории — текстом, без плашек: плашки читались
     как кнопки. На «О компании» — в левой колонке рядом с фотографией,
     на главной — строкой под текстом. */
  const factsBlock = (
    <ul className="facts">
      <li>
        <b>с 2010 года</b> ведём исследования в Липецкой области
      </li>
      <li>
        <b>Shimadzu</b> спектральное и хроматографическое оборудование
      </li>
    </ul>
  );

  return (
    <section className="section" id="laboratoriya" aria-labelledby="lab-title">
      <div className="container">
        <div className={showMedia ? 'lab' : 'lab lab--text'}>
          <div className="lab__text">
            <div className="section-head">
              <p className="kicker">Оснащение</p>
              <h2 className="h2" id="lab-title">
                Лаборатория, а не посредник
              </h2>
              <p className="lead">
                Анализы делаем сами: парк приборов, собственная пробоподготовка, аттестованные методики. Поэтому
                держим сроки и не перепродаём чужие протоколы.
              </p>
            </div>

            {showMedia && factsBlock}
          </div>

          {showMedia && (
            <Image
              src={asset(widePhoto.src)}
              alt={widePhoto.alt}
              width={1536}
              height={1024}
              sizes="(max-width: 1023px) 100vw, 560px"
              className="lab__img"
            />
          )}
        </div>

        {!showMedia && factsBlock}

        {showMedia && (
          <>
            <h3 className="visually-hidden">Фотографии оборудования</h3>
            <div className="gallery">
              {equipment.map((item, index) => (
                <figure key={item.label}>
                  <button
                    type="button"
                    onClick={(event) => {
                      lastTrigger.current = event.currentTarget;
                      setOpenIndex(index);
                    }}
                    aria-label={`Открыть фото: ${item.label}`}
                  >
                    <Image
                      src={asset(photos[index].src)}
                      alt={photos[index].alt}
                      width={1536}
                      height={1024}
                      sizes="(max-width: 1023px) 47vw, 360px"
                      className="gallery__img"
                    />
                  </button>
                  <figcaption>{item.label}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
      </div>

      {openIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={equipment[openIndex].label}
          onClick={close}
        >
          <div className="lightbox__panel" onClick={(event) => event.stopPropagation()}>
            <Image
              src={asset(photos[openIndex].src)}
              alt={photos[openIndex].alt}
              width={1536}
              height={1024}
              sizes="(max-width: 760px) 100vw, 720px"
              className="lightbox__img"
            />
            <div className="lightbox__row">
              <p className="muted">{equipment[openIndex].label}</p>
              <button className="btn btn--ghost btn--sm" type="button" onClick={close} autoFocus>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
