// Contenido de la Escuela de Bolsa en español. Misma estructura, slugs y respuestas que school.ts (fuente en francés).
import type { Lesson, Path } from "./school";

export const PATHS_ES: Path[] = [
  { slug: "comprendre-la-bourse", title: "Comprender la bolsa", text: "Qué es una bolsa, para qué sirve y quién hace qué en el mercado regional.", badge: "Primer paso" },
  { slug: "investir-via-une-societe-de-bourse", title: "Invertir a través de una sociedad de bolsa", text: "Abrir una cuenta, dar una orden, conocer sus gastos y sus derechos.", badge: "Inversor informado" },
  { slug: "lire-un-boc", title: "Leer un BOC", text: "Comprender las columnas del Boletín Oficial de Cotización.", badge: "Lector del BOC" },
  { slug: "investir-dans-une-obligation", title: "Invertir en una obligación", text: "Cupón, vencimiento, riesgo del emisor: lo esencial del mercado de obligaciones.", badge: "Experto en obligaciones" },
  { slug: "s-introduire-en-bourse", title: "Salir a bolsa", text: "Por qué y cómo una empresa o un Estado capta fondos en bolsa.", badge: "Emisor informado" },
];

export const LESSONS_ES: Lesson[] = [
  {
    slug: "comprendre-la-bourse", path: "comprendre-la-bourse", title: "¿Para qué sirve una bolsa?", minutes: 4,
    sections: [
      { h: "Un lugar de encuentro", p: "Una bolsa pone en contacto a empresas o Estados que necesitan financiación con ahorradores que buscan invertir su dinero. Organiza estos intercambios según reglas comunes y públicas." },
      { h: "Dos mercados", p: "En el mercado primario, un emisor vende valores nuevos para captar fondos. En el mercado secundario, los inversores se intercambian después esos valores: es la cotización diaria." },
    ],
    keep: "La bolsa financia la economía y permite a los ahorradores comprar o vender valores en un marco regulado.",
    quiz: [
      { q: "¿En qué mercado capta un emisor fondos nuevos?", options: ["El mercado primario", "El mercado secundario", "El mercado de divisas"], answer: 0, explain: "El mercado primario es el de la emisión: el dinero va al emisor." },
      { q: "¿Qué ocurre en el mercado secundario?", options: ["El emisor recibe dinero", "Los inversores se intercambian valores existentes", "El banco central fija los tipos"], answer: 1, explain: "En el mercado secundario, el dinero pasa de un inversor a otro." },
      { q: "¿Quién fija las reglas del mercado financiero regional?", options: ["Las sociedades cotizadas", "La COSUMAF", "Cada inversor"], answer: 1, explain: "La COSUMAF es la autoridad de regulación y supervisión del mercado." },
      { q: "¿Cuáles son actores del mercado regional? (varias respuestas)", options: ["La COSUMAF", "Las sociedades de bolsa", "El FMI", "La BVMAC"], answer: [0, 1, 3], explain: "El regulador, los intermediarios y la empresa de mercado forman parte del mercado; el FMI no interviene." },
    ],
  },
  {
    slug: "actions-et-obligations", path: "comprendre-la-bourse", title: "Acciones y obligaciones", minutes: 5,
    sections: [
      { h: "La acción", p: "Una acción es una parte del capital de una sociedad. El accionista se convierte en copropietario: puede cobrar un dividendo y votar en la junta general. El precio de la acción varía según la oferta y la demanda." },
      { h: "La obligación", p: "Una obligación es un préstamo concedido a un emisor (empresa, Estado, institución). A cambio, el emisor paga intereses llamados cupones y reembolsa el capital al vencimiento." },
    ],
    keep: "Acción = parte del capital, rendimientos variables. Obligación = préstamo, rendimientos fijados de antemano pero no sin riesgo.",
    quiz: [
      { q: "¿Qué es una obligación?", options: ["Una parte del capital", "Un préstamo a un emisor", "Una cuenta de ahorro"], answer: 1, explain: "El obligacionista presta dinero y cobra cupones." },
      { q: "¿Está garantizado el dividendo de una acción?", options: ["Sí, siempre", "No, depende de los resultados y del voto de la junta", "Sí, si figura en el BOC"], answer: 1, explain: "El dividendo lo decide cada año la junta general." },
      { q: "¿Cómo se llama el interés que paga una obligación?", options: ["El cupón", "El nominal", "La prima"], answer: 0, explain: "El cupón es el interés periódico de la obligación." },
      { q: "¿Qué derechos tiene un accionista? (varias respuestas)", options: ["Cobrar un dividendo si se aprueba", "Votar en la junta general", "Ser reembolsado en una fecha fija", "Cobrar un cupón garantizado"], answer: [0, 1], explain: "El accionista tiene derecho al dividendo aprobado y al voto; el reembolso y el cupón corresponden a las obligaciones." },
    ],
  },
  {
    slug: "qui-fait-quoi", path: "comprendre-la-bourse", title: "¿Quién hace qué en el mercado regional?", minutes: 4,
    sections: [
      { h: "Las instituciones", p: "La COSUMAF regula y supervisa. La BVMAC organiza la cotización y difunde la información. El depositario central conserva los valores y se encarga de la liquidación." },
      { h: "Los intermediarios", p: "Las sociedades de bolsa, autorizadas por la COSUMAF, reciben y ejecutan las órdenes de los inversores. Un particular siempre pasa por una de ellas." },
    ],
    keep: "Para invertir, se pasa por una sociedad de bolsa autorizada; la BVMAC organiza el mercado.",
    quiz: [
      { q: "¿Dónde da un particular una orden?", options: ["Directamente a la BVMAC", "En una sociedad de bolsa autorizada", "En la COSUMAF"], answer: 1, explain: "Solo las sociedades de bolsa autorizadas reciben órdenes del público." },
      { q: "¿Quién conserva los valores?", options: ["El depositario central", "La sociedad cotizada", "El inversor, en papel"], answer: 0, explain: "El depositario central se encarga de la custodia y la liquidación." },
      { q: "¿Cuál es el papel de la BVMAC?", options: ["Prestar dinero", "Organizar la cotización y difundir la información", "Fijar los impuestos"], answer: 1, explain: "La BVMAC es la empresa de mercado." },
    ],
  },
  {
    slug: "ouvrir-un-compte", path: "investir-via-une-societe-de-bourse", title: "Abrir una cuenta de valores", minutes: 4,
    sections: [
      { h: "Dos cuentas", p: "La sociedad de bolsa abre una cuenta de valores, donde se inscriben sus títulos, y una cuenta de efectivo, que recibe sus fondos, dividendos y cupones." },
      { h: "Los documentos exigidos", p: "Un documento de identidad, un justificante de domicilio e información sobre su situación y sus objetivos. Esta información permite al intermediario comprobar que los productos le convienen." },
    ],
    keep: "Cuenta de valores + cuenta de efectivo, abiertas por una sociedad de bolsa tras verificar su identidad.",
    quiz: [
      { q: "¿Dónde se inscriben sus acciones?", options: ["En la cuenta de valores", "En la cuenta de efectivo", "En el BOC"], answer: 0, explain: "La cuenta de valores recoge sus títulos." },
      { q: "¿Por qué el intermediario le pregunta por sus objetivos?", options: ["Por curiosidad", "Para comprobar la idoneidad de los productos", "Para fijar el precio"], answer: 1, explain: "Es una norma de protección de los inversores." },
      { q: "¿Dónde se pagan los dividendos?", options: ["En la cuenta de efectivo", "Solo en títulos", "A la BVMAC"], answer: 0, explain: "Los ingresos en dinero llegan a la cuenta de efectivo." },
    ],
  },
  {
    slug: "passer-un-ordre", path: "investir-via-une-societe-de-bourse", title: "Dar una orden de bolsa", minutes: 5,
    sections: [
      { h: "El contenido de una orden", p: "Una orden indica el sentido (compra o venta), el valor, la cantidad, el posible precio límite y el plazo de validez." },
      { h: "La ejecución", p: "La sociedad de bolsa transmite la orden al mercado. En la BVMAC, las órdenes se casan en el fixing: se fija un precio único y se ejecutan las órdenes compatibles." },
    ],
    keep: "Una orden precisa (sentido, valor, cantidad, precio, validez) se ejecuta en el fixing si encuentra contrapartida.",
    quiz: [
      { q: "¿Qué es el fixing?", options: ["Una comisión", "El casamiento de órdenes para fijar un precio", "Un dividendo"], answer: 1, explain: "El fixing determina un precio de equilibrio entre oferta y demanda." },
      { q: "¿Se ejecuta siempre una orden?", options: ["Sí", "No, necesita una contrapartida compatible", "Sí, si el importe es elevado"], answer: 1, explain: "Sin vendedor al precio pedido, una orden de compra limitada queda pendiente." },
      { q: "¿Qué información no figura en una orden?", options: ["La cantidad", "El sentido", "El dividendo futuro"], answer: 2, explain: "El dividendo futuro no se conoce al dar la orden." },
    ],
  },
  {
    slug: "frais-et-droits", path: "investir-via-une-societe-de-bourse", title: "Gastos y derechos del inversor", minutes: 4,
    sections: [
      { h: "Los gastos", p: "Cada operación soporta comisiones (mercado, depositario, regulador, corretaje) y la cuenta puede soportar derechos de custodia. Compare las tarifas publicadas por las sociedades de bolsa." },
      { h: "Los derechos", p: "El accionista tiene derecho a los dividendos aprobados, al voto en la junta y a la información. En caso de litigio, puede presentar una reclamación." },
    ],
    keep: "Conozca sus gastos antes de invertir; conozca sus derechos después.",
    quiz: [
      { q: "¿Qué son los derechos de custodia?", options: ["Gastos de mantenimiento de la cuenta de valores", "Un impuesto", "Un dividendo"], answer: 0, explain: "Remuneran la conservación de los valores." },
      { q: "¿Qué hacer en caso de litigio?", options: ["Nada", "Dirigirse a su sociedad de bolsa y luego presentar una reclamación", "Vender sus valores"], answer: 1, explain: "La reclamación va primero al intermediario y después a la BVMAC." },
      { q: "¿Son iguales las tarifas en todas partes?", options: ["Sí", "No, el corretaje varía según la sociedad", "Sí, las fija la ley"], answer: 1, explain: "Cada sociedad de bolsa fija libremente su corretaje." },
    ],
  },
  {
    slug: "lire-un-boc", path: "lire-un-boc", title: "Las columnas del BOC", minutes: 5,
    sections: [
      { h: "Precio de referencia y de cierre", p: "El precio de referencia es el punto de partida de la sesión. El precio de cierre es el que se registra al final de la sesión. La variación compara ambos, en porcentaje." },
      { h: "Cantidades", p: "La cantidad demandada y la ofrecida muestran el interés de compradores y vendedores. La cantidad negociada indica los valores realmente intercambiados." },
    ],
    keep: "Variación = (cierre − referencia) ÷ referencia. Negociado = realmente intercambiado.",
    quiz: [
      { q: "Un valor pasa de 10 000 a 10 100 FCFA. ¿Cuál es la variación?", options: ["+1 %", "+10 %", "+0,1 %"], answer: 0, explain: "100 ÷ 10 000 = 1 %." },
      { q: "¿Qué significa una cantidad negociada de cero?", options: ["No se intercambió ningún valor", "El valor ha sido excluido", "El precio se ha duplicado"], answer: 0, explain: "Puede haber órdenes sin intercambio." },
      { q: "¿Cuándo se publica el BOC?", options: ["Después de cada sesión", "Una vez al año", "Solo en una salida a bolsa"], answer: 0, explain: "La BVMAC publica el BOC tras cada sesión de cotización." },
    ],
  },
  {
    slug: "statuts-et-avis", path: "lire-un-boc", title: "Situación de cotización y avisos", minutes: 3,
    sections: [
      { h: "La situación de un valor", p: "Un valor puede cotizar, no cotizar ese día (sin intercambios) o estar suspendido por la BVMAC tras informar a la COSUMAF y al emisor." },
      { h: "Los avisos", p: "Los avisos de la BVMAC anuncian los acontecimientos: salidas a bolsa, dividendos, juntas, suspensiones. Están numerados y fechados." },
    ],
    keep: "Lea la situación junto con el precio y siga los avisos numerados de la BVMAC.",
    quiz: [
      { q: "¿Quién puede suspender un valor?", options: ["La BVMAC, tras informar a la COSUMAF y al emisor", "Un accionista", "La sociedad de bolsa"], answer: 0, explain: "Es una prerrogativa de la empresa de mercado." },
      { q: "¿Dónde encontrar el anuncio de un dividendo?", options: ["En un aviso de la BVMAC", "Solo en las redes sociales", "En ninguna parte"], answer: 0, explain: "Los avisos oficiales son la fuente de referencia." },
      { q: "«Sin cotizar hoy» significa:", options: ["Ningún intercambio durante la sesión", "El valor ha desaparecido", "El precio está garantizado"], answer: 0, explain: "El valor sigue admitido a cotización." },
    ],
  },
  {
    slug: "investir-dans-une-obligation", path: "investir-dans-une-obligation", title: "Cupón, vencimiento, nominal", minutes: 5,
    sections: [
      { h: "El vocabulario", p: "El nominal es el valor facial de la obligación. El tipo de interés aplicado al nominal da el cupón. El vencimiento es la fecha de reembolso." },
      { h: "El precio", p: "Antes del vencimiento, una obligación se negocia a un precio expresado en porcentaje del nominal. Este precio varía, en particular, con los tipos de interés y la solvencia del emisor." },
    ],
    keep: "Cupón = nominal × tipo. El precio de una obligación se lee en % del nominal.",
    quiz: [
      { q: "Nominal 10 000 FCFA, tipo 6 %. ¿Cuál es el cupón anual?", options: ["600 FCFA", "60 FCFA", "6 000 FCFA"], answer: 0, explain: "10 000 × 6 % = 600 FCFA." },
      { q: "Un precio de 101 significa:", options: ["101 % del nominal", "101 FCFA", "101 títulos"], answer: 0, explain: "El precio de las obligaciones se expresa en porcentaje del nominal." },
      { q: "¿Qué es el vencimiento?", options: ["La fecha de reembolso", "La fecha del dividendo", "La fecha de salida a bolsa"], answer: 0, explain: "Al vencimiento se reembolsa el capital." },
    ],
  },
  {
    slug: "risques-obligataires", path: "investir-dans-une-obligation", title: "Los riesgos de una obligación", minutes: 4,
    sections: [
      { h: "El riesgo del emisor", p: "Si el emisor atraviesa dificultades, puede pagar con retraso o no reembolsar. El documento informativo visado por la COSUMAF describe al emisor y la operación." },
      { h: "El riesgo de precio", p: "Si vende antes del vencimiento, el precio puede ser inferior al que pagó. Un mercado poco activo también puede hacer más lenta la reventa." },
    ],
    keep: "Una obligación no está exenta de riesgo: lea el documento informativo.",
    quiz: [
      { q: "¿Qué documento describe una emisión de obligaciones?", options: ["El documento informativo visado por la COSUMAF", "El BOC", "El extracto bancario"], answer: 0, explain: "Presenta al emisor, las condiciones y los riesgos." },
      { q: "Vender antes del vencimiento puede suponer:", options: ["Una pérdida o una ganancia según el precio", "Siempre una ganancia", "Una multa"], answer: 0, explain: "El precio de mercado varía antes del vencimiento." },
      { q: "¿Puede un Estado emitir obligaciones en la BVMAC?", options: ["Sí", "No", "Solo Gabón"], answer: 0, explain: "Los Estados de la CEMAC emiten obligaciones en el mercado regional." },
    ],
  },
  {
    slug: "pourquoi-entrer-en-bourse", path: "s-introduire-en-bourse", title: "¿Por qué salir a bolsa?", minutes: 4,
    sections: [
      { h: "Captar fondos", p: "La bolsa permite financiar proyectos abriendo el capital o tomando prestado de un público amplio, sin depender de un único prestamista." },
      { h: "Visibilidad y exigencias", p: "La cotización aporta visibilidad y un valor de mercado, pero exige transparencia, gobernanza y publicación regular de información." },
    ],
    keep: "Salir a bolsa: más financiación y visibilidad, a cambio de transparencia.",
    quiz: [
      { q: "Una sociedad cotizada debe:", options: ["Publicar su información con regularidad", "Mantener sus cuentas en secreto", "Pagar un dividendo fijo"], answer: 0, explain: "La transparencia es la contrapartida del acceso al mercado." },
      { q: "¿Quién examina una solicitud de salida a bolsa?", options: ["El Comité de Admisión y Desarrollo de la BVMAC", "Solo los accionistas actuales", "Solo la sociedad de bolsa"], answer: 0, explain: "La decisión se publica mediante aviso." },
      { q: "¿Puede una empresa captar fondos con obligaciones?", options: ["Sí", "No", "Solo los bancos"], answer: 0, explain: "Empresas, Estados e instituciones pueden emitir obligaciones." },
    ],
  },
  {
    slug: "etapes-introduction", path: "s-introduire-en-bourse", title: "Las etapas de una salida a bolsa", minutes: 5,
    sections: [
      { h: "Preparar", p: "La empresa se adecua a la normativa, audita sus cuentas y elige una sociedad de bolsa y asesores." },
      { h: "Obtener las autorizaciones", p: "Presenta un expediente de admisión a la BVMAC y un documento informativo sometido al visado de la COSUMAF; después se abre la oferta pública antes de la primera cotización." },
    ],
    keep: "Preparación, expediente, visado, decisión publicada mediante aviso y, después, primera cotización.",
    quiz: [
      { q: "¿Quién visa el documento informativo?", options: ["La COSUMAF", "La BEAC", "El depositario"], answer: 0, explain: "El visado de la COSUMAF es obligatorio para una oferta pública." },
      { q: "¿Qué segmento exige una capitalización de al menos 10 000 millones de FCFA?", options: ["A-Premium", "Todos", "Ninguno"], answer: 0, explain: "Es uno de los criterios del segmento A-Premium." },
      { q: "¿Cómo se hace pública la decisión de admisión?", options: ["Mediante un aviso de la BVMAC", "Por carta privada", "Sigue siendo confidencial"], answer: 0, explain: "Las decisiones se publican en los avisos." },
    ],
  },
  {
    slug: "diversifier", path: "investir-via-une-societe-de-bourse", title: "Diversificar y pensar a largo plazo", minutes: 3,
    sections: [
      { h: "No apostarlo todo a un valor", p: "Repartir el ahorro entre varios valores y tipos de producto reduce el impacto de una mala noticia sobre un solo emisor." },
      { h: "El tiempo", p: "Las cotizaciones varían a corto plazo. Invertir con un horizonte acorde con sus proyectos evita tener que vender en mal momento." },
    ],
    keep: "La diversificación y un horizonte largo reducen el riesgo, sin eliminarlo.",
    quiz: [
      { q: "La diversificación permite:", options: ["Reducir el riesgo ligado a un solo emisor", "Garantizar una ganancia", "Evitar los gastos"], answer: 0, explain: "Reparte el riesgo, sin anularlo." },
      { q: "¿Garantizan las rentabilidades pasadas el futuro?", options: ["No", "Sí", "Solo para las obligaciones"], answer: 0, explain: "Las rentabilidades pasadas no presuponen las futuras." },
      { q: "¿Por qué un horizonte largo?", options: ["Para no verse obligado a vender en una caída", "Para pagar menos impuestos en todas partes", "Para evitar el BOC"], answer: 0, explain: "Un horizonte adecuado evita las ventas forzadas." },
    ],
  },
  {
    slug: "lire-un-avis-de-dividende", path: "lire-un-boc", title: "Leer un aviso de dividendo", minutes: 3,
    sections: [
      { h: "Las fechas clave", p: "Un aviso de dividendo indica el importe por acción, la fecha de corte y la fecha de pago. Para cobrar el dividendo, hay que tener la acción antes de la fecha de corte." },
      { h: "El efecto en el precio", p: "El día del corte, el precio de referencia se ajusta en el importe del dividendo: no es una pérdida de valor para el accionista." },
    ],
    keep: "Tenga la acción antes de la fecha de corte; ese día el precio se ajusta en el dividendo.",
    quiz: [
      { q: "Para cobrar el dividendo, hay que tener la acción:", options: ["Antes de la fecha de corte", "Después del pago", "Solo el día de la junta"], answer: 0, explain: "La fecha de corte determina quién lo cobra." },
      { q: "El día del corte, el precio de referencia:", options: ["Se ajusta en el dividendo", "Se duplica", "Se congela una semana"], answer: 0, explain: "El ajuste refleja el dividendo pagado." },
      { q: "¿Dónde se publica el aviso?", options: ["En los avisos de la BVMAC", "Solo por teléfono", "En ninguna parte"], answer: 0, explain: "Los avisos se publican en el sitio web y en la aplicación." },
    ],
  },
];

