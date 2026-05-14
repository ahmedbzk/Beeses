import { Injectable } from '@angular/core';

export interface Distributor {
  id: string;
  name: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class DistributorService {

  private distributors: Distributor[] = [
    {
      id: '1',
      name: 'Beeses Audio Turkey',
      country: 'Türkiye',
      address: 'Oruçreis Mahallesi Giyimkent 16. Sokak Giyimkent Sitesi B170 Blok no: 112/A Esenler / İSTANBUL',
      phone: '+90 (212) 000 00 00',
      email: 'info@iotek.com.tr',
      image: 'assets/logo.png'
    },
    {
      id: '2',
      name: 'Global Audio Taiwan',
      country: 'Tayvan',
      address: 'No. 123, Section 3, Xinyi Rd, Da’an District, Taipei City, Taiwan 106',
      phone: '+886 2 1234 5678',
      email: 'taiwan@beeses.audio',
      image: 'assets/logo.png'
    },
    {
      id: '3',
      name: 'Premium Sound USA',
      country: 'Amerika',
      address: '1234 Audio Way, Los Angeles, CA 90001, USA',
      phone: '+1 213 555 0199',
      email: 'usa@beeses.audio',
      image: 'assets/logo.png'
    },
    {
      id: '4',
      name: 'High End Audio Germany',
      country: 'Almanya',
      address: 'Berliner Str. 45, 10117 Berlin, Germany',
      phone: '+49 30 123456',
      email: 'germany@beeses.audio',
      image: 'assets/logo.png'
    },
    {
      id: '5',
      name: 'Iran Audio Solutions',
      country: 'İran',
      address: 'Valiasr Ave, Tehran, Iran',
      phone: '+98 21 8888 8888',
      email: 'iran@beeses.audio',
      image: 'assets/logo.png'
    }
  ];

  constructor() { }

  getDistributors(): Distributor[] {
    return this.distributors;
  }

  getCountries(): string[] {
    const countries = new Set(this.distributors.map(d => d.country));
    return Array.from(countries);
  }
}
