import { Observable, from } from 'rxjs';
import fetch from '../lib/isomorphic-fetch';

export function isNode(): boolean {
  return (typeof window === 'undefined') &&
    !((typeof WorkerGlobalScope !== 'undefined') && (self instanceof WorkerGlobalScope))
}

export function rxjsFetch<T>(url: string): Observable<T> {
  return from(fetch(url).then(res => res.json()));
}
