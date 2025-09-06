<script lang="ts" setup>
const props = defineProps({
  content: {
    type: String,
    default: "nihao \n hello",
  },
});
const myEditor = useTemplateRef('my-editor')
const selectedLine = ref<HTMLDivElement>()
function handlerMutaion(mutation: MutationRecord) {
  const selection = window.getSelection()
  if(mutation.type === 'characterData'){
    // 文本内容变化 
    const mycontent = Array.from(myEditor.value!.children).map(e=>e.textContent).join('\n')
    console.log('mycontent: ', mycontent);
  }
  if(mutation.type === 'childList'){
    // 子节点增加或删除

    mutation.addedNodes.forEach((node)=>{
      // 子节点增加处理
      if(node.nodeName === 'DIV'){
        switchActive(node as HTMLDivElement)
      }
    })
    mutation.removedNodes.forEach((node)=>{
      // 子节点删除处理
      if(!myEditor.value?.childElementCount){
        // 当删除后 editor没有子节点创造一个晒给它
        const newLine = lineCreate()
        newLine.className = 'cm-line active'
        myEditor.value?.appendChild(newLine)
      }
      else{
        if(node.nodeName === 'DIV'){
          switchActive(selection?.anchorNode as HTMLDivElement)
        }
      }
    })
  }
}
function lineCreate(str?:string){
  const line = document.createElement('div')
  line.className = 'cm-line'
  if(str) line.innerText = str
  return line
}
function switchActive(line:HTMLDivElement){
  if(line === selectedLine.value) return
  line.classList.add('active')
  selectedLine.value?.classList.remove('active')
  selectedLine.value = line
}

onMounted(()=>{
  //初始化
  const lines = props.content.split('\n')
  lines.forEach((line)=>{
    const lineDiv = lineCreate(line)
    myEditor.value?.appendChild(lineDiv)
  })

  //添加监听器
  const observer = new MutationObserver((mutationsList)=>{
    for(const mutaion of mutationsList){
      handlerMutaion(mutaion)
    }
  })

  // 配置观察选项
  const options:MutationObserverInit = {
    childList: true, //监听子节点的增删
    characterData: true, // 监听文本内容变化
    subtree: true
  }
  observer.observe(myEditor.value!,options)

})

function editClick(){
  const selection = window.getSelection()
  let flag = false
  let node = selection?.anchorNode
  while(!flag){
    if(node?.nodeType === 1 && node.nodeName === 'DIV' && (node as HTMLDivElement).classList.contains('cm-line')){
      switchActive(node as HTMLDivElement)
      flag = true
      break
    }
    else{
      node = node?.parentNode
      if(!node) {
        flag = true
        break
      }
    }
  }
}

</script>
<template>
  <div id="editor" class="md-editor-wrapper" contenteditable="true"ref="my-editor"  @click="editClick">
    <div v-for="i in 1"  class="cm-line"></div>
  </div>
</template>

<style>
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
