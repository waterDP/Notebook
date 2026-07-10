"""
===========================================================================
Tree of Thoughts (ToT) — 思维树 实战 Demo
===========================================================================
场景：24点游戏 — 用给定的 4 个数字，通过 +-*/ 运算得到 24

对比演示：
  1. 普通 CoT（Chain of Thought）— 一条路走到黑
  2. ToT（Tree of Thoughts）— 分支探索 + 剪枝，找最优路径

核心思想：
  - CoT 是"一条直线推理"
  - ToT 是"多分支探索"，每一步产生多个想法 → 评估 → 剪枝 → 继续深入

参考论文：Tree of Thoughts: Deliberate Problem Solving with Large Language Models (Yao et al. 2023)
===========================================================================
"""

import itertools
import re
from typing import List, Tuple, Optional, Callable

# ============================================================
# 1. 24点游戏的经典解（用于验证）
# ============================================================

def solve_24_bruteforce(numbers: List[int]) -> Optional[str]:
    """暴力枚举所有可能的运算组合，找 24 的解"""
    ops = ['+', '-', '*', '/']
    
    for a, b, c, d in itertools.permutations(numbers):
        for o1, o2, o3 in itertools.product(ops, repeat=3):
            # 5 种括号结构
            expressions = [
                f"(({a} {o1} {b}) {o2} {c}) {o3} {d}",
                f"({a} {o1} ({b} {o2} {c})) {o3} {d}",
                f"({a} {o1} {b}) {o2} ({c} {o3} {d})",
                f"{a} {o1} (({b} {o2} {c}) {o3} {d})",
                f"{a} {o1} ({b} {o2} ({c} {o3} {d}))",
            ]
            for expr in expressions:
                try:
                    if abs(eval(expr) - 24) < 1e-9:
                        return expr
                except ZeroDivisionError:
                    continue
    return None


# ============================================================
# 2. ToT 核心实现：用 LLM 模拟器代替真实 LLM 调用
# ============================================================
# 注意：为了让 demo 无需 API Key 就能跑，这里用"模拟 LLM"
# 真实的 ToT 应该调用 DeepSeek / OpenAI 等 LLM
# ============================================================

class ThoughtNode:
    """树上的一个节点：代表一步推理"""
    def __init__(self, content: str, parent: Optional['ThoughtNode'] = None, depth: int = 0, value: float = 0.0):
        self.content = content       # 节点内容（当前推理结果）
        self.parent = parent         # 父节点
        self.depth = depth           # 深度
        self.value = value           # 评估值（0~1）
        self.children = []           # 子节点
    
    def add_child(self, child: 'ThoughtNode'):
        self.children.append(child)
    
    def get_path(self) -> List[str]:
        """回溯整条路径"""
        path = []
        node = self
        while node:
            path.append(node.content)
            node = node.parent
        return list(reversed(path))
    
    def __repr__(self):
        return f"ThoughtNode(depth={self.depth}, value={self.value:.2f}, content='{self.content}')"


