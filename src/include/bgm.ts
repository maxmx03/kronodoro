import { reactive } from 'vue'

interface BgmConfig {
  focus: string
  break: string
}

export const bgm = reactive<BgmConfig>({
  focus: '',
  break: ''
})
