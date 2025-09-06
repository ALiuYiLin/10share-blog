<script lang="ts" setup>
const content = defineModel({
  type: String,
  default: ''
})

const myEditor = useTemplateRef('my-editor')
const selectedLine = ref<HTMLDivElement>()
function handlerMutaion(mutation: MutationRecord) {
  const selection = window.getSelection()
  if(mutation.type === 'characterData'){
    // 文本内容变化 
    content.value = Array.from(myEditor.value!.children).map(e=>e.textContent).join('\n')
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
        if(node.nodeType === 1 && node.nodeName === 'DIV' && selection?.anchorNode  ){
          const lineEl = findLine(selection!.anchorNode)
          switchActive(lineEl as HTMLDivElement)
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

function findLine(anchorNode:Node){
  let node = anchorNode
  let lineEl = null
  while(node){
    if(node.nodeType ===1 && node.nodeName === 'DIV' && (node as HTMLElement).classList.contains('cm-line')){
      lineEl = node as HTMLDivElement
      break
    }
    node = node.parentNode as Node
  }
  return lineEl
}

onMounted(()=>{
  //初始化
  const lines = content.value.split('\n')
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
  if(selection?.anchorNode) {
    let lineEl = findLine(selection.anchorNode)
    if(lineEl) switchActive(lineEl)
  }
}

defineExpose(['content'])

</script>
<template>
  <div id="editor" class="md-editor-wrapper" contenteditable="true"ref="my-editor" autocorrect="off" autocapitalize="off"  translate="no" spellcheck="false"  @click="editClick">
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
  border-bottom: 0;
  
}

.cm-line.active {
  background-color: beige;
}

</style>
