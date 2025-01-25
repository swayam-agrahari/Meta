-- DropForeignKey
ALTER TABLE "mapElements" DROP CONSTRAINT "mapElements_mapId_fkey";

-- DropForeignKey
ALTER TABLE "spaceElements" DROP CONSTRAINT "spaceElements_spaceId_fkey";

-- AddForeignKey
ALTER TABLE "spaceElements" ADD CONSTRAINT "spaceElements_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mapElements" ADD CONSTRAINT "mapElements_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;
