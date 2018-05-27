import { Observable, from } from 'rxjs';
import { nodeFetch } from './node-fetch';

const fetchFunc = getFetchFunction();

export function isNode(): boolean {
  return (typeof window === 'undefined') &&
    !((typeof WorkerGlobalScope !== 'undefined') && (self instanceof WorkerGlobalScope))
}

export function apiFetch<T>(url: string): Observable<T> {
  return from(fetchFunc(url).then(res => res.json()));
}

function getFetchFunction(): (url: string) => Promise<any> {
  return isNode() ? nodeFetch : fetch;
}
