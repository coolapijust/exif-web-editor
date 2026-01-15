# EXIF Web Editor

一个功能强大的网页端 EXIF 元数据编辑器，支持查看、编辑和导出图片的 EXIF 信息。

## 功能特性

- **EXIF 数据读取**：支持读取图片的完整 EXIF 元数据
- **标签编辑**：可编辑的标签支持修改值，不可编辑的标签隐藏编辑按钮
- **中文支持**：EXIF 标签名称支持中英文切换
- **数据持久化**：使用 IndexedDB 自动保存文件和数据，刷新页面不丢失
- **手动下载**：修改后手动下载处理后的图片
- **实时预览**：支持图片预览和拖拽上传
- **批量处理**：支持同时管理多张图片

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **状态管理**：Pinia
- **样式方案**：Tailwind CSS
- **EXIF 处理**：@uswriting/exiftool (WebAssembly)
- **构建工具**：Vite

## 项目结构

```
exif-editor/
├── public/                 # 静态资源
│   └── zeroperl.wasm      # ExifTool WebAssembly 模块
├── src/
│   ├── assets/            # 图片资源
│   ├── components/        # Vue 组件
│   │   ├── app/          # 应用框架组件
│   │   ├── common/       # 公共组件
│   │   ├── editor/       # 编辑器组件
│   │   ├── file/         # 文件管理组件
│   │   └── info/         # 信息展示组件
│   ├── composables/       # Vue 组合式函数
│   ├── core/             # 核心功能模块
│   │   ├── executor/    # ExifTool 执行器
│   │   ├── parser/      # 数据解析器
│   │   └── validator/   # 数据验证器
│   ├── data/             # 静态数据
│   ├── event-bus/        # 事件总线
│   ├── i18n/             # 国际化
│   ├── infrastructure/   # 基础设施
│   │   └── file-db.ts   # IndexedDB 存储
│   ├── services/         # 业务服务
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

## 使用说明

1. **添加图片**：点击上传区域或拖拽图片到上传区域
2. **查看 EXIF**：点击图片列表中的文件，右侧显示 EXIF 信息
3. **编辑标签**：点击可编辑标签旁的编辑按钮进行修改
4. **下载图片**：点击"下载修改后图片"按钮保存修改后的文件

## 注意事项

- WebAssembly 模块需要从本地加载，确保 `public/zeroperl.wasm` 文件存在
- 部分 EXIF 标签为只读，无法修改
- 浏览器需要支持 WebAssembly 和 IndexedDB

## 许可证

MIT
