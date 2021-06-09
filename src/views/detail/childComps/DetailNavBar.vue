<template>
  <div>
    <nav-bar>
      <div slot="left" class="back">
        <img src="~assets/img/common/back.svg" alt="" @click="backClick">
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in titles" :key="index" class="title-item" :class="{active:index===currentIndex}" @click="titleClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      titles:['商品','参数','评论','推荐'],
      currentIndex:{
        type:Array,
        default:0
      }
    }
  },
  methods: {
    titleClick(index){
      this.currentIndex=index
      this.$emit('titleClick',index)
    },
    backClick(){
      this.$router.back()
    }
  },
};
</script>

<style scoped>
.back img{
  margin-top: 11px;
}
.title{
  display: flex;
  font-size: 13px;
  justify-content: space-around;
  text-align: center;
}
/* .title-item{
  justify-content: space-around;
  align-items: center;
} */
.active{
  color:var(--color-high-text)
}
</style>