import * as Yup from 'yup'

const ParkingLotSchema = Yup.object().shape({
    parkingLotName: Yup.string().required("You must insert a name"),
    capacity: Yup.number().typeError("Capacity must be a number").integer("Capacity must be an integer").min(0, "Capacity must be at least 0").required("You must insert a capacity"),
    altitude: Yup.string().nullable().matches(/^(0|[1-9]\d*)(\.\d+)?$/, {
        message: "Altitude must be a positive number",
        excludeEmptyString: false
      }),
    point: Yup.object().shape({
        longitude: Yup.number().required(),
        latitude: Yup.number().required()
    })
})

export default ParkingLotSchema