import * as Yup from 'yup'

import { __REGIONS, getProvincesForRegion, getCitiesForProvince } from '@lib/helpers/location'

const HikeSchema = Yup.object().shape({
    title: Yup.string().required(),
    region: Yup.number().oneOf(
        [...Object.values(__REGIONS)
            .map(reg => reg.regione)],
        "Value must match with one of selectable ones").integer().required(),
    province: Yup.number().test('Province is within the selected region', 'Value must match with one of selectable ones',
        (value, ctx) => (
            getProvincesForRegion(ctx.parent.region)
                .map(p => p.provincia)
                .includes(value))
    ).integer().required(),
    city: Yup.number().test('City is within the selected province', 'Value must match with one of selectable ones',
        (value, ctx) => (
            getCitiesForProvince(ctx.parent.province)
                .map(c => c.comune)
                .includes(value))
    ).integer().required(),
    expectedTime: Yup.mixed(),
    difficulty: Yup.string().oneOf(
        ["Tourist", "Hiker", "Professional hiker"],
        "Value must match with one of selectable ones").required(),
    description: Yup.string().required(),
    gpx: Yup.mixed().required(),
    image: Yup.mixed().required()
        .test('fileFormat', 'Provide a valid image', (value) => {
            if (!value) return false;
            const format = value.split('.').pop();
            return ['jpg', 'jpeg', 'gif', 'png'].includes(format);
})
})

export default HikeSchema;