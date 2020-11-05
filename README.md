# vue-creator

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## TODO

- [ ] 编辑器
    - [x] 组件列表
        - 布局组件
        - 功能组件
        - [x] 父子组件关系
        - [ ] 支持配置默认属性
        - [ ] 添加2级分组
    - [ ] playground
        - [x] 组件线框实现方式重构
        - [x] drop-area怎么作为有限制的子组件
        - [x] [A]调整操作的展示位置，使其不影响组件展示
        - [x] hover的时候才展示线框
        - [ ] [A]优化drop-area展示
        - [ ] 父子组件依赖：只能拖动子组件到内部，在内部默认展示子组件作为slot
        - [ ] 激活热区，支持双击添加组件
        - [ ] 可以在拖动到组件上后，展示一个slot列表让选择添加到哪个slot中
    - [ ] 属性编辑器
        - [x] 属性还原
        - [ ] 对有validator的属性添加验证，通过验证的才赋值给组件

- [ ] 易用性
    - [ ] 大部分的场景应该是布局，而不是完成尽可能多的代码
    - [ ] 基于上面的场景，大部分情况下，拖动父组件时，希望子组件也处于连动OK的状态

- 商店
    - 上传组件
        - git地址
        - zip包
    - 预览组件
    - 增删改