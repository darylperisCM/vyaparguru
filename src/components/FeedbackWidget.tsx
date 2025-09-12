import { useState } from "react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white px-3 py-2 rounded-full shadow-lg z-[9999]"
      >
        Feedback
      </button>

      {/* Overlay Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="relative bg-white rounded-lg max-w-lg w-full p-4 shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            {/* Elfsight Container */}
            <div
              className="elfsight-app-7e915384-2ea3-4868-a577-899d188fc9f4"
              data-elfsight-app-lazy
            ></div>
          </div>
        </div>
      )}
    </>
  );
}
