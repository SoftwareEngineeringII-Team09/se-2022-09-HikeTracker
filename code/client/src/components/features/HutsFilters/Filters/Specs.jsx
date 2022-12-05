import { Row, Col } from 'react-bootstrap'

import { Input } from '@components/form'

const Specs = () => (
    <div className="mb-5">
        {[
            { label: "Altitude", ref: "altitude", unit: "meters" },
            { label: "Cost per night", ref: "cost", unit: "euros" },
            { label: "Number of beds", ref: "beds", unit: "" }
        ].map((item, idx) => (
            <div key={idx} className="mb-5">
                <h4 className="fw-bold mb-3">
                    {item.label}
                    <span className="h6">{" "}{item.unit != '' && 'in ' + item.unit}</span>
                </h4>
                <Row className="row">
                    <Col xs={6} >
                        <Input id={`min-${item.ref}`} name={`${item.ref}.min`} type="number" label={`Min ${item.label}`} />
                    </Col>
                    <Col xs={6} >
                        <Input id={`max-${item.ref}`} name={`${item.ref}.max`} type="number" label={`Max ${item.label}`} />
                    </Col>
                </Row>
            </div>
        ))}
    </div>
)

export default Specs