<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components:{
      NavBar,
    },
    computed:{
      // 两种语法
      // 使用对象展开运算符将 getter 混入 computed 对象中
      // <div slot="center">购物车({{cartLength}})</div>
      // ...mapGetters(['cartLength','cartList'])
      
      ...mapGetters({
        // 把 `length` 映射为 `cartLength`
        length:'cartLength',
        list:'cartList'
      })
    }
  }
</script>

<style scoped>
.nav-bar{
  background-color: var(--color-tint);
  color: white;
}
</style>
