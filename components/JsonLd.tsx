import { company } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

/** Микроразметка организации: адрес, телефон, часы работы. */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    telephone: company.phoneFree,
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. М.И. Неделина, д. 1В, офис 201/202',
      addressLocality: 'Липецк',
      postalCode: '398059',
      addressCountry: 'RU',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
    foundingDate: String(company.yearFounded),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** FAQPage: вопросы попадают в расширенную выдачу. */
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** BreadcrumbList: путь в выдаче вместо голого URL. */
export function BreadcrumbsJsonLd({ items }: { items: { label: string; href: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href === '/' ? '' : item.href}`,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** Service: разметка страницы услуги. */
export function ServiceJsonLd({ name, description, slug }: { name: string; description: string; slug: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: `${SITE_URL}/uslugi/${slug}`,
    provider: { '@type': 'Organization', name: company.name, telephone: company.phoneFree },
    areaServed: { '@type': 'AdministrativeArea', name: 'Липецкая область' },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
