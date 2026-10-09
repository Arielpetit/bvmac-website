import type { Locale } from "@/i18n/config";
import type { MarketStatus } from "@/data/market";

export const STATUS_LABEL: Record<Locale, Record<MarketStatus, string>> = {
  fr: { NC: "Non coté (NC)", PEq: "Prix d’équilibre (PEq)", Suspendu: "Suspendu" },
  en: { NC: "Not traded (NC)", PEq: "Equilibrium price (PEq)", Suspendu: "Suspended" },
  es: { NC: "Sin cotizar (NC)", PEq: "Precio de equilibrio (PEq)", Suspendu: "Suspendido" },
};

// Short definitions shown as hints on table headers.
export const COLUMN_HINTS: Record<Locale, Record<string, string>> = {
  fr: {
    isin: "Code international unique qui identifie un titre.",
    dividend: "Dernier dividende versé par action, avec sa date de paiement.",
    nominal: "Valeur faciale du titre fixée lors de son émission.",
    ref: "Cours de départ de la séance, base de calcul de la variation.",
    close: "Cours retenu à l’issue de la séance.",
    change: "Évolution du cours de clôture par rapport au cours de référence.",
    demanded: "Nombre de titres demandés par les acheteurs pendant la séance.",
    offered: "Nombre de titres proposés par les vendeurs pendant la séance.",
    traded: "Nombre de titres réellement échangés pendant la séance.",
    status: "NC : aucune transaction. PEq : cours d’équilibre publié (définition à confirmer par la BVMAC).",
  },
  en: {
    isin: "Unique international code identifying a security.",
    dividend: "Last dividend paid per share, with its payment date.",
    nominal: "Face value set when the security was issued.",
    ref: "Starting price of the session, used to compute the change.",
    close: "Price recorded at the end of the session.",
    change: "Change of the closing price versus the reference price.",
    demanded: "Number of securities bid during the session.",
    offered: "Number of securities offered during the session.",
    traded: "Number of securities actually traded.",
    status: "NC: no trade. PEq: equilibrium price published (definition to be confirmed by BVMAC).",
  },
  es: {
    isin: "Código internacional único que identifica un valor.",
    dividend: "Último dividendo pagado por acción, con su fecha de pago.",
    nominal: "Valor nominal fijado en la emisión.",
    ref: "Precio de partida de la sesión, base de la variación.",
    close: "Precio registrado al final de la sesión.",
    change: "Variación del cierre respecto al precio de referencia.",
    demanded: "Número de títulos demandados durante la sesión.",
    offered: "Número de títulos ofrecidos durante la sesión.",
    traded: "Número de títulos realmente negociados.",
    status: "NC: sin operación. PEq: precio de equilibrio publicado (definición por confirmar por la BVMAC).",
  },
};

export function formatListedOn(value: string | null, locale: Locale): string {
  if (!value) return { fr: "Non communiquée", en: "Not disclosed", es: "No comunicada" }[locale];
  if (value.length === 4) return value;
  if (value.length === 7) {
    return new Intl.DateTimeFormat({ fr: "fr-FR", en: "en-GB", es: "es-ES" }[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}-15T00:00:00Z`));
  }
  return new Intl.DateTimeFormat({ fr: "fr-FR", en: "en-GB", es: "es-ES" }[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}
