#!/usr/bin/env tsx

import { init, id } from "@instantdb/admin";
import schema, { type AppSchema } from "@schema";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Load environment variables
const appId = process.env.VITE_INSTANT_APP_ID;
const adminToken = process.env.VITE_INSTANT_ADMIN_TOKEN;

if (!appId || !adminToken) {
  console.error("❌ Missing required environment variables:");
  console.error("   VITE_INSTANT_APP_ID");
  console.error("   VITE_INSTANT_ADMIN_TOKEN");
  process.exit(1);
}

// Initialize database with admin privileges
const db = init<AppSchema>({
  appId,
  adminToken,
  schema,
});

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // First, clear existing data
    console.log("🧹 Clearing existing data...");

    // Get all existing records to delete
    const existingData = await db.query({
      prayers: {},
      categories: {},
      prayerBlocks: {},
      litanyBlocks: {},
    });

    // Delete in the correct order (children first, then parents)
    if (existingData.litanyBlocks.length > 0) {
      await Promise.all(
        existingData.litanyBlocks.map((lb) =>
          db.transact(db.tx.litanyBlocks[lb.id].delete())
        )
      );
      console.log(
        `   ✅ Deleted ${existingData.litanyBlocks.length} litany blocks`
      );
    }

    if (existingData.prayerBlocks.length > 0) {
      await Promise.all(
        existingData.prayerBlocks.map((pb) =>
          db.transact(db.tx.prayerBlocks[pb.id].delete())
        )
      );
      console.log(
        `   ✅ Deleted ${existingData.prayerBlocks.length} prayer blocks`
      );
    }

    if (existingData.prayers.length > 0) {
      await Promise.all(
        existingData.prayers.map((p) =>
          db.transact(db.tx.prayers[p.id].delete())
        )
      );
      console.log(`   ✅ Deleted ${existingData.prayers.length} prayers`);
    }

    if (existingData.categories.length > 0) {
      await Promise.all(
        existingData.categories.map((c) =>
          db.transact(db.tx.categories[c.id].delete())
        )
      );
      console.log(`   ✅ Deleted ${existingData.categories.length} categories`);
    }

    // Get existing block types (they should already exist)
    console.log("📝 Getting existing block types...");
    const existingBlockTypes = await db.query({ blockTypes: {} });
    console.log(
      `   ✅ Found ${existingBlockTypes.blockTypes.length} block types`
    );

    // Create 4 categories
    console.log("📂 Creating categories...");
    const categories = [
      { name: "Morning Prayers", order: 1 },
      { name: "Evening Prayers", order: 2 },
      { name: "Liturgical Prayers", order: 3 },
      { name: "Empty Category", order: 4 }, // This one will remain empty
    ];

    await Promise.all(
      categories.map((category) =>
        db.transact(db.tx.categories[id()].create(category))
      )
    );

    console.log(`   ✅ Created ${categories.length} categories`);

    // Get the created category IDs
    const createdCategories = await db.query({ categories: {} });

    const litanyBlockType = existingBlockTypes.blockTypes.find(
      (bt) => bt.name === "Litany"
    );
    const bodyBlockType = existingBlockTypes.blockTypes.find(
      (bt) => bt.name === "Body"
    );
    const titleBlockType = existingBlockTypes.blockTypes.find(
      (bt) => bt.name === "Centered Title"
    );

    // Create 3 prayers for first 3 categories (skip the "Empty Category")
    console.log("🙏 Creating prayers...");
    const prayersToCreate = [];

    for (let catIndex = 0; catIndex < 3; catIndex++) {
      const category = createdCategories.categories[catIndex];
      for (let prayerIndex = 1; prayerIndex <= 3; prayerIndex++) {
        const isUnpublished = prayerIndex === 1; // First prayer in each category is unpublished
        prayersToCreate.push({
          categoryId: category.id,
          prayer: {
            name: `${category.name} Prayer ${prayerIndex}`,
            order: prayerIndex,
            published: !isUnpublished,
          },
        });
      }
    }

    // Create prayers and link to categories
    const prayerResults = [];
    for (const { categoryId, prayer } of prayersToCreate) {
      const prayerId = id();
      await db.transact([
        db.tx.prayers[prayerId].create(prayer),
        db.tx.categories[categoryId].link({ prayers: prayerId }),
      ]);
      prayerResults.push({ id: prayerId, ...prayer });
    }
    console.log(`   ✅ Created ${prayerResults.length} prayers`);

    // Create prayer blocks for each prayer
    console.log("📄 Creating prayer blocks...");
    let totalBlocks = 0;
    let totalLitanyBlocks = 0;

    for (const prayer of prayerResults) {
      const blocks = [
        {
          text: `Title for ${prayer.name}`,
          order: 1,
          blockTypeId: titleBlockType?.id,
          reference: "",
          spaceAbove: false,
        },
        {
          text: `Body content for ${prayer.name}. This is the main text of the prayer.`,
          order: 2,
          blockTypeId: bodyBlockType?.id,
          reference: "Reference 1:1",
          spaceAbove: false,
        },
        {
          text: `Litany section for ${prayer.name}`,
          order: 3,
          blockTypeId: litanyBlockType?.id,
          reference: "",
          spaceAbove: true,
        },
      ];

      for (const block of blocks) {
        const blockId = id();
        await db.transact([
          db.tx.prayerBlocks[blockId].create({
            text: block.text,
            order: block.order,
            reference: block.reference,
            spaceAbove: block.spaceAbove,
          }),
          db.tx.prayers[prayer.id].link({ prayerBlocks: blockId }),
          ...(block.blockTypeId
            ? [
                db.tx.blockTypes[block.blockTypeId].link({
                  prayerBlocks: blockId,
                }),
              ]
            : []),
        ]);

        totalBlocks++;

        // If this is a litany block, create 3 litany blocks for it
        if (block.blockTypeId === litanyBlockType?.id) {
          for (let i = 1; i <= 3; i++) {
            const litanyId = id();
            await db.transact([
              db.tx.litanyBlocks[litanyId].create({
                order: i,
                call: `Call ${i} for ${prayer.name}`,
                response: `Response ${i} for ${prayer.name}`,
                superscript: i === 1 ? "†" : "",
                inline: i === 3, // Make the third one inline
              }),
              db.tx.prayerBlocks[blockId].link({ litanyBlocks: litanyId }),
            ]);
            totalLitanyBlocks++;
          }
        }
      }
    }

    console.log(`   ✅ Created ${totalBlocks} prayer blocks`);
    console.log(`   ✅ Created ${totalLitanyBlocks} litany blocks`);

    console.log("✅ Database seeding completed successfully!");
    console.log(`
📊 Summary:
   • ${existingBlockTypes.blockTypes.length} block types (existing)
   • ${categories.length} categories (1 empty)
   • ${prayerResults.length} prayers (${
      /* eslint-disable-next-line  */
      prayerResults.filter((p: any) => !p.published).length
    } unpublished)
   • ${totalBlocks} prayer blocks
   • ${totalLitanyBlocks} litany blocks
    `);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Run the seeding function
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
