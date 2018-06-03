import { Observable, from } from 'rxjs';
import fetch from '../lib/isomorphic-fetch';

export function isNode(): boolean {
  return (typeof window === 'undefined') &&
    !((typeof WorkerGlobalScope !== 'undefined') && (self instanceof WorkerGlobalScope))
}

export function fetchRxjs<T>(url: string, options?: {}): Observable<T> {
  // patch the error in browser running webpack built js: change the context of fetch to not window object
  const fetchFunc = fetch;
  return from(fetchFunc(url, options).then(res => res.json()));
}
