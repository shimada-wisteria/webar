const app = Vue.createApp({
    data() {
      return {
        isShowDetails: [],
        sysList: []
      }
    },
    async created() {
      this.sysList = await this.getSettings()
      this.sysList.forEach(element => {
        this.isShowDetails[element.id] = true;
      });
    },
    methods: {
      toggleDetails(id) {
        this.isShowDetails[id] = !this.isShowDetails[id]
      },
      windowOpen(url) {
        window.open(url)
      },
      async getSettings() {
        const settingsUrl = `./list.json`
        const response = await fetch(
          settingsUrl,
          {
            cache: 'no-store',
            credentials: 'include'
          }
        )
        return response.json()
      }
    }
  })

  app.mount('#app')