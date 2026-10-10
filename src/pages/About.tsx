
import { ChevronRight } from "lucide-react";
import aboutImage from "@/assets/about/about.jpg";

export default function AboutUs() {
  const aboutItems = [
    <>
      Juwelo New York is an international platform company that provides gold
      and jewelry buying, selling and trading. Its main goal is to help brands
      and retailers collect, manage and nationally order transactions.
    </>,
    <>
      Juwelo New York helps merchants conduct cross-border transactions,
      providing a system mechanism for greater mobility and faster
      transactions.
    </>,
    <>
      The platform provides customized review display options, allowing brands
      to display customer feedback in an eye-catching way on their website.
    </>,
    <>
      By displaying real user reviews, Juwelo New York helps brands build trust
      and improve potential customers' purchasing decisions.
    </>,
    <>
      The tool provides data analysis to help brands and retailers gain insights
      into customer feedback and identify product strengths and weaknesses.
    </>,
    <>
      Juwelo New York can be integrated with agencies and marketing tools in
      different countries to help brands manage customer transactions in
      cross-border channels.
    </>,
    <>
      Improve conversion rate: Showing positive customer reviews can often
      increase the trust of potential customers, thereby increasing conversion
      rates.
    </>,
    <>
      Understand customer needs: By analyzing reviews, brands can better
      understand consumer needs and preferences to improve products and
      services.
    </>,
    <>
      Enhance awareness and exposure: Make more gold and jewelry designs known
      to more people and increase transaction volume on international
      platforms.
    </>,
  ];

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-900">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-5 py-5 sm:px-8"
      >
        <div className="flex items-center gap-2 text-xs tracking-wide text-neutral-500">
          <span className="cursor-pointer transition-colors hover:text-neutral-900">
            Home
          </span>

          <ChevronRight
            aria-hidden="true"
            className="h-3.5 w-3.5 text-neutral-400"
          />

          <span className="text-neutral-900">About Us</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative isolate flex min-h-64 items-center justify-center overflow-hidden sm:min-h-80">
        <img
          src={aboutImage}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 -z-10 bg-black/40" />

        <div className="px-5 py-16 text-center">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-white/80 sm:text-xs">
            Our Story
          </p>

          <h1 className="text-3xl font-light tracking-wide text-white sm:text-5xl">
            About Us
          </h1>

          <div className="mx-auto mt-5 h-px w-10 bg-white/70" />

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/90 sm:text-base">
            Discover more about Juwelo New York and our platform.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16 lg:py-20">
        <div className="border border-neutral-200/80 bg-white px-5 py-7 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
          {/* Section Heading */}
          <header className="mb-8 border-b border-neutral-200 pb-7 sm:mb-10 sm:pb-9">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
              About Juwelo New York
            </p>

            <h2 className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Who We Are
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Learn about our platform, its features, and how it aims to support
              brands and retailers in the jewelry industry.
            </p>
          </header>

          {/* About List */}
          <div className="divide-y divide-neutral-200">
            {aboutItems.map((item, index) => (
              <article
                key={index}
                className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-4 sm:py-6"
              >
                <span className="pt-0.5 text-xs font-medium tabular-nums tracking-wide text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="text-[13px] leading-6 text-neutral-600 sm:text-sm sm:leading-7">
                  {item}
                </p>
              </article>
            ))}
          </div>

          {/* Closing Note */}
          <div className="mt-9 border-l-2 border-neutral-900 pl-4 sm:mt-12">
            <p className="text-xs leading-6 text-neutral-500 sm:text-sm">
              Our focus is to help brands showcase their products, understand
              customer feedback, and build stronger relationships with their
              customers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
