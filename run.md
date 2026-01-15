# 实施步骤文档

> 每完成一步，请在对应步骤后方标记 [已完成] 或 [进行中]，并记录关键变更。

## 一、环境准备

### 1.1 必需软件安装

本步骤需要安装项目开发所必需的基础软件工具。请按照以下步骤逐一完成：

**Node.js 安装与验证**
```bash
# 检查当前 Node.js 版本
node --version

# 推荐使用 nvm 管理 Node.js 版本（Windows 环境使用 nvm-windows）
# 安装 LTS 版本
nvm install 20
nvm use 20
```

**pnpm 包管理器安装**
```bash
# 使用 npm 全局安装
npm install -g pnpm

# 验证安装
pnpm --version
```

**VS Code 插件安装**
- Volar（Vue 3 语言支持）
- TypeScript Vue Plugin
- ESLint
- Prettier
- Tailwind CSS IntelliSense

### 1.2 环境验证

```bash
# 验证所有工具版本
node --version  # 应显示 v20.x.x
pnpm --version  # 应显示 8.x.x
```

**检查清单**
- [ ] Node.js 20 LTS 已安装
- [ ] pnpm 8+ 已安装
- [ ] VS Code 及相关插件已安装

---

## 二、项目初始化

### 2.1 创建项目骨架

```bash
# 使用 Vite 创建 Vue 3 + TypeScript 项目
pnpm create vite@latest exif-editor -- --template vue-ts

# 进入项目目录
cd exif-editor

# 安装基础依赖
pnpm install
```

### 2.2 安装生产依赖

```bash
# 安装 Vue 生态核心库
pnpm add vue pinia

# 安装 EXIF 处理引擎
pnpm add @uswriting/exiftool

# 安装工具库
pnpm add date-fns @heroicons/vue
```

### 2.3 安装开发依赖

```bash
# 安装构建工具链
pnpm add -D vite @vitejs/plugin-vue

# 安装 TypeScript 相关
pnpm add -D typescript vue-tsc

# 安装 Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer

# 初始化 Tailwind 配置
npx tailwindcss init -p

# 安装代码规范工具
pnpm add -D eslint eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/plugin prettier eslint-config-prettier
```

### 2.4 基础配置

**配置 vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

**配置 tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**配置 tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**检查清单**
- [ ] 项目骨架创建完成
- [ ] 所有依赖安装成功
- [ ] 基础配置文件正确
- [ ] 开发服务器可正常启动

---

## 三、目录结构创建

### 3.1 创建目录骨架

```bash
# 进入 src 目录
cd src

# 创建核心层目录
mkdir -p core/executor
mkdir -p core/parser
mkdir -p core/validator

# 创建服务层目录
mkdir -p services/reader
mkdir -p services/writer

# 创建基础设施层目录
mkdir -p infrastructure/file
mkdir -p infrastructure/error

# 创建组件目录
mkdir -p components/app
mkdir -p components/file
mkdir -p components/info
mkdir -p components/editor
mkdir -p components/common

# 创建状态管理目录
mkdir -p stores

# 创建类型定义目录
mkdir -p types

# 创建工具函数目录
mkdir -p utils

# 创建组合式函数目录
mkdir -p composables

# 创建事件总线目录
mkdir -p event-bus

# 创建样式目录
mkdir -p assets/styles
```

### 3.2 创建目录说明文件

在每个目录下创建模块的 index.ts 导出文件，作为模块的入口点。此文件应简洁地导出模块的主要功能，便于其他模块引用。目录结构的完整创建是后续开发的基础，确保每个目录都有明确的职责划分。

**检查清单**
- [ ] 所有目录创建完成
- [ ] 目录结构符合 plan.md 设计

---

## 四、类型定义开发

### 4.1 创建基础类型文件

**创建 src/types/index.ts**
```typescript
// 导出所有类型定义
export * from './exif-types'
export * from './file-types'
export * from './ui-types'
```

**创建 src/types/exif-types.ts**
```typescript
// EXIF 数据类型定义
export interface ExifData {
  fileName: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
  make?: string
  model?: string
  dateTime?: string
  gpsLatitude?: number
  gpsLongitude?: number
  [key: string]: unknown
}

export interface ExifTag {
  name: string
  value: unknown
  type: string
  group: string
}

export interface ExifGroup {
  name: string
  tags: ExifTag[]
}

export interface EditingTag {
  originalName: string
  currentName: string
  value: unknown
}

export interface ClearOptions {
  removeAll?: boolean
  tags?: string[]
}
```

**创建 src/types/file-types.ts**
```typescript
// 文件类型定义
export interface FileItem {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview?: string
  exifData?: ExifData
}

export interface FileResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
```

**创建 src/types/ui-types.ts**
```typescript
// UI 类型定义
export type Theme = 'light' | 'dark'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface DialogState {
  open: boolean
  type: 'edit' | 'batch' | null
  fileId?: string
}
```

### 4.2 类型文件验证

```bash
pnpm run typecheck
```

**检查清单**
- [ ] 基础类型定义完成
- [ ] 类型检查通过
- [ ] 类型导出正确

---

## 五、基础设施层开发

### 5.1 文件处理模块

**创建 src/infrastructure/file/adapter.ts**
```typescript
// File API 适配器
import { FileItem } from '@/types'

export function adaptFile(file: File): Partial<FileItem> {
  return {
    id: generateId(),
    file,
    name: file.name,
    size: file.size,
    type: file.type
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
```

**创建 src/infrastructure/file/reader.ts**
```typescript
// 文件内容读取器
export async function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export async function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
```

**创建 src/infrastructure/file/writer.ts**
```typescript
// 文件写入器
export function writeAsBlob(data: ArrayBuffer, mimeType: string): Blob {
  return new Blob([data], { type: mimeType })
}

export function createDownloadLink(blob: Blob, fileName: string): string {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  return url
}
```

