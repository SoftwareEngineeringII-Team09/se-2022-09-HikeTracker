import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActivateAccount from './ActivateAccount';
import { createMemoryHistory } from "history";
import { Router } from 'react-router-dom';
import api from '../../services/api';
import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

/* Mocking api and libraries */
jest.mock('../../services/api');
jest.mock("axios");

const mockUserId = 5;
const mockToken = "mockToken12345";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: () => ([{
        get: (param) => {
            const values = {
                token: mockToken,
                id: mockUserId
            }
            return values[param];
        }
    }]),
    useNavigate: () => jest.fn()
}));

describe("<ActivateAccount />", () => {

    const setup = async () => {
        act(() => {
            const route = `/activate?id=${mockUserId}&token=${mockToken}`;
            const history = createMemoryHistory({ initialEntries: [route] });
            render(
                <Router location={history.location} navigator={history}>
                    <ActivateAccount />
                </Router>
            );
        })
    };

    /* Retrieve page elements */
    beforeEach(setup);

    it("Correctly renders loading text and Makes API Call to verify mail on page load", async () => {
        await act(async () => {

            /* Mock api call */
            axios.put.mockResolvedValueOnce({});
            api.users.verifyEmail.mockResolvedValueOnce({});

            /* Find Loading text */
            expect(screen.getByText("Activating account...")).toBeInTheDocument();

            await waitFor(() => {
                /* Check if api call was made */
                expect(api.users.verifyEmail).toHaveBeenCalledTimes(1);
                expect(api.users.verifyEmail).toHaveBeenCalledWith({
                    "userId": mockUserId,
                    "token": mockToken
                });
            });

            /* Check success message is shown */
            await waitFor(async () => {
                expect(await screen.queryByText("Your account has been activated!")).toBeInTheDocument();
            });

            await waitFor(async () => {
                expect(await screen.queryByText("Activating account...")).not.toBeInTheDocument();
            });

        });
    });

});