import { createFsFromVolume, Volume } from "memfs";
const str = ""
const vol = Volume.fromJSON({
  "virtual.vue":str
})

export const fsVol = createFsFromVolume(vol)
