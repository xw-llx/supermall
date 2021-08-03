import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'

export default {
  addCart(context, payload) {
    // payload新添加的商品
    // 数组常用的方法有哪些？push/pop/unshift/shift/sort/reverse/map/filter/reduce/join/
    // 定义一个oldProduct来接收
    // var oldProduct=null
    // for (let item = 0; item < state.cartList; item++) {
    //   if (item.iid===payload.iid) {
    //     oldProduct=item
    //   }
    // } 
    // 1.查找之前数组中是否有该商品
    var oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

    // 2.判断oldProduct是否有值
    // if (oldProduct) {
    //   oldProduct.count+=1
    // } else {
    //   payload.count=1
    //   state.cartList.push(payload)
    // }
    if (oldProduct) {
      // oldProduct.count += 1
      context.commit(ADD_COUNTER, oldProduct)
    } else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART, payload)
    }
  }
}