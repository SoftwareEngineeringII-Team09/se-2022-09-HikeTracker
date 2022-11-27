import * as Yup from 'yup'

const ParkingLotSchema = Yup.object().shape({
    parkingLotName: Yup.string().required("You must insert a name"),
    point: Yup.object().shape({
        longitude: Yup.number().required(),
        latitude: Yup.number().required(),
        // altitude: Yup.number().required()
    })
})

export default ParkingLotSchema