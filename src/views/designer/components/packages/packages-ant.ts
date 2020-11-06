import * as Ant from 'ant-design-vue'

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
            {
                name: Ant.Breadcrumb.Item.name
            }
        ]
    }]
}
