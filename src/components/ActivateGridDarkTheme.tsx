import React from "react";

interface Props {
    enabled: boolean;
}


/**TODO refactor into functiion component */

/**
 * dark theme helper for grid
 */
export class ActivateGridDarkTheme extends React.Component<Props, Record<string, unknown>> {
    enabled: boolean;
    myRef: any;
    constructor(props: Props) {
        super(props);
        this.enabled = props.enabled;
        this.myRef = React.createRef();
    }

    shouldComponentUpdate(props: any) {
        this.enabled = props.enabled ? true : false;
        return true;
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        if (!this.enabled) {
            let children = this.myRef.current.childNodes;
            while (children.length) {
                children[0]?.parentNode.removeChild(children[0]);
                children = this.myRef.current.childNodes;
            }
        } else {
            this.myRef.current.append(
                document.createTextNode(`
                body,
                .simple-html-grid-menu,
                .simple-html-grid {
                    --simple-html-grid-main-bg-color: #374151;
                    --simple-html-grid-sec-bg-color: #4b5563;
                    --simple-html-grid-alt-bg-color: #4b5563;
                    --simple-html-grid-main-bg-border: #1f2937;
                    --simple-html-grid-sec-bg-border: #1f2937;
                    --simple-html-grid-main-bg-selected: #234882;
                    --simple-html-grid-main-font-color: #f9f7f7;
                    --simple-html-grid-sec-font-color: #979494;
                    --simple-html-grid-dropzone-color: #979494;
                    --simple-html-grid-grouping-border: #1f2937;
                    --simple-html-grid-boxshadow: #4b5563;
                    --simple-html-grid-main-hr-border: #4b5563;
                }
            
                .simple-html-grid ul.dialog-row {
                    box-shadow: none;
                  
                }
                .simple-html-grid li.dialog-row {
        
                    border-left: 1px dotted rgb(100, 100, 100);
                } 
                .simple-html-grid .grid-edit-button {
                    border-color: #374151;
                }
                .simple-html-grid .filter-dialog-bottom-row{
                    border-top: 0px;
                }
                .simple-html-grid-menu{
                    z-index: 50000;
                }
        
                .simple-html-grid .filter-dialog-bottom-row button{
                    border: 1px solid #515458;
                }
                simple-html-grid-filter-dialog ul input{
                    color: var(--simple-html-grid-main-font-color);
                    background-color: var(--simple-html-grid-alt-bg-color);
                }
                simple-html-grid-filter-dialog ul textarea{
                    color: var(--simple-html-grid-main-font-color);
                    background-color: var(--simple-html-grid-alt-bg-color);
                }
        
        `)
            );
        }
    }

    render() {
        return <style ref={this.myRef}></style>;
    }
}
