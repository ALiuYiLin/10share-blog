import { createFsFromVolume, IFs, Volume } from "memfs";

const vol = Volume.fromJSON({
    "virtual.vue": "",
  });


export const fsVol = (function(){
  let instance: IFs;
  return {
    getInstance: function(){
      if(!instance) {
        instance = createFsFromVolume(vol)
        console.log("new instance");
      }
      return instance
    }
  }
})();
