/**
 * use this file to rename fetch imported from node-fetch to nodeFetch
 * in order to separate from window.fetch
 */
import fetch from 'node-fetch';
export const nodeFetch = fetch;
