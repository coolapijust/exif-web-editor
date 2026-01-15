# EXIF 编辑器 - 设计文档

## 1. 项目概述

### 1.1 项目目标
开发一个纯前端的图片 EXIF 信息查看和编辑器，支持主流图片格式的元数据读写。

### 1.2 核心功能
- 图片文件选择与预览
- EXIF 信息读取与展示
- EXIF 信息查看与编辑在同一页面
- 单个 EXIF 标签可独立删除
- 一键清除全部 EXIF 信息
- 多格式支持（ JPEG、PNG、WebP、HEIC、TIFF、RAW 等）

### 1.3 技术约束
- 纯前端实现，无需后端服务
- 模块化设计，单文件代码行数不超过 150 行
- 使用 WebAssembly 技术处理 EXIF

---

## 2. 系统架构

### 2.1 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                      UI Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │
│  │ FileUpload  │ │ InfoPanel   │ │ ClearButton     │   │
│  │             │ │ (查看+编辑)  │ │ (一键清除)      │   │
│  └─────────────┘ └─────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────────────┐     │
│  │ ExifApp   │ │ Store     │ │ EventBus          │     │
│  └───────────┘ └───────────┘ └───────────────────┘     │
├─────────────────────────────────────────────────────────┤
│                   Service Layer                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────────────┐     │
│  │ Reader    │ │ Writer    │ │ ClearService      │     │
│  │ Service   │ │ Service   │ │ (清除服务)        │     │
│  └───────────┘ └───────────┘ └───────────────────┘     │
├─────────────────────────────────────────────────────────┤
│                   Core Layer                            │
│  ┌───────────┐ ┌───────────┐ ┌───────────────────┐     │
│  │ Executor  │ │ Parser    │ │ Validator         │     │
│  │ WASM      │ │           │ │                   │     │
│  └───────────┘ └───────────┘ └───────────────────┘     │
├─────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────────────┐     │
│  │ File      │ │ Error     │ │ Logger            │     │
│  │ Adapter   │ │ Handler   │ │                   │     │
│  └───────────┘ └───────────┘ └───────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 2.2 模块依赖关系

```
file-adapter.ts ──► executor ──► parser ──► validator
        │              │            │
        ▼              ▼            ▼
    eventbus      writer      reader service
        │              │            │
        └──────────────┼────────────┘
                       ▼
                    store
                       │
                       ▼
                 ui components
```

---

## 3. 目录结构

```
src/
├── main.ts                    # 应用入口
├── app.vue                    # 根组件
├── root.ts                    # 应用配置导出
│
├── assets/                    # 静态资源
│   └── styles/                # 全局样式
│       ├── main.css
│       └── variables.css
│
├── core/                      # 核心层 - WebAssembly 和基础能力
│   ├── executor/              # WASM 执行器封装
│   │   ├── index.ts
│   │   ├── loader.ts          # WASM 文件加载
│   │   ├── initializer.ts     # WASM 初始化
│   │   └── caller.ts          # 调用封装
│   ├── parser/                # 数据解析器
│   │   ├── index.ts
│   │   ├── raw-parser.ts      # 原始数据解析
│   │   └── tag-parser.ts      # 标签解析
│   └── validator/             # 数据验证器
│       ├── index.ts
│       ├── tag-validator.ts   # 标签验证
│       └── type-validator.ts  # 类型验证
│
├── services/                  # 服务层 - 业务逻辑封装
│   ├── reader/                # 读取服务
│   │   ├── index.ts
│   │   ├── image-reader.ts    # 图片读取
│   │   └── batch-reader.ts    # 批量读取
│   ├── writer/                # 写入服务
│   │   ├── index.ts
│   │   ├── image-writer.ts    # 图片写入
│   │   └── batch-writer.ts    # 批量写入
│   └── format-detector.ts     # 格式检测服务
│
├── infrastructure/            # 基础设施层 - 工具和适配器
│   ├── file/                  # 文件处理
│   │   ├── index.ts
│   │   ├── adapter.ts         # File API 适配
│   │   ├── reader.ts          # 文件读取
│   │   └── writer.ts          # 文件写入
│   ├── error/                 # 错误处理
│   │   ├── index.ts
│   │   ├── types.ts           # 错误类型定义
│   │   └── handler.ts         # 错误处理器
│   └── logger.ts              # 日志服务
│
├── components/                # UI 组件层
│   ├── app/                   # 应用级组件
│   │   ├── exif-app.vue       # 主应用组件
│   │   ├── app-header.vue     # 应用头部
│   │   └── app-footer.vue     # 应用底部
│   ├── file/                  # 文件相关组件
│   │   ├── file-upload.vue    # 文件上传
│   │   ├── file-list.vue      # 文件列表
│   │   └── file-item.vue      # 文件项
│   ├── info/                  # 信息展示组件
│   │   ├── info-panel.vue     # 信息面板
│   │   ├── tag-group.vue      # 标签分组
│   │   └── tag-item.vue    # 标签项（支持内联编辑和删除）
│   ├── editor/             # 编辑相关组件
│   │   ├── clear-button.vue # 一键清除按钮
│   │   └── inline-editor.vue # 内联编辑器
│   └── common/             # 通用组件
│       ├── image-preview.vue  # 图片预览
│       ├── loading-spinner.vue # 加载动画
│       └── empty-state.vue    # 空状态
│
├── stores/                    # 状态管理
│   ├── index.ts
│   ├── file-store.ts          # 文件状态
│   ├── exif-store.ts          # EXIF 数据状态
│   └── ui-store.ts            # UI 状态
│
├── types/                     # 类型定义
│   ├── index.ts
│   ├── exif-types.ts          # EXIF 类型定义
│   ├── file-types.ts          # 文件类型定义
│   └── ui-types.ts            # UI 类型定义
│
├── utils/                     # 工具函数
│   ├── index.ts
│   ├── date-formatter.ts      # 日期格式化
│   ├── string-helper.ts       # 字符串处理
│   └── constants.ts           # 常量定义
│
├── composables/               # 组合式函数
│   ├── index.ts
│   ├── use-exif.ts            # EXIF 操作组合式
│   ├── use-file.ts            # 文件操作组合式
│   └── use-ui.ts              # UI 操作组合式
│
├── event-bus/                 # 事件总线
│   ├── index.ts
│   ├── types.ts
│   └── emitter.ts
│
└── vite-env.d.ts              # Vite 类型声明
```

