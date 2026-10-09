import { ChevronRight } from "lucide-react";
import helpImage from "@/assets/help/help.jpg"; // use any banner image you like

export default function Help() {
    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center text-sm text-gray-600">
                    <span className="hover:text-gray-900 cursor-pointer">Home</span>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-900">Help</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-80 bg-gray-200 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${helpImage})`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/35"></div>
                </div>
                <div className="relative h-full flex items-center justify-center">
                    <h1 className="text-5xl font-bold text-white tracking-wide">
                        Help & Support
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <div className="flex items-start">
                        <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
                        <p className="text-base">
                            After completing every set of orders, you may submit <strong>Sell Out</strong> once only. Please bind your bank information on the platform before submitting a Sell Out request.
                        </p>
                    </div>

                    <div className="flex items-start">
                        <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
                        <p className="text-base">
                            Click the <strong>"Sell Out"</strong> button after entering the amount you want to Sell Out, then enter your Sell Out password to proceed. The actual arrival time depends on your bank’s processing time.
                        </p>
                    </div>

                    <div className="flex items-start">
                        <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
                        <p className="text-base">
                            Accounts are not allowed to keep remaining funds exceeding <strong>100,000 taka</strong> after applying for Sell Out.
                        </p>
                    </div>

                    <div className="flex items-start">
                        <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
                        <p className="text-base">
                            <strong>Note:</strong> Sell Out time is from <strong>10:00 AM to 10:00 PM</strong>. Only one Sell Out request can be made per day.
                        </p>
                    </div>

                    <div className="flex items-start">
                        <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
                        <p className="text-base">
                            The maximum Sell Out amount is <strong>10,000,000 taka</strong>.
                        </p>
                    </div>

                    <div className="flex items-start">
                        <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
                        <p className="text-base">
                            If the first Sell Out exceeds <strong>500,000 taka</strong>, a <strong>50% security deposit</strong> is required for safety verification. The Sell Out can be completed after <strong>1 hour</strong>.
                        </p>
                    </div>

                    <div className="flex items-start">
                        <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
                        <p className="text-base">
                            The <strong>50% Buy In</strong> only needs to be paid once. For future Sell Outs exceeding 500,000 taka, no additional security Buy In is required.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
