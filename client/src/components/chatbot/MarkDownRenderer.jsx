import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { createHighlighter } from "shiki";
import { ClipboardCopy, Check } from "lucide-react";

export default function MarkdownRenderer({ children }) {
  const [highlighter, setHighlighter] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Load Shiki once on mount
  useEffect(() => {
    createHighlighter({
        themes: ["dracula"],
        langs: [
          "javascript",
          "typescript",
          "jsx",
          "tsx",
          "json",
          "html",
          "css",
          "bash",
          "markdown",
          "python",
          "cpp",
          "java",
          "c",
          "ruby",
          "go",
          "rust",
          "php",
          "sql",
          "yaml"
        ]
        }).then((hl) => setHighlighter(hl));
  }, []);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  let blockCounter = 0;

  return (
    <div className="markdown-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            // Inline code stays normal
            if (inline || !match) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            // Prepare block code
            const lang = match[1];
            const codeText = String(children).replace(/\n$/, "");
            const index = blockCounter++;

            // Fallback if Shiki hasn't loaded yet
            if (!highlighter) {
              return (
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl">
                  <code>{codeText}</code>
                </pre>
              );
            }

            // Highlight using Shiki
            const html = highlighter.codeToHtml(codeText, { lang, theme: "dracula" });

            return (
              <div className="relative group my-4">
                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(codeText, index)}
                  className="absolute top-2 right-2 
                             bg-gray-700/70 hover:bg-gray-600
                             text-white p-1.5 rounded-md
                             flex items-center justify-center
                             transition opacity-0 
                             group-hover:opacity-100"
                >
                  {copiedIndex === index ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <ClipboardCopy size={16} />
                  )}
                </button>

                {/* Shiki HTML */}
                <div
                  className="shiki-code rounded-xl"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            );
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}