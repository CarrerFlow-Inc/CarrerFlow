import React from "react";

// SlideToggler: shows two panels side-by-side and slides between them.
// Props:
// - left: ReactNode (e.g., <LoginForm />)
// - right: ReactNode (e.g., <SignupForm />)
// - leftLabel, rightLabel: labels for the segmented control
// - initial: 'left' | 'right' (default: 'left')
// - onChange?: (side) => void
const SlideToggler = React.forwardRef(function SlideToggler(
  {
    left,
    right,
    leftLabel = "Login",
    rightLabel = "Cadastro",
    initial = "left",
    onChange,
  },
  ref
) {
  const [side, setSide] = React.useState(initial === "right" ? "right" : "left");

  const switchTo = React.useCallback((next) => {
    if (next === side) return;
    setSide(next);
    onChange && onChange(next);
  }, [side, onChange]);

  const toggle = React.useCallback(() => {
    switchTo(side === "left" ? "right" : "left");
  }, [side, switchTo]);

  React.useImperativeHandle(ref, () => ({ switchTo, toggle }), [switchTo, toggle]);

  return (
    <div className="w-full">
      {/* Segmented control */}
      <div
        role="tablist"
        aria-label="Alternar entre Login e Cadastro"
        className="relative flex w-full rounded-lg border border-gray-200 bg-gray-50 p-1 text-sm"
      >
        <button
          role="tab"
          aria-selected={side === "left"}
          onClick={() => switchTo("left")}
          className={`relative z-10 flex-1 rounded-md px-3 py-2 font-medium transition-colors ${
            side === "left" ? "text-white" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {leftLabel}
        </button>
        <button
          role="tab"
          aria-selected={side === "right"}
          onClick={() => switchTo("right")}
          className={`relative z-10 flex-1 rounded-md px-3 py-2 font-medium transition-colors ${
            side === "right" ? "text-white" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {rightLabel}
        </button>
        {/* Active indicator */}
        <span
          className={`absolute inset-y-1 w-1/2 rounded-md bg-gray-900 shadow-sm transition-transform duration-300 ease-out ${
            side === "left" ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Sliding panels */}
      <div className="mt-4 overflow-hidden">
        <div
          className={`flex w-[200%] transition-transform duration-300 ease-out ${
            side === "left" ? "-translate-x-0" : "-translate-x-1/2"
          }`}
        >
          <div className="w-1/2 pr-2">{left}</div>
          <div className="w-1/2 pl-2">{right}</div>
        </div>
      </div>
    </div>
  );
});

export default SlideToggler;
