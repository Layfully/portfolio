import { storyblokInit, apiPlugin } from '@storyblok/js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../src/assets/data');
const routesFilePath = path.join(__dirname, '../routes.txt');

const { storyblokApi } = storyblokInit({
  accessToken: process.env.STORYBLOK_API_TOKEN,
  use: [apiPlugin],
});

async function fetchAllData() {
  console.log('Starting data fetch from Storyblok using @storyblok/js...');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  try {
    const { data } = await storyblokApi.get('cdn/stories', {
      version: 'published',
      starts_with: 'portfolio',
      per_page: 100,
    });

    const stories = data.stories;

    const allDataPath = path.join(dataDir, 'stories.json');
    fs.writeFileSync(allDataPath, JSON.stringify(stories, null, 2));
    console.log(`✅  Successfully saved ${stories.length} stories to ${allDataPath}`);

    const allRoutes = '/';

    fs.writeFileSync(routesFilePath, allRoutes);
    console.log(`✅  Successfully generated routes file with the single route: /`);

  } catch (error) {
    console.error('❌ Error fetching data from Storyblok:', error);
    process.exit(1);
  }
}

fetchAllData();
