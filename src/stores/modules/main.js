import { defineStore } from 'pinia'

export default defineStore('main', {
  state() {
    return {
      appList: [],
      currentAppName: '',
      currentAppId: '',
    }
  },
  getters: {},
  actions: {
    async getAppList() {
      try {
        const res = await getApp()
        if (res.code === 200) {
          this.appList = res.data
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
})
