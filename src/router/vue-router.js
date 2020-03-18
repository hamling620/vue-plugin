class HistoryRoutes {
  constructor () {
    this.current = null
  }
}
class VueRouter {
  constructor ({ mode = 'hash', routes = [] }) {
    this.mode = mode
    this.routes = routes

    this.routesMap = this.createMap(this.routes)
    // { '/home': Home } key为path，value为component
    // console.log(this.routesMap)

    // 当前路径
    this.history = new HistoryRoutes()

    // 初始化操作
    this.init()
  }

  createMap (routes) {
    return routes.reduce((memo, current) => {
      memo[current.path] = current.component
      return memo
    }, {})
  }

  init () {
    if (this.mode === 'hash') {
      // 默认跳到#/
      // location.hash ? location.hash : '/'
      if (!location.hash) location.hash = '/'
      window.addEventListener('DOMContentLoaded', () => {
        this.history.current = location.hash.slice(1)
      })
      window.addEventListener('hashchange', () => {
        this.history.current = location.hash.slice(1)
      })
    } else {
      // location.pathname ? location.pathname : '/'
      if (!location.pathname) location.pathname = '/'
      window.addEventListener('DOMContentLoaded', () => {
        this.history.current = location.pathname
      })
      window.addEventListener('popstate', () => {
        this.history.current = location.pathname
      })
    }
  }
}

// 使用Vue.use()就会调用 install方法
VueRouter.install = function (Vue) {
  Vue.mixin({
    beforeCreate () {
      // 定位根组件，只有根组件传入router实例
      if (this.$options && this.$options.router) {
        this._root = this // 把当前实例对象挂载到_root上
        this._router = this.$options.router // 路由实例挂载到_router上

        // Observer
        Vue.util.defineReactive(this, 'xxx', this._router.history)
      } else {
        // 子组件都可以通过_root属性，获取父组件的_root属性
        this._root = this.$parent._root
      }

      // 将$router、$route属性混入到每个组件
      Object.defineProperty(this, '$router', {
        get () {
          return this._root._router
        }
      })
      Object.defineProperty(this, '$route', {
        get () {
          return this._root._router.history.current
        }
      })
    }
  })

  Vue.component('router-link', {
    props: {
      to: String
    },
    render (h) {
      const mode = this._self._root._router.mode
      return h('a', {
        attrs: {
          href: mode === 'hash' ? `#${this.to}` : this.to
        }
      }, this.$slots.default)
    }
  })
  Vue.component('router-view', {
    render (h) {
      const current = this._self._root._router.history.current
      const routesMap = this._self._root._router.routesMap
      // console.log(current)
      // console.log(routesMap)
      // console.log(routesMap[current])
      return h(routesMap[current])
    }
  })
}

export default VueRouter
