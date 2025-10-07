import { useEffect, useState } from "react";
import { useStatusBar } from "@/contexts/StatusBarContext";
import LoggedInUserWrapper from "@/layout/LoggedInUserWrapper";
import NavigationHeader from "@/components/NavigationHeader";
import { Pages } from "@/layout/App/router";
import { useDebounce } from "@/hooks/useDebounce";
import useSearch from "@/hooks/useSearch";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function Search() {
  const { setStatusBarColor } = useStatusBar();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { prayerResults, prayerBlockResults, isLoading } = useSearch(
    debouncedSearchTerm
  );

  useEffect(() => {
    setStatusBarColor("#0082cb");
  }, [setStatusBarColor]);

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

  return (
    <LoggedInUserWrapper>
      <div className="w-screen grid grid-cols-1 mx-auto gap-3 h-full content-start">
        <NavigationHeader backTo={Pages.HOME} />

        <div className="px-6 w-full max-w-[600px] mx-auto pb-24">
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search prayers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
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
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Prayers ({prayerResults.length})
                  </h2>
                  <div className="space-y-2">
                    {prayerResults.map((prayer) => (
                      <Link
                        key={prayer.id}
                        to={`/prayer/${prayer.id}`}
                        className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow no-underline text-gray-900 hover:text-gray-900"
                      >
                        <div className="font-medium">
                          {highlightText(prayer.name, debouncedSearchTerm)}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Prayer Block Results */}
              {prayerBlockResults.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Prayer Blocks ({prayerBlockResults.length})
                  </h2>
                  <div className="space-y-2">
                    {prayerBlockResults.map((block) => (
                      <Link
                        key={block.id}
                        to={`/prayer/${block.prayer?.id}`}
                        className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow no-underline text-gray-900 hover:text-gray-900"
                      >
                        <div className="font-medium text-sm text-gray-600 mb-1">
                          {block.prayer?.name}
                        </div>
                        <div className="text-sm">
                          {highlightText(block.text || "", debouncedSearchTerm)}
                        </div>
                      </Link>
                    ))}
                  </div>
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
      </div>
    </LoggedInUserWrapper>
  );
}
