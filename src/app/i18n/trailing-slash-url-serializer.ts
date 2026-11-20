import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * Sunucu (Apache) sayfaları sonda "/" ile sunuyor: /products -> 301 -> /products/
 * Angular varsayılan olarak linkleri "/" olmadan üretiyordu; bu da site içindeki her linkte
 * bir 301 yönlendirmesine ve Search Console'da "Yönlendirmeli sayfa" kayıtlarına yol açıyordu.
 *
 * - serialize: routerLink href'lerine ve adres çubuğuna sondaki "/"yu ekler (/products/?category=...)
 * - parse: sondaki "/"yu atarak çözer; aksi halde Angular rotanın sonuna boş bir segment ekler.
 */
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    const [, path = '', rest = ''] = url.match(/^([^?#]*)(.*)$/) ?? [];
    const trimmed = path.length > 1 ? path.replace(/\/+$/, '') : path;
    return super.parse(trimmed + rest);
  }

  override serialize(tree: UrlTree): string {
    const url = super.serialize(tree);
    const [, path = '', rest = ''] = url.match(/^([^?#]*)(.*)$/) ?? [];
    return (path.endsWith('/') ? path : path + '/') + rest;
  }
}
