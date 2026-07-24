const GRID_NOTIFICACIONES_ID = '#gridNotificaciones';

export function actualizarCheckboxNotificaciones(rowIndex: number): void {
  try {
    const gridElement = document.querySelector(GRID_NOTIFICACIONES_ID) as HTMLElement;
    if (!gridElement) {
      return;
    }

    const radioButtons = gridElement.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      (radio as HTMLInputElement).checked = false;
    });

    let targetRowIndex = -1;
    const selectedRows = gridElement.querySelectorAll('.jqx-grid-row-selected, .jqx-grid-row-selected-alt');

    if (selectedRows.length > 0) {
      const allRows = gridElement.querySelectorAll('tr');
      for (let i = 0; i < allRows.length; i++) {
        if (
          allRows[i].classList.contains('jqx-grid-row-selected') ||
          allRows[i].classList.contains('jqx-grid-row-selected-alt')
        ) {
          targetRowIndex = i;
          break;
        }
      }
    }

    if (targetRowIndex === -1) {
      const allRows = gridElement.querySelectorAll('tr');
      for (let i = 0; i < allRows.length; i++) {
        const row = allRows[i];
        if (
          row.getAttribute('aria-selected') === 'true' ||
          row.getAttribute('data-selected') === 'true' ||
          row.style.backgroundColor.includes('240') ||
          row.style.backgroundColor.includes('245')
        ) {
          targetRowIndex = i;
          break;
        }
      }
    }

    if (targetRowIndex === -1) {
      targetRowIndex = radioButtons.length - 1 - rowIndex;
    }

    if (targetRowIndex >= 0 && targetRowIndex < radioButtons.length) {
      const radio = radioButtons[targetRowIndex] as HTMLInputElement;
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } catch {
    // jqxGrid puede no estar listo
  }
}