class ToTSolver:
    """
    Tree of Thoughts 求解器
    
    核心步骤：
    1. 思维生成 (Thought Generation) — 当前状态产生 k 个候选想法
    2. 状态评估 (State Evaluation) — 评估每个想法的价值
    3. 搜索策略 (Search Strategy) — BFS / DFS 探索树
    4. 回溯 (Backtracking) — 找到最优路径
    """
    
    def __init__(self, 
                 thought_generator: Callable,   # 生成下一步想法
                 state_evaluator: Callable,      # 评估状态
                 max_depth: int = 5,
                 branches: int = 3,              # 每层保留的候选数
                 search_strategy: str = "bfs"):  # bfs / dfs
        self.thought_generator = thought_generator
        self.state_evaluator = state_evaluator
        self.max_depth = max_depth
        self.branches = branches
        self.search_strategy = search_strategy
        self.root = ThoughtNode("初始状态", depth=0)
    
    def solve(self, problem: str) -> List[str]:
        """运行 ToT 搜索"""
        print(f"\n{'='*60}")
        print(f"🧠 问题: {problem}")
        print(f"策略: {self.search_strategy.upper()} | 每层分支: {self.branches} | 最大深度: {self.max_depth}")
        print(f"{'='*60}")
        
        if self.search_strategy == "bfs":
            return self._bfs_search(problem)
        else:
            return self._dfs_search(problem)
    
    def _bfs_search(self, problem: str) -> List[str]:
        """BFS 搜索：广度优先，适合深度不大的问题"""
        current_level = [(self.root, problem)]
        
        for depth in range(self.max_depth):
            print(f"\n{'▸'*5} 第 {depth+1} 层探索 {'▸'*5}")
            next_level = []
            
            for node, state in current_level:
                # Step 1: 生成候选想法
                candidates = self.thought_generator(state, num_candidates=self.branches * 2)
                print(f"  ┃ 从状态「{state}」生成候选:")
                for i, c in enumerate(candidates, 1):
                    print(f"  ┃   {i}. {c}")
                
                # Step 2: 评估每个候选
                evaluated = []
                for cand in candidates:
                    if '无' in cand or '无效' in cand:
                        continue  # 跳过无效候选
                    # 新状态就是候选本身携带的数字集（生成器已包好）
                    new_state = self._extract_state(cand)
                    value = self.state_evaluator(new_state)
                    if value < -999:  # 无效状态也跳过
                        continue
                    evaluated.append((cand, new_state, value))
                    child = ThoughtNode(cand, parent=node, depth=depth+1, value=value)
                    node.add_child(child)
                
                # Step 3: 剪枝，只保留 top-k
                evaluated.sort(key=lambda x: x[2], reverse=True)
                top_k = evaluated[:self.branches]
                print(f"  ┃ ✅ 保留 Top-{self.branches}: {[(c[:30], f'{v:.2f}') for c, s, v in top_k]}")
                
                for cand, new_state, value in top_k:
                    child = ThoughtNode(cand, parent=node, depth=depth+1, value=value)
                    next_level.append((child, new_state))
            
            if not next_level:
                print("  ✂️ 无有效候选，提前终止")
                break
            
            current_level = next_level
            
            # 检查是否到达目标
            for node, state in current_level:
                if self._is_goal(state):
                    print(f"\n🎉 找到目标！路径: {node.get_path()}")
                    return node.get_path()
        
        # 无完美解，返回最优叶子
        best_node = self._find_best_leaf(self.root)
        print(f"\n⚠️  未找到完美解，返回当前最优路径 (value={best_node.value:.2f})")
        return best_node.get_path()
    
    def _extract_state(self, state_str: str) -> str:
        """从候选想法字符串中提取纯粹的状态描述"""
        # 候选想法格式："运算后数字集: [1, 5, 25]"
        if '数字集:' in state_str:
            return state_str.split('数字集:')[1].strip()
        return state_str
    
    def _dfs_search(self, problem: str) -> List[str]:
        """DFS 搜索：深度优先，适合深度较大但分支可控的问题"""
        best_path = None
        best_value = -1
        
        def _dfs(node: ThoughtNode, state: str, depth: int):
            nonlocal best_path, best_value
            
            if depth >= self.max_depth or self._is_goal(state):
                if self._is_goal(state):
                    print(f"\n🎉 找到目标！深度 {depth}")
                    return node.get_path()
                return None
            
            # 生成候选
            candidates = self.thought_generator(state, num_candidates=self.branches)
            
            for cand in candidates:
                if '无' in cand or '无效' in cand:
                    continue
                new_state = self._extract_state(cand)
                value = self.state_evaluator(new_state)
                if value < -999:
                    continue
                # 剪枝：价值太低的跳过
                if value < 0.2 and depth > 1:
                    continue
                
                child = ThoughtNode(cand, parent=node, depth=depth+1, value=value)
                node.add_child(child)
                
                result = _dfs(child, new_state, depth + 1)
                if result:
                    return result
                
                if value > best_value:
                    best_value = value
                    best_path = child.get_path()
            
            return None
        
        result = _dfs(self.root, problem, 0)
        if result:
            return result
        
        print(f"\n⚠️  未找到完美解，返回当前最优路径 (value={best_value:.2f})")
        return best_path or [problem]
    
    def _apply_thought(self, state: str, thought: str) -> str:
        """将想法应用到当前状态，产生新状态"""
        return f"{state} → [{thought}]"
    
    def _is_goal(self, state: str) -> bool:
        """检查是否达到目标状态：只剩一个数字且==24"""
        nums = _extract_numbers(state)
        return len(nums) == 1 and nums[0] == 24
    
    def _find_best_leaf(self, node: ThoughtNode) -> ThoughtNode:
        """找到 value 最高的叶子节点"""
        if not node.children:
            return node
        best = max((self._find_best_leaf(child) for child in node.children), 
                    key=lambda n: n.value)
        return best


