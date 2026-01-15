export type Locale = 'zh-CN' | 'en-US'

export interface TranslationDict {
  [key: string]: string | TranslationDict
}

export interface Translations {
  'zh-CN': TranslationDict
  'en-US': TranslationDict
}

export const translations: Translations = {
  'zh-CN': {
    common: {
      loading: '加载中...',
      noData: '暂无数据',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息',
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      clear: '清除',
      close: '关闭',
      submit: '提交',
      reset: '重置'
    },
    app: {
      title: 'EXIF 编辑器',
      subtitle: '查看和编辑图片元数据',
      clearAll: '清除全部',
      themeSwitch: '切换主题',
      footer: {
        pureFrontend: '纯前端 EXIF 编辑器 - 数据不会离开您的浏览器',
        poweredBy: '由 '
      },
      theme: {
        light: '浅色模式',
        dark: '深色模式'
      }
    },
    upload: {
      title: '拖拽图片到此处',
      subtitle: '或点击选择文件',
      formats: '支持 JPEG、PNG、WebP、HEIC、TIFF 格式',
      selectButton: '选择文件',
      loading: '正在加载 EXIF 数据...'
    },
    fileList: {
      title: '文件列表',
      size: 'KB'
    },
    info: {
      noExif: '此图片中未找到 EXIF 元数据',
      noFileSelected: '未选择文件',
      selectFileHint: '请从左侧选择要编辑的图片',
      fileSize: '文件大小',
      mimeType: '文件类型',
      groups: {
        GPS: 'GPS 信息',
        Image: '图片信息',
        Photo: '拍摄信息',
        Other: '其他信息'
      },
      tags: {
        Make: '相机品牌',
        Model: '相机型号',
        DateTime: '拍摄时间',
        CreateDate: '创建日期',
        ModifyDate: '修改日期',
        ExposureTime: '曝光时间',
        FNumber: '光圈值',
        ISOSpeedRatings: 'ISO 感光度',
        FocalLength: '焦距',
        ImageWidth: '图片宽度',
        ImageHeight: '图片高度',
        GPSLatitude: 'GPS 纬度',
        GPSLongitude: 'GPS 经度',
        Software: '软件',
        Orientation: '方向',
        ColorSpace: '色彩空间',
        Flash: '闪光灯',
        WhiteBalance: '白平衡',
        Artist: '作者',
        Copyright: '版权',
        ImageDescription: '图片描述'
      }
    },
    editor: {
      clearAll: '清除所有 EXIF',
      clearAllConfirm: '确定要清除此图片的所有 EXIF 数据吗？',
      clearSuccess: '所有 EXIF 标签已清除',
      updateSuccess: '标签 "{tag}" 已更新',
      removeSuccess: '标签 "{tag}" 已移除',
      updateError: '更新标签失败',
      removeError: '移除标签失败',
      clearError: '清除标签失败',
      editTag: '编辑标签',
      enterValue: '输入值',
      valueRequired: '请输入值',
      arrayHint: '多个值请用逗号分隔',
      saving: '保存中...'
    },
    notifications: {
      formatNotSupported: '不支持的格式: {file}',
      fileLoaded: '文件已加载',
      allFilesCleared: '所有文件已清除'
    },
    language: {
      switch: '切换语言',
      chinese: '中文',
      english: 'English'
    }
  },
  'en-US': {
    common: {
      loading: 'Loading...',
      noData: 'No data',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      clear: 'Clear',
      close: 'Close',
      submit: 'Submit',
      reset: 'Reset'
    },
    app: {
      title: 'EXIF Editor',
      subtitle: 'View and edit image metadata',
      clearAll: 'Clear All',
      themeSwitch: 'Switch theme',
      footer: {
        pureFrontend: 'Pure frontend EXIF editor - No data leaves your browser',
        poweredBy: 'Powered by '
      },
      theme: {
        light: 'Light mode',
        dark: 'Dark mode'
      }
    },
    upload: {
      title: 'Drag and drop images here',
      subtitle: 'or click to select files',
      formats: 'Supports JPEG, PNG, WebP, HEIC, TIFF formats',
      selectButton: 'Select Files',
      loading: 'Loading EXIF data...'
    },
    fileList: {
      title: 'Files',
      size: 'KB'
    },
    info: {
      noExif: 'No EXIF metadata found in this image',
      noFileSelected: 'No File Selected',
      selectFileHint: 'Please select an image from the left to edit',
      fileSize: 'File size',
      mimeType: 'File type',
      groups: {
        GPS: 'GPS Info',
        Image: 'Image Info',
        Photo: 'Photo Info',
        Other: 'Other Info'
      },
      tags: {
        Make: 'Camera Make',
        Model: 'Camera Model',
        DateTime: 'Date Taken',
        CreateDate: 'Create Date',
        ModifyDate: 'Modify Date',
        ExposureTime: 'Exposure Time',
        FNumber: 'F-Number',
        ISOSpeedRatings: 'ISO Speed',
        FocalLength: 'Focal Length',
        ImageWidth: 'Width',
        ImageHeight: 'Height',
        GPSLatitude: 'GPS Latitude',
        GPSLongitude: 'GPS Longitude',
        Software: 'Software',
        Orientation: 'Orientation',
        ColorSpace: 'Color Space',
        Flash: 'Flash',
        WhiteBalance: 'White Balance',
        Artist: 'Artist',
        Copyright: 'Copyright',
        ImageDescription: 'Description'
      }
    },
    editor: {
      clearAll: 'Clear All EXIF',
      clearAllConfirm: 'Are you sure you want to clear all EXIF data from this image?',
      clearSuccess: 'All EXIF tags cleared',
      updateSuccess: 'Tag "{tag}" updated',
      removeSuccess: 'Tag "{tag}" removed',
      updateError: 'Failed to update tag',
      removeError: 'Failed to remove tag',
      clearError: 'Failed to clear tags'
    },
    notifications: {
      formatNotSupported: 'Format not supported: {file}',
      fileLoaded: 'File loaded',
      allFilesCleared: 'All files cleared'
    },
    language: {
      switch: 'Switch language',
      chinese: '中文',
      english: 'English'
    }
  }
}

export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}
