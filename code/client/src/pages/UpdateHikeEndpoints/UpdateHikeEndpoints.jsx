import { Spinner, Alert, Container, Row, Col, Button } from 'react-bootstrap';
import HikeEndpoint from '@components/features/HikeDetails/HikeEndpoint';
import TrackMap from '@components/features/HikeDetails/TrackMap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '@services/api';

const UpdateHikeEndpoints = () => {

    // Get the hike id from the url
    const [searchParams] = useSearchParams();
    const hikeId = searchParams.get("hikeId");
    const navigate = useNavigate();

    const [hike, setHike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [potentialPoints, setPotentialPoints] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {

        Promise.all([
            /* Retrieve hike information */
            api.hikes.getHikeDetails(hikeId),
            /* Retrieve huts and parking lots close to start/end point */
            // api.hikes.getPotentialPoints(hikeId),
        ])
            .then((results) => {
                console.log(results[0].hike.startPoint)
                console.log(results[0].hike.endPoint)
                setHike(results[0].hike);
                // setPotentialPoints(
                //     /* Add type "start" or "end" to each point */
                //     results[1].potentialStartPoints.map((point) => ({ ...point, type: 'start' }))
                //         .join(results[1].potentialEndPoints.map((point) => ({ ...point, type: 'end' })))
                // );
                /* Set initial start/end points */
                results[0].hike.startPoint.original = true;
                results[0].hike.endPoint.original = true;
                setStartPoint(results[0].hike.startPoint);
                setEndPoint(results[0].hike.endPoint);
            })
            .catch((error) => {
                console.log(error);
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [hikeId]);

    const updatePoint = (point) => {
        if (point.type === 'start')
            setStartPoint(point);
        else
            setEndPoint(point);
    };

    const savePoints = () => {
        const points = {};
        if (!startPoint.hasOwnProperty('original'))
            points.startPoint = startPoint;
        if (!endPoint.hasOwnProperty('original'))
            points.endPoint = endPoint;
        api.hikes.updateHikeEndpoints(hikeId, points)
            .then(() => {
                toast.success("Points have been successfully updated", { theme: "colored" });
            })
            .catch((error) => {
                toast.success("There has been a problem saving the points, try again", { theme: "colored" });
                console.log(error);
            });
    };

    if (!hikeId)
        navigate('/browse');

    if (loading)
        return <Spinner />;

    if (error)
        return <Alert variant='danger'>There has been a problem loading the hike</Alert>;

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Update start and end point</h1>
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <TrackMap start={startPoint} end={endPoint} track={hike.track} pins={potentialPoints}/>
                </Col>
                <Col xs={6}>
                    <h2>{hike.name}</h2>
                    <HikeEndpoint point={startPoint} type="Start" />
                    <HikeEndpoint point={endPoint} type="End" />
                    <Button className="d-block mx-auto my-3" onClick={savePoints}>Save points</Button>
                </Col>
            </Row>
        </Container>
    );

};

export default UpdateHikeEndpoints;