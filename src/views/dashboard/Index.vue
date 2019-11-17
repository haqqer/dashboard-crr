<template>
  <v-app>
    <navbar></navbar>
    <v-container>
      <v-row>
        <v-col>
          <h2>
          Project
          </h2>
        </v-col>
      </v-row>
      <v-row mb-5>
        <v-col>
          <v-card dark class="green">
            <v-card-title>
              Finished Project
            </v-card-title>
            <v-card-text>
              <h3>{{ project.done }}</h3>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card dark class="red">
            <v-card-title>
              Unfinished Project
            </v-card-title>
            <v-card-text>
              <h3>{{ project.undone }}</h3>              
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card dark class="blue">
            <v-card-title>
              Total Project
            </v-card-title>
            <v-card-text>
              <h3>{{ project.total }}</h3>              
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="my-3">
          <h2>Posts Activity</h2>
        </v-col>
      </v-row>
      <v-row class="mb-5">
        <v-col class="col6">
          <h3 class="mb-3 text-center">Posts By Type</h3>
          <pie-chart :data="postsType"></pie-chart>
        </v-col>
        <v-col>
          <h3 class="mb-3 text-center">Posts by Status</h3>
          <pie-chart :data="postsStatus"></pie-chart>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import Navbar from '../../components/Navbar'
import { mapState, mapGetters} from 'vuex'
// import ChartPost from './Chart.vue'
import axios from 'axios'

export default {
  name: 'Dashboard',
  computed:{
    ...mapState(["token"]),
    ...mapGetters(['isLogedIn'])
  },
  data: () => ({
    project: {
      total: "",
      done: "",
      undone: ""
    },
    postsType: {},
    postsStatus: {}
  }),
  components:{
    'navbar' : Navbar,
    // 'post-chart' : ChartPost
  },
  async created() {
    this.$nextTick(() => {
      this.getPostType()
      this.getPostStatus()
    })      
    // const getCountProjectDone = await this.getCountProject({ status: 'done' })
    // this.project.done = getCountProjectDone.data.result.count
    // const getCountProjectUndone = await this.getCountProject({ status: 'undone' })
    // this.project.undone = getCountProjectUndone.data.result.count
    // const getCountProjectTotal = await this.getCountProject()
    // this.project.total = getCountProjectTotal.data.result.count
    // this.$nextTick(() => {
    //   this.getPostType()
    //   this.getPostStatus()
    // })
  },
  methods: {
    async getCountProject(params) {
      const token = localStorage.getItem('token')
      return await axios.get('https://dch.doscom.org/api/projects/count', {
        headers : {
            'Authorization': `Bearer ${token}`          
        },
        params: params ? params : ""
      })
    },
    async getCountPost(params) {
      const token = localStorage.getItem('token')
      return await axios.get('https://dch.doscom.org/api/posts/count', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params ? params : ""
      })
    },
    getPostType() {
      this.getCountPost({ type: 'accident' }).then(response => {
        this.postsType = { ...this.postsType, 'accident': response.data.result.count}
      })
      this.getCountPost({ type: 'progress' }).then(response => {
        this.postsType = { ...this.postsType, 'progress': response.data.result.count}
      })
      this.getCountPost({ type: 'report' }).then(response => {
        this.postsType = { ...this.postsType, 'report': response.data.result.count }
      })
    },
    getPostStatus() {
      this.getCountPost({ status: 'solved' }).then(response => {
        this.postsStatus = { ...this.postsStatus, 'solved': response.data.result.count}
      })
      this.getCountPost({ status: 'process' }).then(response => {
        this.postsStatus = { ...this.postsStatus, 'process': response.data.result.count}
      })
      this.getCountPost({ status: 'unsolved' }).then(response => {
        this.postsStatus = { ...this.postsStatus, 'unsolved': response.data.result.count }
      })
    }
  },
  async mounted() {
    const getCountProjectDone = await this.getCountProject({ status: 'done' })
    this.project.done = getCountProjectDone.data.result.count
    const getCountProjectUndone = await this.getCountProject({ status: 'undone' })
    this.project.undone = getCountProjectUndone.data.result.count
    const getCountProjectTotal = await this.getCountProject()
    this.project.total = getCountProjectTotal.data.result.count  
  }
};
</script>
