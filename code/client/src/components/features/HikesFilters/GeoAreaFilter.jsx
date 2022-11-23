import { Form } from "react-bootstrap"

import { helperLocation } from '@lib/helpers'

const GeoAreaFilter = ({ location, setProvince, setCity }) => {
    return (
        <div className="mb-5">
            <h4 className="mb-3">Geographic area</h4>
            <div className="d-lg-flex">
                <div className={`w-100 me-3 mb-3`}>
                    <h6>Province</h6>
                    <Form.Select data-testid="province-select" defaultValue={location.province} onChange={(e) => setProvince(parseInt(e.target.value))} className="p-3 border-0 bg-base-light">
                        <option value={0}>Select a provice</option>
                        {helperLocation.provinces.map(province => (
                            <option key={province.istat_provincia} value={province.istat_provincia}>{province.provincia}</option>
                        ))}
                    </Form.Select>
                </div>
                <div className={`w-100 mb-3 ${!location.province ? "opacity-50" : "opacity-100"}`}>
                    <h6>City</h6>
                    <Form.Select data-testid="city-select" defaultValue={location.city} disabled={!location.province} onChange={(e) => setCity(parseInt(e.target.value))} className="p-3 border-0 bg-base-light">
                        <option value={0}>I want to leave this field empty</option>
                        {helperLocation.getCitiesForProvince(location.province).map(city => (
                            <option key={city.codiceistatcomune} value={city.codiceistatcomune}>{city.comune}</option>
                        ))}
                    </Form.Select>
                </div>
            </div>
        </div>
    )
}

export default GeoAreaFilter