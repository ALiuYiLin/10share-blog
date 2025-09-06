<script lang="ts" setup>
const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});
const myeditor = useTemplateRef('myeditor')

// 处理文本变化
function handleTextChange(mutation: MutationRecord) {
  if (mutation.type === 'characterData') {
    const mycontent = Array.from(myeditor.value!.children).map(el=>el.textContent.trim()).join('\n')
    console.log(mycontent);
  }
  if (mutation.type === "childList") {
    // 处理子节点增删（如用户输入导致文本节点拆分）
    mutation.addedNodes.forEach((node) => {
      if(node.nodeName === 'DIV') {
        changeSelectedLine(node as HTMLElement)
      }
    });
    mutation.removedNodes.forEach((node) =>{
      if(node.nodeName === 'DIV') {
        if(!myeditor.value?.childElementCount){
          const line = document.createElement('div')
          line.className = 'cm-line'
          myeditor.value!.appendChild(line) 
        }
        const s= window.getSelection()
        console.log('s: ', s);
      }
    })
  }
}

onMounted(() => {
  const editor = document.getElementById("editor");
  // 创建 Mutation Observer 实例
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      handleTextChange(mutation);
    }
  });

  // 配置观察选项（监听文本变化和子节点变化）
  const options = {
    childList: true, // 观察直接子节点增删
    subtree: true, // 观察所有后代节点
    characterData: true, // 观察文本内容变化
    characterDataOldValue: true, // 记录旧值
  };

  // 启动监听
  observer.observe(editor!, options);
});
const selectedLine = ref<HTMLElement | null>(null)


function keydown(e:KeyboardEvent){
  // console.log('e.target: ', e.target);
}

function changeSelectedLine(newEl:HTMLElement){
  if(newEl == selectedLine.value) return
  newEl.classList.add('active')
  newEl.classList.add('cm-line')
  selectedLine.value?.classList.remove('active')
  selectedLine.value = newEl
}
    
function click(e:MouseEvent){
  const target = e.target as HTMLElement
  if(target.classList.contains('cm-line')){
    changeSelectedLine(target)
  }
  else{
    // console.log('target: ', target);
  }
}

</script>
<template>
  <div id="editor" class="md-editor-wrapper" 
  role="textbox"
  aria-multiline="true"
  contenteditable="true"
  ref="myeditor"
  @keypress="keydown"
  @click="click"
  >
    <div v-for="i in 1"  class="cm-line"></div>
  </div>
</template>

<style  scoped>
.md-editor-wrapper {
  width: 800px;
  min-height: 600px;
  padding: 10px;

  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  border: 1px black solid;

}
.cm-line{
  height: 20.8px;
}
.cm-line.active {
  background-color: beige;
}
</style>
