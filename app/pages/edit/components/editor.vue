<script lang="ts" setup>
import { editorObserverStart, lineCreate, lineClick } from "./utils";

const content = defineModel({
  type: String,
  default: "",
});

const editor = useTemplateRef("10-editor");
const selectedLine = ref<HTMLDivElement>();


const init = () => {
  content.value
    .split("\n")
    .forEach((line) => editor.value?.appendChild(lineCreate(line)));
  editorObserverStart(editor, content, selectedLine);
};

onMounted(() => {
  //初始化
  init();
});

function editorClick() {
  lineClick(selectedLine);
}

</script>
<template>
  <div
    id="10-editor"
    class="md-editor-wrapper"
    contenteditable="true"
    ref="10-editor"
    autocorrect="off"
    autocapitalize="off"
    translate="no"
    spellcheck="false"
    @click="editorClick"
  ></div>
</template>

<style>
.md-editor-wrapper {
  width: 800px;
  min-height: 600px;
  padding: 10px;
  margin-left: 20px;

  border: 1px black solid;
}

.cm-line {
  height: 20.8px;
  border-bottom: 0;
}

.cm-line.active {
  background-color: beige;
}
</style>
