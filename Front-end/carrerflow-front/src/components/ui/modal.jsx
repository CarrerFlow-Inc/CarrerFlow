import React from "react";

export default function Modal({ open, onClose, children, ariaLabel = "Modal" }) {
  const firstFocusRef = React.useRef(null);
  const dialogRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    // focus the first element when opening
    const t = setTimeout(() => {
      firstFocusRef.current?.focus();
    }, 0);
    // close on ESC
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
      // basic focus trap: keep tab within dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
        const list = Array.from(focusable).filter(el => !el.disabled && el.getAttribute('aria-hidden') !== 'true');
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('keydown', onKeyDown); clearTimeout(t); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div
        ref={dialogRef}
        className="bg-white rounded-xl sm:rounded-lg p-4 sm:p-6 w-[92vw] sm:w-full max-w-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div className="flex justify-end">
          <button ref={firstFocusRef} onClick={onClose} className="text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40">Fechar</button>
        </div>
        {children}
      </div>
    </div>
  );
}

