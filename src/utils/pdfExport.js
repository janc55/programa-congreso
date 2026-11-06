import * as htmlToImage from 'html-to-image';

export async function exportElementToImage(element, filename = 'Programa_Congreso_UNIOR.png') {
  if (!element) {
    throw new Error('Element to export was not found');
  }

  // Toast de carga
  const toast = document.createElement('div');
  toast.id = 'pdf-export-toast';
  toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-3 border border-slate-700';
  toast.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>Generando imagen...</span>
  `;
  document.body.appendChild(toast);

  await document.fonts.ready;

  // Activamos la clase pdf-export-mode definida en print.css:
  // - overflow: visible, height: auto, width: 794px fijo, sin sombras/bordes
  // Esto asegura que el contenido completo sea visible antes de capturar
  document.body.classList.add('pdf-export-mode');

  // Esperamos que los estilos se apliquen y el layout se recalcule
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    // Medimos DESPUÉS de aplicar pdf-export-mode para obtener las dimensiones reales
    const captureWidth = element.offsetWidth;
    const captureHeight = element.scrollHeight;

    const dataUrl = await htmlToImage.toPng(element, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#f8f9fa',
      width: captureWidth,
      height: captureHeight,
      // Forzamos overflow visible para que nada quede recortado
      style: {
        overflow: 'visible',
        height: captureHeight + 'px',
      },
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Error generating image:', err);
    alert('Hubo un inconveniente al generar la imagen. Por favor intenta nuevamente.');
  } finally {
    // Siempre quitamos la clase para restaurar el diseño normal
    document.body.classList.remove('pdf-export-mode');

    const existingToast = document.getElementById('pdf-export-toast');
    if (existingToast) {
      existingToast.remove();
    }
  }
}
