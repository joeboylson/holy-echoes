export { BlockTypes } from "../../instant.schema";

// NOTE: These types are derived from the schema and provide better typing for your app
// BETTER WAY: Consider using InstantDB's automatic type generation when available

export type User = {
  id: string;
  email: string;
};

export type InstantFile = {
  id: string;
  path: string;
  url: string;
  // NOTE: InstantDB handles other file metadata automatically
};

export type Admin = {
  id: string;
  $user?: User; // Relationship to user
};

export type Prayer = {
  id?: string;
  name: string;
  order: number;
  published: boolean;
  prayerBlocks?: PrayerBlock[]; // Relationship
  categories?: Category[]; // Relationship
};

export type PrayerBlock = {
  id: string;
  text?: string; // Optional for image-only blocks
  order: number;
  reference?: string; // Optional
  spaceAbove: boolean;
  blockType?: BlockType; // Relationship
  prayer?: Prayer; // Relationship
  litanyBlocks?: LitanyBlock[]; // Relationship
  file?: InstantFile; // Relationship for images
};

export type BlockType = {
  id: string;
  name: string; // Should match BlockTypes enum values
  order: number;
  prayerBlocks?: PrayerBlock[]; // Relationship
};

export type LitanyBlock = {
  id: string;
  order: number;
  call: string;
  response: string;
  superscript?: string; // Optional
  inline: boolean;
  prayerBlock?: PrayerBlock; // Relationship
};

export type Category = {
  id?: string;
  name: string;
  order: number;
  prayers?: Prayer[]; // Relationship
};

// Query result types for better typing
export type PrayerWithRelations = Prayer & {
  prayerBlocks: (PrayerBlock & {
    blockType?: BlockType;
    litanyBlocks?: LitanyBlock[];
    file?: InstantFile;
  })[];
  categories: Category[];
};

export type CategoryWithPrayers = Category & {
  prayers: Prayer[];
};

// Utility types for mutations
export type CreatePrayerInput = Omit<
  Prayer,
  "id" | "prayerBlocks" | "categories"
>;
export type UpdatePrayerInput = Partial<CreatePrayerInput>;

export type CreatePrayerBlockInput = Omit<
  PrayerBlock,
  "id" | "prayer" | "blockType" | "litanyBlocks" | "file"
>;
export type UpdatePrayerBlockInput = Partial<CreatePrayerBlockInput>;

export type CreateCategoryInput = Omit<Category, "id" | "prayers">;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;
