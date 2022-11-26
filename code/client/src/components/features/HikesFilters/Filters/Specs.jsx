import { Row, Col } from 'react-bootstrap'

import { Input } from '@components/form'

const Specs = () => (
    <div className="mb-5">
        {[
            { label: "Length", ref: "length", unit: "kms" },
            { label: "Total Ascent", ref: "totalAscent", unit: "meters" },
            { label: "Expected Time", ref: "expectedTime", unit: "hours" }
        ].map((item, idx) => (
            <div key={idx} className="mb-5">
                <h4 className="fw-bold mb-3">
                    {item.label}
                    <span className="h6">{" "}in {item.unit}</span>
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