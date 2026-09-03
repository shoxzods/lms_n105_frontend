/**
 * Figma: "Reviews" — 20px yulduzlar, orasi 12px.
 *
 * Yulduz ichma-ich SVG sifatida chiziladi (rasm sifatida emas) —
 * shunda ikkita narsa hal bo'ladi:
 *
 *   1. Yarim yulduz gradient bilan bo'linadi. Ilgari ikkita rasm
 *      ustma-ust qo'yilgan edi va o'rtasida chok ko'rinardi.
 *   2. Bo'sh qism rangi `currentColor` — tungi rejimda qorayadi.
 *      Ilgari qattiq `#E0E3E6` edi va qora fonda oppoq bo'lib
 *      to'la yulduzdek ko'rinardi.
 */
const STAR_PATH =
  "M14.2891 7.69143L12.2516 0.986969C11.8497 -0.32899 9.99247 -0.32899 9.60439 0.986969L7.55313 7.69143H1.38544C0.0410218 7.69143 -0.513377 9.42302 0.581561 10.1987L5.62661 13.8003L3.64462 20.1862C3.24268 21.4744 4.73957 22.5133 5.80679 21.6961L10.9211 17.8174L16.0354 21.7099C17.1026 22.5272 18.5995 21.4883 18.1976 20.2L16.2156 13.8142L21.2606 10.2126C22.3556 9.42302 21.8012 7.70528 20.4568 7.70528H14.2891V7.69143Z";

/** Figma: System colors / Warning / 400 */
const GOLD = "#FCB823";

function Star({ fill, id }: { fill: "full" | "half" | "empty"; id: string }) {
  return (
    <svg
      viewBox="0 0 21.8422 22"
      className="size-5 shrink-0 text-ink-200 dark:text-ink-800"
      aria-hidden
    >
      {fill === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor={GOLD} />
            <stop offset="50%" stopColor="currentColor" />
          </linearGradient>
        </defs>
      )}
      <path
        d={STAR_PATH}
        fill={
          fill === "full"
            ? GOLD
            : fill === "half"
              ? `url(#${id})`
              : "currentColor"
        }
      />
    </svg>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          id={`star-${rating}-${i}`}
          fill={rating >= i ? "full" : rating >= i - 0.5 ? "half" : "empty"}
        />
      ))}
      <p className="text-sm font-medium text-ink-500">({rating})</p>
    </div>
  );
}
