
import { BsTelegram } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";
import contactImage from "@/assets/contact/contact.jpg";

const Contact = () => {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-900">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[480px] w-full overflow-hidden">
        <img
          src={contactImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-10 text-left sm:px-10 sm:pb-14 lg:px-16">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white/75 sm:text-xs">
            Customer Care
          </p>

          <h1 className="mb-3 text-2xl font-light leading-tight tracking-tight text-white sm:text-4xl">
            Damiani Help Center
          </h1>

          <p className="mb-2 max-w-xl text-sm leading-7 text-white/90 sm:text-base md:text-lg">
            Our jewelry is more than an accessory—it’s an expression of
            identity, emotion, and timeless elegance. Each piece is thoughtfully
            designed to celebrate life’s most precious moments with grace and
            sophistication.
          </p>
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16 lg:py-20">
        <div className="border border-neutral-200/80 bg-white px-5 py-7 sm:px-9 sm:py-10">
          <header className="mb-8 sm:mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
              We're Here to Help
            </p>

            <h2 className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Knowledge Base
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
              Connect with our support channels for assistance and information.
            </p>
          </header>

          <div className="border-t border-neutral-200">
            {/* Telegram */}
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 border-b border-neutral-200 py-6 transition-colors hover:bg-neutral-50 sm:gap-6 sm:px-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-200 text-neutral-800 transition-colors group-hover:border-neutral-900">
                <BsTelegram className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-neutral-900">
                  Telegram Support
                </h3>
                <p className="mt-1 text-xs leading-5 text-neutral-500 sm:text-sm">
                  Contact us through Telegram for assistance.
                </p>
              </div>

              <span className="text-lg text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900">
                →
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 border-b border-neutral-200 py-6 transition-colors hover:bg-neutral-50 sm:gap-6 sm:px-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-200 text-neutral-800 transition-colors group-hover:border-neutral-900">
                <IoLogoWhatsapp className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-neutral-900">
                  WhatsApp Support
                </h3>
                <p className="mt-1 text-xs leading-5 text-neutral-500 sm:text-sm">
                  Reach our support team through WhatsApp.
                </p>
              </div>

              <span className="text-lg text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
