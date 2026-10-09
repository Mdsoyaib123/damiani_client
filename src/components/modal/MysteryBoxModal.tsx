import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import treasureOpen from "@/assets/treasure/opened-treasure-new.png"
import treasureClosed from "@/assets/treasure/closed-treasure.png"

interface MysteryBoxData {
    method: string;
    amount: string;
}

interface MysteryBoxModalProps {
    open: boolean;
    onClose: () => void;
    mysteryBoxData: MysteryBoxData;
}

interface BoxReveal {
    boxIndex: number;
    amount: string;
    isWinning: boolean;
}

const MysteryBoxModal: React.FC<MysteryBoxModalProps> = ({
    open,
    onClose,
    mysteryBoxData,
}) => {
    const [selectedBox, setSelectedBox] = useState<number | null>(null);
    const [revealedBoxes, setRevealedBoxes] = useState<BoxReveal[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Reset state when modal opens
        if (open) {
            setSelectedBox(null);
            setRevealedBoxes([]);
            setIsAnimating(false);
        }
    }, [open]);

    if (!open) return null;

    const generateRandomMultiplier = (method: string): string => {
        if (method === "12x") {
            // Multiplier reward
            const multiplier = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
            return `${multiplier}x`;
        }

        if (method === "cash") {
            // Cash reward (example: 500 – 5000)
            const cash = Math.floor(Math.random() * (50000 - 500 + 1)) + 500;
            return `${cash}`;
        }

        return "";
    };


    const generateUniqueMultipliers = (method: string, count: number): string[] => {
        const multipliers = new Set<string>();

        while (multipliers.size < count) {
            multipliers.add(generateRandomMultiplier(method));
        }

        return Array.from(multipliers);
    };

    const handleBoxClick = (boxIndex: number) => {
        if (selectedBox !== null || isAnimating) return;

        setIsAnimating(true);
        setSelectedBox(boxIndex);

        // Reveal selected box first (winning amount)
        setTimeout(() => {
            setRevealedBoxes((prev) => [
                ...prev,
                {
                    boxIndex,
                    amount: mysteryBoxData.amount,
                    isWinning: true,
                },
            ]);
        }, 500);

        // Reveal other boxes after a delay with unique random multipliers
        setTimeout(() => {
            const otherBoxes = [0, 1, 2].filter((i) => i !== boxIndex);
            const uniqueMultipliers = generateUniqueMultipliers(mysteryBoxData.method, 2);

            const reveals: BoxReveal[] = otherBoxes.map((idx, i) => ({
                boxIndex: idx,
                amount: uniqueMultipliers[i],
                isWinning: false,
            }));

            setRevealedBoxes((prev) => [...prev, ...reveals]);
            setIsAnimating(false);
        }, 1500);
    };

    const getRevealedAmount = (boxIndex: number): BoxReveal | undefined => {
        return revealedBoxes.find((box) => box.boxIndex === boxIndex);
    };

    const isBoxRevealed = (boxIndex: number): boolean => {
        return revealedBoxes.some((box) => box.boxIndex === boxIndex);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-transparent relative w-full max-w-lg">
                {/* Close button */}
                <button
                    // onClick={onClose}
                    className="absolute -top-12 right-0 text-white/20 hover:text-white/30 transition-colors z-10"
                    disabled={isAnimating}
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Content */}
                <div className="relative">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-white mb-2">
                            Crown Box!
                        </h2>
                        <p className="text-gray-300 text-lg">
                            {selectedBox === null
                                ? "Choose Your Crown Box"
                                : "Congratulations!"}
                        </p>
                    </div>

                    {/* Mystery Boxes */}
                    <div className="flex justify-center gap-8 mb-8">
                        {[0, 1, 2].map((boxIndex) => {
                            const revealed = getRevealedAmount(boxIndex);
                            const isRevealed = isBoxRevealed(boxIndex);
                            const isSelected = selectedBox === boxIndex;

                            return (
                                <button
                                    key={boxIndex}
                                    onClick={() => handleBoxClick(boxIndex)}
                                    disabled={selectedBox !== null || isAnimating}
                                    className={`
                                        relative w-32 h-32 transition-all duration-300 transform
                                        ${!isRevealed ? "hover:scale-110 cursor-pointer" : "cursor-default"}
                                        ${isSelected && !isRevealed ? "scale-110 animate-bounce" : ""}
                                        ${selectedBox !== null && !isRevealed ? "opacity-50" : ""}
                                        ${isRevealed && revealed?.isWinning ? "scale-110" : ""}
                                    `}
                                >
                                    {!isRevealed ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img
                                                src={treasureClosed}
                                                alt="Closed Treasure"
                                                className={`w-full h-full object-contain ${isSelected ? "animate-pulse" : ""}`}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center relative">
                                            <img
                                                src={treasureOpen}
                                                alt="Opened Treasure"
                                                className="w-full h-full object-contain"
                                            />
                                            {/* Amount overlay */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div
                                                    className={`text-2xl font-bold ${revealed?.isWinning
                                                        ? "text-yellow-400 animate-pulse bg-black/70 p-2 rounded-xl"
                                                        : "text-white bg-black/70 p-2 rounded-xl"
                                                        }`}
                                                >
                                                    {mysteryBoxData.method === "cash" ? "৳" : ""}{revealed?.amount}
                                                </div>
                                                {revealed?.isWinning && (
                                                    <div className="text-xs text-yellow-400 mt-1 font-semibold">
                                                        YOU WIN!
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Result message */}
                    {revealedBoxes.length === 3 && (
                        <div className="text-center animate-fadeIn">
                            <div className="bg-black bg-opacity-50 rounded-lg p-6 mb-6 backdrop-blur-sm">
                                <p className="text-white text-xl font-semibold mb-2">
                                    Your Prize
                                </p>
                                <p className="text-yellow-400 text-4xl font-bold">
                                    {mysteryBoxData.method === "cash" ? "৳" : ""}{mysteryBoxData.amount}
                                </p>
                                <p className="text-yellow-400 text-4xl font-bold">{mysteryBoxData?.method === "12x" ? "Crown Order" : ""}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full cursor-pointer max-w-xs mx-auto py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Instructions */}
                    {selectedBox === null && (
                        <div className="text-center text-gray-300 text-base">
                            <p className="font-medium">Pick a box to reveal your reward!</p>
                            {/* <p className="text-sm mt-2 opacity-75">
                                Method: {mysteryBoxData.method.toUpperCase()}
                            </p> */}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MysteryBoxModal;