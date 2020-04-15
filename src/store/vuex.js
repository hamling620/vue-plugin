let Vue // 保存Vue构造函数

// 遍历方法
const forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key])
  })
}

// 模块收集
class ModuleCollections {
  constructor (options) {
    this.register([], options)
  }

  register (path, rootModule) {
    const newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    }

    if (!path.length) {
      this.root = newModule
    } else {
      const parent = path.slice(0, -1).reduce((root, current) => {
        return this.root._children[current]
      }, this.root)
      parent._children[path[path.length - 1]] = newModule
    }

    if (rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
}

// Store类
class Store {
  constructor (options) {
    this._vm = new Vue({
      data: {
        state: options.state
      }
    })

    const getters = options.getters || {}
    this.getters = {}
    forEach(getters, (key, fn) => {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return fn(this.state)
        }
      })
    })

    const mutations = options.mutations || {}
    this.mutations = {}
    forEach(mutations, (key, fn) => {
      // 把传递过来的mutations绑定的store实例上
      this.mutations[key] = playload => {
        fn.call(this, this.state, playload)
      }
    })

    const actions = options.actions || {}
    this.actions = {}
    forEach(actions, (key, fn) => {
      this.actions[key] = playload => {
        fn.call(this, this, playload)
      }
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)

    // 收集模块
    this.modules = new ModuleCollections(options)
    console.log(this.modules)
  }

  commit (type, playload) {
    this.mutations[type](playload)
  }

  dispatch (type, playload) {
    this.actions[type](playload)
  }

  get state () {
    return this._vm.state
  }
}

// 插件install方法
const install = _Vue => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      // 给每个Vue组件实例添加$store属性
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

export default {
  install,
  Store
}