---

## 4. 核心模块设计

### 4.1 Core Layer - 核心层

#### 4.1.1 executor/ 执行器模块
负责 WebAssembly 的加载和调用封装。

**loader.ts** - WASM 文件加载
```typescript
// 职责：加载 WASM 二进制文件
// 导出：loadWasm() 返回 ArrayBuffer
```

**initializer.ts** - WASM 初始化
```typescript
// 职责：初始化 ExifTool 实例
// 导出：initialize() 返回初始化状态
```

**caller.ts** - 调用封装
```typescript
// 职责：封装 WASM 调用方法
// 导出：callRead(), callWrite() 等
```

**index.ts** - 模块导出
```typescript
// 职责：统一导出执行器模块
```

#### 4.1.2 parser/ 解析器模块
负责将 WASM 返回的原始数据解析为结构化对象。

**raw-parser.ts** - 原始数据解析
```typescript
// 职责：解析 WASM 返回的字符串/Buffer
// 导出：parseRawData() 返回解析结果
```

**tag-parser.ts** - 标签解析
```typescript
// 职责：解析单个 EXIF 标签
// 导出：parseTag() 返回标签对象
```

**index.ts** - 模块导出
```typescript
// 职责：统一导出解析器模块
```

#### 4.1.3 validator/ 验证器模块
负责数据校验和类型检查。

**tag-validator.ts** - 标签验证
```typescript
// 职责：验证 EXIF 标签值
// 导出：validateTag() 返回验证结果
```

**type-validator.ts** - 类型验证
```typescript
// 职责：验证数据类型
// 导出：validateType() 返回验证结果
```

**index.ts** - 模块导出
```typescript
// 职责：统一导出验证器模块
```

### 4.2 Service Layer - 服务层

#### 4.2.1 reader/ 读取服务
封装 EXIF 读取业务逻辑。

**image-reader.ts** - 单图片读取
```typescript
// 职责：读取单张图片的 EXIF
// 导出：readImage() 返回 EXIF 数据
```

**batch-reader.ts** - 批量读取
```typescript
// 职责：批量读取多个文件
// 导出：batchRead() 返回结果数组
```

**index.ts** - 服务导出
```typescript
// 职责：统一导出读取服务
```

#### 4.2.2 writer/ 写入服务
封装 EXIF 写入业务逻辑。

**image-writer.ts** - 单图片写入
```typescript
// 职责：写入 EXIF 到图片
// 导出：writeImage() 返回修改后的 Blob
```

**batch-writer.ts** - 批量写入
```typescript
// 职责：批量写入多个文件
// 导出：batchWrite() 返回结果数组
```

**index.ts** - 服务导出
```typescript
// 职责：统一导出写入服务
```

#### 4.2.3 format-detector.ts - 格式检测
```typescript
// 职责：检测文件格式和 MIME 类型
// 导出：detectFormat() 返回格式信息
```

#### 4.2.4 clear-service.ts - 清除服务
封装 EXIF 清除业务逻辑，支持一键清除全部和单独清除单个标签。

**clear-all.ts** - 一键清除全部 EXIF
```typescript
// 职责：清除图片的全部 EXIF 信息
// 导出：clearAll() 返回清除后的 Blob
```

**clear-tag.ts** - 单独清除单个标签
```typescript
// 职责：清除指定的单个 EXIF 标签
// 导出：clearTag() 返回修改后的 Blob
```

**index.ts** - 服务导出
```typescript
// 职责：统一导出清除服务
```

### 4.3 Infrastructure Layer - 基础设施层

#### 4.3.1 file/ 文件处理
**adapter.ts** - File API 适配
```typescript
// 职责：适配不同来源的 File 对象
// 导出：adaptFile() 返回标准化文件
```

