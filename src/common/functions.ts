import { nodeFetch } from './node-fetch';

export function isNode(): boolean {
  return (typeof window === 'undefined') &&
    !((typeof WorkerGlobalScope !== 'undefined') && (self instanceof WorkerGlobalScope))
}

export function getFetchFunction(): (url: string) => Promise<any> {
  return isNode() ? nodeFetch : fetch;
}
