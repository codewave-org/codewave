# CodeWave 开发规范

## 文档结构

### 通用规范 (general/)
- [通用编码规范](general/coding-standards.md)
- Git 相关规范
  * [Git 工作流](general/git/git-workflow.md)
  * [版本控制](general/git/version-control.md)

### 前端规范 (frontend/)
- [TypeScript & React 规范](frontend/typescript-react-guidelines.md)

### 后端规范 (backend/)
- [Python 开发规范](backend/python-guidelines.md)

## 规范更新规则

1. 更新通用规范时：
   - 确保与项目整体目标一致
   - 更新相关工具配置
   - 同步更新示例代码

2. 更新前端规范时：
   - 确保与最新的技术栈兼容
   - 更新 ESLint 和 Prettier 配置
   - 更新组件开发示例

3. 更新后端规范时：
   - 确保与 Python 最佳实践一致
   - 更新 pylint 和 black 配置
   - 更新 API 开发示例

## 规范执行

1. 自动化检查
   - 使用 ESLint 和 Prettier
   - 使用 pylint 和 black
   - 使用 Git hooks

2. 代码审查
   - 遵循审查清单
   - 使用自动化工具
   - 保持反馈记录

3. 持续改进
   - 收集开发者反馈
   - 定期评审和更新
   - 保持规范的实用性 