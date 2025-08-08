import { storyblokInit, apiPlugin } from '@storyblok/js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../src/assets/data');
const routesFilePath = path.join(__dirname, '../routes.txt');

const languages = ['en', 'pl'];
const defaultLang = 'en';

const { storyblokApi } = storyblokInit({
  accessToken: 'S5UlY9WelUkYqhJrnGEQawtt',
  use: [apiPlugin],
});

async function fetchAllData() {
  console.log('Starting data fetch from Storyblok using @storyblok/js...');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const allRoutes = [];

  try {
    for (const lang of languages) {
      console.log(`\nFetching data for language: [${lang.toUpperCase()}]`);
      const { data } = await storyblokApi.get('cdn/stories', {
        version: 'published',
        starts_with: 'portfolio',
        per_page: 100,
        language: lang,
      });

      const stories = data.stories;
      const langDataPath = path.join(dataDir, `stories.${lang}.json`);
      fs.writeFileSync(langDataPath, JSON.stringify(stories, null, 2));
      console.log(`✅  Successfully saved ${stories.length} stories to ${langDataPath}`);
    }

    allRoutes.push('/');

    languages.filter(l => l !== defaultLang).forEach(lang => {
        allRoutes.push(`/${lang}`);
    });

    fs.writeFileSync(routesFilePath, allRoutes.join('\n'));
    console.log(`✅  Successfully generated routes file with routes: ${allRoutes.join(', ')}`);

  } catch (error) {
    console.error('❌ Error fetching data from Storyblok:', error);
    process.exit(1);
  }
}

fetchAllData();
