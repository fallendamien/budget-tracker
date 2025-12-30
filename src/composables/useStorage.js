import { STORAGE_TYPE } from '@/config';
import { useLocalStorage } from './useLocalStorage';
import { useFirebaseStorage } from './useFirebaseStorage';

export function useStorage() {
  if (STORAGE_TYPE === 'localStorage') {
    return useLocalStorage();
  }
  return useFirebaseStorage();
}
