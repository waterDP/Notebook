/*
 * @Author: water.li
 * @Date: 2023-02-26 23:12:04
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-reconciler\src\ReactFiberWorkLoop.js
 */
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
import {
  NoFlags,
  MutationMask,
  Placement,
  Update,
  ChildDeletion,
  Passive,
} from "./ReactFiberFlags";
import {
  commitMutationEffectsOnFiber, // 执行DOM操作
  commitPassiveUnmountEffects, // 执行destroy
  commitPassiveMountEffects, // 执行create
  commitLayoutEffects
} from "./ReactFiberCommitWork";
import {
  HostRoot,
  HostComponent,
  HostText,
  FunctionComponent,
} from "./ReactWorkTags";
import { finishQueueingConcurrentUpdates } from "./ReactFiberConcurrentUpdates";
import { scheduleCallback, NormalPriority as NormalSchedulerPriority, shouldYield } from "scheduler/index";

let workInProgress = null;
let workInProgressRoot = null;
let rootDoesHavePassiveEffect = false; // 此根节点上有没有useEffect类似的作用
let rootWithPendingPassiveEffects = null; // 具有useEffect副作用的根节点 FiberRootNode 根fiber.stateNode
/**
 * 计划更新root
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root) {
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  if (workInProgressRoot) return;
  workInProgressRoot = root;
  scheduleCallback(NormalSchedulerPriority, performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 根据vdom 构建fiber树
 * 创建真实的Dom节点
 * 把真实的dom节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root, timeout) {
  // 第一次渲染以同步的方式渲染根节点 初次渲染的时候 都是同步的
  renderRootSync(root);
  console.log("renderRootSync", root);
  // !开始进入提交阶段 执行副作用 修改真实DOM节点
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
  workInProgressRoot = null;
}

function flushPassiveEffect() {
  if (rootWithPendingPassiveEffects !== null) {
    const root = rootWithPendingPassiveEffects;
    // 执行卸载副作用 destroy
    commitPassiveUnmountEffects(root.current);
    // 执行挂载副作用 create
    commitPassiveMountEffects(root, root.current);
  }
}

function commitRoot(root) {
  // 获取新的构建好的fiber树的根fiber
  const { finishedWork } = root;
  if (
    (finishedWork.subtreeFlags & Passive) !== NoFlags ||
    (finishedWork.flag & Passive) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true;
      scheduleCallback(NormalSchedulerPriority, flushPassiveEffect);
    }
  }

  printFinishedWork(finishedWork);
  const subtreeHasEffects =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffects = (finishedWork.flags & MutationMask) !== NoFlags;

  // 如果自己有副作用或者子节点有副作用就进行提交操作
  if (subtreeHasEffects || rootHasEffects) {
    // 当DOM执行变更之后
    commitMutationEffectsOnFiber(finishedWork, root);
    // 执行layoutEffect
    commitLayoutEffects(finishedWork, root)
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false;
      rootWithPendingPassiveEffects = root;
    }
  }
  // 等DOM变更后，就可以把root的current指新的fiber树
  root.current = finishedWork;
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
  finishQueueingConcurrentUpdates();
}

function renderRootSync(root) {
  // !开始构建 fiber 树
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopConcurrent() {
  // 如果有下一个要构建的fiber，并且时间片没有过期
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行一个工作单元
 * @param {*} unitOfWork
 */
function performUnitOfWork(unitOfWork) {
  // 获取新的fiber对应的老的fiber
  const current = unitOfWork.alternate;
  // 完成当前fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // 如果没有子节点，说明当前fiber已经完成了
    completeUnitOfWork(unitOfWork);
  } else {
    // 如果有子节点就让子节点成为下一个工作单元
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let competedWork = unitOfWork;
  do {
    const current = competedWork.alternate;
    const returnFiber = competedWork.return;
    // 执行此fiber 的完成工作 如果是原生组件的话就是创建真实DOM节点
    completeWork(current, competedWork);
    const siblingFiber = competedWork.sibling;
    // 如果有弟弟 就构建弟弟对应的fiber链表
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    // 如果没有弟弟，说明当前完成的是父fiber的最后一个节点
    // 也就是说一个父fiber的所有的子fiber全部完成了
    competedWork = returnFiber;
    workInProgress = competedWork;
  } while (competedWork !== null);
}

function printFinishedWork(fiber) {
  const { flags, deletions } = fiber;
  if ((flags & ChildDeletion) !== NoFlags) {
    fiber.flags &= ~ChildDeletion;

    console.log(
      "子节点有删除" +
      deletions
        .map((fiber) => `${fiber.type}#${fiber.memoizedProps.id}`)
        .join(",")
    );
  }
  let child = fiber.child;
  while (child) {
    printFinishedWork(child);
    child = child.sibling;
  }

  if (fiber.flags !== NoFlags) {
    console.log(
      getFlags(fiber),
      getTag(fiber.tag),
      typeof fiber.type === "function" ? fiber.type.name : fiber.type,
      fiber.memoizedProps
    );
  }
}

function getFlags(fiber) {
  const { flags } = fiber;
  if (flags === (Placement | Update)) {
    return "移动";
  }
  if (flags === Placement) {
    return "插入";
  }
  if (flags === Update) {
    return "更新";
  }

  return flags;
}

function getTag(tag) {
  switch (tag) {
    case FunctionComponent:
      return "FunctionComponent";
    case HostRoot:
      return "HostRoot";
    case HostComponent:
      return "HostComponent";
    case HostText:
      return "HostText";
    default:
      return tag;
  }
}
