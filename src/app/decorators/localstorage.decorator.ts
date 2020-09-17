import * as storage from '../_helpers/localstorage'

export function LocalStorage(group?: string) {
  return function (target: Object, key: string | symbol) {

    var id = group + '_' + key.toString();

    var isFirstSet = true;

    const getter = () => {
      return storage.get(id);
    };
    const setter = (newVal) => {
      if (isFirstSet) {
        const existingVal = storage.get(id);
        if (!existingVal) {
          storage.set(id, newVal);
        }
        isFirstSet = false;
      }
      else if(newVal === null || newVal === undefined )
      {
        storage.remove(id);
        isFirstSet = true;
      }
      else {
        storage.set(id, newVal);
      }  

    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
};
