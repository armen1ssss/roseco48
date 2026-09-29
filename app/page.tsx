import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { WorkPhotos } from '@/components/WorkPhotos';
import { Tiles } from '@/components/Tiles';
import { Industries } from '@/components/Industries';
import { Steps } from '@/components/Steps';
import { Lab } from '@/components/Lab';
import { NatureBand } from '@/components/NatureBand';
import { Docs } from '@/components/Docs';
import { Clients } from '@/components/Clients';
import { Faq } from '@/components/Faq';
import { Contacts } from '@/components/Contacts';
import { Footer } from '@/components/Footer';
import { FaqJsonLd, OrganizationJsonLd } from '@/components/JsonLd';
import { faq } from '@/lib/content';

/**
 * Главная страница.
 *
 * Порядок блоков — по логике «вопрос клиента → ответ на него»:
 *   1. первый экран      — что делаем, где, чем подтверждено, что нажать;
 *   2. фотографии работы  — доказательство: за сайтом стоит лаборатория;
 *   3. плитки по объектам — быстрый вход для человека с задачей;
 *   4. отрасли            — «это подходит моей отрасли?»;
 *   5. процесс            — «что будет после заявки и сколько ждать»;
 *   6. лаборатория        — «вы сами делаете или перепродаёте?»;
 *   7. природная полоса   — регион и цифры, единственное место для них;
 *   8. документы          — «примут ли протоколы, проверю ли сам»;
 *   9. клиенты и отзыв    — «кто уже работал»;
 *  10. FAQ                — вопросы из реальных звонков;
 *  11. контакты и карта  — единственный тёплый акцент в конце, звонок первым шагом.
 *
 * Цифры 15 лет / 150 000 / 1000+ живут только в природной полосе:
 * повторённые дважды на одной странице, они перестают убеждать.
 * Поэтому строка доверия с главной убрана и осталась на «О компании».
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <WorkPhotos />
        <Tiles />
        <Industries />
        <Steps />
        {/* На главной фотографии уже показаны выше — в блоке лаборатории
            оставляем текст и цифры, без дублей кадров */}
        <Lab showMedia={false} />
        <NatureBand />
        <Docs limit={3} />
        <Clients />
        <Faq />
        <Contacts />
      </main>
      <Footer />
      <OrganizationJsonLd />
      <FaqJsonLd items={faq} />
    </>
  );
}
