import {Component}  from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ThemeToggle} from './components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggle],
  templateUrl: './app.html'
})
export class App {}
