const TestFeature = () => {

    const testCoverage = () => {
        let number = 0;
        for (let index = 0; index < 10; index++) {
            if (index % 2 === 0) {
                number += index;
            }
        }
        console.log(number);
    };

    return (
        <div>
            <h2>Test coverage</h2>
            <button onClick={testCoverage}>Test coverage</button>
        </div>
    )
}

export default TestFeature