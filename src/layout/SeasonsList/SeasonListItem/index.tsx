import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Season, Prayer } from "@schema";
import { db } from "@/database";
import { last, isEmpty, compact } from "lodash";
import AsyncImage from "@/components/AsyncImage";
import DeleteButton from "@/components/DeleteButton";
import LoadingIcon from "@/components/LoadingIcon";
import { formatDayOfYear } from "@/utils/seasonDateHelpers";
import { SelectWithCreate } from "@/components/SelectWithCreate";

type SeasonListItemProps = {
  season: Season;
  prayers: Prayer[];
  startDay?: number;
  endDay?: number;
  onSave: (updates: Partial<Season>) => void;
  onLinkPrayer: (prayerId: string) => void;
  onUnlinkPrayer: (prayerId: string) => void;
  onLinkFile: (fileId: string) => void;
  onUnlinkFile: () => void;
};

export function SeasonListItem({
  season,
  prayers,
  startDay,
  endDay,
  onSave,
  onLinkPrayer,
  onUnlinkPrayer,
  onLinkFile,
  onUnlinkFile,
}: SeasonListItemProps) {
  const [loading, setLoading] = useState(false);

  const handleNameChange = (newName: string) => {
    onSave({ name: newName });
  };

  const handleColorChange = (newColor: string) => {
    onSave({ color: newColor });
  };

  const handleUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !season.id) return;

    setLoading(true);
    const file = event.target.files[0];
    const extension = last(file.name.split("."));
    const path = `season-${season.id}.${extension}`;

    const uploadedFile = await db.storage.uploadFile(path, file);
    await onLinkFile(uploadedFile.data.id);
    setLoading(false);
  };

  const handleClearImage = async () => {
    setLoading(true);
    await onUnlinkFile();
    setLoading(false);
  };

  const handlePublishedChange = (checked: boolean) => {
    onSave({ published: checked });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const featuredPrayers = season.prayers || [];
  const selectedPrayerIds = compact(featuredPrayers.map((p) => p.id));

  const prayersAsOptions = prayers.map((prayer) => ({
    label: prayer.name,
    value: prayer.id,
  }));

  return (
    <div className="flex gap-4 w-full">
      {/* Featured Image - Left Side */}
      <div className="flex-shrink-0">
        {loading ? (
          <div className="w-[200px] h-[200px] flex items-center justify-center border rounded">
            <LoadingIcon />
          </div>
        ) : isEmpty(season?.file?.url) ? (
          <label className="w-[200px] h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors">
            <div className="text-center px-4">
              <span className="text-sm text-gray-500">
                Click to upload image
              </span>
              <p className="text-xs text-gray-400 mt-2">
                (Use 2:1 ratio image)
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
            </div>
          </label>
        ) : (
          <div className="relative w-[200px] h-[200px] group">
            {season?.file?.url && (
              <AsyncImage
                src={season.file.url}
                alt={season.name}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <div className="absolute top-2 right-2">
              <DeleteButton onClick={handleClearImage} icon itemName="image" />
            </div>
          </div>
        )}
      </div>

      {/* Season Details - Right Side */}
      <div
        className="grid gap-3 flex-1 content-start"
        style={{ gridTemplateColumns: "150px 1fr" }}
      >
        {/* Season Name */}
        <span className="font-semibold">Season Name:</span>
        <Input
          value={season.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Season name"
          className="max-w-[250px] h-[24px]"
        />

        {/* Color Picker */}
        <span className="font-semibold">Color:</span>
        <Input
          type="color"
          value={season.color}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-[72px] h-[24px] border-0 p-0 cursor-pointer"
        />

        {/* Published Status */}
        <span className="font-semibold">Published:</span>
        <div className="flex items-center gap-2">
          <Switch
            checked={season.published}
            onCheckedChange={handlePublishedChange}
          />
          <span className="text-sm text-gray-600">
            {season.published ? "Visible to users" : "Hidden from users"}
          </span>
        </div>

        {/* Date Range (Read-only display) */}
        <span className="font-semibold">Date Range:</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              {startDay
                ? formatDayOfYear(startDay)
                : `${monthNames[season.startMonth - 1]} ${season.startDay}`}
            </span>
            <span>-</span>
            <span>
              {endDay
                ? formatDayOfYear(endDay)
                : season.endMonth && season.endDay
                ? `${monthNames[season.endMonth - 1]} ${season.endDay}`
                : "..."}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            (Use the timeline slider above to adjust)
          </span>
        </div>

        {/* Featured Prayers */}
        <span className="font-semibold">Featured Prayers:</span>
        <SelectWithCreate
          placeholder="+ Add a prayer"
          onSelect={onLinkPrayer}
          onDeselect={onUnlinkPrayer}
          onCreate={() => {}} // No create functionality for prayers here
          options={prayersAsOptions}
          values={selectedPrayerIds}
        />
      </div>
    </div>
  );
}
