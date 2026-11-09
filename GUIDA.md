# Sito Essecci Multiservice — Guida tecnica e di gestione

## In breve
- **Tecnologia:** [Astro](https://astro.build) (sito statico, veloce e SEO-friendly) + **Decap CMS** (pannello di gestione via browser su `/admin/`).
- **Hosting previsto:** Netlify (piano gratuito): HTTPS automatico, moduli con allegati, accesso al pannello.
- **Contenuti:** file JSON in `src/content/` (negozi, gestori, servizi, promo, impostazioni, pagina Drive2Store). Il pannello li modifica per te.

## Pagine
| URL | Contenuto |
|---|---|
| `/` | Home: i due negozi, servizi, Drive2Store, promo, partner, dove siamo, modulo |
| `/formigine/` | Centro TIM Formigine |
| `/maranello/` | Store Multibrand Maranello (gestori raggruppati per categoria) |
| `/servizi/` | Servizi in negozio |
| `/drive2store/` | Landing B2B Drive2Store |
| `/promozioni/` | Promo con filtro per negozio |
| `/contatti/` | Modulo intelligente + schede negozi con mappa |
| `/privacy/`, `/cookie/` | Bozze da far verificare al consulente |
| `/admin/` | Pannello di gestione |

## Gestire i contenuti (dopo la pubblicazione)
1. Vai su `https://<dominio>/admin/` e clicca **Accedi con GitHub**.
2. Scegli la sezione:
   - **Promozioni** — aggiungi, modifica, disattiva (spunta *Pubblicata*) o imposta una scadenza.
   - **Gestori / Partner** — es. per aggiungere *Tiscali (tramite SegnoVerde)*: apri la scheda già pronta e spunta **Attivo** e **Mostra nella striscia**. Il gestore comparirà da solo nella card Maranello in Home, nella pagina Maranello e nella striscia partner. Carica il **logo** per sostituire il nome scritto.
   - **Servizi** — titolo, descrizione, icona, negozi, se mostrarlo in Home.
   - **Negozi** — indirizzo, telefono, WhatsApp, email, orari, link social, foto.
   - **Pagine → Drive2Store** — tutti i testi della landing B2B.
   - **Impostazioni generali** — dati aziendali, logo, titolo della Home, argomenti del modulo contatti.
3. Clicca **Pubblica**: il sito si aggiorna da solo in 1–2 minuti.

> Tutto ciò che è marcato **[DA CONFERMARE]** o **[ESEMPIO]** è provvisorio e va sostituito dal pannello.

## Modulo contatti
- Il cliente sceglie **negozio** e **esigenza**; i campi cambiano (allegato bolletta fino a 8 MB, data/fascia oraria per l’assistenza, dati azienda per Drive2Store).
- Ogni richiesta arriva su uno di tre moduli Netlify: `contatti-formigine`, `contatti-maranello`, `contatti-drive2store`.
- In Netlify → **Forms → Form notifications** si associa a ciascun modulo l’email di destinazione (es. negozio di Formigine, negozio di Maranello, referente Drive2Store).
- Le richieste si leggono anche in Netlify → Forms (con l’allegato scaricabile).
- Se si aggiunge un campo al modulo, aggiungerlo anche in `public/moduli-netlify.html`.

## Messa online (una tantum)
1. **GitHub:** creare un repository privato (es. `essecci-sito`) e caricarvi il contenuto della cartella `sito/`.
2. **Netlify:** registrarsi con l’account GitHub → *Add new site → Import an existing project* → scegliere il repository. Le impostazioni di build sono già in `netlify.toml`.
3. **Moduli:** Netlify → *Forms* → **Enable form detection**, poi *Deploys → Trigger deploy*. Impostare le 3 notifiche email.
4. **Pannello /admin/:**
   - su GitHub: *Settings → Developer settings → OAuth Apps → New*; Homepage = URL del sito, Callback = `https://api.netlify.com/auth/done`;
   - su Netlify: *Site configuration → Access & security → OAuth → Install provider → GitHub* con Client ID e Secret;
   - in `public/admin/config.yml` sostituire `OWNER/REPO` con il repository reale e aggiornare `site_url`.
5. **Dominio:** Netlify → *Domain management → Add a domain*; impostare i DNS presso il registrar come indicato da Netlify. Il certificato **HTTPS** (Let’s Encrypt) si attiva in automatico.
6. Impostare la variabile `SITE_URL=https://www.<dominio>` (Netlify → *Environment variables*) per canonical, sitemap e robots.

## Sviluppo in locale
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
```
Per provare il pannello in locale: `npx decap-server` e poi `http://localhost:4321/admin/index.html`.

## Note
- Le mappe Google si caricano solo al clic (nessun cookie di terze parti senza azione dell’utente): per questo non serve un banner cookie. Se si aggiungono statistiche o pixel, serve un banner di consenso.
- I loghi dei gestori vanno usati secondo le linee guida dei rispettivi marchi.
