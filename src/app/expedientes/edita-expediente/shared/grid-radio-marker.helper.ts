/** Marca el radio button de una fila en un grid jqxGrid (patrón data-row + fallback por índice). */
export function marcarRadioButtonGrid(name: string, rowIndex: number): void {
  const radioButtons = document.querySelectorAll(`input[name="${name}"]`) as NodeListOf<HTMLInputElement>;
  radioButtons.forEach((radio) => {
    radio.checked = false;
  });

  const selectedRadio = document.querySelector(
    `input[name="${name}"][data-row="${rowIndex}"]`,
  ) as HTMLInputElement;
  if (selectedRadio) {
    selectedRadio.checked = true;
    return;
  }

  const allRadios = document.querySelectorAll(`input[name="${name}"]`) as NodeListOf<HTMLInputElement>;
  if (allRadios[rowIndex]) {
    allRadios[rowIndex].checked = true;
  }
}
