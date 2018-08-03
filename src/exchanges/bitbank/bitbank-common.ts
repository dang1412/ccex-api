export const publicUrl = 'https://public.bitbank.cc';
export const subscribeKey = 'sub-c-e12e9174-dd60-11e6-806b-02ee2ddab7fe';

export interface RawData<T> {
  success: 0 | 1;
  data: T;
}
