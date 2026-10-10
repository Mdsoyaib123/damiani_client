import { BsTelegram } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";
import contactImage from "@/assets/contact/contact.jpg";

const Contact = () => {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Hero — matching the Flexibility design */}
      <section className="relative h-[60vh] min-h-[480px] w-full overflow-hidden bg-cover bg-center">
        <img
          src={contactImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-10 text-left sm:px-10 sm:pb-14">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-white/75">
            Customer Care
          </p>

          <h1 className="mb-3 text-2xl font-light leading-tight tracking-tight text-white sm:text-4xl">
            Juwelo Help Center
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
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            We're here to help
          </p>

          <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl">
            Knowledge Base
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
            Connect with our support channels for assistance and information.
          </p>
        </div>

        <div className="border-t border-neutral-200">
          {/* Telegram */}
          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 border-b border-neutral-200 py-6 transition-colors hover:bg-neutral-50 sm:gap-6 sm:px-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-200 text-neutral-800">
              <BsTelegram className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium">Telegram Support</h3>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
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
            rel="noreferrer"
            className="group flex items-center gap-4 border-b border-neutral-200 py-6 transition-colors hover:bg-neutral-50 sm:gap-6 sm:px-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-200 text-neutral-800">
              <IoLogoWhatsapp className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium">WhatsApp Support</h3>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Reach our support team through WhatsApp.
              </p>
            </div>

            <span className="text-lg text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900">
              →
            </span>
          </a>
        </div>
      </section>
    </main>
  );
};

export default Contact;