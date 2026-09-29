import Link from 'next/link';
import Image from 'next/image';
import { asset } from '@/lib/asset';
import { documents } from '@/lib/content';

/**
 * Документы и статус.
 *
 * Правило: любой документ можно скачать и проверить по ссылке в реестр.
 * Декорация («документ в рамке», «диплом в папке») не доказывает ничего,
 * поэтому в карточке — превью реального скана, номер, срок действия
 * и кнопка с результатом: «Скачать PDF» плюс вес файла.
 *
 * Мобильный: карточка горизонтальная — превью 88 px, текст справа:
 * так три документа помещаются на экран без бесконечной прокрутки.
 */
export function Docs({ limit }: { limit?: number }) {
  const list = limit ? documents.slice(0, limit) : documents;

  return (
    <section className="section section--line" id="dokumenty" aria-labelledby="docs-title">
      <div className={`container${limit ? ' center' : ''}`}>
        <div className="section-head">
          <p className="kicker">Статус и аккредитация</p>
          <h2 className="h2" id="docs-title">
            Протоколы принимают надзорные органы и суды
          </h2>
          <p className="lead">
            Работаем по области аккредитации. Любой документ можно проверить в реестрах по прямым ссылкам.
          </p>
        </div>

        <div className="grid-3" style={limit ? { textAlign: 'left' } : undefined}>
          {list.map((doc) => (
            <article className="doc-card" key={doc.id} id={doc.id}>
              <div className="doc-card__preview">
                <Image src={asset('/docs/preview-blank.svg')} alt="" fill sizes="88px" style={{ objectFit: 'cover' }} />
              </div>
              <div className="doc-card__body">
                <h3 className="h4">{doc.title}</h3>
                <p className="doc-card__meta">{doc.meta}</p>
                <a className="link link--block" href={asset(doc.href)} download>
                  {doc.file}
                </a>
                <Link className="link--quiet link--block" href="/dokumenty#registry">
                  {doc.registry} ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
