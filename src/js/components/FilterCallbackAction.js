import React from 'react';

import { toType, getTextFromHyperlink } from './../helpers/util';
// import stringifyVariable from './../helpers/stringifyVariable';

//Filter icon
import { FilterIcon } from './icons';

//theme
import Theme from './../themes/getStyle';

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            copied: false
        };
    }

    copiedTimer = null;

    componentWillUnmount() {
        if (this.copiedTimer) {
            clearTimeout(this.copiedTimer);
            this.copiedTimer = null;
        }
    }

    getString(str) {
        if (str.startsWith('<a') && str.endsWith('</a>')) {
            return getTextFromHyperlink(str)
        }
        return str;
    }

    handleSelection = () => {
        const { clickCallback, value, keyName, namespace } = this.props;
        const innerValue = typeof(value) === 'string' ? this.getString(value) : JSON.stringify(
            this.clipboardValue(value),
            null,
            '  '
        );

        this.copiedTimer = setTimeout(() => {
            this.setState({
                copied: false
            });
        }, 5500);

        this.setState({ copied: true }, () => {
            if (typeof clickCallback !== 'function') {
                return;
            }

            clickCallback({
                namespace: namespace,
                key: keyName,
                value: innerValue
            });
        });
    };

    getFilterIcon = () => {
        const { theme } = this.props;

        if (this.state.copied) {
            return (
                <span>
                    <FilterIcon class="copy-icon" {...Theme(theme, 'copy-icon')} />
                    <span {...Theme(theme, 'copy-icon-copied')}>✔</span>
                </span>
            );
        }

        return <FilterIcon class="copy-icon" {...Theme(theme, 'copy-icon')} />;
    }

    clipboardValue = value => {
        const type = toType(value);
        switch (type) {
        case 'function':
        case 'regexp':
            return value.toString();
        default:
            return value;
        }
    }

    render() {
        const { src, theme, hidden } = this.props;
        let style = Theme(theme, 'copy-to-clipboard').style;
        let display = 'inline';

        if (hidden) {
            display = 'none';
        }

        return (
            <span class="copy-to-clipboard-container" title="Filter by value">
                <span
                    style={{
                        ...style,
                        display: display
                    }}
                    onClick={this.handleSelection}
                >
                    {this.getFilterIcon()}
                </span>
            </span>
        );
    }
}
