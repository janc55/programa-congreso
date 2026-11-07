// Map of known speaker slugs to their uploaded photo file names
export const SPEAKER_PHOTO_MAP = {
  'omar-ricardo-panozo-vargas': 'omar-panozo.jpeg',
  'emilio-garnica-villagomez': 'emilio-garnica.png',
  'roberto-flores-gamboa': 'roberto-flores.jpeg',
  'danny-reynaga': 'danny-reynaga.jpeg',
  'eduardo-condori-aspiazu': 'eduardo-condori.jpeg',
  'marco-antonio-quelca': 'marco-quelca.png',
  'gabriel-galindo': 'gabriel-galindo.jpeg',
  'willy-benjamin-suarez': 'willy-suarez.jpeg',
  'jocelyn-chavez-farro': 'jocelyn-chavez.jpeg',
  'victor-hugo-cortes-cortes': 'victor-cortes.png',
  'yerko-paz-huet': 'yerko-paz.jpeg',
  'madai-montoya-lopez': 'madai-montoya.jpeg',
  'carlos-clavel-tola-quispe': 'carlos-tola.jpeg',
  'eloy-paz-viscarra': 'eloy-paz.jpeg',
  'adrian-aramayo-ponce': 'adrian-aramayo.jpg',
  'sarai-paredes': 'sarai-paredes.jpeg',
  'carlos-ariel-trigo-vargas': 'carlos-trigo.webp',
  'jorge-jose-valda-daza': 'jorge-valda.jpeg',
  'martin-amaru-aguilar-vilches': 'martin-aguilar.jpeg',
  'gabriel-condo-soto': 'gabriel-condo.jpeg',
  'albina-palmira-maldonado-chacon': 'albina-maldonado.jpeg',
  'ross-mary-janeth-ibanez-bustillo': 'rossmary-ibanez.jpeg',
  'pamela-arias': 'pamela-arias.jpeg',
  'pablo-guerrero': 'pablo-guerrero.jpeg',
  'franz-rodrigo-callizaya-vergara': 'franz-callisaya.png',
  'maria-luiza-sotomayor-duarte': 'maria-sotomayor.jpeg',
  'edmundo-enrique-vilches-luzio': 'edmundo-vilches.jpeg',
  'hans-v-kukok-montoya': 'hans-kukoc.jpeg',
  // Fotos actualizadas
  'alejandra-noldine': 'alejandra-noldin.jpeg',
  'camilo-vasquez-ledezma': 'camilo-vasquez.jpeg',
  'ibar-mario-vasquez-ramos': 'ibar-vasquez.png',
  'jorge-eduardo-espinoza-arzabe': 'jorge-espinoza.png',
  'marco-antonio-laura-avendano': 'marco-laura.jpg',
  'rolando-manuel-barrientos-gomez': 'rolando-barrientos.jpeg',
  'sonia-flores-mamani': 'sonia-flores.jpeg'
};

// Direct mapping to the user's PNG flag files in /assets/flags/
export const getCountryFlagPath = (country) => {
  const c = (country || 'bolivia').toLowerCase().trim();
  if (c === 'brasil' || c === 'brazil') return '/assets/flags/br.png';
  if (c === 'chile') return '/assets/flags/ch.png';
  if (c === 'paraguay') return '/assets/flags/py.png';
  if (c === 'peru' || c === 'perú') return '/assets/flags/pe.png';
  if (c === 'mexico' || c === 'méxico') return '/assets/flags/mx.png';
  return '/assets/flags/bo.png';
};
