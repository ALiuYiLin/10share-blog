import type { ModelRef, ShallowRef } from "vue";

export function findLine(anchorNode: Node) {
  let node = anchorNode;
  let lineEl = null;
  while (node) {
    if (
      node.nodeType === 1 &&
      node.nodeName === "DIV" &&
      (node as HTMLElement).classList.contains("cm-line")
    ) {
      lineEl = node as HTMLDivElement;
      break;
    }
    node = node.parentNode as Node;
  }
  return lineEl;
}

export function lineCreate(str?: string) {
  const line = document.createElement("div");
  line.className = "cm-line";
  if (str) line.innerText = str;
  return line;
}

// 配置观察选项
export const observerOptions: MutationObserverInit = {
  childList: true, //监听子节点的增删
  characterData: true, // 监听文本内容变化
  subtree: true,
};

export function switchActive(
  line: HTMLDivElement,
  selectedLine: globalThis.Ref<
    HTMLDivElement | undefined,
    HTMLDivElement | undefined
  >
) {
  if (line === selectedLine.value) return;
  line.classList.add("active");
  selectedLine.value?.classList.remove("active");
  selectedLine.value = line;
}

export function editorObserverStart(
  editor: Readonly<ShallowRef<HTMLDivElement | null>>,
  content: ModelRef<string, string, string, string>,
  selectedLine: globalThis.Ref<
    HTMLDivElement | undefined,
    HTMLDivElement | undefined
  >
) {
  //添加监听器
  const observer = new MutationObserver((mutationsList) => {
    for (const mutaion of mutationsList) {
      handlerMutaion(mutaion, content, selectedLine, editor);
    }
  });
  observer.observe(editor.value!, observerOptions);
}

export function handlerMutaion(
  mutation: MutationRecord,
  content: ModelRef<string, string, string, string>,
  selectedLine: globalThis.Ref<
    HTMLDivElement | undefined,
    HTMLDivElement | undefined
  >,
  editor: Readonly<ShallowRef<HTMLDivElement | null>>
) {
  const selection = window.getSelection();
  if (mutation.type === "characterData") {
    // 文本内容变化
    content.value = Array.from(editor.value!.children)
      .map((e) => e.textContent)
      .join("\n");
  }
  if (mutation.type === "childList") {
    // 子节点增加或删除
    mutation.addedNodes.forEach((node) => {
      // 子节点增加处理
      if (node.nodeName === "DIV") {
        switchActive(node as HTMLDivElement, selectedLine);
      }
    });
    mutation.removedNodes.forEach((node) => {
      // 子节点删除处理
      if (!editor.value?.childElementCount) {
        // 当删除后 editor没有子节点创造一个晒给它
        const newLine = lineCreate();
        newLine.className = "cm-line active";
        editor.value?.appendChild(newLine);
      } else {
        if (
          node.nodeType === 1 &&
          node.nodeName === "DIV" &&
          selection?.anchorNode
        ) {
          const lineEl = findLine(selection!.anchorNode);
          switchActive(lineEl as HTMLDivElement, selectedLine);
        }
      }
    });
  }
}

export function lineClick(
  selectedLine: globalThis.Ref<
    HTMLDivElement | undefined,
    HTMLDivElement | undefined
  >
) {
  const selection = window.getSelection();
  if (selection?.anchorNode) {
    let lineEl = findLine(selection.anchorNode);
    if (lineEl) switchActive(lineEl, selectedLine);
  }
}
