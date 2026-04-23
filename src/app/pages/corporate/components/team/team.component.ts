import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  socials: { icon: string; link: string }[];
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  team: TeamMember[] = [
    {
      name: 'Celal Altıner',
      role: 'Kurucu & Baş Mühendis',
      image: 'assets/team/celal_altıner.jpg',
      socials: [{ icon: 'instagram', link: '#' }, { icon: 'mail', link: '#' }]
    },
    {
      name: 'Yakup Altıner',
      role: 'Ar-Ge ve Tasarım Direktörü',
      image: 'assets/team/yakup_altıner.jpg',
      socials: [{ icon: 'instagram', link: '#' }, { icon: 'mail', link: '#' }]
    },
    {
      name: 'Süleyman Terzioğlu',
      role: 'Akustik Uzmanı & Üretim Sorumlusu',
      image: 'assets/team/suleyman_terzioglu.jpg',
      socials: [{ icon: 'instagram', link: '#' }, { icon: 'mail', link: '#' }]
    },
    {
      name: 'Rifat Yüksel',
      role: 'Operasyon ve Satış Yöneticisi',
      image: 'assets/team/rifat_yuksel.jpg',
      socials: [{ icon: 'instagram', link: '#' }, { icon: 'mail', link: '#' }]
    }
  ];
}
