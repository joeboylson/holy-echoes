import { useEffect, useState } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";
import { useDebounce } from "@/hooks/useDebounce";
import useSearch from "@/hooks/useSearch";
import { Input } from "@/components/ui/input";
import { Link, useSearchParams } from "react-router-dom";
import markdownit from "markdown-it";
import ScrollablePageLayout from "@/components/ScrollablePageLayout";
import clsx from "clsx";

const md = markdownit({ html: true });

export default function Search() {
  const { setStatusBarColor } = useStatusBar();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { prayerResults, prayerBlockResults, isLoading } =
    useSearch(debouncedSearchTerm);

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

  useEffect(() => {
    // Transition to top when there are results
    if (
      (prayerResults.length > 0 || prayerBlockResults.length > 0) &&
      !hasSearched
    ) {
      setHasSearched(true);
    }
  }, [prayerResults, prayerBlockResults, hasSearched]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const highlightMarkdown = (text: string, query: string) => {
    if (!query.trim()) {
      return { __html: md.render(text) };
    }

    // Find the first match and extract surrounding context
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex === -1) {
      return { __html: md.render(text) };
    }

    // Extract 25 characters before and after the match
    let start = Math.max(0, matchIndex - 25);
    let end = Math.min(text.length, matchIndex + query.length + 25);
    let snippet = text.substring(start, end);

    // If snippet contains line breaks, just show the line with the match
    if (snippet.includes("\n")) {
      const beforeMatch = text.substring(0, matchIndex);
      const afterMatch = text.substring(matchIndex);
      const lineStart = beforeMatch.lastIndexOf("\n") + 1;
      const lineEnd = afterMatch.indexOf("\n");
      const lineEndPos = lineEnd === -1 ? text.length : matchIndex + lineEnd;

      start = lineStart;
      end = lineEndPos;
      snippet = text.substring(start, end);
    }

    // Add ellipsis if truncated
    const prefix = start > 0 ? "..." : "";
    const suffix = end < text.length ? "..." : "";
    const fullSnippet = prefix + snippet + suffix;

    // Highlight the query in the snippet
    const highlightedText = fullSnippet.replace(
      new RegExp(`(${query})`, "gi"),
      '<mark class="bg-yellow-200">$1</mark>'
    );

    return { __html: md.render(highlightedText) };
  };

  // Conditional class variables
  const containerClasses = clsx(
    "w-full px-6 max-w-[600px] mx-auto",
    "transition-transform duration-700 ease-in-out",
    {
      "translate-y-[30vh]": !hasSearched,
      "translate-y-0": hasSearched,
    }
  );

  const inputWrapperClasses = clsx({
    "my-6": hasSearched,
  });

  const inputClasses = clsx(
    "w-full transition-all duration-700 ease-in-out",
    {
      "text-lg h-14": !hasSearched,
    }
  );

  return (
    <LoggedInUserWrapper>
      <ScrollablePageLayout
        variant="50"
        header={<NavigationHeader backTo={Pages.HOME} />}
      >
        <div className={containerClasses}>
          {!hasSearched && (
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Search Prayers
              </h1>
              <p className="text-gray-600">
                Find prayers by name or content
              </p>
            </div>
          )}

          <div className={inputWrapperClasses}>
            <Input
              type="text"
              placeholder="Search prayers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={inputClasses}
              autoFocus
            />
          </div>

          {isLoading && (
            <div className="text-center text-gray-500">Searching...</div>
          )}

          {!isLoading && debouncedSearchTerm && (
            <>
              {/* Prayer Results */}
              {prayerResults.length > 0 && (
                <div className="space-y-2">
                  {prayerResults.map((prayer) => {
                    // Find first block with text content (likely a title/body block)
                    const textBlock = prayer.prayerBlocks?.find(
                      (block) => block.text
                    );
                    const previewText = textBlock?.text
                      ? textBlock.text.substring(0, 50) +
                        (textBlock.text.length > 50 ? "..." : "")
                      : "";

                    return (
                      <Link
                        key={prayer.id}
                        to={`/category/search/prayer/${
                          prayer.id
                        }?q=${encodeURIComponent(debouncedSearchTerm)}`}
                        className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow no-underline text-gray-900 hover:text-gray-900"
                      >
                        <div className="text-lg font-medium">
                          {highlightText(prayer.name, debouncedSearchTerm)}
                        </div>
                        {previewText && (
                          <div className="text-sm text-gray-500 mt-1">
                            {previewText}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Prayer Block Results */}
              {prayerBlockResults.length > 0 && (
                <div className="space-y-2">
                  {prayerBlockResults.map((block) => (
                    <Link
                      key={block.id}
                      to={`/category/search/prayer/${
                        block.prayer?.id
                      }?q=${encodeURIComponent(debouncedSearchTerm)}`}
                      className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow no-underline text-gray-900 hover:text-gray-900"
                    >
                      <div className="text-lg font-medium text-gray-900 mb-1">
                        {block.prayer?.name}
                      </div>
                      <div
                        className="text-sm"
                        dangerouslySetInnerHTML={highlightMarkdown(
                          block.text || "",
                          debouncedSearchTerm
                        )}
                      />
                    </Link>
                  ))}
                </div>
              )}

              {prayerResults.length === 0 &&
                prayerBlockResults.length === 0 && (
                  <div className="text-center text-gray-500">
                    No results found for "{debouncedSearchTerm}"
                  </div>
                )}
            </>
          )}
        </div>
      </ScrollablePageLayout>
    </LoggedInUserWrapper>
  );
}
