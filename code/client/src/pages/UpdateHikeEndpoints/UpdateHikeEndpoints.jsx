import { Spinner, Alert, Container, Row, Col, Button } from 'react-bootstrap';
import HikeEndpoint from '@components/features/HikeDetails/HikeEndpoint';
import TrackMap from '@components/features/HikeDetails/TrackMap';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '@services/api';

const UpdateHikeEndpoints = () => {

    // Get the hike id from the url
    const { hikeId } = useParams();
    const navigate = useNavigate();

    const [hike, setHike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [potentialPoints, setPotentialPoints] = useState([]);
    const [error, setError] = useState(false);
    const [trackUpdated, setTrackUpdated] = useState(true);

    if (!hikeId)
        navigate('/browse');

    const updatePoint = (point) => {
        if (point.pointType === 'start')
            setStartPoint(point);
        else
            setEndPoint(point);
    };

    useEffect(() => {

        Promise.all([
            /* Retrieve hike information */
            api.hikes.getHikeDetails(hikeId),
            /* Retrieve huts and parking lots close to start/end point */
            api.hikes.getPotentialPoints(hikeId)
        ])
            .then((results) => {
                if (trackUpdated) {
                    setHike(results[0]);
                    const potentialStartPoints = results[1].potentialStartPoints.map((point) => ({ ...point, pointType: 'start', updatePoint }))
                    const potentialEndPoints = results[1].potentialEndPoints.map((point) => ({ ...point, pointType: 'end', updatePoint }))
                    setPotentialPoints(
                        /* Add type "start" or "end" to each point */
                        potentialStartPoints.concat(potentialEndPoints)
                    );
                    /* Set initial start/end points */
                    results[0].startPoint.original = true;
                    results[0].endPoint.original = true;
                    setStartPoint(results[0].startPoint);
                    setEndPoint(results[0].endPoint);
                }
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setTrackUpdated(false);
                setLoading(false);
            });
    }, [hikeId, trackUpdated]);

    const savePoints = () => {

        const pointsUpdated = !startPoint.hasOwnProperty('original') || !endPoint.hasOwnProperty('original');

        if (!pointsUpdated)
            return toast.success("Points have been successfully updated", { theme: "colored" });

        const points = {};
        setLoadingUpdate(true);

        if (!startPoint.hasOwnProperty('original'))
            points.newStartPoint = startPoint;
        if (!endPoint.hasOwnProperty('original'))
            points.newEndPoint = endPoint;

        api.hikes.updateHikeEndpoints(hikeId, points)
            .then(() => {
                toast.success("Points have been successfully updated", { theme: "colored" });
                setTrackUpdated(true);
            })
            .catch((error) => {
                toast.error(error, { theme: "colored" });
            })
            .finally(() => {
                setLoadingUpdate(false);
            });
    };

    if (loading)
        return <Spinner />;

    if (error)
        return <Alert variant='danger'>
            There has been a problem loading the hike: {error}
            <Button className='d-block mt-3' variant="light" onClick={() => navigate(-1)}>Go back</Button>
        </Alert>;


    return (
        <Container>
            <Row>
                <Col>
                    <h1>Update start and end point</h1>
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <TrackMap start={startPoint} end={endPoint} track={hike.track} potentials={potentialPoints} />
                </Col>
                <Col xs={6} className="update-endpoints">
                    <h2>{hike.name}</h2>
                    <HikeEndpoint point={startPoint} type="Start" />
                    <HikeEndpoint point={endPoint} type="End" />
                    <Button variant="primary-dark" size='lg' className="py-3 fw-bold w-100 my-3" onClick={savePoints} disabled={loadingUpdate}>
                        {loadingUpdate ? <Spinner /> : "Save points"}
                    </Button>
                    <NavLink className='d-block mt-3 text-center' onClick={() => navigate(-1)}>Return to hike details</NavLink>
                </Col>
            </Row>
        </Container>
    );

};

export default UpdateHikeEndpoints;