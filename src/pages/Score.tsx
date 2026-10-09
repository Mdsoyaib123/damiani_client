import { useGetSingleUserQuery } from "@/store/api/user/userApi";

const Score = () => {
    // Get userId from localStorage or your auth state
    // const userId = JSON.parse(localStorage.getItem('userId') || '{}')?.userId || 3520335;
    const id = localStorage.getItem("userId");
    const userId = id ? parseInt(id) : 0;

    console.log(userId, "score userId");

    const { data: userData, isLoading } = useGetSingleUserQuery(userId, {
        skip: !userId,
        refetchOnMountOrArgChange: true,
    });
    const score = userData?.data?.score || 0;

    // Calculate rotation angle for the needle based on score (0-100)
    // 0 points = -90deg (left), 100 points = 90deg (right)
    let needleRotation = -90;
    if (score < 20) {
        needleRotation = -90 + (score * 2);
    } else if (score >= 20 && score < 40) {
        needleRotation = -90 + (score * 2.5);
    } else if (score >= 40 && score < 60) {
        needleRotation = -90 + (score * 1.8)
    } else if (score >= 60 && score < 80) {
        needleRotation = -90 + (score * 1.65)
    } else {
        needleRotation = -90 + (score * 1.65)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Honor Score</h1>

                {/* Current Score Display */}
                <div className="border-4 border-red-500 rounded-lg p-4 mb-8">
                    <p className="text-xl font-semibold text-gray-700">
                        Current Honor Score: {score}/100
                    </p>
                </div>

                {/* Gauge Container */}
                <div className="relative w-full max-w-md mx-auto mb-8">
                    {/* SVG Gauge */}
                    <svg viewBox="0 0 200 120" className="w-full">
                        {/* Red segment (0-19) */}
                        <path
                            d="M 20 100 A 80 90 0 0 1 46 35"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="20"
                        />

                        {/* Orange segment (20-39) */}
                        <path
                            d="M 46 35 A 80 80 0 0 1 80 15"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="20"
                        />

                        {/* Yellow segment (40-59) */}
                        <path
                            d="M 80 15 A 80 80 0 0 1 120 15"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="20"
                        />

                        {/* Light green segment (60-79) */}
                        <path
                            d="M 120 15 A 80 80 0 0 1 154 35"
                            fill="none"
                            stroke="#84cc16"
                            strokeWidth="20"
                        />

                        {/* Green segment (80-100) */}
                        <path
                            d="M 154 35 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="20"
                        />

                        {/* Center circle */}
                        <circle cx="100" cy="100" r="15" fill="#1f2937" />

                        {/* Needle */}
                        <g transform={`rotate(${needleRotation}, 100, 100)`}>
                            <line
                                x1="100"
                                y1="100"
                                x2="100"
                                y2="35"
                                stroke="#1f2937"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </g>
                    </svg>

                    {/* Labels */}
                    <div className="absolute top-24 lg:top-28 left-8 lg:left-12 text-[9px] lg:text-xs font-semibold text-gray-700">
                        0-19
                    </div>
                    <div className="absolute top-8 lg:top-10 left-19 lg:left-28 text-[9px] lg:text-xs font-semibold text-gray-700">
                        20-39
                    </div>
                    <div className="absolute top-3 lg:top-5 left-1/2 transform -translate-x-1/2 text-[9px] lg:text-xs font-semibold text-gray-700">
                        40-59
                    </div>
                    <div className="absolute top-7 lg:top-10 right-21 lg:right-28 text-[9px] lg:text-xs font-semibold text-gray-700">
                        60-79
                    </div>
                    <div className="absolute top-26 right-5 lg:right-11 text-[9px] lg:text-xs font-semibold text-gray-700">
                        80-100
                    </div>
                </div>

                {/* Score Display Box */}
                <div className="border-4 border-red-500 rounded-lg p-4 w-32 mx-auto mb-8">
                    <p className="text-2xl font-bold text-center text-gray-800">
                        {score} <span className="text-base font-normal text-gray-600">points</span>
                    </p>
                </div>

                {/* Reputation Rules */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Reputation rule</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Each complete 2 around of purchase will get 2 points</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Completing special purchase can get extra commission and points</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>If the purchase is not completed for too long, the credit score will decrease</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Membership reach 100 points, Apply Entire Amount Sell Out Credit point down during Sell Out process Need to make Credit score insurance</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Score;