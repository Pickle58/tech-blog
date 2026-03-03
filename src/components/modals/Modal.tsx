import { LuX } from "react-icons/lu";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div aria-hidden={!isOpen} className={`fixed inset-0 z-50 flex items-center justify-center px-3 transition-opacity duration-700
    ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}>
            {/* backdrop */}
            <div onClick={onClose} className={`absolute inset-0 bg-black/90 transition-all duration-700
            ${isOpen ? "opacity-100" : "opacity-0"}
            `} />

            {/* modal */}
            <div className={`relative z-10 w-full max-w-md rounded-2xl bg-secondary-background border border-white/10 px-6 py-12 shadow-xl transition-all duration-700
                ${isOpen ? "translate-y-0" : "translate-y-full"}
                ${isOpen ? "opacity-100" : "opacity-0"}
                `}>
                <button className="absolute right-4 top-4 text-gray-400 hover:text-white transition" aria-label="Close Modal" onClick={onClose}>
                    <LuX size={22} />
                </button>
                {children}
            </div>
        </div>
    )
}
