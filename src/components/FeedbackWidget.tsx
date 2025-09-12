import { useState, useEffect } from "react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("[FeedbackWidget] mounted");
  }, []);

  return (
    <>
      {/* Vertical Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-red-500 text-white px-2 py-4 rounded-l-md shadow-lg z-[100000]"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        Feedback
      </button>

      {/* Overlay Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100001]
                     animate-fadeIn"
        >
          <div
            className="relative bg-white rounded-lg max-w-lg w-[90vw] max-h-[85vh] p-4 shadow-xl overflow-auto
                       animate-slideInUp"
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Elfsight container */}
            <div
              className="elfsight-app-7e915384-2ea3-4868-a577-899d188fc9f4"
              data-elfsight-app-lazy
            />
          </div>
        </div>
      )}
    </>
  );
}
