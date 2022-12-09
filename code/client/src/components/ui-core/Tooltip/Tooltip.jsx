import { OverlayTrigger, Tooltip as Tip } from "react-bootstrap"

const Tooltip = ({ placement = "top", tip, children }) => {
    return (
        <OverlayTrigger placement={placement}
            overlay={
                <Tip>{tip}</Tip>
            }
        >
            {children}
        </OverlayTrigger>
    )
}

export default Tooltip