export const GLOSSARY_DEFS_ES: Record<string, string> = {
  Action: "Título de propiedad que representa una parte del capital de una sociedad.",
  Actionnaire: "Titular de acciones, copropietario de la sociedad.",
  "Admission à la cote": "Inscripción de un valor en la lista de valores negociados en la BVMAC.",
  "Appel public à l'épargne (APE)": "Oferta de valores al público, sometida al visado de la COSUMAF.",
  "Assemblée générale": "Reunión de los accionistas que aprueba las cuentas y vota el dividendo.",
  Avis: "Comunicación oficial y numerada de la BVMAC.",
  BOC: "Boletín Oficial de Cotización, publicado tras cada sesión.",
  "Capitalisation boursière": "Número de acciones multiplicado por el precio.",
  CEMAC: "Comunidad Económica y Monetaria de África Central (seis Estados).",
  Compartiment: "Segmento de la cotización que agrupa valores según criterios de admisión.",
  "Compte titres": "Cuenta en la que se inscriben los valores de un inversor.",
  COSUMAF: "Comisión de Supervisión del Mercado Financiero de África Central, el regulador.",
  Coupon: "Interés que se paga periódicamente al titular de una obligación.",
  Cours: "Precio de un valor en el mercado.",
  "Cours de clôture": "Precio registrado al final de la sesión.",
  "Cours de référence": "Precio de partida de una sesión, que sirve para calcular la variación.",
  "Date de détachement": "Fecha a partir de la cual la acción se negocia sin el dividendo.",
  "Dépositaire central": "Institución que conserva los valores y se encarga de la liquidación.",
  Diversification: "Reparto del ahorro entre varias inversiones para reducir el riesgo.",
  Dividende: "Parte del beneficio distribuida a los accionistas.",
  "Droits de garde": "Gastos de conservación de los valores en una cuenta.",
  "Échéance": "Fecha de reembolso de una obligación.",
  "Émetteur": "Empresa, Estado o institución que emite valores.",
  Fixing: "Casamiento de órdenes para determinar un precio único.",
  "Introduction en bourse": "Primera admisión a cotización de los valores de una sociedad.",
  "Investisseur institutionnel": "Banco, aseguradora, fondo de pensiones o fondo que invierte de forma profesional.",
  "Liquidité": "Facilidad para comprar o vender un valor sin mover mucho su precio.",
  "Marché primaire": "Mercado de emisión de valores nuevos.",
  "Marché secondaire": "Mercado de intercambio de valores ya emitidos.",
  Nominal: "Valor facial de un título.",
  Obligation: "Título de deuda que representa un préstamo a un emisor.",
  OPCVM: "Institución de inversión colectiva en valores mobiliarios (SICAV, FCP).",
  "Ordre de bourse": "Instrucción de compra o venta transmitida a una sociedad de bolsa.",
  "Plus-value": "Ganancia obtenida al vender un valor por encima de su precio de compra.",
  Portefeuille: "Conjunto de valores que posee un inversor.",
  "Quantité transigée": "Número de valores realmente intercambiados durante la sesión.",
  "Règlement-livraison": "Intercambio de los valores contra su pago tras la operación.",
  "Séance de cotation": "Período durante el cual se casan las órdenes.",
  "Société de bourse": "Intermediario autorizado por la COSUMAF para negociar valores.",
  Suspension: "Interrupción temporal de la cotización de un valor decidida por la BVMAC.",
  Variation: "Evolución del precio en porcentaje respecto al precio de referencia.",
};
