/**
 * Franjas fijas que desenfocan el contenido cuando pasa por los bordes de
 * la pantalla. Todo el comportamiento vive en globals.css (.edge-blur).
 *
 * Son elementos hermanos de la barra de navegacion, no hijos: un elemento
 * con backdrop-filter solo desenfoca lo que hay dentro de su propio
 * ancestro con backdrop-filter, asi que dentro del <header> no verian el
 * contenido de la pagina.
 */
export function EdgeBlur() {
  return (
    <>
      <div className="edge-blur edge-blur--top" aria-hidden="true">
        <div />
        <div />
        <div />
      </div>
      <div className="edge-blur edge-blur--bottom" aria-hidden="true">
        <div />
        <div />
        <div />
      </div>
    </>
  );
}
