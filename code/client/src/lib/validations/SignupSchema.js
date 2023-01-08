import * as Yup from 'yup';
import YupPassword from "yup-password";

const roles = [
    { name: "Hiker", requiresAdditionalInfo: false },
    { name: "Local Guide", requiresAdditionalInfo: true },
    { name: "Hut Worker", requiresAdditionalInfo: true },
    { name: "Emergency Operator", requiresAdditionalInfo: true },
];

const rolesRequiringAdditionalInfo = roles.filter((r) => r.requiresAdditionalInfo).map((r) => r.name);
const mobileRegExp = /^(\+[1-9]{1,4}\s?)?\d{3,12}$/;

YupPassword(Yup);

const SignupSchema = Yup.object({
    role: Yup.mixed().oneOf(roles.map(r => r.name)),
    firstname: Yup.string()
        .max(40, 'First name must be 40 characters or less')
        .when("role", {
            is: (r) => rolesRequiringAdditionalInfo.includes(r),
            then: Yup.string().required("Please provide your first name")
        }),
    lastname: Yup.string()
        .max(40, 'Last name must be 40 characters or less')
        .when("role", {
            is: (r) => rolesRequiringAdditionalInfo.includes(r),
            then: Yup.string().required("Please provide your last name")
        }),
    mobile: Yup.string()
        .matches(mobileRegExp, 'Provide a valid mobile number')
        .when("role", {
            is: (r) => rolesRequiringAdditionalInfo.includes(r),
            then: Yup.string().required("Please provide your mobile number")
        }),
    email: Yup.string()
        .email('This is not a valid email address')
        .required('Insert your email address'),
    password: Yup.string()
        .password()
        .required('Insert your password'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
});

export default SignupSchema;