/**
 * Luz de vitral: capa fija detras de todo el contenido con manchas de luz
 * en los colores del logo y dos haces diagonales muy tenues, como la luz
 * que entra por los vitrales del templo. Todo el dibujo vive en
 * globals.css (.stained-light); este componente solo coloca la capa.
 */
export function StainedLight() {
  return <div className="stained-light" aria-hidden="true" />;
}
