import { ChevronRight } from "lucide-react";
import helpImage from "@/assets/help/help.jpg";

export default function Help() {
    const helpItems = [
        <>
            After completing every set of orders, you may submit <strong>Sell Out</strong> once only. Please bind your bank information on the platform before submitting a Sell Out request.
        </>,
        <>
            Click the <strong>"Sell Out"</strong> button after entering the amount you want to Sell Out, then enter your Sell Out password to proceed. The actual arrival time depends on your bank’s processing time.
        </>,
        <>
            Accounts are not allowed to keep remaining funds exceeding <strong>100,000 taka</strong> after applying for Sell Out.
        </>,
        <>
            <strong>Note:</strong> Sell Out time is from <strong>10:00 AM to 10:00 PM</strong>. Only one Sell Out request can be made per day.
        </>,
        <>
            The maximum Sell Out amount is <strong>10,000,000 taka</strong>.
        </>,
        <>
            If the first Sell Out exceeds <strong>500,000 taka</strong>, a <strong>50% security deposit</strong> is required for safety verification. The Sell Out can be completed after <strong>1 hour</strong>.
        </>,
        <>
            The <strong>50% Buy In</strong> only needs to be paid once. For future Sell Outs exceeding 500,000 taka, no additional security Buy In is required.
        </>,
    ];

    return (
        <main className="min-h-screen bg-white text-neutral-900">
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

                    <span className="text-neutral-900">Help</span>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative isolate flex min-h-[280px] items-center justify-center overflow-hidden sm:min-h-[360px]">
                <img
                    src={helpImage}
                    alt=""
                    className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
                />

                <div className="absolute inset-0 -z-10 bg-black/35" />

                <div className="px-5 py-16 text-center">
                    <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-white/80 sm:text-xs">
                        Customer Care
                    </p>

                    <h1 className="text-3xl font-light tracking-wide text-white sm:text-5xl">
                        Help &amp; Support
                    </h1>

                    <div className="mx-auto mt-5 h-px w-10 bg-white/70" />

                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/90 sm:text-base">
                        Information to help you manage your withdrawals.
                    </p>
                </div>
            </section>

            {/* Help Content */}
            <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
                <header className="mb-8 sm:mb-10">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
                        Information &amp; Guidelines
                    </p>

                    <h2 className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
                        Sell Out guidelines
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                        Please review the following information before submitting
                        a Sell Out request.
                    </p>
                </header>

                <div className="border-t border-neutral-200">
                    {helpItems.map((item, index) => (
                        <article
                            key={index}
                            className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 border-b border-neutral-200 py-5 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-4 sm:py-6"
                        >
                            <span className="pt-0.5 text-xs font-medium tabular-nums tracking-wide text-neutral-400">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <p className="text-[13px] leading-6 text-neutral-600 sm:text-sm sm:leading-7 [&_strong]:font-medium [&_strong]:text-neutral-900">
                                {item}
                            </p>
                        </article>
                    ))}
                </div>

                <div className="mt-8 border-l-2 border-neutral-900 pl-4 sm:mt-10">
                    <p className="text-xs leading-6 text-neutral-500 sm:text-sm">
                        Please make sure you understand the withdrawal requirements
                        before proceeding.
                    </p>
                </div>
            </section>
        </main>
    );
}