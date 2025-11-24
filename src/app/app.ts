import {Component, ChangeDetectionStrategy}  from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ThemeToggle} from './components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggle],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
