import { Check } from '@components/form'

const Difficulty = () => (
    <div className="mb-5">
        <h4 className="fw-bold mb-3">Difficulty</h4>
        {[
            { label: "Tourist", ref: "tourist" },
            { label: "Hiker", ref: "hiker" },
            { label: "Professional Hiker", ref: "professional" },
        ].map((item) => (
            <Check key={`difficulty-${item.label}`} id={`${item.ref}-difficulty`} name={`difficulty.${item.ref}`} label={item.label} />
        ))}
    </div>
)

export default Difficulty