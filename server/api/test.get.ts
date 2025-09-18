import { compile, fsVol } from "@@/instance";


export default defineEventHandler(async (event) => {
  const str = `\
  <template>
  <div>
    <h1>virtual.vue</h1>
    <test name="more"></test>
  </div>
</template>

<script lang="ts" setup>
import test from '@/components/test.vue';
</script>
<style scoped>
h1{
  color: red;
}
</style>
  `;
  // await fsVol.promises.writeFile('@virtual/virtual.vue',str,{encoding:'utf-8'})
  const input = ['virtual.vue']
  await fsVol.getInstance().promises.writeFile('virtual.vue',str,{encoding:'utf-8'})

  return await compile(input);
});
