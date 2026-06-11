import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface Testimonial {
  category: string;
  comment: string;
  author: string;
}

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss'
})
export class ReferencesComponent {
  testimonials: Testimonial[] = [
    {
      category: 'REF_CAT_ARTISTS',
      comment: 'REF_COMMENT_ARTISTS',
      author: 'Alya Özer'
    },
    {
      category: 'REF_CAT_EDUCATION',
      comment: 'REF_COMMENT_EDUCATION',
      author: 'Mahmut Sani'
    },
    {
      category: 'REF_CAT_STUDIOS',
      comment: 'REF_COMMENT_STUDIOS',
      author: 'Burak Yurt'
    },
    {
      category: 'REF_CAT_EVENTS',
      comment: 'REF_COMMENT_EVENTS',
      author: 'Cemil Kaya'
    },
    {
      category: 'REF_CAT_ACOUSTIC',
      comment: 'REF_COMMENT_ACOUSTIC',
      author: 'Sinem Aydın'
    },
    {
      category: 'REF_CAT_MUSICLANS',
      comment: 'REF_COMMENT_MUSICLANS',
      author: 'Kemal Erdem'
    }
  ];
}
