import { render, screen, waitFor } from '@testing-library/react'
const { createMemoryHistory } = require("history");
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import ActivateAccount from './ActivateAccount'

describe("<ActivateAccount />", () => {

    let initialText;

    const setup = async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <ActivateAccount />
            </Router>
        );
        initialText = screen.getByText("Activating account...");
    };

    /* Retrieve page elements */
    beforeEach(setup);

    it("Correctly renders loading text", async () => {
        /* Loading text */
        expect(initialText).toBeInTheDocument();
    });

});