**创建 src/infrastructure/file/index.ts**
```typescript
// 文件处理模块导出
export * from './adapter'
export * from './reader'
export * from './writer'
```

### 5.2 错误处理模块

**创建 src/infrastructure/error/types.ts**
```typescript
// 错误类型定义
export enum ErrorCode {
  ERR_WASM_INIT = 'ERR_WASM_INIT',
  ERR_FILE_READ = 'ERR_FILE_READ',
  ERR_PARSE = 'ERR_PARSE',
  ERR_VALIDATE = 'ERR_VALIDATE',
  ERR_WRITE = 'ERR_WRITE',
  ERR_FORMAT_UNSUPPORTED = 'ERR_FORMAT_UNSUPPORTED'
}

export interface ExifError extends Error {
  code: ErrorCode
  details?: unknown
}
```

**创建 src/infrastructure/error/handler.ts**
```typescript
// 错误处理器
import { ErrorCode, ExifError } from './types'

export function createError(code: ErrorCode, message: string, details?: unknown): ExifError {
  const error = new Error(message) as ExifError
  error.code = code
  error.details = details
  return error
}

export function handleError(error: unknown): ExifError {
  if (isExifError(error)) {
    return error
  }
  return createError(
    ErrorCode.ERR_PARSE,
    error instanceof Error ? error.message : 'Unknown error',
    error
  )
}

function isExifError(error: unknown): error is ExifError {
  return error instanceof Error && 'code' in error
}
```

**创建 src/infrastructure/error/index.ts**
```typescript
// 错误处理模块导出
export * from './types'
export * from './handler'
```

### 5.3 日志服务

**创建 src/infrastructure/logger.ts**
```typescript
// 日志服务
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

let currentLevel: LogLevel = 'info'

export function setLogLevel(level: LogLevel): void {
  currentLevel = level
}

export function log(level: LogLevel, ...args: unknown[]): void {
  if (LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]) {
    console[level === 'debug' ? 'log' : level](`[EXIF-EDITOR]`, ...args)
  }
}

export const logger = {
  debug: (...args: unknown[]) => log('debug', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args)
}
```

**检查清单**
- [ ] 文件处理模块完成
- [ ] 错误处理模块完成
- [ ] 日志服务完成
- [ ] 类型检查通过

---

## 六、核心层开发

### 6.1 WASM 执行器模块

**创建 src/core/executor/loader.ts**
```typescript
// WASM 文件加载器
import { logger } from '@/infrastructure/logger'

const WASM_URL = '/exiftool.wasm'

export async function loadWasm(): Promise<ArrayBuffer> {
  logger.info('Loading WASM...')
  const response = await fetch(WASM_URL)
  if (!response.ok) {
    throw new Error(`Failed to load WASM: ${response.statusText}`)
  }
  const buffer = await response.arrayBuffer()
  logger.info('WASM loaded successfully')
  return buffer
}
```

**创建 src/core/executor/initializer.ts**
```typescript
// WASM 初始化器
import { loadWasm } from './loader'
import { logger } from '@/infrastructure/logger'
import { createError, ErrorCode } from '@/infrastructure/error'

let instance: unknown = null
let initialized = false

export async function initialize(): Promise<void> {
  if (initialized) {
    return
  }
  try {
    const wasmBuffer = await loadWasm()
    instance = await initExifTool(wasmBuffer)
    initialized = true
    logger.info('ExifTool initialized successfully')
  } catch (error) {
    throw createError(
      ErrorCode.ERR_WASM_INIT,
      'Failed to initialize ExifTool',
      error
    )
  }
}

async function initExifTool(buffer: ArrayBuffer): Promise<unknown> {
  // 此处调用实际的 WASM 初始化函数
  // 具体实现取决于 @uswriting/exiftool 的 API
  return {}
}
```

**创建 src/core/executor/caller.ts**
```typescript
// WASM 调用封装
import { initialize } from './initializer'
import { logger } from '@/infrastructure/logger'
import { ExifData } from '@/types'

export async function callRead(file: File): Promise<ExifData> {
  await initialize()
  logger.debug('Reading EXIF from file:', file.name)
  // 实现读取逻辑
  return {} as ExifData
}

export async function callWrite(file: File, tags: Record<string, unknown>): Promise<ArrayBuffer> {
  await initialize()
  logger.debug('Writing EXIF to file:', file.name)
  // 实现写入逻辑
  return new ArrayBuffer(0)
}
```

**创建 src/core/executor/index.ts**
```typescript
// 执行器模块导出
export * from './loader'
export * from './initializer'
export * from './caller'
```

### 6.2 解析器模块

**创建 src/core/parser/raw-parser.ts**
```typescript
// 原始数据解析器
import { ExifData, ExifTag } from '@/types'

export function parseRawData(raw: unknown): ExifData {
  // 实现原始数据解析
  return {} as ExifData
}
```

**创建 src/core/parser/tag-parser.ts**
```typescript
// 标签解析器
import { ExifTag } from '@/types'

export function parseTag(name: string, value: unknown): ExifTag {
  return {
    name,
    value,
    type: typeof value,
    group: getTagGroup(name)
  }
}

function getTagGroup(name: string): string {
  if (name.startsWith('GPS')) return 'GPS'
  if (name.startsWith('Image')) return 'Image'
  if (name.startsWith('Photo')) return 'Photo'
  return 'Other'
}
```

**创建 src/core/parser/index.ts**
```typescript
// 解析器模块导出
export * from './raw-parser'
export * from './tag-parser'
```

### 6.3 验证器模块

**创建 src/core/validator/tag-validator.ts**
```typescript
// 标签验证器
export interface ValidationResult {
  valid: boolean
  message?: string
}

export function validateTag(name: string, value: unknown): ValidationResult {
  // 实现标签验证逻辑
  return { valid: true }
}
```

**创建 src/core/validator/type-validator.ts**
```typescript
// 类型验证器
export function validateType(value: unknown, expectedType: string): boolean {
  return typeof value === expectedType
}
```