**reader.ts** - 文件内容读取
```typescript
// 职责：读取文件内容为 ArrayBuffer
// 导出：readAsArrayBuffer() 返回 ArrayBuffer
```

**writer.ts** - 文件内容写入
```typescript
// 职责：将数据写回为 Blob
// 导出：writeAsBlob() 返回 Blob
```

**index.ts** - 模块导出
```typescript
// 职责：统一导出文件处理模块
```

#### 4.3.2 error/ 错误处理
**types.ts** - 错误类型定义
```typescript
// 职责：定义所有错误类型
// 导出：ErrorCode, ExifError 等类型
```

**handler.ts** - 错误处理器
```typescript
// 职责：统一处理和转换错误
// 导出：handleError() 返回错误响应
```

**index.ts** - 模块导出
```typescript
// 职责：统一导出错误处理模块
```

### 4.4 状态管理设计

#### 4.4.1 file-store.ts - 文件状态
```typescript
interface FileState {
  files: FileItem[];
  selectedId: string | null;
  loading: boolean;
}
```

#### 4.4.2 exif-store.ts - EXIF 数据状态
```typescript
interface ExifState {
  data: Record<string, ExifData>;
  editing: EditingState | null;
  history: HistoryEntry[];
}
```

#### 4.4.3 ui-store.ts - UI 状态
```typescript
interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  dialogOpen: boolean;
  notification: Notification | null;
}
```

---

## 5. 组件设计

### 5.1 组件层级结构

```
App (exif-app.vue)
├── AppHeader
├── MainContent
│   ├── FileUpload
│   ├── FileList
│   │   └── FileItem (循环)
│   └── InfoPanel (查看+编辑同一页面)
│       ├── ClearButton (一键清除)
│       ├── TagGroup (循环)
│       │   └── TagItem (循环，可编辑+删除)
│       └── EmptyState
└── AppFooter
```

### 5.2 组件通信方式

- **Props**: 父向子单向数据流
- **Events**: 子向父事件通知
- **Provide/Inject**: 跨层级数据共享
- **Store**: 全局状态管理
- **EventBus**: 跨组件事件通信

---

## 6. 数据流设计

### 6.1 读取流程

```
用户选择文件
    │
    ▼
FileUpload  ──► FileAdapter ──► FileStore
    │              │
    │              ▼
    │         FormatDetector
    │              │
    └──────────────┴─────────────┐
                                 ▼
                          Executor (WASM)
                                 │
                                 ▼
                           RawParser
                                 │
                                 ▼
                           TagParser
                                 │
                                 ▼
                           Validator
                                 │
                                 ▼
                           ExifStore ──► InfoPanel
```

### 6.2 写入流程

```
用户编辑标签
    │
    ▼
EditorForm ──► TagValidator ──► EditStore
    │              │
    │              ▼
    │         FormatDetector
    │              │
    └──────────────┴─────────────┐
                                 ▼
                          Executor (WASM)
                                 │
                                 ▼
                           ResultParser
                                 │
                                 ▼
                           FileWriter ──► Download
```

---

## 7. 异常处理策略

### 7.1 错误分类
- **ERR_WASM_INIT**: WASM 初始化失败
- **ERR_FILE_READ**: 文件读取失败
- **ERR_PARSE**: 数据解析失败
- **ERR_VALIDATE**: 数据验证失败
- **ERR_WRITE**: 写入失败
- **ERR_FORMAT_UNSUPPORTED**: 格式不支持

### 7.2 处理机制
- 全局错误边界捕获
- 错误码分类处理
- 用户友好错误提示
- 错误日志记录

---

## 8. 性能优化策略

### 8.1 WASM 优化
- 懒加载 WASM（首次使用时加载）
- 预加载策略（空闲时预加载）
- 单例模式（全局复用实例）

### 8.2 渲染优化
- 大列表虚拟滚动
- 组件按需加载
- 防抖/节流操作

### 8.3 内存优化
- 大文件流式处理
- 及时释放 ArrayBuffer
- 避免内存泄漏

---

## 9. 安全考虑

### 9.1 输入验证
- 文件类型白名单
- 文件大小限制
- EXIF 标签值校验

### 9.2 隐私保护
- 本地处理，不上传服务器
- 敏感信息处理确认
- 清除敏感数据功能

---

## 10. 扩展性设计

### 10.1 插件机制
- EXIF 标签插件扩展
- 格式支持插件扩展
- UI 主题插件扩展

### 10.2 配置化
- 标签分组配置
- 编辑权限配置
- UI 行为配置

---

## 11. 开发规范

### 11.1 代码规范
- 单文件不超过 150 行
- 函数单一职责
- 明确的类型定义
- 完整的注释文档

### 11.2 提交规范
- feat: 新功能
- fix: 修复 bug
- refactor: 重构
- docs: 文档更新
- chore: 构建/工具

### 11.3 分支规范
- main: 主分支
- develop: 开发分支
- feature/*: 功能分支
- hotfix/*: 紧急修复
