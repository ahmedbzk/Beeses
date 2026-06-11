import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-technical-specs',
  standalone: true,
  imports: [LucideAngularModule, TranslateModule],
  templateUrl: './technical-specs.component.html',
  styleUrl: './technical-specs.component.scss'
})
export class TechnicalSpecsComponent {

}