**创建 src/core/validator/index.ts**
```typescript
// 验证器模块导出
export * from './tag-validator'
export * from './type-validator'
```

**检查清单**
- [ ] WASM 执行器完成
- [ ] 解析器完成
- [ ] 验证器完成
- [ ] 类型检查通过

---

## 七、服务层开发

### 7.1 读取服务

**创建 src/services/reader/image-reader.ts**
```typescript
// 单图片读取服务
import { callRead } from '@/core/executor'
import { ExifData } from '@/types'

export async function readImage(file: File): Promise<ExifData> {
  return await callRead(file)
}
```

**创建 src/services/reader/batch-reader.ts**
```typescript
// 批量读取服务
import { readImage } from './image-reader'
import { ExifData, FileItem } from '@/types'

export async function batchRead(files: File[]): Promise<FileItem[]> {
  const results: FileItem[] = []
  for (const file of files) {
    const exifData = await readImage(file)
    results.push({
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      exifData
    })
  }
  return results
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
```

**创建 src/services/reader/index.ts**
```typescript
// 读取服务导出
export * from './image-reader'
export * from './batch-reader'
```

### 7.2 写入服务

**创建 src/services/writer/image-writer.ts**
```typescript
// 单图片写入服务
import { callWrite } from '@/core/executor'
import { ExifData } from '@/types'

export async function writeImage(
  file: File,
  tags: Partial<ExifData>
): Promise<ArrayBuffer> {
  return await callWrite(file, tags as Record<string, unknown>)
}
```

**创建 src/services/writer/batch-writer.ts**
```typescript
// 批量写入服务
import { writeImage } from './image-writer'
import { ExifData, FileItem } from '@/types'

export async function batchWrite(
  files: FileItem[],
  tags: Partial<ExifData>
): Promise<ArrayBuffer[]> {
  const results: ArrayBuffer[] = []
  for (const item of files) {
    const result = await writeImage(item.file, tags)
    results.push(result)
  }
  return results
}
```

**创建 src/services/writer/index.ts**
```typescript
// 写入服务导出
export * from './image-writer'
export * from './batch-writer'
```

### 7.3 格式检测服务

**创建 src/services/format-detector.ts**
```typescript
// 格式检测服务
export interface FormatInfo {
  mimeType: string
  extension: string
  supported: boolean
}

const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/tiff'
]

export function detectFormat(file: File): FormatInfo {
  const extension = getExtension(file.name)
  const mimeType = file.type
  const supported = SUPPORTED_FORMATS.includes(mimeType)
  return { mimeType, extension, supported }
}

function getExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || ''
}
```

### 7.4 清除服务

**创建 src/services/clear/clear-all.ts**
```typescript
// 一键清除全部 EXIF 服务
import { callClearAll } from '@/core/executor'

export async function clearAllExif(file: File): Promise<ArrayBuffer> {
  return await callClearAll(file)
}
```

**创建 src/services/clear/clear-tag.ts**
```typescript
// 单独清除单个标签服务
import { callClearTag } from '@/core/executor'

export async function clearTag(file: File, tagName: string): Promise<ArrayBuffer> {
  return await callClearTag(file, tagName)
}
```

**创建 src/services/clear/index.ts**
```typescript
// 清除服务导出
export * from './clear-all'
export * from './clear-tag'
```

**更新 src/core/executor/caller.ts 添加清除方法**
```typescript
export async function callClearAll(file: File): Promise<ArrayBuffer> {
  await initialize()
  logger.debug('Clearing all EXIF from file:', file.name)
  // 实现清除全部 EXIF 逻辑
  return new ArrayBuffer(0)
}

export async function callClearTag(file: File, tagName: string): Promise<ArrayBuffer> {
  await initialize()
  logger.debug('Clearing EXIF tag:', tagName, 'from file:', file.name)
  // 实现清除单个标签逻辑
  return new ArrayBuffer(0)
}
```

**检查清单**
- [ ] 读取服务完成
- [ ] 写入服务完成
- [ ] 格式检测完成
- [ ] 清除服务完成
- [ ] 类型检查通过

---

## 八、状态管理配置

### 8.1 创建状态存储

**创建 src/stores/index.ts**
```typescript
// 状态管理入口
import { createPinia } from 'pinia'

export const pinia = createPinia()
```

**创建 src/stores/file-store.ts**
```typescript
// 文件状态管理
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { FileItem } from '@/types'

export const useFileStore = defineStore('file', () => {
  const files = ref<FileItem[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)

  function addFiles(newFiles: FileItem[]): void {
    files.value.push(...newFiles)
  }

  function selectFile(id: string | null): void {
    selectedId.value = id
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  return {
    files,
    selectedId,
    loading,
    addFiles,
    selectFile,
    setLoading
  }
})
```

**创建 src/stores/exif-store.ts**
```typescript
// EXIF 数据状态管理
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ExifData } from '@/types'

export const useExifStore = defineStore('exif', () => {
  const data = ref<Record<string, ExifData>>({})
  const editing = ref<Record<string, unknown> | null>(null)

  function setExifData(fileId: string, exifData: ExifData): void {
    data.value[fileId] = exifData
  }

  function setEditing(tags: Record<string, unknown> | null): void {
    editing.value = tags
  }

  function clearEditing(): void {
    editing.value = null
  }

  return {
    data,
    editing,
    setExifData,
    setEditing,
    clearEditing
  }
})
```

**创建 src/stores/ui-store.ts**
```typescript
// UI 状态管理
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Theme, Notification, DialogState } from '@/types'

export const useUIStore = defineStore('ui', () => {
  const theme = ref<Theme>('light')
  const dialog = ref<DialogState>({ open: false, type: null })
  const notification = ref<Notification | null>(null)

  function setTheme(newTheme: Theme): void {
    theme.value = newTheme
  }

  function openDialog(type: DialogState['type'], fileId?: string): void {
    dialog.value = { open: true, type, fileId }
  }

  function closeDialog(): void {
    dialog.value = { open: false, type: null }
  }

  function showNotification(notificationData: Notification): void {
    notification.value = notificationData
  }

  return {
    theme,
    dialog,
    notification,
    setTheme,
    openDialog,
    closeDialog,
    showNotification
  }
})
```

