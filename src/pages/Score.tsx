import { useGetSingleUserQuery } from "@/store/api/user/userApi";

const Score = () => {
  let userId = 3520335;

  try {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      const parsed = JSON.parse(storedUserId);
      userId = parsed?.userId ?? parsed?.id ?? parsed;
    }
  } catch {
    // Keep the fallback ID if stored data is invalid.
  }

  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSingleUserQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const score = Math.min(
    100,
    Math.max(0, Number(userData?.data?.score ?? 0) || 0)
  );

  let needleRotation = -90;

  if (score < 20) {
    needleRotation = -90 + score * 2;
  } else if (score < 40) {
    needleRotation = -90 + score * 2.5;
  } else if (score < 60) {
    needleRotation = -90 + score * 1.8;
  } else {
    needleRotation = -90 + score * 1.65;
  }

  const scoreLabel =
    score < 20
      ? "Needs improvement"
      : score < 40
        ? "Fair"
        : score < 60
          ? "Good"
          : score < 80
            ? "Very good"
            : "Excellent";

  const rules = [
    {
      number: "01",
      title: "Complete purchases",
      description: "Earn 2 points for every two completed purchase rounds.",
    },
    {
      number: "02",
      title: "Special purchases",
      description:
        "Completing special purchases can earn additional commission and points.",
    },
    {
      number: "03",
      title: "Maintain consistent activity",
      description:
        "Your credit score may decrease if a purchase remains incomplete for too long.",
    },
    {
      number: "04",
      title: "Membership benefits",
      description:
        "At 100 points, refer to your membership policy for eligibility and requirements during the sell-out process.",
    },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto w-full max-w-5xl">
          <div className="h-3 w-28 animate-pulse bg-gray-200" />
          <div className="mt-4 h-9 w-56 animate-pulse bg-gray-200" />
          <div className="mt-8 h-72 animate-pulse border border-[#e8e6df] bg-white" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6] px-4 py-10">
        <div className="w-full max-w-md border border-[#e8e6df] bg-white p-6 sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#77796f]">
            Account overview
          </p>

          <h1 className="mt-4 text-2xl font-light text-[#20231f]">
            Couldn’t load your credit score
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#77796f]">
            We couldn’t retrieve your score. Please try again.
          </p>

          <details className="mt-5 border-t border-[#e8e6df] pt-4">
            <summary className="cursor-pointer text-xs text-[#77796f]">
              Technical details
            </summary>

            <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words text-xs text-red-700">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 w-full bg-[#272b25] px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#41463d]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 text-[#20231f] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <header className="mb-7 border-b border-[#e8e6df] pb-6 sm:mb-9">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#77796f]">
            Account overview
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl font-light tracking-[-0.045em] sm:text-4xl">
              Credit score
            </h1>

            <span className="pb-1 text-xs text-[#77796f]">
              Membership assessment
            </span>
          </div>
        </header>

        {/* Score overview */}
        <section className="grid grid-cols-1 overflow-hidden border border-[#e8e6df] bg-white md:grid-cols-[0.85fr_1.15fr]">
          {/* Score details */}
          <div className="flex flex-col justify-between border-b border-[#e8e6df] p-6 sm:p-8 md:border-b-0 md:border-r lg:p-9">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#77796f]">
                Your current score
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-7xl font-light leading-none tracking-[-0.075em] sm:text-8xl">
                  {score}
                </span>

                <span className="text-sm text-[#8a8b83]">/ 100</span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#50765b]" />
                <span className="text-sm text-[#50765b]">{scoreLabel}</span>
              </div>
            </div>

            <div className="mt-8 md:mt-12">
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="text-[#77796f]">Score progress</span>
                <span className="tabular-nums">{score}%</span>
              </div>

              <div
                className="h-[3px] overflow-hidden bg-[#eeede8]"
                role="progressbar"
                aria-label="Credit score progress"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-[#50765b] transition-[width] duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-[#8a8b83]">
                Complete purchases consistently to build and maintain your
                score.
              </p>
            </div>
          </div>

          {/* Colorful semicircular gauge */}
          <div className="flex min-w-0 flex-col items-center justify-center bg-[#fdfcf9] px-4 py-7 sm:px-8 sm:py-9">
            <div className="mb-1 flex w-full max-w-[400px] items-center justify-between gap-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#77796f]">
                Credit rating
              </p>

              <span className="text-right text-xs text-[#77796f]">
                {scoreLabel}
              </span>
            </div>

            <svg
              viewBox="0 0 300 190"
              className="block h-auto w-full max-w-[400px]"
              role="img"
              aria-label={`Credit score ${score} out of 100`}
            >
              <defs>
                <linearGradient
                  id="scoreGaugeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#e45b55" />
                  <stop offset="25%" stopColor="#f0a54a" />
                  <stop offset="50%" stopColor="#e9d65d" />
                  <stop offset="75%" stopColor="#9bcf79" />
                  <stop offset="100%" stopColor="#3e9d69" />
                </linearGradient>
              </defs>

              {/* Gauge background */}
              <path
                d="M 35 145 A 115 115 0 0 1 265 145"
                fill="none"
                stroke="#eeede8"
                strokeWidth="20"
                strokeLinecap="round"
              />

              {/* Color range */}
              <path
                d="M 35 145 A 115 115 0 0 1 265 145"
                fill="none"
                stroke="url(#scoreGaugeGradient)"
                strokeWidth="20"
                strokeLinecap="round"
              />

              {/* Scale marks */}
              {Array.from({ length: 11 }, (_, index) => {
                const angle = (-180 + index * 18) * (Math.PI / 180);
                const cx = 150;
                const cy = 145;

                return (
                  <line
                    key={index}
                    x1={cx + Math.cos(angle) * 91}
                    y1={cy + Math.sin(angle) * 91}
                    x2={cx + Math.cos(angle) * 101}
                    y2={cy + Math.sin(angle) * 101}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Needle */}
              <g transform={`rotate(${needleRotation} 150 145)`}>
                <path
                  d="M 150 145 L 145 145 L 150 58 L 155 145 Z"
                  fill="#252821"
                />
              </g>

              <circle cx="150" cy="145" r="8" fill="#252821" />
              <circle cx="150" cy="145" r="3" fill="#ffffff" />

              {/* Scale labels */}
              <text
                x="29"
                y="170"
                fontSize="11"
                fill="#77796f"
                textAnchor="middle"
              >
                0
              </text>

              <text
                x="150"
                y="18"
                fontSize="11"
                fill="#77796f"
                textAnchor="middle"
              >
                50
              </text>

              <text
                x="271"
                y="170"
                fontSize="11"
                fill="#77796f"
                textAnchor="middle"
              >
                100
              </text>

              <text
                x="150"
                y="177"
                fontSize="12"
                fontWeight="500"
                fill="#252821"
                textAnchor="middle"
              >
                {score} points
              </text>
            </svg>

            {/* Range legend */}
            <div className="mt-2 grid w-full max-w-[400px] grid-cols-5 gap-2">
              {[
                { label: "Low", color: "#e45b55" },
                { label: "Fair", color: "#f0a54a" },
                { label: "Average", color: "#e9d65d" },
                { label: "Good", color: "#9bcf79" },
                { label: "Excellent", color: "#3e9d69" },
              ].map((item) => (
                <div key={item.label} className="min-w-0 text-center">
                  <span
                    className="mx-auto mb-2 block h-[3px] w-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="block truncate text-[10px] text-[#77796f]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Score guidelines */}
        <section className="mt-9 sm:mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e8e6df] pb-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#77796f]">
                How it works
              </p>

              <h2 className="mt-2 text-2xl font-light tracking-[-0.035em]">
                Understanding your score
              </h2>
            </div>

            <span className="text-xs text-[#8a8b83]">4 guidelines</span>
          </div>

          <div>
            {rules.map((rule) => (
              <div
                key={rule.number}
                className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 border-b border-[#e8e6df] py-5 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-5 sm:py-6"
              >
                <span className="pt-0.5 text-xs tabular-nums text-[#8a8b83]">
                  {rule.number}
                </span>

                <div>
                  <h3 className="text-sm font-medium text-[#292c26]">
                    {rule.title}
                  </h3>

                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#77796f]">
                    {rule.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-6 pb-8">
          <p className="max-w-2xl text-xs leading-5 text-[#8a8b83]">
            Score requirements and membership benefits are subject to the
            applicable membership terms.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Score;