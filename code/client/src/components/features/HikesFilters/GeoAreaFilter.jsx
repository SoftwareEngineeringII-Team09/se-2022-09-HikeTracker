import { Form } from "react-bootstrap"

import provinces from '@data/provinces'
import cities from '@data/cities'

const GeoAreaFilter = ({ location, setProvince, setCity, setRadius }) => {
    return (
        <div className="mb-5">
            <h4 className="mb-3">Geographic area</h4>
            <div className="d-lg-flex">
                <div className={`w-100 me-3 mb-3 ${location.radius ? "opacity-50" : "opacity-100"}`}>
                    <h6>Province</h6>
                    <Form.Select defaultValue={location.province} onChange={(e) => setProvince(parseInt(e.target.value))} className="p-3 border-0 bg-base-light" disabled={location.radius}>
                        <option value={0}>Select a provice</option>
                        {provinces.map(province => (
                            <option key={province.istat_provincia} value={province.istat_provincia}>{province.provincia}</option>
                        ))}
                    </Form.Select>
                </div>
                <div className={`w-100 mb-3 ${!location.province ? "opacity-50" : "opacity-100"}`}>
                    <h6>City</h6>
                    <Form.Select defaultValue={location.city} disabled={!location.province || location.radius} onChange={(e) => setCity(parseInt(e.target.value))} className="p-3 border-0 bg-base-light">
                        <option value={0}>I want to leave this field empty</option>
                        {cities.filter(city => city.istat_provincia === location.province).map(city => (
                            <option key={city.codiceistatcomune} value={city.codiceistatcomune}>{city.comune}</option>
                        ))}
                    </Form.Select>
                </div>
            </div>
            {/* <div className={`w-100 mt-3 ${province || city ? "opacity-50" : "opacity-100"}`}>
                <h6>
                    Radius from current position{" "}
                    ({radius} km)
                </h6>
                <Form.Range defaultValue={radius} onChange={(e) => setRadius(e.currentTarget.value / 5)} className="w-50" disabled={province || city} />
            </div> */}
        </div>
    )
}

export default GeoAreaFilter