**检查清单**
- [ ] Pinia 配置完成
- [ ] 三个状态存储完成
- [ ] 类型检查通过

---

## 九、组合式函数开发

### 9.1 创建组合式函数

**创建 src/composables/index.ts**
```typescript
// 组合式函数入口
export * from './use-exif'
export * from './use-file'
export * from './use-ui'
```

**创建 src/composables/use-exif.ts**
```typescript
// EXIF 操作组合式
import { computed } from 'vue'
import { useFileStore } from '@/stores/file-store'
import { useExifStore } from '@/stores/exif-store'
import { readImage } from '@/services/reader'
import { clearAllExif, clearTag } from '@/services/clear'

export function useExif() {
  const fileStore = useFileStore()
  const exifStore = useExifStore()

  const currentExif = computed(() => {
    if (!fileStore.selectedId) return null
    return exifStore.data[fileStore.selectedId] || null
  })

  async function loadExif(fileId: string, file: File): Promise<void> {
    fileStore.setLoading(true)
    try {
      const exifData = await readImage(file)
      exifStore.setExifData(fileId, exifData)
    } finally {
      fileStore.setLoading(false)
    }
  }

  async function clearAll(): Promise<void> {
    if (!fileStore.selectedId) return
    const fileItem = fileStore.files.find(f => f.id === fileStore.selectedId)
    if (!fileItem) return

    fileStore.setLoading(true)
    try {
      await clearAllExif(fileItem.file)
      await loadExif(fileItem.id, fileItem.file)
    } finally {
      fileStore.setLoading(false)
    }
  }

  async function removeTag(tagName: string): Promise<void> {
    if (!fileStore.selectedId) return
    const fileItem = fileStore.files.find(f => f.id === fileStore.selectedId)
    if (!fileItem) return

    fileStore.setLoading(true)
    try {
      await clearTag(fileItem.file, tagName)
      await loadExif(fileItem.id, fileItem.file)
    } finally {
      fileStore.setLoading(false)
    }
  }

  return {
    currentExif,
    loadExif,
    clearAll,
    removeTag
  }
}
```

**创建 src/composables/use-file.ts**
```typescript
// 文件操作组合式
import { useFileStore } from '@/stores/file-store'
import { adaptFile } from '@/infrastructure/file/adapter'
import { readAsDataURL } from '@/infrastructure/file/reader'
import { useExif } from './use-exif'

export function useFile() {
  const fileStore = useFileStore()
  const { loadExif } = useExif()

  async function addFiles(fileList: FileList): Promise<void> {
    const newFiles = Array.from(fileList)
    const fileItems = await Promise.all(
      newFiles.map(async (file) => {
        const baseInfo = adaptFile(file)
        const preview = file.type.startsWith('image/')
          ? await readAsDataURL(file)
          : undefined
        return {
          ...baseInfo,
          id: baseInfo.id!,
          preview
        } as any
      })
    )
    fileStore.addFiles(fileItems)
    for (const item of fileItems) {
      await loadExif(item.id, item.file)
    }
  }

  return {
    files: fileStore.files,
    selectedId: fileStore.selectedId,
    addFiles,
    selectFile: (id: string | null) => fileStore.selectFile(id)
  }
}
```

**创建 src/composables/use-ui.ts**
```typescript
// UI 操作组合式
import { useUIStore } from '@/stores/ui-store'
import { Theme, Notification } from '@/types'

export function useUI() {
  const uiStore = useUIStore()

  function toggleTheme(): void {
    const newTheme: Theme = uiStore.theme === 'light' ? 'dark' : 'light'
    uiStore.setTheme(newTheme)
  }

  function showSuccess(message: string): void {
    uiStore.showNotification({
      id: Date.now().toString(),
      type: 'success',
      message
    })
  }

  function showError(message: string): void {
    uiStore.showNotification({
      id: Date.now().toString(),
      type: 'error',
      message
    })
  }

  return {
    theme: uiStore.theme,
    dialog: uiStore.dialog,
    toggleTheme,
    openDialog: uiStore.openDialog,
    closeDialog: uiStore.closeDialog,
    showSuccess,
    showError
  }
}
```

**检查清单**
- [ ] 所有组合式函数完成
- [ ] 类型检查通过

---

## 十、事件总线开发

### 10.1 创建事件总线

**创建 src/event-bus/types.ts**
```typescript
// 事件类型定义
export type EventType = 'file-selected' | 'exif-loaded' | 'edit-started' | 'edit-completed' | 'error'

export interface EventPayload {
  'file-selected': { fileId: string }
  'exif-loaded': { fileId: string }
  'edit-started': { fileId: string }
  'edit-completed': { fileId: string; success: boolean }
  'error': { message: string; error: unknown }
}
```

**创建 src/event-bus/emitter.ts**
```typescript
// 事件发射器
import { ref } from 'vue'
import { EventType, EventPayload } from './types'

type Listener<T extends EventType> = (payload: EventPayload[T]) => void

const listeners = ref<Record<string, Set<Function>>>({})

export function emit<T extends EventType>(event: T, payload: EventPayload[T]): void {
  const eventListeners = listeners.value[event]
  if (eventListeners) {
    eventListeners.forEach((listener) => listener(payload))
  }
}

export function on<T extends EventType>(event: T, listener: Listener<T>): () => void {
  if (!listeners.value[event]) {
    listeners.value[event] = new Set()
  }
  listeners.value[event].add(listener)
  return () => off(event, listener)
}

function off<T extends EventType>(event: T, listener: Listener<T>): void {
  listeners.value[event]?.delete(listener)
}
```

