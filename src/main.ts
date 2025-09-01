import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { addIcons } from 'ionicons';
import { home, filterOutline } from 'ionicons/icons';
import { AppModule } from './app/app.module';

addIcons({ home, filterOutline });

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
