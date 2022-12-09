import { Spinner, Alert, Container, Row, Col, Button } from 'react-bootstrap';
import HikeEndpoint from '@components/features/HikeDetails/HikeEndpoint';
import TrackMap from '@components/features/HikeDetails/TrackMap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '@contexts/authContext'
import api from '@services/api';

const UpdateEndpoints = () => {
    const [user] = useContext(AuthContext)

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
        navigate('/hikes');

    const updatePoint = (point) => {
        const updateFunction = point.pointType === 'start' ? setStartPoint : setEndPoint;
        updateFunction((oldPoint) => {
            // Add point to potentialPoints if it was the original one (to put back things as they were)
            if (oldPoint && oldPoint.hasOwnProperty('original')) {
                oldPoint.name = `Old ${oldPoint.pointType} point`;
                setPotentialPoints(potentialPoints => [...potentialPoints, { ...oldPoint, potential: true }]);
            }
            // Remove point from potentialPoints if it is the original one (avoid having it twice on the map)
            if (point.hasOwnProperty('original')) {
                point.name = `${oldPoint.pointType.charAt(0).toUpperCase() + oldPoint.pointType.slice(1)} point`;
                setPotentialPoints(potentialPoints => potentialPoints.filter(p => !p.potential || point.pointType !== p.pointType));
            }
            return point;
        });
    };

    useEffect(() => {

        if (trackUpdated) {
            Promise.all([
                /* Retrieve hike information */
                api.hikes.getHikeDetails(hikeId),
                /* Retrieve huts and parking lots close to start/end point */
                api.hikes.getPotentialPoints(hikeId)
            ])
                .then((results) => {
                    if (results[0].writer.writerId !== user.userId) {
                        navigate('/account/hikes')
                        toast.error('Unauthorized operation', { theme: 'colored' })
                    } else {
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
                        results[0].startPoint.pointType = 'start';
                        results[0].endPoint.pointType = 'end';
                        results[0].startPoint.updatePoint = updatePoint;
                        results[0].endPoint.updatePoint = updatePoint;
                        if (!results[0].startPoint.name)
                            results[0].startPoint.name = "Start point";
                        if (!results[0].endPoint.name)
                            results[0].endPoint.name = "End point";
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
        }
    }, [hikeId, trackUpdated]); // eslint-disable-line

    const savePoints = () => {

        const pointsUpdated = !startPoint.hasOwnProperty('original') || !endPoint.hasOwnProperty('original');

        if (!pointsUpdated)
            return toast.success("Points have been successfully updated", { theme: "colored" });

        const points = {};
        setLoadingUpdate(true);

        if (!startPoint.hasOwnProperty('original'))
            points.newStartPoint = {
                type: startPoint.type,
                id: startPoint.id,
            };
        if (!endPoint.hasOwnProperty('original'))
            points.newEndPoint = {
                type: endPoint.type,
                id: endPoint.id,
            };

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
                    <Link className='d-block mt-3 text-center' to={`/hikes/${hikeId}`}>Return to hike details</Link>
                </Col>
            </Row>
        </Container>
    );

};

export default UpdateEndpoints;