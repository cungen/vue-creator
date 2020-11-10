import * as Ant from 'ant-design-vue'
import Vue, { VNode } from 'vue'

function rename (name: string) {
    return name + '_'
}

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
            {
                name: Ant.Menu.name,
                children: [Ant.Menu.Item],
                defaultProps: {
                    mode: 'horizontal'
                }
            }, Ant.Menu.Item, Ant.Menu.ItemGroup, Ant.Menu.SubMenu
        ]
    }]
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