# ============================================================
# 3. 24 点游戏的 ToT 具体实现
# ============================================================

def twenty_four_generator(state: str, num_candidates: int = 3) -> List[str]:
    """24点游戏的思维生成器：
    根据当前剩余的数字，生成可能的下一步运算"""
    
    # 从状态中提取剩余数字
    numbers = _extract_numbers(state)
    
    if len(numbers) < 2:
        return ["无更多可用数字"]
    
    # 生成所有可能的运算组合
    candidates = []
    ops = ['+', '-', '*', '/']
    
    for a, b in itertools.permutations(numbers, 2):
        remaining = [n for n in numbers if n != a or numbers.count(n) - numbers[:].count(n) == 0]
        # 修复：正确移除 a 和 b
        remaining = numbers.copy()
        remaining.remove(a)
        remaining.remove(b)
        
        for op in ops:
            try:
                result = _calc(a, b, op)
                if result is not None:
                    expr = f"计算 {a} {op} {b} = {result}"
                    # 新状态是：剩余数字 + 计算结果
                    new_set = remaining + [result]
                    candidates.append((expr, result, new_set))
            except:
                continue
    
    # 按结果接近24排序，取 top-k
    candidates.sort(key=lambda x: abs(x[1] - 24))
    return [f"{c[0]} | 剩余: {sorted(c[2])}" for c in candidates[:num_candidates]]


def twenty_four_evaluator(state: str) -> float:
    """24点游戏的状态评估器
    
    核心评估逻辑：
    - 只剩一个数字且==24 → 满分 1.0
    - 只剩一个数字但 !=24 → 按接近程度给分
    - 剩余多数字 → 数字越少越高分
    """
    
    numbers = _extract_numbers(state)
    if not numbers:
        return -1000  # 无效状态
    
    if len(numbers) == 1:
        result = numbers[0]
        if result == 24:
            return 1.0
        closeness = max(0, 1 - abs(result - 24) / 100)
        return closeness * 0.8
    
    # 数字少 = 进展大
    progress = 1.0 - (len(numbers) - 1) / 4
    # 任意数字接近24也是好趋势
    closeness_values = [max(0, 1 - abs(n - 24) / 100) for n in numbers]
    best_closeness = max(closeness_values) if closeness_values else 0
    
    return progress * 0.6 + best_closeness * 0.4


def _extract_numbers(state: str) -> List[int]:
    """从状态字符串中提取数字"""
    nums = re.findall(r'[-]?\d+\.?\d*', state)
    return [int(float(n)) for n in nums if n]


def _calc(a: int, b: int, op: str) -> Optional[float]:
    """计算 a op b"""
    if op == '+': return a + b
    if op == '-': return a - b
    if op == '*': return a * b
    if op == '/' and b != 0: return a / b
    return None


def twenty_four_generator_dedup(state: str, num_candidates: int = 3) -> List[str]:
    """思维生成器（去重版）：生成不重复的候选运算"""
    numbers = _extract_numbers(state)
    
    if len(numbers) < 2:
        return ["无更多可用数字"]
    
    candidates = []
    seen = set()
    ops = ['+', '-', '*', '/']
    
    for a, b in itertools.permutations(numbers, 2):
        remaining = numbers.copy()
        remaining.remove(a)
        remaining.remove(b)
        
        for op in ops:
            try:
                result = _calc(a, b, op)
                if result is None:
                    continue
                # 结果取整（如果是整数除法精确结果）
                result_val = int(result) if result == int(result) else round(result, 2)
                # 排序后作为去重 key
                new_set = tuple(sorted(remaining + [result_val]))
                if new_set not in seen:
                    seen.add(new_set)
                    candidates.append((new_set, abs(result_val - 24)))
            except:
                continue
    
    # 按接近24排序
    candidates.sort(key=lambda x: x[1])
    seen_output = set()
    result = []
    for new_set, _ in candidates:
        key = str(sorted(new_set))
        if key not in seen_output:
            seen_output.add(key)
            result.append(f"运算后数字集: {sorted(new_set)}")
        if len(result) >= num_candidates:
            break
    
    return result if result else ["无有效运算"]


