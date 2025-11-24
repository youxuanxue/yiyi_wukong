# yiyi_wukong
AI早学早香（饽饽）

## 项目说明

这是一个展示研究论文的全栈 Web 应用项目，包含前端展示界面和后端 API 服务。前端实现了论文列表、标签筛选、论文详情展示等功能，后端提供 RESTful API 和 SQLite 数据库支持。

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS

### 后端
- Node.js (Express)
- TypeScript
- SQLite

## 安装和运行

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. 安装 Node.js：
   - 访问 https://nodejs.org/ 下载 LTS 版本
   - 或使用包管理器安装

2. 安装依赖：
```bash
npm install
```

3. 初始化数据库（首次运行）：
```bash
# 填充 5 条样例数据
npx ts-node --project tsconfig.server.json server/seed.ts
```

4. 启动后端服务（在一个终端）：
```bash
npm run server
```
后端服务将运行在 `http://localhost:3001`。

5. 启动前端开发服务器（在另一个终端）：
```bash
npm run dev
```
前端将运行在 `http://localhost:5173`。

6. 构建生产版本：
```bash
npm run build
```

7. 预览生产版本：
```bash
npm run preview
```

## 项目结构

```
yiyi_wukong/
├── src/                          # 前端源代码
│   ├── components/               # React 组件
│   │   ├── __tests__/           # 测试文件
│   │   │   ├── PaperPage.test.tsx
│   │   │   └── Simple.test.tsx
│   │   └── PaperPage.tsx        # 主页面组件
│   ├── types/                    # TypeScript 类型定义
│   │   └── shared.ts            # 共享类型（前后端共用）
│   ├── App.tsx                   # 应用入口组件
│   ├── main.tsx                  # 应用启动文件
│   └── index.css                 # 全局样式
├── server/                       # 后端源代码
│   ├── db.ts                     # 数据库连接和初始化
│   ├── index.ts                  # Express 服务器入口
│   └── seed.ts                   # 数据库种子数据脚本
├── index.html                    # HTML 入口文件
├── package.json                  # 项目配置和依赖
├── tsconfig.json                 # TypeScript 配置（前端）
├── tsconfig.server.json          # TypeScript 配置（后端）
├── vite.config.ts                # Vite 配置
├── tailwind.config.js            # Tailwind CSS 配置
├── postcss.config.js             # PostCSS 配置
└── database.sqlite               # SQLite 数据库文件（自动生成）
```

## 功能特性

### 前端功能
- ✅ 论文列表展示，支持按标签筛选
- ✅ 论文详情页面，包含多个内容区域
- ✅ 标签系统，支持多标签分类
- ✅ 响应式设计，现代化 UI
- ✅ 顶部导航栏和底部操作栏
- ✅ 自动滚动定位到当前阅读章节

### 后端功能
- ✅ RESTful API 接口
- ✅ SQLite 数据库存储
- ✅ 支持论文的 CRUD 操作
- ✅ 支持章节的更新和删除

## 后端与数据库

### 数据库结构

项目使用 SQLite 数据库 (`database.sqlite`)，包含以下表：

**papers 表**：
- `id` (TEXT, PRIMARY KEY): 论文唯一标识
- `title` (TEXT): 论文标题
- `authors` (TEXT): 作者列表（JSON 格式）
- `tags` (TEXT): 标签列表（JSON 格式）
- `date` (TEXT): 发布日期
- `paperLink` (TEXT): 论文原文链接
- `sections` (TEXT): 章节内容（JSON 格式）

### API 接口

#### 论文列表
- `GET /api/papers` - 获取所有论文列表
  - 查询参数：`tag` (可选) - 按标签筛选
  - 返回：论文元数据列表（不包含章节内容）

- `GET /api/paper/:id` - 根据 ID 获取单篇论文详情
  - 返回：完整的论文数据（包含所有章节）

- `GET /api/paper` - 获取最新的一篇论文（向后兼容）
  - 返回：最新论文的完整数据

#### 论文管理
- `POST /api/paper` - 创建新论文
  - 请求体：`PaperData` 对象
  - 返回：创建成功消息和论文 ID

#### 章节管理
- `PUT /api/paper/section/:id` - 更新指定章节内容
  - 请求体：`{ content: string[] }`
  - 返回：更新后的章节对象

- `DELETE /api/paper/section/:id` - 删除指定章节
  - 返回：删除成功消息

### 数据模型

```typescript
interface PaperMetadata {
  title: string;
  authors: string[];
  tags: string[];
  date: string;
  paperLink: string;
}

interface PaperSection {
  id: string;
  title: string;
  type: 'text' | 'gallery';
  content: string[];
}

interface PaperData {
  meta: PaperMetadata;
  sections: PaperSection[];
}
```

## 开发

### 开发模式

1. 启动后端服务：
```bash
npm run server
```

2. 启动前端开发服务器：
```bash
npm run dev
```

3. 访问 `http://localhost:5173` 查看应用

### 数据库操作

#### 填充测试数据
```bash
npx ts-node --project tsconfig.server.json server/seed.ts
```

这将填充 5 条样例论文数据到数据库。

#### 查看数据库
可以使用 SQLite 命令行工具或 GUI 工具（如 DB Browser for SQLite）查看 `database.sqlite` 文件。

## 测试

### 单元测试

项目使用 Vitest 进行单元测试。

```bash
npm test
```

### 手动验证

1. 启动后端：`npm run server`
2. 启动前端：`npm run dev`
3. 访问 `http://localhost:5173`，你应该能看到从数据库加载的论文数据
4. 使用 `curl` 验证 API：
   ```bash
   # 获取所有论文
   curl http://localhost:3001/api/papers
   
   # 获取最新论文
   curl http://localhost:3001/api/paper
   
   # 按标签筛选
   curl "http://localhost:3001/api/papers?tag=CV"
   ```

## 许可证

详见 [LICENSE](LICENSE) 文件。