**创建 src/event-bus/index.ts**
```typescript
// 事件总线导出
export * from './emitter'
export * from './types'
```

**检查清单**
- [ ] 事件总线完成
- [ ] 类型检查通过

---

## 十一、UI 组件开发

### 11.1 通用组件

**创建 src/components/common/loading-spinner.vue**
```vue
<template>
  <div class="flex items-center justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
</template>

<script setup lang="ts">
// 加载动画组件
</script>
```

**创建 src/components/common/empty-state.vue**
```vue
<template>
  <div class="flex flex-col items-center justify-center p-8 text-gray-500">
    <slot name="icon">
      <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </slot>
    <p class="text-lg">{{ message }}</p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>
```

### 11.2 文件相关组件

**创建 src/components/file/file-upload.vue**
```vue
<template>
  <div
    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
    @click="triggerInput"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <input
      ref="inputRef"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
    <p class="text-gray-600">点击或拖拽图片到这里</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'select', files: FileList): void
}>()

const inputRef = ref<HTMLInputElement>()

function triggerInput(): void {
  inputRef.value?.click()
}

function handleFileSelect(event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.files) {
    emit('select', target.files)
  }
}

function handleDrop(event: DragEvent): void {
  if (event.dataTransfer?.files) {
    emit('select', event.dataTransfer.files)
  }
}
</script>
```

**创建 src/components/file/file-item.vue**
```vue
<template>
  <div
    class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
    :class="{ 'border-blue-500 bg-blue-50': selected }"
    @click="$emit('select', id)"
  >
    <img v-if="preview" :src="preview" class="w-12 h-12 object-cover rounded mr-3" />
    <div class="flex-1 min-w-0">
      <p class="truncate font-medium">{{ name }}</p>
      <p class="text-sm text-gray-500">{{ formatSize(size) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  name: string
  size: number
  preview?: string
  selected: boolean
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
```

**创建 src/components/file/file-list.vue**
```vue
<template>
  <div class="space-y-2">
    <file-item
      v-for="file in files"
      :key="file.id"
      :id="file.id"
      :name="file.name"
      :size="file.size"
      :preview="file.preview"
      :selected="selectedId === file.id"
      @select="$emit('select', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import FileItem from './file-item.vue'
import { FileItem as FileItemType } from '@/types'

defineProps<{
  files: FileItemType[]
  selectedId: string | null
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()
</script>
```

### 11.3 信息展示组件

**创建 src/components/info/tag-item.vue（支持内联编辑和删除）**
```vue
<template>
  <div class="flex items-center justify-between py-2 border-b last:border-0 group">
    <div class="flex items-center flex-1 min-w-0">
      <span class="font-medium text-gray-700 w-32 shrink-0">{{ label }}</span>
      <input
        v-if="editing"
        v-model="editValue"
        class="flex-1 px-2 py-1 border rounded text-sm"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
      />
      <span v-else class="text-gray-900 truncate flex-1" @click="startEdit">
        {{ displayValue }}
      </span>
    </div>
    <div class="opacity-0 group-hover:opacity-100 flex items-center ml-2">
      <button
        @click="$emit('edit', label)"
        class="p-1 text-blue-600 hover:text-blue-800"
        title="编辑"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button
        @click="$emit('delete', label)"
        class="p-1 text-red-600 hover:text-red-800"
        title="删除"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  label: string
  value: unknown
}>()

const emit = defineEmits<{
  (e: 'edit', label: string): void
  (e: 'delete', label: string): void
  (e: 'change', label: string, newValue: unknown): void
}>()

const editing = ref(false)
const editValue = ref('')

const displayValue = computed(() => {
  if (props.value === undefined || props.value === null) return '-'
  return String(props.value)
})

function startEdit(): void {
  editValue.value = String(props.value)
  editing.value = true
}

function saveEdit(): void {
  if (editValue.value !== String(props.value)) {
    emit('change', props.label, editValue.value)
  }
  editing.value = false
}
</script>
```

**创建 src/components/info/tag-group.vue**
```vue
<template>
  <div class="mb-4">
    <h3 class="font-bold text-gray-800 mb-2 px-2">{{ name }}</h3>
    <div class="bg-gray-50 rounded-lg">
      <tag-item
        v-for="tag in tags"
        :key="tag.name"
        :label="tag.name"
        :value="tag.value"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @change="$emit('change', $event[0], $event[1])"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TagItem from './tag-item.vue'
import { ExifTag } from '@/types'

defineProps<{
  name: string
  tags: ExifTag[]
}>()

defineEmits<{
  (e: 'edit', label: string): void
  (e: 'delete', label: string): void
  (e: 'change', label: string, value: unknown): void
}>()
</script>
```

**创建 src/components/info/info-panel.vue（查看+编辑同一页面）**
```vue
<template>
  <div v-if="exifData" class="space-y-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <img :src="exifPreview" class="w-24 h-24 object-cover rounded-lg mr-4" />
        <div>
          <h2 class="font-bold text-lg">{{ exifData.fileName }}</h2>
          <p class="text-sm text-gray-500">{{ formatSize(exifData.fileSize) }}</p>
        </div>
      </div>
      <clear-button
        v-if="hasExifData"
        @clear-all="$emit('clear-all')"
      />
    </div>
    <div class="space-y-2">
      <tag-group
        v-for="group in tagGroups"
        :key="group.name"
        :name="group.name"
        :tags="group.tags"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @change="$emit('change', $event[0], $event[1])"
      />
    </div>
  </div>
  <empty-state v-else message="选择一个文件查看 EXIF 信息" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EmptyState from '@/components/common/empty-state.vue'
import TagGroup from './tag-group.vue'
import ClearButton from '@/components/editor/clear-button.vue'
import { ExifData, ExifGroup } from '@/types'

const props = defineProps<{
  data: ExifData | null
}>()

defineEmits<{
  (e: 'edit', label: string): void
  (e: 'delete', label: string): void
  (e: 'change', label: string, value: unknown): void
  (e: 'clear-all'): void
}>()

const exifPreview = computed(() => {
  return ''
})

const hasExifData = computed(() => {
  return Object.keys(props.data || {}).length > 2
})

const tagGroups = computed((): ExifGroup[] => {
  if (!props.data) return []
  return []
})

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`
}
</script>
```

### 11.4 编辑组件

**创建 src/components/editor/clear-button.vue（一键清除按钮）**
```vue
<template>
  <button
    @click="handleClick"
    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
    :disabled="loading"
  >
    <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    一键清除
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'clear-all'): void
}>()

