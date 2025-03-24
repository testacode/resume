import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateImages() {
  try {
    // Generate 2x avatar
    await sharp(join(__dirname, "../public/images/avatar.png"))
      .resize(240, 240)
      .toFile(join(__dirname, "../public/images/avatar@2x.png"));

    console.log("Successfully generated 2x avatar image");
  } catch (error) {
    console.error("Error generating images:", error);
  }
}

generateImages();
