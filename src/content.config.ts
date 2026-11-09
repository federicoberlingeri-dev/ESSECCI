// Modello dati dei contenuti gestibili dal pannello /admin.
// Ogni file JSON in src/content/<cartella> è un elemento. Aggiungere un gestore = aggiungere un file in gestori/.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const json = (dir: string) => glob({ pattern: '*.json', base: `./src/content/${dir}` });
const negozioId = z.enum(['formigine', 'maranello']);
const social = z.object({
  facebook: z.string().optional().default(''),
  instagram: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
});

const negozi = defineCollection({
  loader: json('negozi'),
  schema: z.object({
    nome: z.string(),
    nomeBreve: z.string(),
    tipo: z.string(),
    slogan: z.string(),
    descrizione: z.string(),
    clienti: z.string().optional().default(''),
    offerta: z.array(z.object({ titolo: z.string(), testo: z.string().optional().default('') })).default([]),
    indirizzo: z.string(),
    citta: z.string(),
    telefono: z.string().optional().default(''),
    whatsapp: z.string().optional().default(''),
    email: z.string().optional().default(''),
    orari: z.array(z.object({ giorni: z.string(), ore: z.string() })).default([]),
    mappa: z.string().optional().default(''),
    foto: z.string().optional().default(''),
    social: social.default({ facebook: '', instagram: '', linkedin: '' }),
    ordine: z.number().default(0),
  }),
});

const gestori = defineCollection({
  loader: json('gestori'),
  schema: z.object({
    nome: z.string(),
    negozi: z.array(negozioId).min(1),
    categoria: z.string(),
    descrizione: z.string().optional().default(''),
    logo: z.string().optional().default(''),
    sito: z.string().optional().default(''),
    attivo: z.boolean().default(true),
    striscia: z.boolean().default(true),
    ordine: z.number().default(0),
  }),
});

const servizi = defineCollection({
  loader: json('servizi'),
  schema: z.object({
    titolo: z.string(),
    descrizione: z.string(),
    icona: z.string().default('star'),
    negozi: z.array(negozioId).default(['formigine', 'maranello']),
    esigenza: z.string().optional().default(''),
    home: z.boolean().default(false),
    attivo: z.boolean().default(true),
    ordine: z.number().default(0),
  }),
});

const promo = defineCollection({
  loader: json('promo'),
  schema: z.object({
    titolo: z.string(),
    negozio: z.enum(['formigine', 'maranello', 'entrambi']),
    gestore: z.string().optional().default(''),
    descrizione: z.string(),
    immagine: z.string().optional().default(''),
    etichetta: z.string().optional().default(''),
    scadenza: z.string().optional().default(''),
    note: z.string().optional().default(''),
    esigenza: z.string().optional().default(''),
    attiva: z.boolean().default(true),
    ordine: z.number().default(0),
  }),
});

const impostazioni = defineCollection({
  loader: json('impostazioni'),
  schema: z.object({
    ragioneSociale: z.string(),
    marchio: z.string(),
    piva: z.string(),
    sedeLegale: z.string(),
    emailGenerale: z.string(),
    logo: z.string().optional().default(''),
    linkedinAzienda: z.string().optional().default(''),
    hero: z.object({
      titolo: z.string(),
      evidenza: z.string(),
      sottotitolo: z.string(),
      foto: z.string().optional().default(''),
    }),
    esigenze: z.array(z.object({
      id: z.string(),
      etichetta: z.string(),
      tipo: z.enum(['standard', 'bolletta', 'appuntamento', 'b2b']),
      negozi: z.array(negozioId).default(['formigine', 'maranello']),
    })),
  }),
});

const pagine = defineCollection({
  loader: json('pagine'),
  schema: z.object({
    titolo: z.string(),
    sottotitolo: z.string(),
    introduzione: z.string().optional().default(''),
    destinatari: z.array(z.string()).default([]),
    strumenti: z.array(z.object({ titolo: z.string(), testo: z.string(), icona: z.string().default('star') })).default([]),
    passi: z.array(z.object({ titolo: z.string(), testo: z.string() })).default([]),
    vantaggi: z.array(z.string()).default([]),
    cta: z.string().optional().default(''),
  }),
});

export const collections = { negozi, gestori, servizi, promo, impostazioni, pagine };
