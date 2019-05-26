import React from 'react';
import DataTypeLabel from './DataTypeLabel';
import { getTextFromHyperlink } from '../../helpers/util';
//theme
import Theme from './../../themes/getStyle';

//attribute store for storing collapsed state
import AttributeStore from './../../stores/ObjectAttributes';

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: AttributeStore.get(
                props.rjvId,
                props.namespace,
                'collapsed',
                true
            )
        };
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        }, () => {
            AttributeStore.set(
                this.props.rjvId,
                this.props.namespace,
                'collapsed',
                this.state.collapsed
            );
        });
    }

    render() {
        const type_name = 'link';
        const { props } = this;
        const { theme, value } = props;
        let style = { style: { cursor: 'default' } };
        const link = value.match(/href="([^"]*)/)[1];
        const string = getTextFromHyperlink(value);
        return (
            <div {...Theme(theme, 'link')}>
                <DataTypeLabel type_name={type_name} {...props} />
                <span
                    className="string-value"
                    {...style}
                    onClick={this.toggleCollapsed}
                >
                    <a href={link}>{string}</a>
                </span>
            </div>
        );
    }
}
