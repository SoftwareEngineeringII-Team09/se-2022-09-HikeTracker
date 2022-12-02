import { Row, Col } from 'react-bootstrap'
import { useFormikContext } from "formik"

import { __REGIONS, getProvincesForRegion, getCitiesForProvince } from '@lib/helpers/location'
import { Select } from '@components/form'

const Location = () => {
    const { values } = useFormikContext()
    const { region, province } = values.geoArea.location

    return (
        <Row className="mb-5">
            <Col xs={12} lg={4} className="mb-3">
                <Select id="location-region" name="geoArea.location.region" label="Region" defaultLabel="Leave this field empty">
                    {__REGIONS.map(r => (
                        <option key={r.regione} value={r.regione}>{r.nome}</option>
                    ))}
                </Select>
            </Col>
            <Col xs={12} lg={4} className="mb-3">
                <Select id="location-province" name="geoArea.location.province" label="Province" defaultLabel="Leave this field empty" disabled={!parseInt(region)}>
                    {getProvincesForRegion(parseInt(region)).map(p => (
                        <option key={p.provincia} value={p.provincia}>{p.nome}</option>
                    ))}
                </Select>
            </Col>
            <Col xs={12} lg={4} className="mb-3">
                <Select id="location-city" name="geoArea.location.city" label="City" defaultLabel="Leave this field empty" disabled={!parseInt(province)}>
                    {getCitiesForProvince(parseInt(province))
                        .map(c => (
                            <option key={c.comune} value={c.comune}>{c.nome}</option>
                        ))}
                </Select>
            </Col>
        </Row>
    )
}

export default Location