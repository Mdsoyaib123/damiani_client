import { ChevronRight } from 'lucide-react';
import aboutImage from "@/assets/about/about.jpg";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">About Us</span>
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <div className="relative h-80 bg-gray-200 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${aboutImage})`,
          }}
        >
          <div className="absolute inset-0 bg-black/35"></div>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white tracking-wide">About Us</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              Juwelo New York is an international platform company that provides gold and jewelry buying, selling and trading. Its main goal is to help brands and retailers collect, manage and nationally order transactions.
            </p>
          </div>

          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              Juwelo New York helps merchants conduct cross-border transactions, providing a system mechanism for greater mobility and faster transactions.
            </p>
          </div>

          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              The platform provides customized review display options, allowing brands to display customer feedback in an eye-catching way on their website.
            </p>
          </div>

          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              By displaying real user reviews, Juwelo New York helps brands build trust and improve potential customers' purchasing decisions.
            </p>
          </div>

          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              The tool provides data analysis to help brands and retailers gain insights into customer feedback and identify product strengths and weaknesses.
            </p>
          </div>

          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              Juwelo New York can be integrated with agencies and marketing tools in different countries to help brands manage customer transactions in cross-border channels.
            </p>
          </div>

          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              Improve conversion rate: Showing positive customer reviews can often increase the trust of potential customers, thereby increasing conversion rates.
            </p>
          </div>

          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              Understand customer needs: By analyzing reviews, brands can better understand consumer needs and preferences to improve products and services.
            </p>
          </div>

          <div className="flex items-start">
            <span className="text-gray-900 font-bold mr-3 mt-1">•</span>
            <p className="text-base">
              Enhance awareness and exposure: Make more gold and jewelry designs known to more people and increase transaction volume on international platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}