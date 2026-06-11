import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  socials: { icon: string; link: string }[];
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslateModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  team: TeamMember[] = [
    {
      name: 'Celal Altıner',
      role: 'TEAM_ROLE_FOUNDER',
      image: 'assets/team/celal_altıner.jpg',
      socials: [{ icon: 'instagram', link: '#' }, { icon: 'mail', link: '#' }]
    },
    {
      name: 'Yakup Altıner',
      role: 'TEAM_ROLE_DESIGN',
      image: 'assets/team/yakup_altıner.jpg',
      socials: [{ icon: 'instagram', link: '#' }, { icon: 'mail', link: '#' }]
    },
    {
      name: 'Süleyman Terzioğlu',
      role: 'TEAM_ROLE_ACOUSTIC',
      image: 'assets/team/suleyman_terzioglu.jpg',
      socials: [{ icon: 'instagram', link: '#' }, { icon: 'mail', link: '#' }]
    },
    {
      name: 'Rifat Yüksel',
      role: 'TEAM_ROLE_SALES',
      image: 'assets/team/rifat_yuksel.jpg',
      socials: [{ icon: 'instagram', link: '#' }, { icon: 'mail', link: '#' }]
    }
  ];
}
