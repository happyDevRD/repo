const CHECKBOX_TEU_MENSAJES: Record<string, { on: string; off: string }> = {
  datoperso: { on: 'Datos personales incluidos', off: 'Datos personales excluidos' },
  incltex: { on: 'Textos incluidos', off: 'Textos excluidos' },
  leygene: { on: 'Ley tributaria aplicada', off: 'Ley tributaria desactivada' },
};

export function onCheckboxTeuChange(checkboxName: string, value: boolean): void {
  const checkboxElement = document.getElementById(checkboxName) as HTMLInputElement;
  if (!checkboxElement) {
    return;
  }

  const card = checkboxElement.closest('.custom-checkbox-card');
  if (!card) {
    return;
  }

  if (value) {
    card.classList.add('checkbox-active');
    mostrarToastCheckboxTeu(checkboxName, true);
  } else {
    card.classList.remove('checkbox-active');
    mostrarToastCheckboxTeu(checkboxName, false);
  }
}

export function mostrarToastCheckboxTeu(checkboxName: string, activado: boolean): void {
  const config = CHECKBOX_TEU_MENSAJES[checkboxName];
  if (!config) {
    return;
  }

  const mensaje = activado ? config.on : config.off;
  const toast = document.createElement('div');
  toast.className = `checkbox-toast ${activado ? 'toast-success' : 'toast-info'}`;
  toast.textContent = mensaje;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${activado ? '#d4edda' : '#d1ecf1'};
    color: ${activado ? '#155724' : '#0c5460'};
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid ${activado ? '#c3e6cb' : '#bee5eb'};
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 9999;
    font-size: 0.875rem;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.parentNode?.removeChild(toast), 300);
  }, 2000);
}
