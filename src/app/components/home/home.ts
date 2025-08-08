import { Component, OnInit } from '@angular/core';
import { StoryblokService } from '../../services/storyblok.service';
import { SeoService } from '../../services/seo.service';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { About } from '../about/about';
import { Hero } from '../hero/hero';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Experience } from '../experience/experience';
import { Contact } from '../contact/contact';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { LanguageSwitcher } from "../language-switcher/language-switcher";

@Component({
  selector: 'app-home',
  imports: [
    Hero,
    About,
    Header,
    Footer,
    Experience,
    Contact,
    Skills,
    Projects,
    AsyncPipe,
    LanguageSwitcher
],
  templateUrl: './home.html'
})
export class Home implements OnInit {

  blokMap$: Observable<Record<string, any>> = of({});

  constructor(private storyblokService: StoryblokService, private seoService: SeoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.blokMap$ = this.route.data.pipe(
      map(data => data['lang'] as string || 'en'),
      switchMap(lang => this.storyblokService.getStory('portfolio', lang).pipe(
        map(story => {
          const contentBody = story?.['content']?.body;
          if (!contentBody) {
            return {};
          }
          const seoDataBlock = contentBody.find((blok: any) => blok.component === 'seo_data');
          if (seoDataBlock) {
            this.seoService.updateMetaTags(seoDataBlock, lang);
          }

          const blokMap: Record<string, any> = {};
          for (const blok of contentBody) {
            blokMap[blok.component] = blok;
          }
          return blokMap;
        })
      ))
    );
  }
}
