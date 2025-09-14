import { createFsFromVolume, Volume } from "memfs";
const str = `\
  <template>
  <div>
    <h1>test</h1>
    <SvgIcon name="more"></SvgIcon>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon.vue';
</script>
  `
const vol = Volume.fromJSON({
  "virtual.vue":str
})

export const fsVol = createFsFromVolume(vol)
