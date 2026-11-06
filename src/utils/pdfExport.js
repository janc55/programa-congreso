import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a DOM element directly to a high-resolution A4 PDF document.
 * @param {HTMLElement} element - The DOM element to capture (#brochure-container)
 * @param {string} filename - The output PDF filename
 */
export async function exportElementToA4PDF(element, filename = 'Programa_Congreso_UNIOR.pdf') {
  if (!element) {
    throw new Error('Element to export was not found');
  }

  // Visual feedback toast
  const toast = document.createElement('div');
  toast.id = 'pdf-export-toast';
  toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-3 border border-slate-700 animate-in fade-in';
  toast.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>Generando folleto oficial A4 en alta resolución...</span>
  `;
  document.body.appendChild(toast);

  // Wait for fonts to be completely ready before capturing
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  try {
    // Capture with html2canvas at 2.5x retina resolution
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('#brochure-container');
        if (clonedElement) {
          // Flatten borders and shadows for clean bleed
          clonedElement.style.borderRadius = '0px';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.margin = '0px';
          clonedElement.style.border = 'none';
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    // Standard A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Calculate height proportional to A4 width
    const calculatedHeight = (canvas.height * a4Width) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // If it's a single page (within tolerance of A4), stretch/fit cleanly to exact A4
    if (calculatedHeight <= a4Height + 20) {
      // Force 100% full bleed of the A4 page (0 white margins top, bottom, left, right)
      pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height, undefined, 'FAST');
    } else {
      // Multi-page slicing for longer agendas (e.g. Programa General)
      let heightLeft = calculatedHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, a4Width, calculatedHeight, undefined, 'FAST');
      heightLeft -= a4Height;

      while (heightLeft > 0) {
        position -= a4Height;
        pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, position, a4Width, calculatedHeight, undefined, 'FAST');
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
