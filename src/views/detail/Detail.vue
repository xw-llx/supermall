<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <ul>
      <li v-for="(item,index) in $store.state.cartList" :key="index">{{item}}</li>
    </ul>
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <!-- 参数 -->
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <!-- 热门推荐(字) -->
      <detail-recommend-info ref="recommend" :recommends="recommends" />
      <!-- 热门推荐(图片) -->
      <goods-list ref="recommends" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";

import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailRecommendInfo from "./childComps/DetailRecommendInfo";

import BackTop from "components/content/backTop/BackTop";
import GoodsList from "components/content/goods/GoodsList";

import { itemListenerMixin } from "common/mixin";
import {BACKTOP_DISTANCE} from 'common/const'

import {
  getDetail,
  getRecommend,
  Goods,
  GoodsParam,
  Shop,
} from "network/detail";

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop: false,
    };
  },
  mixins: [itemListenerMixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailBottomBar,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailRecommendInfo,

    Scroll,
    GoodsParam,
    GoodsList,

    getDetail,
    getRecommend,
    Goods,
    Shop,
    BackTop,
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      // 2.1.获取结果
      const data = res.result;
      // 2.2获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages;

      // 2.3保存商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 2.4创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 2.5.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 2.6.获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 2.7获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // 1.第一次获取,值不对
      // 值不对的原因:this.$refs.params.$el压根没有渲染
      // 第一个默认push0,第二个则是参数的offsetTop
      // 第一个默认push0,第二个则是参数的offsetTop
      // this.themeTopYs.push(参数的offsetTop)
      // this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      //   console.log(this.themeTopYs);

      // this.$nextTick(() => {
      // 2.第二次获取:值依然不对
      // 值依然不对的原因:图片没有计算在内
      // 根据最新的数据,对应的DOM是已经被渲染出来
      // 但是图片依然是没有加载完(目前获取到offsetTop是不包含其中的图片)
      // 每次offsetTop值不对的时候,都是因为图片的问题
      // 第一个默认push0,第二个则是参数的offsetTop
      // this.themeTopYs.push(参数的offsetTop)
      //   this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });

    // 3.请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    // 4.给getThemeTopY赋值(给this.themeTopY赋值的操作进行防抖)
    // this.getThemeTopY = debouce(() => {
    //   this.themeTopYs = [];
    //   this.themeTopYs.push(0);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
    //   console.log(this.themeTopYs);
    // },300);
  },
  mounted() {},
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh();
      // this.getThemeTopY()
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      console.log(this.themeTopYs);
    },
    addToCart() {
      // 1.创建对象
      const obj = {};
      // 2.对象信息
      obj.iid = this.iid;
      obj.imgURL = this.topImages[0];
      obj.title = this.goods.title;
      obj.desc = this.goods.desc;
      obj.newPrice = this.goods.nowPrice;
      // 3.添加到Store中
      this.$store.commit("addCart", obj);
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
      // // 第一个参数表示x第二个参数表示y第三个参数表示时间
      // this.$refs.scroll.scrollTo(0, -this.themeTopys[index], 200);
    },
    contentScroll(position) {
      // console.log(position);
      // 1.获取y值
      const positionY = -position.y;

      // 2.拿positionY跟主题中的值进行对比
      // [0, 2626, 3991, 4253,Number.MAX_VALUE]
      // console.log(Number.MAX_VALUE);

      // positionY在0和2626之间,index=0
      // positionY在2626和3991之间包括=2661,index=1
      // positionY在3991和4253之间包括=3991,index=2
      // positionY在4253和js最大值之间包括=4253,index=3

      // positionY超过4253值或等于4253值时,index=3
      var length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // 这里的positionY大于主题中i的位置且小于主题中i+1的位置
        // if (positionY>this.themeTopYs[i]&&positionY<this.themeTopYs[i+1]) {
        //   console.log(i);
        // }
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex=i
          this.$refs.nav.currentIndex=i
          // this.$refs.nav.currentIndex=this.currentIndex
        }
        // if (this.currentIndex!==i&&((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //   (i === length - 1 && positionY >= this.themeTopYs[i]))) {
        //   this.currentIndex=i
        //   this.$refs.nav.currentIndex=i
        // }
      }

      // 3.是否显示回到顶部
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    addToCart(){
      // console.log('添加购物车');
      // 1.获取购物车需要展示的信息
      const prodult={}
      prodult.image=this.topImages[0]
      prodult.title=this.goods.title
      prodult.desc=this.goods.desc
      prodult.price=this.goods.realPrice
      prodult.iid=this.iid
      // 2.将商品添加到购物车里面
      this.$store.dispatch('addCart',prodult)
    }
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 44px);
}
.back-top {
  position: fixed;
  right: 10px;
  bottom: 65px;
}
</style>