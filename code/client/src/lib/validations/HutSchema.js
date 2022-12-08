import * as Yup from 'yup';

const mobileRegExp = /^(\+[1-9]{1,4}\s?)?[0-9]{3,12}$/;

const HutSchema = Yup.object({
    hutName: Yup.string()
        .max(40, 'Hut name must be 40 characters or less')
        .required("Please provide a name for the hut"),
    city: Yup.number()
        .required("Please select a city").positive("Please select a city").integer(),
    province: Yup.number()
        .required("Please select a province").positive("Please select a province").integer(),
    region: Yup.number()
        .required("Please select a region").positive("Please select a region").integer(),
    numOfBeds: Yup.number()
        .required("Please provide the number of beds for the hut")
        .min(0, "The number of beds must be 0 or higher").integer(),
    cost: Yup.number()
        .required("Please provide the cost per night at the hut")
        .min(0, "The cost must be 0 or higher"),
    altitude: Yup.number()
        .required("Please provide the altitude where the hut is located")
        .min(0, "The altitude must be 0 or higher")
        .max(10000, "The altitude cannot exceed 10000 meters"),
    phone: Yup.string()
        .required('Provide a phone number')
        .matches(mobileRegExp, 'Provide a valid phone number'),
    website: Yup.string().url("Provide a valid website").nullable(),
    email: Yup.string()
        .email('This is not a valid email address')
        .required('Insert your email address'),
});

export default HutSchema;