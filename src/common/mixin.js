import {debounce} from './utils'
import {POP, NEW, SELL} from "./const";
export const itemListenerMixin={
  data() {
    return {
      itemImgListener:null,
    }
  },
  mounted() {
    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    // 监听item中图片加载完成(对监听的事件进行保存)
    this.itemImgListener=() => {
      refresh();
      // this.$refs.scroll.refresh();
    }
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    // console.log('我是混入的对象');
  },
}


export const backTopMixin = {
  data: function () {
    return {
      showBackTop: false
    }
  },
  methods: {
    backTop: function () {
      this.$refs.scroll.scrollTo(0, 0, 300);
    }
  }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}
