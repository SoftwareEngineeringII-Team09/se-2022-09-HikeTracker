import { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik'

import { Select, Input, File, LoadingButton } from '@components/form'
import { HikeSchema } from "@lib/validations"

import regions from '@data/locations/regioni'
import provinces from '@data/locations/province'
import cities from '@data/locations/comuni'

import api from '@services/api';

const AddHike = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const handleSubmit = useCallback((values) => {
        setLoading(true);
        const data = new FormData();
        data.append('gpx', values.gpx);
        data.append('title', values.title);
        data.append('region', values.region);
        data.append('province', values.province);
        data.append('city', values.city);
        data.append('expectedTime', values.expectedTime);
        data.append('difficulty', values.difficulty);
        data.append('description', values.description);
        data.append('hikeImage', values.image);

        api.hikes.createHike(data)
            .then((res) => {
                // Success message
                toast.success("Hike created successfully", {
                    theme: "colored"
                });
                // Redirect to the newly created hike
                navigate(`/account/hikes/${res.hikeId}/update/reference-points`);
            })
            .catch((error) => {
                toast.error(error, {
                    theme: "colored",
                });
            })
            .finally(() => setLoading(false))
    }, [navigate]);

    const initialValues = {
        title: "",
        region: 0,
        province: 0,
        city: 0,
        expectedTime: "",
        difficulty: "",
        description: "",
        gpx: "",
        image: ""
    };

    return (

        <div className='my-5'>
            <div className='mb-4'>
                <h1 className="fw-bold">Add a new hike</h1>
                <p>Add a new hike so that hiker can see its info and start it when he want.</p>
            </div>
            <Formik className="my-2" initialValues={initialValues} validationSchema={HikeSchema} onSubmit={(values) => handleSubmit(values)}>
                {({ values, setFieldValue }) => {
                    return (<Form data-testid="hike-form">
                        <Input id="title" name="title" type="text" label="Title" placeholder="Hike title" className="mb-3" />
                        <Select id="region" name="region" defaultLabel="Select a region" label="Region" className="mb-3">
                            {regions.map(region => (
                                <option key={region.regione} value={region.regione}>{region.nome}</option>
                            ))}
                        </Select>
                        <Select id="province" name="province" defaultLabel="Select a province" label="Province" className="mb-3">
                            {provinces.filter(province => province.regione === Number(values.region)).map(province => (
                                <option key={province.provincia} value={province.provincia}>{province.nome}</option>
                            ))}
                        </Select>
                        <Select id="city" name="city" defaultLabel="Select a city" label="City" className="mb-3">
                            {cities.filter(city => city.provincia === Number(values.province)).map(city => (
                                <option key={city.comune} value={city.comune}>{city.nome}</option>
                            ))}
                        </Select>

                        <Input id="expectedTime" name="expectedTime" type="number" label="Expected time (minutes)" placeholder="240" min="1" className="mb-3" />

                        <Select id="difficulty" name="difficulty" defaultLabel="Select a difficulty" label="Difficulty" className="mb-3">
                            {["Tourist", "Hiker", "Professional hiker"].map((difficulty, idx) => (
                                <option key={`difficulty-${idx}`} value={difficulty}>{difficulty}</option>
                            ))}
                        </Select>

                        <Input id="description" name="description" as="textarea" label="Description" placeholder="An amazing hike..." className="mb-3" />

                        <File id="gpx" name="gpx" type="file" accept=".gpx" label="Select your gpx file" className="mb-3" onChange={(e) => {
                            setFieldValue('gpx', e.currentTarget.files[0])
                        }} />
                        <File id="image" name="image" type="file" accept="image/*" label="Cover image" className="mb-3" onChange={(e) => {
                            setFieldValue('image', e.currentTarget.files[0])
                        }} />

                        <LoadingButton type="submit" text="Create new hike" loading={loading} />
                    </Form>
                    )
                }}
            </Formik>
        </div>
    );
}

export default AddHike;