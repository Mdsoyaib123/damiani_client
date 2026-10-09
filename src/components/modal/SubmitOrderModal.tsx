
interface SubmitOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    isConfirming: boolean;
}


const SubmitOrderModal: React.FC<SubmitOrderModalProps> = ({ isOpen, onClose, onSubmit, isConfirming }) => {
    if (!isOpen) return null;

    return (
        <div className="hi fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="h-[300px] w-[400px] flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Confirm Submitting Order</h2>
                <div className="flex flex-col gap-2 w-3/4">
                    <button onClick={onSubmit} className="bg-gray-800 hover:bg-gray-900 cursor-pointer text-white px-4 py-2 rounded">{isConfirming ? "Confirming..." : "Confirm"}</button>
                    <button onClick={onClose} className="border-1 border-gray-800 text-black hover:bg-gray-800 cursor-pointer hover:text-white px-4 py-2 rounded">Cancel</button></div>
            </div>
        </div>
    )
}

export default SubmitOrderModal