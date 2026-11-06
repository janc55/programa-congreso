import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a DOM element directly to a single-page full-bleed A4 PDF document.
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
    <span>Generando folleto A4 oficial...</span>
  `;
  document.body.appendChild(toast);

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  try {
    // Exact A4 dimensions at 96 DPI: 794px width, 1123px height
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('#brochure-container');
        if (clonedElement) {
          // Lock cloned element to exact A4 aspect ratio to prevent any stretching or distortion
          clonedElement.style.width = '794px';
          clonedElement.style.minHeight = '1123px';
          clonedElement.style.height = '1123px';
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.borderRadius = '0px';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.margin = '0px';
          clonedElement.style.border = 'none';
          clonedElement.style.padding = '22px 24px';
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Exact 1:1 placement filling the full A4 sheet (210mm x 297mm)
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(filename);
  } finally {
    const existingToast = document.getElementById('pdf-export-toast');
    if (existingToast) {
      existingToast.remove();
    }
  }
}