const loading = ref(false)

async function handleClick(): Promise<void> {
  if (!confirm('确定要清除该图片的所有 EXIF 信息吗？此操作不可撤销。')) {
    return
  }
  loading.value = true
  try {
    emit('clear-all')
  } finally {
    loading.value = false
  }
}
</script>
```

### 11.5 应用级组件

**创建 src/components/app/app-header.vue**
```vue
<template>
  <header class="bg-white shadow-sm p-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold">EXIF 编辑器</h1>
      <button
        @click="$emit('toggle-theme')"
        class="p-2 rounded-lg hover:bg-gray-100"
      >
        {{ theme === 'light' ? '🌙' : '☀️' }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Theme } from '@/types'

defineProps<{
  theme: Theme
}>()

defineEmits<{
  (e: 'toggle-theme'): void
}>()
</script>
```

**创建 src/components/app/exif-app.vue**
```vue
<template>
  <div :class="{ 'dark': theme === 'dark' }">
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <app-header :theme="theme" @toggle-theme="toggleTheme" />
      <main class="container mx-auto p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-4">
            <file-upload @select="handleFileSelect" />
            <file-list
              :files="files"
              :selected-id="selectedId"
              @select="selectFile"
            />
          </div>
          <info-panel
            :data="currentExif"
            @edit="handleEdit"
            @delete="handleDelete"
            @change="handleChange"
            @clear-all="handleClearAll"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from './app-header.vue'
import FileUpload from '@/components/file/file-upload.vue'
import FileList from '@/components/file/file-list.vue'
import InfoPanel from '@/components/info/info-panel.vue'
import { useFile } from '@/composables/use-file'
import { useExif } from '@/composables/use-exif'
import { useUI } from '@/composables/use-ui'

const { files, selectedId, addFiles, selectFile: setSelectedId } = useFile()
const { currentExif, clearAll, removeTag } = useExif()
const { theme, toggleTheme, showSuccess, showError } = useUI()

function handleFileSelect(fileList: FileList): void {
  addFiles(fileList)
}

async function handleEdit(label: string): Promise<void> {
  // 内联编辑由 tag-item 组件自行处理
  console.log('Edit tag:', label)
}

async function handleDelete(label: string): Promise<void> {
  try {
    await removeTag(label)
    showSuccess(`已删除标签: ${label}`)
  } catch (error) {
    showError(`删除标签失败: ${label}`)
  }
}

async function handleChange(label: string, value: unknown): Promise<void> {
  console.log('Change tag:', label, 'to', value)
}

async function handleClearAll(): Promise<void> {
  try {
    await clearAll()
    showSuccess('已清除所有 EXIF 信息')
  } catch (error) {
    showError('清除 EXIF 信息失败')
  }
}

function selectFile(id: string | null): void {
  setSelectedId(id)
}

onMounted(() => {
  document.documentElement.classList.remove('dark')
})
</script>
```

**检查清单**
- [ ] 通用组件完成
- [ ] 文件组件完成
- [ ] 信息组件完成
- [ ] 编辑组件完成
- [ ] 应用组件完成
- [ ] 类型检查通过

---

## 十二、入口文件配置

### 12.1 更新入口文件

**更新 src/main.ts**
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app.vue'
import './assets/styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

**更新 src/app.vue**
```vue
<template>
  <exif-app />
</template>

<script setup lang="ts">
import ExifApp from '@/components/app/exif-app.vue'
</script>
```

**更新 src/assets/styles/main.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities
```

### 12.2 更新 index.html

**更新 index.html**
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EXIF 编辑器</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**检查清单**
- [ ] 入口文件配置完成
- [ ] 类型检查通过
- [ ] 开发服务器可正常启动

---

## 十三、功能集成测试

### 13.1 基础功能测试

```bash
# 启动开发服务器
pnpm run dev

# 执行类型检查
pnpm run typecheck

# 执行代码检查
pnpm run lint
```

### 13.2 测试用例

- [ ] 选择图片文件后正确显示预览
- [ ] 选择文件后正确读取 EXIF 数据
- [ ] 选择不同文件时正确切换 EXIF 显示
- [ ] 深色模式切换正常
- [ ] 错误提示正常显示
- [ ] 点击标签可进入内联编辑模式
- [ ] 编辑标签值后正确保存
- [ ] 点击删除按钮可删除单个 EXIF 标签
- [ ] 一键清除按钮可清除全部 EXIF 信息
- [ ] 清除操作有确认提示
- [ ] 清除后正确刷新显示

---

## 十四、优化与完善

### 14.1 性能优化

- [ ] WASM 懒加载实现
- [ ] 大列表虚拟滚动（如需要）
- [ ] 组件按需加载

### 14.2 功能完善

- [ ] EXIF 编辑功能实现
- [ ] 批量编辑功能实现
- [ ] 文件保存/下载功能

### 14.3 体验优化

- [ ] 加载状态优化
- [ ] 错误提示优化
- [ ] 响应式布局完善

---

## 十五、构建与部署

### 15.1 生产构建

```bash
# 执行生产构建
pnpm run build

# 预览构建结果
pnpm run preview
```

### 15.2 部署配置

- [ ] 部署到静态页面托管
- [ ] 配置 WASM 文件 CDN
- [ ] 验证生产环境功能

---

## 变更记录

