import * as Ant from 'ant-design-vue'
import Vue, { VNode } from 'vue'

function rename (name: string) {
    return name + '_'
}

Vue.component(rename(Ant.Dropdown.name), {
    name: rename(Ant.Dropdown.name),
    props: {
        placeholder: {
            type: String,
            default: 'Hover me'
        },
        isButton: Boolean
    },
    render (h): VNode {
        return h(Ant.Dropdown.name, [
            h(this.isButton ? 'a-button' : 'a', {
                class: ['ant-dropdown-link'],
                attrs: {
                    href: 'javascript:;'
                }
            }, [this.placeholder, h('a-icon', {
                attrs: {
                    type: 'down'
                }
            })]),
            h('a-menu', {
                slot: 'overlay'
            }, new Array(3).fill(0).map((item, i) => {
                return h('a-menu-item', [
                    h('a', {
                        attrs: {
                            href: 'javascript:;'
                        }
                    }, 'menu ' + i)
                ])
            }))
        ])
    }
})

Vue.component(rename(Ant.Menu.name), {
    name: rename(Ant.Dropdown.name),
    props: {
        isVertical: Boolean,
        menus: String
    },
    data () {
        return {
            selected: ['0'] as string[]
        }
    },
    render (h): VNode {
        return h(Ant.Menu.name, {
            attrs: {
                mode: this.isVertical ? 'vertical' : 'horizontal'
            },
            props: {
                defaultSelectedKeys: this.selected
            }
        }, (this.menus ? this.menus.split(',') : new Array(3).fill(0)).map((item, i) => {
            return h('a-menu-item', {
                attrs: {
                    key: String(i)
                }
            }, i === 0 ? [h('a-icon', { attrs: { type: 'appstore' } }), item || 'menu ' + i] : [item || 'menu ' + i])
        }))
    }
})

Vue.component(rename(Ant.Steps.name), {
    name: rename(Ant.Steps.name),
    props: {
        isVertical: Boolean,
        steps: String,
        isDot: Boolean,
        current: {
            type: Number,
            default: 1
        },
        size: String,
        status: String
    },
    render (h): VNode {
        return h(Ant.Steps.name, {
            attrs: {
                direction: this.isVertical ? 'vertical' : 'horizontal',
                size: this.size,
                status: this.status,
                'progress-dot': this.isDot
            },
            props: {
                current: this.current
            }
        }, (this.steps ? this.steps.split(',') : new Array(3).fill(0)).map((item, i) => {
            return h('a-step', {
                attrs: {
                    title: item || 'Title ' + i,
                    description: 'description ' + i,
                    subTitle: i === 1 ? '00:01:02' : ''
                }
            })
        }))
    }
})

Vue.component(rename(Ant.Cascader.name), {
    name: rename(Ant.Cascader.name),
    props: {
        options: Object,
        size: String,
        suffixIcon: String
    },
    render (h): VNode {
        return h(Ant.Cascader.name, {
            props: {
                size: this.size,
                // eslint-disable-next-line
                options: this.options || [{ value: 'zhejiang', label: 'Zhejiang', children: [{ value: 'hangzhou', label: 'Hangzhou', children: [{ value: 'xihu', label: 'West Lake' }]}]}, { value: 'jiangsu', label: 'Jiangsu', children: [{ value: 'nanjing', label: 'Nanjing', children: [{ value: 'zhonghuamen', label: 'Zhong Hua Men', }]}]}]
            },
            scopedSlots: {
                ...(this.suffixIcon ? {
                    suffixIcon: () => {
                        return h('a-icon', {
                            props: {
                                type: this.suffixIcon
                            }
                        })
                    }
                } : {})
            }
        })
    }
})

Vue.component(rename(Ant.Mentions.name), {
    name: rename(Ant.Mentions.name),
    props: {
        peoples: String,
        tags: String,
        placeholder: String
    },
    data () {
        return {
            prefix: '@' as string
        }
    },
    render (h): VNode {
        const MOCK_DATA = {
            '@': this.peoples ? this.peoples.split(',') : ['afc163', 'zombiej', 'yesmeck'],
            '#': this.tags ? this.tags.split(',') : ['1.0', '2.0', '3.0']
        } as { [key: string]: string[] }

        return h(Ant.Mentions.name, {
            attrs: {
                placeholder: this.placeholder || 'input @ to mention people, # to mention tag'
            },
            props: {
                prefix: ['@', '#']
            },
            on: {
                search: (_: string, prefix: string) => {
                    this.prefix = prefix
                }
            }
        }, (MOCK_DATA[this.prefix] || []).map((item): VNode => {
            return h(Ant.Mentions.Option.name, {
                props: {
                    value: item
                }
            }, item)
        }))
    }
})

Vue.component(rename(Ant.Select.name), {
    name: rename(Ant.Select.name),
    props: {
        size: String,
        mode: String,
        defaultValue: String,
        placeholder: String
    },
    render (h): VNode {
        return h(Ant.Select.name, {
            attrs: {
                placeholder: this.placeholder || 'Please Select',
                mode: this.mode,
                style: 'min-width: 120px'
            },
            props: {
                size: this.size,
                defaultValue: this.defaultValue
            }
        }, ((new Array(3).fill(0)).map((item, i): VNode => {
            return h(Ant.Select.Option.name, {
                props: {
                    value: String(i)
                }
            }, 'Option ' + i)
        })))
    }
})

export default {
    name: 'Ant Design',
    children: [{
        name: 'General',
        children: [{
            name: Ant.Button.name,
            defaultProps: { type: 'primary' }
        }, {
            name: Ant.Icon.name,
            noSlot: true,
            defaultProps: { type: 'user' }
        }]
    }, {
        name: 'Layout',
        children: [{
            name: Ant.Row.name,
            defaultProps: { gutter: 10 }
        }, {
            name: Ant.Col.name,
            defaultProps: { span: 8 }
        }, Ant.Layout, Ant.Layout.Header, Ant.Layout.Content, Ant.Layout.Footer, Ant.Layout.Sider
        ]
    }, {
        name: 'Navigation',
        children: [
            Ant.Affix,
            {
                name: Ant.Breadcrumb.name,
                children: [Ant.Breadcrumb.Item]
            },
            { name: Ant.Breadcrumb.Item.name },
            { name: rename(Ant.Dropdown.name) },
            { name: rename(Ant.Menu.name) },
            {
                name: Ant.PageHeader.name,
                slots: ['default', 'title', 'subTitle', 'backIcon', 'extra', 'footer']
            },
            Ant.Pagination,
            { name: rename(Ant.Steps.name) }
        ]
    }, {
        name: 'Data Entry',
        children: [
            Ant.AutoComplete,
            { name: rename(Ant.Cascader.name), slots: ['suffixIcon'] },
            Ant.Checkbox,
            Ant.FormModel,
            Ant.FormModel.Item,
            Ant.Input, Ant.InputNumber, Ant.Radio,
            { name: rename(Ant.Mentions.name) },
            { name: Ant.Rate.name },
            { name: rename(Ant.Select.name) },
            Ant.Slider,
            Ant.Switch,
            Ant.TimePicker,
            Ant.Transfer
        ]
    }, {
        name: 'Data Display',
        children: [
            Ant.Avatar,
            Ant.Badge,
            { name: Ant.Card.name, slots: ['default', 'title', 'extra', 'actions'] },
            Ant.Card.Grid,
            { name: Ant.Carousel.name, slots: ['default'] },
            Ant.Empty
        ]
    }]
}
