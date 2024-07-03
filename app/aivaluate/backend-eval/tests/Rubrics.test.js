import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Rubrics from './Rubrics';

jest.mock('@klarr-agency/circum-icons-react', () => {
    return {
        CircumIcon: ({ name }) => <div>{name}</div>
    };
});

jest.mock('../components/AIvaluateNavBarEval', () => {
    return () => <div>NavBar</div>;
});

jest.mock('../components/SideMenuBarEval', () => {
    return () => <div>SideMenu</div>;
});

beforeEach(() => {
    fetch.resetMocks();
});

const mockCourseDetails = { courseCode: 'CS101', courseName: 'Intro to Computer Science' };
const mockRubrics = [
    { criteria: 'Rubric 1' },
    { criteria: 'Rubric 2' },
    { criteria: 'Rubric 3' },
    { criteria: 'Rubric 4' },
    { criteria: 'Rubric 5' },
    { criteria: 'Rubric 6' },
    { criteria: 'Rubric 7' },
];

test('renders Rubrics component', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockCourseDetails));
    fetch.mockResponseOnce(JSON.stringify(mockRubrics));

    render(
        <BrowserRouter>
            <Rubrics />
        </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Your Rubrics')).toBeInTheDocument());
    expect(screen.getByText('NavBar')).toBeInTheDocument();
    expect(screen.getByText('SideMenu')).toBeInTheDocument();
});

test('fetches and displays course details and rubrics', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockCourseDetails));
    fetch.mockResponseOnce(JSON.stringify(mockRubrics));

    render(
        <BrowserRouter>
            <Rubrics />
        </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('CS101 - Intro to Computer Science')).toBeInTheDocument());
    mockRubrics.slice(0, 6).forEach(rubric => {
        expect(screen.getByText(rubric.criteria)).toBeInTheDocument();
    });
});

test('searches and filters rubrics', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockCourseDetails));
    fetch.mockResponseOnce(JSON.stringify(mockRubrics));

    render(
        <BrowserRouter>
            <Rubrics />
        </BrowserRouter>
    );

    await waitFor(() => screen.getByPlaceholderText('Search...'));

    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Rubric 1' } });

    await waitFor(() => expect(screen.getByText('Rubric 1')).toBeInTheDocument());
    expect(screen.queryByText('Rubric 2')).not.toBeInTheDocument();
});

test('paginates rubrics', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockCourseDetails));
    fetch.mockResponseOnce(JSON.stringify(mockRubrics));

    render(
        <BrowserRouter>
            <Rubrics />
        </BrowserRouter>
    );

    await waitFor(() => screen.getByText('Page 1 of 2'));

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => screen.getByText('Page 2 of 2'));

    mockRubrics.slice(6, 7).forEach(rubric => {
        expect(screen.getByText(rubric.criteria)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Previous'));

    await waitFor(() => screen.getByText('Page 1 of 2'));
});