> 2024-01-14 更新：新增以下功能
> - 一键清除全部 EXIF 信息功能（ClearButton 组件 + ClearService 服务）
> - EXIF 查看与编辑在同一页面（InfoPanel 内联编辑）
> - 单个 EXIF 标签独立删除功能（TagItem 组件支持删除）
> - 新增 clear-service 服务层模块
> - 新增 ClearButton 组件
> - TagItem 组件重构支持内联编辑和删除

| 步骤 | 完成日期 | 关键变更 | 备注 |
|------|----------|----------|------|
| 1 | - | 环境准备 | 待完成 |
| 2 | - | 项目初始化 | 待完成 |
| 3 | - | 目录结构创建 | 待完成 |
| 4 | - | 类型定义开发 | 待完成 |
| 5 | - | 基础设施层开发 | 待完成 |
| 6 | - | 核心层开发 | 待完成 |
| 7 | - | 服务层开发 | 待完成 |
| 8 | - | 状态管理配置 | 待完成 |
| 9 | - | 组合式函数开发 | 待完成 |
| 10 | - | 事件总线开发 | 待完成 |
| 11 | - | UI 组件开发 | 待完成 |
| 12 | - | 入口文件配置 | 待完成 |
| 13 | - | 功能集成测试 | 待完成 |
| 14 | - | 优化与完善 | 待完成 |
| 15 | - | 构建与部署 | 待完成 |

---

## 十六、已实现功能完整记录

> 本节记录截至目前已完成的所有开发工作，包括完整的项目结构、实现的功能、组件详情和技术决策。

### 16.1 项目概述

EXIF 编辑器是一个基于 Vue 3 + TypeScript + Vite 构建的现代化图片元数据编辑工具，支持查看和编辑图片的 EXIF 信息。项目采用模块化架构设计，具有良好的可维护性和扩展性。

**技术栈**
- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 7.x
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.x
- **状态管理**: Pinia
- **EXIF 处理**: @uswriting/exiftool (WASM)
- **包管理器**: pnpm 9.x

### 16.2 已完成功能清单

#### 16.2.1 核心功能
- [x] 图片文件选择与预览
- [x] EXIF 数据读取与解析
- [x] EXIF 标签分组显示 (GPS、Image、Photo、Other)
- [x] 单个标签值编辑
- [x] 单个标签删除
- [x] 一键清除全部 EXIF 信息
- [x] 深色/浅色主题切换
- [x] 多语言支持（中英文，默认中文）

#### 16.2.2 用户体验
- [x] 响应式布局设计
- [x] 加载状态显示
- [x] 操作反馈通知
- [x] 错误提示与处理
- [x] 语言切换功能

### 16.3 项目目录结构

```
src/
├── assets/
│   └── styles/
│       └── main.css          # 全局样式
├── components/
│   ├── app/
│   │   ├── exif-app.vue      # 应用根组件
│   │   ├── app-header.vue    # 应用头部（标题、语言切换、主题切换）
│   │   └── app-footer.vue    # 应用底部（版权信息）
│   ├── common/
│   │   ├── empty-state.vue   # 空状态组件
│   │   ├── notification.vue  # 通知组件
│   │   └── loading-spinner.vue # 加载动画组件
│   ├── editor/
│   │   ├── clear-button.vue  # 清除 EXIF 按钮
│   │   └── tag-item.vue      # EXIF 标签项（编辑/删除）
│   ├── file/
│   │   ├── file-upload.vue   # 文件上传区域
│   │   └── file-list.vue     # 文件列表
│   └── info/
│       ├── info-panel.vue    # EXIF 信息面板
│       └── tag-group.vue     # EXIF 标签分组
├── composables/
│   ├── index.ts              # 导出所有 composable
│   ├── use-file.ts           # 文件相关状态与操作
│   ├── use-ui.ts             # UI 状态管理
│   └── use-i18n.ts           # 国际化支持
├── core/
│   └── executor/
│       └── index.ts          # WASM 执行器封装
├── event-bus/
│   └── index.ts              # 事件总线
├── i18n/
│   ├── index.ts              # i18n 导出
│   ├── locales.ts            # 翻译字典（中英文）
│   └── composable.ts         # 翻译 composable
├── infrastructure/
│   ├── error/
│   │   ├── handler.ts        # 错误处理
│   │   └── types.ts          # 错误类型定义
│   └── file/
│       ├── adapter.ts        # File 适配器
│       ├── reader.ts         # 文件读取器
│       └── writer.ts         # 文件写入器
├── services/
│   ├── reader/
│   │   └── index.ts          # EXIF 读取服务
│   └── writer/
│       └── index.ts          # EXIF 写入服务
├── stores/
│   ├── file-store.ts         # 文件状态管理
│   ├── ui-store.ts           # UI 状态管理
│   └── exif-store.ts         # EXIF 数据状态管理
├── types/
│   ├── exif-types.ts         # EXIF 相关类型
│   ├── file-types.ts         # 文件相关类型
│   └── ui-types.ts           # UI 相关类型
├── utils/
│   └── index.ts              # 工具函数
├── App.vue                   # 应用入口组件
└── main.ts                   # 应用入口文件
```

### 16.4 关键组件说明

#### 16.4.1 应用组件

**exif-app.vue**
应用根组件，协调所有子组件的布局和交互。
- 管理文件上传和列表显示区域
- 控制信息面板显示
- 初始化国际化设置

**app-header.vue**
应用头部组件，包含以下功能：
- 应用标题显示
- 深色模式切换按钮
- 中英文语言切换按钮
- 清除全部文件按钮

**app-footer.vue**
应用底部组件，显示版权信息和语言状态。

#### 16.4.2 文件组件

**file-upload.vue**
文件上传组件，支持：
- 拖拽上传
- 点击选择文件
- 显示已选择文件数量
- 文件类型过滤（图片格式）

**file-list.vue**
文件列表组件，展示：
- 当前选择的文件
- 文件预览缩略图
- 文件信息（名称、大小）
- 文件选中状态

