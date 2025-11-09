import React, { useState } from "react";
import { summarizePDF } from "../api";
import { Loader2, FileText, UploadCloud } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // ✅ import global theme hook

export default function FileSummarise() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme(); // ✅ get current theme

  const handleUpload = async () => {
    if (!file) return alert("Please choose a PDF file first.");
    setLoading(true);
    setSummary(null);

    try {
      const res = await summarizePDF(file);
      setSummary(res.summary);
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Something went wrong while summarizing the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-3xl p-8 shadow-2xl border transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-800/80 border-gray-700 hover:shadow-gray-600"
            : "bg-white/90 border-blue-100 hover:scale-[1.01]"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className={`text-4xl font-extrabold mb-2 drop-shadow-sm ${
              theme === "dark" ? "text-blue-400" : "text-blue-700"
            }`}
          >
            📄 PDF Summarizer
          </h2>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Upload your document and let Yamuna-IntelliChat generate concise
            summaries for every page.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <label
            className={`flex items-center gap-3 border-2 border-dashed px-6 py-4 rounded-xl cursor-pointer transition-all
              ${
                theme === "dark"
                  ? "border-blue-500 bg-gray-700 hover:bg-gray-600"
                  : "border-blue-400 bg-blue-50 hover:bg-blue-100"
              } hover:shadow-md`}
          >
            <UploadCloud
              className={`${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
              size={24}
            />
            <span
              className={`font-medium ${
                theme === "dark" ? "text-blue-300" : "text-blue-700"
              }`}
            >
              {file ? file.name : "Choose a PDF file"}
            </span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all
              ${
                theme === "dark"
                  ? "bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                  : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Summarizing...
              </>
            ) : (
              <>
                <FileText size={20} /> Summarize
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            className={`text-center mt-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <Loader2
              className={`animate-spin inline-block mr-2 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            />
            Processing PDF... please wait.
          </div>
        )}

        {/* Summary Display */}
        {summary && (
          <div className="mt-6">
            <h3
              className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                theme === "dark" ? "text-blue-400" : "text-blue-700"
              }`}
            >
              <FileText size={20} /> Summary Result
            </h3>

            <div
              className={`rounded-2xl p-4 shadow-inner max-h-[450px] overflow-y-auto scrollbar-thin transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gray-700 border border-gray-600 scrollbar-thumb-blue-500 scrollbar-track-gray-800"
                  : "bg-gray-50 border border-gray-200 scrollbar-thumb-blue-400 scrollbar-track-blue-100"
              }`}
            >
              {Object.keys(summary).map((pageKey, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition duration-200 mb-4 shadow-sm ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 hover:shadow-gray-600"
                      : "bg-white border-gray-100 hover:shadow-md"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    {pageKey}
                  </h4>
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: summary[pageKey],
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!summary && !loading && (
          <div
            className={`text-center mt-12 italic ${
              theme === "dark" ? "text-gray-400" : "text-gray-400"
            }`}
          >
            <FileText
              className={`mx-auto mb-2 ${
                theme === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
              size={32}
            />
            Upload a PDF to generate its summary.
          </div>
        )}
      </div>
    </div>
  );
}
