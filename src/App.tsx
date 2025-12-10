import { useState } from "react";

type Unit = "%" | "px";
const UNIT_RULE: Record<Unit, { min: number; max: number }> = {
  "%": { min: 0, max: 100 },
  px: { min: 0, max: Infinity },
};

const App = () => {
  const [checkedUnit, setCheckedUnit] = useState<Unit>("%");
  const [value, setValue] = useState("1");

  const cleanNumber = (value: string) => {
    let result = "";
    let dotUsed = false;

    for (const c of value) {
      if (/\d/.test(c)) {
        result += c;
      } else if (c === "." && !dotUsed) {
        result += c;
        dotUsed = true;
      } else {
        break; // gặp ký tự sai → dừng luôn
      }
    }

    if (result === "" || result === ".") return "0";
    return result;
  };

  const clampValue = (val: number, unit = checkedUnit) => {
    const rule = UNIT_RULE[unit];
    return String(Math.min(rule.max, Math.max(rule.min, val)));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cleaned = cleanNumber(e.target.value);
    const num = parseFloat(cleaned);
    setValue(clampValue(num));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const switchUnit = (unit: Unit) => {
    if (unit === checkedUnit) return;
    const num = parseFloat(value);
    setCheckedUnit(unit);
    setValue(clampValue(num, unit));
  };

  const decrement = () => setValue((v) => clampValue(parseFloat(v) - 1));
  const increment = () => setValue((v) => clampValue(parseFloat(v) + 1));

  const isMin = value === "0";
  const isMax = checkedUnit === "%" && value === "100";

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-neutral-800 p-4 rounded-lg">
        <form onSubmit={(e) => e.preventDefault()} className="font-medium w-full text-[#F9F9F9] text-xs p-4 bg-neutral-900 space-y-3">
          {/* UNIT SWITCH */}
          <div className="flex justify-between items-center gap-2 mb-4">
            <span className="leading-5 inline-block min-w-[100px] text-[#AAAAAA]">Unit</span>

            <div className="p-0.5 flex rounded-lg gap-[2px] w-full bg-[#212121]">
              {["%", "px"].map((u) => (
                <label key={u} className="w-full">
                  <input type="radio" name="unit" className="peer sr-only" checked={checkedUnit === u} onChange={() => switchUnit(u as Unit)} />
                  <span
                    className="block text-center py-1.5 rounded-md cursor-pointer
                    leading-5 text-[#AAAAAA] transition
                    peer-checked:text-[#F9F9F9] peer-checked:bg-[#424242]
                    hover:bg-[#424242] hover:text-[#F9F9F9]">
                    {u}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* VALUE FIELD */}
          <div className="flex items-center gap-2">
            <label htmlFor="value" className="leading-5 min-w-[100px] text-[#AAAAAA]">
              Value
            </label>

            <div className="relative flex bg-[#212121] items-center rounded-lg w-full">
              {/* MINUS */}
              <div className="absolute left-0 top-0 h-full group min-w-[36px]">
                <button disabled={isMin} onClick={!isMin ? decrement : undefined} className={`p-2 rounded-l-lg transition ${isMin ? "cursor-not-allowed" : "hover:bg-[#3B3B3B] cursor-pointer"}`}>
                  <img src={isMin ? "./images/minus-disabled.png" : "./images/minus.png"} />
                </button>

                {isMin && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+12px)]
                    whitespace-nowrap px-2 py-1 rounded bg-black text-white text-xs 
                    opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    Value must be greater than 0
                  </span>
                )}
              </div>

              <input
                id="value"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className="leading-5 transition rounded-lg w-full text-center py-2 px-[44px]
                outline-none focus:ring-1 focus:ring-[#3C67FF] hover:bg-[#3B3B3B]"
              />

              {/* PLUS */}
              <div className="absolute right-0 top-0 h-full group min-w-[36px]">
                <button disabled={isMax} onClick={!isMax ? increment : undefined} className={`p-2 rounded-r-lg transition ${isMax ? "cursor-not-allowed" : "hover:bg-[#3B3B3B] cursor-pointer"}`}>
                  <img src={isMax ? "./images/plus-disabled.png" : "./images/plus.png"} />
                </button>

                {isMax && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+12px)]
                    whitespace-nowrap px-2 py-1 rounded bg-black text-white text-xs 
                    opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    Value must be between 0-100%
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
