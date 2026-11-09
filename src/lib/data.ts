// Accesso ai contenuti: ordinamento, filtri "attivo" e utilità condivise.
import { getCollection, getEntry } from 'astro:content';

export type NegozioId = 'formigine' | 'maranello';

const byOrder = <T extends { data: { ordine: number } }>(a: T, b: T) => a.data.ordine - b.data.ordine;

export async function getImpostazioni() {
  const e = await getEntry('impostazioni', 'sito');
  if (!e) throw new Error('Manca src/content/impostazioni/sito.json');
  return e.data;
}

export async function getNegozi() {
  return (await getCollection('negozi')).sort(byOrder);
}

export async function getNegozio(id: NegozioId) {
  const e = await getEntry('negozi', id);
  if (!e) throw new Error(`Manca src/content/negozi/${id}.json`);
  return e;
}

export async function getGestori(negozio?: NegozioId) {
  return (await getCollection('gestori', (g) => g.data.attivo && (!negozio || g.data.negozi.includes(negozio)))).sort(byOrder);
}

export async function getServizi(filtro: { negozio?: NegozioId; home?: boolean } = {}) {
  return (await getCollection('servizi', (s) =>
    s.data.attivo &&
    (!filtro.negozio || s.data.negozi.includes(filtro.negozio)) &&
    (!filtro.home || s.data.home)
  )).sort(byOrder);
}

/** Promo attive e non scadute (la scadenza viene ricontrollata anche lato browser). */
export async function getPromo(negozio?: NegozioId) {
  const oggi = new Date().toISOString().slice(0, 10);
  return (await getCollection('promo', (p) =>
    p.data.attiva &&
    (!p.data.scadenza || p.data.scadenza >= oggi) &&
    (!negozio || p.data.negozio === negozio || p.data.negozio === 'entrambi')
  )).sort(byOrder);
}

export async function getPagina(id: string) {
  const e = await getEntry('pagine', id);
  if (!e) throw new Error(`Manca src/content/pagine/${id}.json`);
  return e.data;
}

/** Testo segnaposto non ancora fornito dal cliente. */
export const daConfermare = (v?: string) => !v || v.includes('[DA CONFERMARE]');

export const telHref = (t: string) => `tel:${t.replace(/[^\d+]/g, '')}`;
export const waHref = (t: string) => `https://wa.me/${t.replace(/[^\d]/g, '')}`;

export const temaNegozio: Record<NegozioId, string> = { formigine: 't-tim', maranello: 't-mb' };

/** Dati strutturati LocalBusiness (SEO locale). Omessi finché l'indirizzo non è confermato. */
export function localBusinessLd(n: { id: string; data: { nome: string; indirizzo: string; citta: string; telefono: string; email: string; social: Record<string, string | undefined> } }, site: URL) {
  if (daConfermare(n.data.indirizzo)) return undefined;
  const d = n.data;
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: d.nome,
    url: new URL(`/${n.id}/`, site).href,
    address: { '@type': 'PostalAddress', streetAddress: d.indirizzo, addressLocality: d.citta.replace(/\s*\(.*\)/, ''), addressRegion: 'MO', addressCountry: 'IT' },
    ...(daConfermare(d.telefono) ? {} : { telephone: d.telefono }),
    ...(daConfermare(d.email) ? {} : { email: d.email }),
    sameAs: Object.values(d.social).filter(Boolean),
  };
}
