'use-strict'

const e = React.createElement;

function ProgramBlock(props) {
    const [faded, setFaded] = React.useState(true);
    const [expanded, setExpanded] = React.useState(false);

    return (<div className={faded?"fadedprogram":""} onClick={setExpanded(true)} style={{background: props.programcolor, height: props.height + "em" }}>props.title</div>);
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(ProgramBlock), domContainer);