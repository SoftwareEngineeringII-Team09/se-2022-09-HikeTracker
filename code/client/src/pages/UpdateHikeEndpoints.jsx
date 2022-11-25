import { HikeEndpoint } from '@components/features/HikeDetails/HikeEndpoint';
import { TrackMap } from '@components/features/HikeDetails/TrackMap';
import { useParams, useEffect } from 'react-router-dom';
import api from '@services/api';

const UpdateHikeEndpoints = () => {

    // Get the hike id from the url
    const { hikeId } = useParams();

    const [hike, setHike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [potentialPoints, setPotentialPoints] = useState([]);

    useEffect(() => {

        Promise.all([
            /* Retrieve hike information */
            getHikeDetails(hikeId),
            /* Retrieve huts and parking lots close to start/end point */
            api.hikes.getPotentialPoints(hikeId),
        ])
            .then((results) => {
                setHike(results[0]);
                setPotentialPoints(
                    /* Add type "start" or "end" to each point */
                    results[1].potentialStartPoints.map((point) => ({ ...point, type: 'start' }))
                        .join(results[1].potentialEndPoints.map((point) => ({ ...point, type: 'end' })))
                );
                setStartPoint(results[0].startPoint);
                setEndPoint(results[0].endPoint);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [hikeId]);


    /* Get closest huts and parking lots to the start/end points */

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Update start and end point</h1>
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <TrackMap start={startPoint} end={endPoint} track={hike.track} />
                </Col>
                <Col xs={6}>
                    <h2>{hike.name}</h2>
                    <HikeEndpoint point={startPoint} type="Start"/>
                    <HikeEndpoint point={endPoint} type="End"/>
                </Col>
        </Container>
    );

};

export default UpdateHikeEndpoints;