-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "callsign" TEXT,
    "role" TEXT,
    "species" TEXT,
    "homeworld" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "registry" TEXT,
    "manufacturer" TEXT,
    "model" TEXT,
    "type" TEXT,
    "yearBuilt" INTEGER,
    "imageUrl" TEXT,
    "specs" TEXT,
    "history" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "where" TEXT,
    "dominantSpecies" TEXT,
    "primaryLanguage" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "overview" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeActive" TEXT,
    "alignment" TEXT,
    "leader" TEXT,
    "imageUrl" TEXT,
    "purpose" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originSpecies" TEXT,
    "status" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "era" TEXT,
    "imageUrl" TEXT,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "episode" INTEGER NOT NULL,
    "discovery" TEXT,
    "synopsis" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ShipCrew" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ShipCrew_A_fkey" FOREIGN KEY ("A") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ShipCrew_B_fkey" FOREIGN KEY ("B") REFERENCES "Ship" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FactionMembers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FactionMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FactionMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Faction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EpisodeCharacters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EpisodeCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EpisodeCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CharacterTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CharacterTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CharacterTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ShipTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ShipTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Ship" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ShipTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LocationTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LocationTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LocationTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FactionShips" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FactionShips_A_fkey" FOREIGN KEY ("A") REFERENCES "Faction" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FactionShips_B_fkey" FOREIGN KEY ("B") REFERENCES "Ship" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FactionTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FactionTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Faction" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FactionTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LoreTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LoreTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Lore" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LoreTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EpisodeTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EpisodeTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EpisodeTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TechnologyTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TechnologyTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TechnologyTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_slug_key" ON "Character"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ship_slug_key" ON "Ship"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Faction_slug_key" ON "Faction"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_slug_key" ON "Technology"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_slug_key" ON "Lore"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_slug_key" ON "Episode"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ShipCrew_AB_unique" ON "_ShipCrew"("A", "B");

-- CreateIndex
CREATE INDEX "_ShipCrew_B_index" ON "_ShipCrew"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FactionMembers_AB_unique" ON "_FactionMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_FactionMembers_B_index" ON "_FactionMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EpisodeCharacters_AB_unique" ON "_EpisodeCharacters"("A", "B");

-- CreateIndex
CREATE INDEX "_EpisodeCharacters_B_index" ON "_EpisodeCharacters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterTags_AB_unique" ON "_CharacterTags"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterTags_B_index" ON "_CharacterTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShipTags_AB_unique" ON "_ShipTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ShipTags_B_index" ON "_ShipTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationTags_AB_unique" ON "_LocationTags"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationTags_B_index" ON "_LocationTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FactionShips_AB_unique" ON "_FactionShips"("A", "B");

-- CreateIndex
CREATE INDEX "_FactionShips_B_index" ON "_FactionShips"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FactionTags_AB_unique" ON "_FactionTags"("A", "B");

-- CreateIndex
CREATE INDEX "_FactionTags_B_index" ON "_FactionTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LoreTags_AB_unique" ON "_LoreTags"("A", "B");

-- CreateIndex
CREATE INDEX "_LoreTags_B_index" ON "_LoreTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EpisodeTags_AB_unique" ON "_EpisodeTags"("A", "B");

-- CreateIndex
CREATE INDEX "_EpisodeTags_B_index" ON "_EpisodeTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TechnologyTags_AB_unique" ON "_TechnologyTags"("A", "B");

-- CreateIndex
CREATE INDEX "_TechnologyTags_B_index" ON "_TechnologyTags"("B");
