import { Observable, from } from 'rxjs';
import fetch from 'node-fetch';

// note: this stream is hot (fetch function run without subscribe)
export function fetchRxjs<T>(url: string, options?: {}): Observable<T> {
  // patch the error in browser running webpack built js: change the context of fetch to not window object
  const fetchFunc = fetch;

  return from(fetchFunc(url, options).then((res) => res.json()));
}
