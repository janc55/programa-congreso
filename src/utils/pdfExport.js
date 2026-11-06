import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a DOM element directly to a high-resolution A4 PDF document.
 * @param {HTMLElement} element - The DOM element to capture (e.g. brochure container)
 * @param {string} filename - The output PDF filename
 * @param {object} options - Configuration options
 */
export async function exportElementToA4PDF(element, filename = 'Programa_Congreso_UNIOR.pdf', options = {}) {
  if (!element) {
    throw new Error('Element to export was not found');
  }

  // Create loading indicator or notify
  const toast = document.createElement('div');
  toast.id = 'pdf-export-toast';
  toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-3 border border-slate-700 animate-in fade-in';
  toast.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>Generando PDF A4 de alta fidelidad...</span>
  `;
  document.body.appendChild(toast);

  try {
    // Capture element with html2canvas with high scale for 300 DPI quality
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp 2.5x retina/print resolution
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('#brochure-container');
        if (clonedElement) {
          // Remove rounded outer corners and box shadow for clean bleed
          clonedElement.style.borderRadius = '0px';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.margin = '0px';
          clonedElement.style.border = 'none';
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Standard A4 dimensions in mm: 210 x 297
    const a4Width = 210;
    const a4Height = 297;

    const imgWidth = a4Width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // If the image fits within a single A4 page or is close, fit on 1 page
    if (imgHeight <= a4Height + 15) {
      pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, Math.min(imgHeight, a4Height), '', 'FAST');
    } else {
      // Multi-page slicing for longer agendas (e.g. Programa General)
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, a4Width, imgHeight, '', 'FAST');
      heightLeft -= a4Height;

      // Subsequent pages
      while (heightLeft > 0) {
        position -= a4Height;
        pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, position, a4Width, imgHeight, '', 'FAST');
        heightLeft -= a4Height;
      }
    }

    pdf.save(filename);
  } finally {
    const existingToast = document.getElementById('pdf-export-toast');
    if (existingToast) {
      existingToast.remove();
    }
  }
}