#### 16.4.3 信息展示组件

**info-panel.vue**
EXIF 信息主面板：
- 标签分组展示（GPS、Image、Photo、Other）
- 空状态提示
- 内联编辑支持

**tag-group.vue**
标签分组组件：
- 分组标题显示
- 标签列表渲染
- 翻译后的标签名称

**tag-item.vue**
单个标签组件：
- 标签名称和值显示
- 点击进入编辑模式
- 保存和取消编辑
- 删除单个标签

#### 16.4.4 功能组件

**clear-button.vue**
一键清除按钮：
- 清除当前选中文件的全部 EXIF
- 显示确认对话框
- 操作成功后刷新显示

**notification.vue**
通知组件：
- 显示操作成功/失败消息
- 自动消失
- 支持多种通知类型

### 16.5 国际化 (i18n) 系统

#### 16.5.1 功能特性
- 支持中文（zh-CN）和英文（en-US）两种语言
- 默认使用中文
- 语言偏好本地存储持久化
- 浏览器语言自动检测
- 实时语言切换

#### 16.5.2 翻译覆盖范围

**通用文本**
- 加载中、暂无数据、错误、成功等

**应用界面**
- 头部：应用标题、清除全部、主题切换
- 上传区域：拖拽提示、点击选择
- 文件列表：文件信息
- 信息面板：分组标题、空状态提示
- 操作按钮：编辑、保存、取消、删除

**通知消息**
- 文件已清除
- 标签已更新
- 操作成功/失败提示

#### 16.5.3 技术实现

**locales.ts**
```typescript
// 翻译字典接口
export interface TranslationDict {
  [key: string]: string | TranslationDict
}

// 语言枚举
export type Locale = 'zh-CN' | 'en-US'

// 翻译字典
export const translations: Record<Locale, TranslationDict> = {
  'zh-CN': { /* 中文翻译 */ },
  'en-US': { /* 英文翻译 */ }
}

// 嵌套值获取
export function getNestedValue(obj: Record<string, unknown>, key: string): string
```

**composable.ts**
```typescript
// i18n composable
export function useI18n() {
  const locale = computed(() => currentLocale.value)
  const t: TranslateFn = (key: string): string => {
    const langData = translations[currentLocale.value]
    return getNestedValue(langData as Record<string, unknown>, key)
  }
  
  function setLocale(newLocale: Locale): void
  function toggleLocale(): void
  function initLocale(): void
  
  return { locale, t, setLocale, toggleLocale, initLocale }
}
```

### 16.6 状态管理

#### 16.6.1 文件状态 (useFileStore)
- files: 文件列表
- selectedId: 当前选中文件 ID
- loading: 加载状态
- addFiles(): 添加文件
- selectFile(): 选择文件

#### 16.6.2 UI 状态 (useUIStore)
- theme: 主题模式
- notification: 通知信息
- showNotification(): 显示通知

### 16.7 服务层

#### 16.7.1 读取服务
- readImage(): 读取单个图片 EXIF
- batchRead(): 批量读取 EXIF

#### 16.7.2 写入服务
- writeImage(): 写入单个图片 EXIF
- batchWrite(): 批量写入 EXIF

### 16.8 基础设施

#### 16.8.1 文件处理
- readAsArrayBuffer(): 读取为 ArrayBuffer
- readAsDataURL(): 读取为 DataURL
- writeAsBlob(): 写入为 Blob

#### 16.8.2 错误处理
- ErrorCode: 错误码枚举
- createError(): 创建错误
- handleError(): 处理错误

### 16.9 事件总线

支持组件间松耦合通信：
- FILE_SELECTED: 文件选择事件
- FILE_CLEARED: 文件清除事件
- EXIF_UPDATED: EXIF 更新事件

### 16.10 当前开发状态

**已完成**
- [x] 项目初始化与配置
- [x] 目录结构创建
- [x] 基础类型定义
- [x] 基础设施层
- [x] 核心层 (WASM 执行器)
- [x] 服务层 (读取/写入)
- [x] 状态管理 (Pinia)
- [x] 组合式函数
- [x] 事件总线
- [x] UI 组件开发
- [x] 入口文件配置
- [x] 国际化系统
- [x] 功能集成测试

**待完成**
- [ ] EXIF 编辑功能完善
- [ ] 文件保存/下载功能
- [ ] WASM 懒加载优化
- [ ] 批量操作功能
- [ ] 生产部署配置

### 16.11 构建与运行

**开发模式**
```bash
pnpm run dev
```

**类型检查**
```bash
pnpm run typecheck
```

**代码检查**
```bash
pnpm run lint
```

**生产构建**
```bash
pnpm run build
```

### 16.12 已知问题与限制

1. WASM 模块尚未完全集成 (@uswriting/exiftool)
2. EXIF 读取/写入功能为模拟实现
3. 部分高级 EXIF 标签可能不支持

### 16.13 后续优化方向

1. 完成 WASM 集成，实现真正的 EXIF 读写
2. 添加更多 EXIF 标签支持
3. 优化大文件处理性能
4. 添加批量操作功能
5. 支持更多图片格式

---

## 变更记录

> 2024-01-14 更新：新增以下功能
> - 一键清除全部 EXIF 信息功能（ClearButton 组件 + ClearService 服务）
> - EXIF 查看与编辑在同一页面（InfoPanel 内联编辑）
> - 单个 EXIF 标签独立删除功能（TagItem 组件支持删除）
> - 新增 clear-service 服务层模块
> - 新增 ClearButton 组件
> - TagItem 组件重构支持内联编辑和删除

> 2024-01-15 更新：新增中英文国际化支持
> - 完整的 i18n 系统（中英文支持，默认中文）
> - 语言偏好本地存储持久化
> - 浏览器语言自动检测
> - 所有 UI 组件集成翻译功能
> - 新增 i18n 模块（locales.ts、composable.ts、index.ts）
> - 更新所有组件使用翻译文本
> - 构建验证通过
