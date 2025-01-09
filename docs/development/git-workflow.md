# Git 工作流程指南

本文档描述了 CodeWave 项目的 Git 工作流程规范。

## 分支策略

### 分支命名
- 主分支：`main`
- 功能分支：`feat/<功能描述>`
- 修复分支：`fix/<问题描述>`
- 文档分支：`docs/<文档描述>`
- 重构分支：`refactor/<重构描述>`
- 性能优化：`perf/<优化描述>`
- 代码风格：`style/<描述>`

### 分支保护
- main 分支受保护，不允许直接推送
- 所有更改必须通过 Pull Request 进行
- 需要至少一个审查者批准才能合并
- CI 检查必须通过才能合并

## 开发流程

### 1. 开始新功能
```bash
# 确保在正确的目录
pwd

# 更新主分支
git checkout main
git pull

# 创建功能分支
git checkout -b feat/your-feature-name
```

### 2. 开发过程
```bash
# 查看文件状态
git status

# 运行测试
cd backend
poetry run pytest tests/ -v

# 运行代码质量检查
poetry run black . --check  # 检查代码格式
poetry run isort . --check  # 检查导入排序
poetry run ruff check .     # 检查代码质量

# 如果有问题，自动修复
poetry run black .     # 格式化代码
poetry run isort .     # 修复导入排序
poetry run ruff . --fix  # 修复可自动修复的问题

# 添加更改
git add <文件名>     # 添加特定文件
git add .          # 添加所有更改

# 提交更改
git commit -m "type: commit message"
```

### 3. 提交规范
提交信息格式：`<type>: <description>`

类型（type）：
- feat: 新功能
- fix: 修复问题
- docs: 文档更改
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动
- perf: 性能优化

示例：
```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
style: format code with black and isort
```

### 4. 创建 Pull Request
1. 推送分支到远程
```bash
git push -u origin feat/your-feature-name
```

2. 在 GitHub 上创建 Pull Request
   - 添加清晰的标题
   - 提供详细的描述
   - 选择合适的审查者
   - 关联相关的 Issue（如果有）
   - 确保 CI 检查通过

PR 描述模板：
```markdown
## What's Changed
- 具体更改内容
- 实现的功能或修复的问题

## Technical Details
- 技术实现细节
- 架构改动说明

## Testing
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] API 测试通过
- [ ] 代码质量检查通过
  - [ ] black 格式化检查
  - [ ] isort 导入排序检查
  - [ ] ruff 代码质量检查
```

### 5. 代码审查
- 等待审查者反馈
- 根据反馈进行修改
- 确保所有 CI 检查通过
- 获得批准后合并

### 6. 完成功能
1. PR 合并后，切换回主分支
```bash
git checkout main
git pull
```

2. 删除本地功能分支（可选）
```bash
git branch -d feat/your-feature-name
```

## 最佳实践

### 提交建议
1. 保持提交粒度适中，每个提交专注于一个改动
2. 提供清晰的提交信息
3. 在提交前运行测试和代码质量检查
4. 代码格式问题应该在单独的 commit 中修复

### 分支管理
1. 定期同步主分支的更新
2. 及时删除已合并的功能分支
3. 避免长期维护的功能分支
4. 代码格式调整使用 `style/` 分支

### 代码质量检查
1. 在提交前运行所有检查
2. 优先使用自动修复功能
3. 对于无法自动修复的问题：
   - 仔细阅读错误信息
   - 参考文档进行手动修复
   - 必要时与团队讨论

### 冲突处理
1. 经常与主分支同步，减少冲突
2. 出现冲突时，与相关开发者讨论解决方案
3. 解决冲突后，重新运行测试和代码质量检查

### 依赖管理
1. 添加新依赖时：
```bash
# 添加生产依赖
poetry add package-name

# 添加开发依赖
poetry add -D package-name

# 更新 lock 文件
poetry lock

# 安装所有依赖
poetry install
```

2. 修改 `pyproject.toml` 后：
```bash
# 更新 lock 文件
poetry lock

# 验证依赖安装
poetry install

# 确保虚拟环境在项目目录下
poetry config virtualenvs.in-project true
```

3. 提交依赖更改：
   - 同时提交 `pyproject.toml` 和 `poetry.lock`
   - 使用 `build:` 作为提交类型
   - 在提交信息中说明依赖变更原因

示例：
```bash
git add pyproject.toml poetry.lock
git commit -m "build: add flake8 for code quality checks"
```

## 常见问题

### Q: 如何处理紧急修复？
A: 创建 `fix/` 分支，修复后优先处理该 PR。

### Q: 提交信息写错了怎么办？
A: 使用 `git commit --amend` 修改最后一次提交信息。

### Q: 如何撤销已推送的提交？
A: 谨慎使用 `git revert`，避免使用 `git reset` 强制推送。

### Q: 代码质量检查失败怎么办？
A: 按以下步骤处理：
1. 运行 `black` 和 `isort` 自动修复格式问题
2. 使用 `ruff --fix` 修复可自动修复的问题
3. 对于其他问题，查看错误信息并手动修复 

### Q: Poetry 依赖问题怎么处理？
A: 按以下步骤处理：
1. 确保 poetry 配置正确：
   ```bash
   poetry config virtualenvs.in-project true
   ```
2. 更新 lock 文件：
   ```bash
   poetry lock
   ```
3. 重新安装依赖：
   ```bash
   poetry install
   ```
4. 如果还有问题，尝试清理并重新安装：
   ```bash
   rm -rf .venv
   poetry install
   ``` 