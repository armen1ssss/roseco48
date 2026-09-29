import Image from 'next/image';
import { asset } from '@/lib/asset';
import { workPhotos } from '@/lib/content';

/**
 * Секция фотографий сразу после первого экрана.
 * Задача: за две секунды показать, что за сайтом стоит работающая лаборатория.
 * Подпись объясняет, что кадр доказывает, — без неё фотография молчит.
 *
 * Пропорция 3:2 задана в CSS, размеры — через next/image:
 * страница не «прыгает» при загрузке (CLS = 0).
 */
export function WorkPhotos() {
  return (
    <section className="section section--flush" aria-labelledby="photos-title">
      <div className="container">
        <div className="section-head">
          <p className="kicker">Как это выглядит</p>
          <h2 className="h2" id="photos-title">
            Работа, которую можно показать
          </h2>
          <p className="lead">
            Приборы, руки, пробы и выезды. Эти кадры сняты в лаборатории и на объектах — их нельзя нарисовать.
          </p>
        </div>

        <div className="photo-row">
          {workPhotos.map((photo) => (
            <figure key={photo.src}>
              <Image
                src={asset(photo.src)}
                alt={photo.alt}
                width={1536}
                height={1024}
                /* Ширина слота по сетке: на десктопе колонка 534 px. Заниженный sizes
                   заставлял браузер брать файл 360 px и фото мылились. */
                sizes="(max-width: 699px) 100vw, (max-width: 1023px) 50vw, (max-width: 1259px) 47vw, 534px"
                className="photo-row__img"
              />
              <figcaption>
                <b>{photo.title}</b>
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
