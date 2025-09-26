<template>
  <div>
    <h1>edit</h1>
    <div class="editor-wrapper" contenteditable="true" @input="inputChange" @keydown="keydown" ref="editor" >
      <div class="et-line" v-for="i in 10"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { h, onBeforeMount, ref, useTemplateRef } from 'vue';
const editor = useTemplateRef('editor')
function inputChange(e:Event){
  console.log('e:input ', e);
  // @ts-ignore
  if(e.inputType === 'deleteContentBackward'){
    const newLineCount = 10 - editor.value?.childElementCount!
    for(let i=0; i< newLineCount; i++){
      const newLine = document.createElement('div')
      newLine.className = 'et-line'
      editor.value?.appendChild(newLine)
    }
  }

  // const content = Array.from(editor.value?.children!).map(e=>e.textContent).join('\n')
  // // console.log('content: ', content);
  // const text = 'aaa'
  // const sel = window.getSelection()
  // console.log('sel: ', sel);
  // const range = sel?.getRangeAt(0)

  // // 保存光标起始位置
  // const startOffset = range!.startOffset;
  // const startContainer = range!.startContainer;


  // range?.deleteContents()
  // document.getElementById('sniper')?.remove()
  // const node = document.createElement('div');
  // node.id = 'sniper'
  // node.innerText = text
  // range!.insertNode(node);
  // console.log('range: ', range);
  

  // // 恢复光标到插入前的位置
  // const newRange = document.createRange();
  // newRange.setStart(startContainer, startOffset);
  // newRange.setEnd(startContainer, startOffset);


  // // range?.setStartAfter(node)
  // // range?.setEndAfter(node)

  // sel?.removeAllRanges()
  // sel?.addRange(newRange!)

}
function keydown(e:KeyboardEvent){
  console.log('e:keydown ', e);
  if(e.key.length === 1){
    const selection = window.getSelection();
    if (!selection) return;
     // 创建新的 Range，把光标移到 span 内
    const range = document.createRange();
  }

}

onBeforeMount(()=>{
  
})

</script>
<style>
.editor-wrapper .et-line {
  background-color: bisque;
  height: 24px;
  position: relative;
}
.et-line #sniper{
  position: absolute;
  z-index: 1;
}
</style>
<style scoped>
.editor-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid black;
  height: 700px;
  width: 600px;
  padding: 10px;
}
</style>