# ============================================================
# 4. 对比实验：CoT vs ToT
# ============================================================

def demo_cot(numbers: List[int]):
    """
    Chain of Thought: 一条路走到黑
    不带评估，不带分支，不带回溯
    """
    print(f"\n{'#'*60}")
    print(f"📏 Chain of Thought — 线性推理")
    print(f"数字: {numbers}")
    print(f"{'#'*60}")
    
    remaining = sorted(numbers)
    path = [f"初始: {remaining}"]
    
    step = 0
    while len(remaining) > 1 and step < 5:
        step += 1
        candidates = twenty_four_generator_dedup(f"{remaining}", num_candidates=1)
        if candidates:
            # 提取新数字集
            nums = _extract_numbers(candidates[0])
            remaining = sorted(set(nums)) if nums else remaining
            path.append(f"  步骤{step}: {candidates[0]}")
    
    print("\n  CoT 推理路径:")
    for p in path:
        print(f"  {p}")
    
    if len(remaining) == 1 and remaining[0] == 24:
        print(f"\n  ✅ CoT 成功！")
    else:
        print(f"\n  ❌ CoT 失败：卡在 {remaining}")
        print(f"      (一条路走到黑，选错第一步就没法回头)")


def demo_tot(numbers: List[int], strategy: str = "bfs"):
    """
    Tree of Thoughts: 多分支 + 评估 + 剪枝
    """
    solver = ToTSolver(
        thought_generator=twenty_four_generator_dedup,
        state_evaluator=twenty_four_evaluator,
        max_depth=5,
        branches=3,
        search_strategy=strategy
    )
    
    initial_state = f"{sorted(numbers)}"
    path = solver.solve(initial_state)
    
    print(f"\n  ToT 推理路径:")
    for i, p in enumerate(path):
        if i == 0:
            print(f"  🌱 初始: {numbers}")
        else:
            print(f"  ├─→ {p}")
    
    return path


# ============================================================
# 5. 运行对比实验
# ============================================================

def run_comparison():
    """运行 CoT vs ToT 对比"""
    
    # 测试用例 (故意选几个有难度的)
    test_cases = [
        [1, 5, 5, 5],   # 经典题：(5-1/5)*5 = 24
        [3, 3, 8, 8],   # 经典题：8/(3-8/3) = 24
        [3, 7, 3, 7],   # (3+3/7)*7 = 24
        [6, 4, 3, 2],   # 6*4*(3-2) = 24 —— 其实简单，但用来对比
    ]
    
    for nums in test_cases:
        print(f"\n\n{'='*70}")
        print(f"🎯 题目: 用 {nums} 通过 +-*/ 运算得到 24")
        
        # 标准答案
        answer = solve_24_bruteforce(nums)
        print(f"📋 参考解: {answer if answer else '无解'}")
        
        print(f"\n{'─'*30} 方法一：CoT {'─'*30}")
        demo_cot(nums)
        
        print(f"\n{'─'*30} 方法二：ToT-BFS {'─'*30}")
        demo_tot(nums, strategy="bfs")
        
        print(f"\n{'─'*30} 方法三：ToT-DFS {'─'*30}")
        demo_tot(nums, strategy="dfs")
        
        print(f"\n{'─'*50}")
    
    print(f"\n\n{'='*70}")
    print("🏁 对比结论")
    print(f"{'='*70}")
    print("""
    CoT (Chain of Thought)      ToT (Tree of Thoughts)
    ──────────────────────      ──────────────────────
    一条直线推理                  多分支树状探索
    无回溯能力                    支持回溯
    遇到错误无法回头               评估+剪枝，自动筛选
    适合简单问题                   适合复杂推理
    计算量小                      计算量大但更可靠
    
    适用场景对比：
    ────────────
    CoT: 数学计算、简单问答、单步推理
    ToT: 规划问题、博弈、创意写作、复杂数学、代码 Debug
    """)


# ============================================================
# 6. Agent 实战：用 ToT 增强 Agent 的推理能力
# ============================================================

class ToTAgent:
    """
    将 ToT 嵌入 Agent 的 Reasoning Loop
    
    在 Agent 做决策时，不再只取第一个结果，而是：
    1. 生成多个候选 Action
    2. 评估每个 Action 的期望收益
    3. 选择 Top-k 继续探索
    4. 找最优路径执行
    """
    
    def __init__(self, llm_callable=None):
        self.llm = llm_callable or self._mock_llm
        self.memory = []
    
    def _mock_llm(self, prompt: str) -> str:
        """模拟 LLM 调用（真实场景换成 DeepSeek/OpenAI）"""
        # 这里模拟一个简单的推理回复
        if "数字" in prompt:
            return "我建议先尝试乘法，看能不能凑出接近24的数"
        return "继续推理..."
    
    def think_with_tot(self, problem: str, num_branches: int = 3) -> str:
        """
        使用 ToT 思维方式进行推理
        
        这就是你面试时可以说的：
        "我使用 Tree of Thoughts 方法，在每一步生成多个推理分支，
         通过评估机制自动剪枝，找到最优推理路径。"
        """
        print(f"\n  🤔 Agent 使用 ToT 进行推理...")
        
        # Step 1: 理解问题，生成初始想法
        thoughts = [
            f"思路 A: {self.llm(f'从正面角度分析：{problem}')}",
            f"思路 B: {self.llm(f'尝试逆向思考：{problem}')}",
            f"思路 C: {self.llm(f'分解子问题：{problem}')}",
        ]
        print(f"    生成 {len(thoughts)} 个初始思路")
        
        # Step 2: 评估每个思路
        print(f"    评估各个思路...")
        scored = [(t, 0.7 + i * 0.1) for i, t in enumerate(thoughts)]
        
        # Step 3: 选择最优路径深入
        best_thought = max(scored, key=lambda x: x[1])[0]
        print(f"    选择最优思路: {best_thought[:40]}...")
        
        # Step 4: 基于最优路径继续推理
        final = self.llm(f"基于思路 '{best_thought}' 给出最终答案")
        
        return f"[ToT推理结果] {final}"
    
    def solve(self, problem: str) -> str:
        """Agent 解决问题"""
        print(f"\n{'='*50}")
        print(f"🤖 Agent 收到任务: {problem}")
        print(f"{'='*50}")
        
        # 使用 ToT 增强推理
        result = self.think_with_tot(problem)
        
        self.memory.append((problem, result))
        return result


# ============================================================
# 7. 主入口
# ============================================================

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Tree of Thoughts Demo")
    parser.add_argument("--mode", choices=["compare", "agent", "all"], default="all",
                       help="运行模式：compare=对比实验, agent=Agent演示, all=全运行")
    
    args = parser.parse_args()
    
    print("""
    ╔══════════════════════════════════════════════════╗
    ║     🌳 Tree of Thoughts (ToT) 思维树实战        ║
    ║                                                   ║
    ║  论文: Yao et al. 2023                           ║
    ║  核心: 多分支推理 + 评估 + 剪枝 + 回溯           ║
    ╚══════════════════════════════════════════════════╝
    """)
    
    if args.mode in ("compare", "all"):
        run_comparison()
    
    if args.mode in ("agent", "all"):
        print(f"\n\n{'#'*70}")
        print(f"#   🤖 Agent + ToT 实战演示")
        print(f"{'#'*70}")
        
        agent = ToTAgent()
        result = agent.solve("""
        用户需要一份重庆三日游攻略：
        - 预算 3000 元
        - 想体验当地美食（火锅、小面）
        - 想去网红打卡点
        - 不想太累
        """)
        print(f"\n最终输出:\n{result}")